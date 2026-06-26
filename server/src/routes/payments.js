const express = require('express');
const db = require('../database');
const { authenticate, requireRole } = require('../middleware/auth');
const email = require('../services/email');

const router = express.Router();

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// POST /api/payments/create-intent — customer initiates payment
router.post('/create-intent', authenticate, requireRole('customer'), async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payments not configured' });

  const { quote_id } = req.body;
  try {
    const quoteRes = await db.query(
      `SELECT q.*, j.customer_id, j.service_type, b.stripe_account_id, b.business_name
       FROM quotes q
       JOIN jobs j ON j.id=q.job_id
       JOIN businesses b ON b.id=q.business_id
       WHERE q.id=$1 AND q.status='accepted'`,
      [quote_id]
    );
    if (!quoteRes.rows.length) return res.status(404).json({ error: 'Quote not found or not accepted' });
    const quote = quoteRes.rows[0];

    if (quote.customer_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const gross = Math.round(parseFloat(quote.amount) * 100);
    const fee = Math.round(gross * 0.035);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gross,
      currency: 'usd',
      application_fee_amount: fee,
      transfer_data: quote.stripe_account_id
        ? { destination: quote.stripe_account_id }
        : undefined,
      metadata: {
        quote_id: quote.id,
        job_id: quote.job_id,
        customer_id: req.user.id,
        business_id: quote.business_id,
      },
    });

    res.json({ client_secret: paymentIntent.client_secret, publishable_key: process.env.STRIPE_PUBLISHABLE_KEY });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// POST /api/payments/webhook — Stripe webhooks
router.post('/webhook', async (req, res) => {
  if (!stripe) return res.status(200).json({ received: true });

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const { quote_id, job_id, customer_id, business_id } = pi.metadata;

    const gross = pi.amount / 100;
    const fee = parseFloat((gross * 0.035).toFixed(2));
    const net = parseFloat((gross - fee).toFixed(2));

    await db.query(
      `INSERT INTO transactions (job_id,quote_id,customer_id,business_id,gross_amount,platform_fee,net_amount,stripe_payment_intent_id,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'completed')
       ON CONFLICT DO NOTHING`,
      [job_id, quote_id, customer_id, business_id, gross, fee, net, pi.id]
    );

    const [customerRes, bizRes, jobRes] = await Promise.all([
      db.query('SELECT * FROM users WHERE id=$1', [customer_id]),
      db.query('SELECT b.business_name, u.email FROM businesses b JOIN users u ON u.id=b.user_id WHERE b.id=$1', [business_id]),
      db.query('SELECT * FROM jobs WHERE id=$1', [job_id]),
    ]);

    await email.paymentConfirmation(customerRes.rows[0].email, customerRes.rows[0].name, gross, jobRes.rows[0].service_type);
    await email.paymentConfirmation(bizRes.rows[0].email, bizRes.rows[0].business_name, net, jobRes.rows[0].service_type);
  }

  res.json({ received: true });
});

// GET /api/payments/transactions — customer payment history
router.get('/transactions', authenticate, requireRole('customer'), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, j.service_type, b.business_name
       FROM transactions t
       JOIN jobs j ON j.id=t.job_id
       JOIN businesses b ON b.id=t.business_id
       WHERE t.customer_id=$1
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /api/payments/onboard — business Stripe Connect onboarding
router.post('/onboard', authenticate, requireRole('business'), async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payments not configured' });
  try {
    const account = await stripe.accounts.create({ type: 'express' });
    await db.query('UPDATE businesses SET stripe_account_id=$1 WHERE user_id=$2', [account.id, req.user.id]);

    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/business/earnings`,
      return_url: `${process.env.FRONTEND_URL}/business/earnings?onboarded=true`,
      type: 'account_onboarding',
    });
    res.json({ url: link.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start onboarding' });
  }
});

module.exports = router;
