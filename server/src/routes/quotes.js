const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticate, requireRole } = require('../middleware/auth');
const email = require('../services/email');

const router = express.Router();

// POST /api/quotes — business submits a quote
router.post(
  '/',
  authenticate,
  requireRole('business'),
  [
    body('job_id').isInt(),
    body('amount').isFloat({ min: 1 }),
    body('message').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { job_id, amount, message, estimated_completion_time } = req.body;

    try {
      const bizRes = await db.query('SELECT * FROM businesses WHERE user_id=$1', [req.user.id]);
      const biz = bizRes.rows[0];
      if (!biz || !biz.is_approved) return res.status(403).json({ error: 'Business not approved' });

      const jobRes = await db.query('SELECT * FROM jobs WHERE id=$1', [job_id]);
      const job = jobRes.rows[0];
      if (!job) return res.status(404).json({ error: 'Job not found' });
      if (!['pending', 'quotes_received'].includes(job.status)) {
        return res.status(400).json({ error: 'This job is no longer accepting quotes' });
      }

      // Enforce quote limit
      const countRes = await db.query(
        `SELECT COUNT(*) FROM quotes WHERE job_id=$1 AND status != 'expired'`,
        [job_id]
      );
      const currentCount = parseInt(countRes.rows[0].count);
      if (currentCount >= job.max_quotes) {
        return res.status(400).json({ error: `This job has reached its maximum of ${job.max_quotes} quote${job.max_quotes > 1 ? 's' : ''}` });
      }

      const expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

      const result = await db.query(
        `INSERT INTO quotes (job_id,business_id,amount,message,estimated_completion_time,expires_at)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (job_id,business_id) DO UPDATE
           SET amount=$3, message=$4, estimated_completion_time=$5, expires_at=$6, status='pending', updated_at=NOW()
         RETURNING *`,
        [job_id, biz.id, amount, message, estimated_completion_time || null, expires_at]
      );

      await db.query(
        `UPDATE jobs SET status='quotes_received', updated_at=NOW() WHERE id=$1 AND status='pending'`,
        [job_id]
      );

      // Notify customer
      const customerRes = await db.query('SELECT * FROM users WHERE id=$1', [job.customer_id]);
      await email.newQuoteReceived(customerRes.rows[0], job, biz);

      await db.query(
        `INSERT INTO notifications (user_id,type,title,message,related_job_id,related_quote_id)
         VALUES ($1,'new_quote','New Quote Received',$2,$3,$4)`,
        [job.customer_id, `${biz.business_name} submitted a quote for your ${job.service_type} job.`, job.id, result.rows[0].id]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit quote' });
    }
  }
);

// PUT /api/quotes/:id/accept — customer accepts a quote
router.put('/:id/accept', authenticate, requireRole('customer'), async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const quoteRes = await client.query(
      `SELECT q.*, j.customer_id, j.service_type, j.id AS job_id
       FROM quotes q JOIN jobs j ON j.id=q.job_id
       WHERE q.id=$1`,
      [req.params.id]
    );
    if (!quoteRes.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Quote not found' });
    }
    const quote = quoteRes.rows[0];

    if (quote.customer_id !== req.user.id) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (quote.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Quote is no longer available' });
    }

    // Accept this quote
    await client.query(
      `UPDATE quotes SET status='accepted', updated_at=NOW() WHERE id=$1`,
      [quote.id]
    );

    // Decline all other quotes for this job
    await client.query(
      `UPDATE quotes SET status='declined', updated_at=NOW()
       WHERE job_id=$1 AND id != $2 AND status='pending'`,
      [quote.job_id, quote.id]
    );

    // Update job
    await client.query(
      `UPDATE jobs SET status='accepted', accepted_quote_id=$1, updated_at=NOW() WHERE id=$2`,
      [quote.id, quote.job_id]
    );

    await client.query('COMMIT');

    // Email notifications
    const bizRes = await db.query(
      `SELECT b.*, u.email FROM businesses b JOIN users u ON u.id=b.user_id WHERE b.id=$1`,
      [quote.business_id]
    );
    const biz = bizRes.rows[0];
    const jobRes = await db.query('SELECT * FROM jobs WHERE id=$1', [quote.job_id]);

    await email.quoteAccepted(biz, jobRes.rows[0], quote);

    // Notify declined businesses
    const declined = await db.query(
      `SELECT b.business_name, u.email FROM quotes q
       JOIN businesses b ON b.id=q.business_id
       JOIN users u ON u.id=b.user_id
       WHERE q.job_id=$1 AND q.status='declined'`,
      [quote.job_id]
    );
    for (const d of declined.rows) {
      await email.quoteDeclined(d, jobRes.rows[0]);
    }

    await db.query(
      `INSERT INTO notifications (user_id,type,title,message,related_job_id,related_quote_id)
       VALUES ($1,'quote_accepted','Quote Accepted','Your quote has been accepted. Check your active jobs.',$2,$3)`,
      [biz.user_id, quote.job_id, quote.id]
    );

    res.json({ message: 'Quote accepted', quote_id: quote.id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to accept quote' });
  } finally {
    client.release();
  }
});

// GET /api/quotes/business/mine — business sees all their quotes
router.get('/business/mine', authenticate, requireRole('business'), async (req, res) => {
  try {
    const bizRes = await db.query('SELECT id FROM businesses WHERE user_id=$1', [req.user.id]);
    if (!bizRes.rows.length) return res.status(404).json({ error: 'Business not found' });

    const result = await db.query(
      `SELECT q.*, j.service_type, j.city, j.zip_code, j.preferred_date, j.status AS job_status
       FROM quotes q JOIN jobs j ON j.id=q.job_id
       WHERE q.business_id=$1
       ORDER BY q.created_at DESC`,
      [bizRes.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// GET /api/quotes/business/active — business sees accepted jobs
router.get('/business/active', authenticate, requireRole('business'), async (req, res) => {
  try {
    const bizRes = await db.query('SELECT id FROM businesses WHERE user_id=$1', [req.user.id]);
    if (!bizRes.rows.length) return res.status(404).json({ error: 'Business not found' });

    const result = await db.query(
      `SELECT j.*, q.amount, q.id AS quote_id, u.name AS customer_name, u.phone AS customer_phone, u.email AS customer_email
       FROM quotes q
       JOIN jobs j ON j.id=q.job_id
       JOIN users u ON u.id=j.customer_id
       WHERE q.business_id=$1 AND q.status='accepted' AND j.status IN ('accepted','completed')
       ORDER BY j.updated_at DESC`,
      [bizRes.rows[0].id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active jobs' });
  }
});

// PUT /api/quotes/:id/complete — business marks job complete
router.put('/:id/complete', authenticate, requireRole('business'), async (req, res) => {
  try {
    const bizRes = await db.query('SELECT id FROM businesses WHERE user_id=$1', [req.user.id]);
    const biz = bizRes.rows[0];

    const quoteRes = await db.query(
      `SELECT q.*, j.customer_id, j.service_type FROM quotes q JOIN jobs j ON j.id=q.job_id WHERE q.id=$1`,
      [req.params.id]
    );
    const quote = quoteRes.rows[0];
    if (!quote || quote.business_id !== biz.id) return res.status(403).json({ error: 'Forbidden' });

    await db.query(`UPDATE jobs SET status='completed', updated_at=NOW() WHERE id=$1`, [quote.job_id]);

    // Fee calculation — 3.5% residential, 5% commercial
    const jobTypeRes = await db.query('SELECT job_type FROM jobs WHERE id=$1', [quote.job_id]);
    const jobType = jobTypeRes.rows[0]?.job_type || 'residential';
    const commissionRate = jobType === 'commercial' ? 0.05 : 0.035;
    const gross = parseFloat(quote.amount);
    const fee = parseFloat((gross * commissionRate).toFixed(2));
    const net = parseFloat((gross - fee).toFixed(2));

    await db.query(
      `INSERT INTO transactions (job_id,quote_id,customer_id,business_id,gross_amount,platform_fee,net_amount,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')`,
      [quote.job_id, quote.id, quote.customer_id || (await db.query('SELECT customer_id FROM jobs WHERE id=$1',[quote.job_id])).rows[0].customer_id, biz.id, gross, fee, net]
    );

    const customerRes = await db.query('SELECT * FROM users WHERE id=$1', [
      (await db.query('SELECT customer_id FROM jobs WHERE id=$1', [quote.job_id])).rows[0].customer_id,
    ]);
    const jobRes = await db.query('SELECT * FROM jobs WHERE id=$1', [quote.job_id]);

    await email.jobCompleted(customerRes.rows[0], jobRes.rows[0]);

    res.json({ message: 'Job marked complete', fee, net });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark job complete' });
  }
});

module.exports = router;
