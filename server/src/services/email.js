const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const send = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER) {
    console.log(`[EMAIL SKIPPED - no config] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

const base = (content) => `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body{font-family:Inter,Arial,sans-serif;background:#f5f7fa;margin:0;padding:0}
  .wrap{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .header{background:#1B3A5C;padding:24px 32px}
  .header h1{color:#fff;margin:0;font-size:22px}
  .header span{color:#4A9FD4;font-weight:700}
  .body{padding:32px}
  .body p{color:#374151;line-height:1.6;margin:0 0 16px}
  .btn{display:inline-block;background:#4A9FD4;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0}
  .footer{background:#f9fafb;padding:16px 32px;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb}
</style></head><body>
<div class="wrap">
  <div class="header"><h1>Bid<span>Rinse</span></h1></div>
  <div class="body">${content}</div>
  <div class="footer">BidRinse &mdash; Clean Bids. Trusted Pros. &bull; NC Service Area</div>
</div></body></html>`;

module.exports = {
  jobPostedConfirmation: (customer, job) =>
    send({
      to: customer.email,
      subject: 'Your BidRinse job has been posted!',
      html: base(`<p>Hi ${customer.name},</p>
        <p>Your <strong>${job.service_type}</strong> job has been posted successfully. Local businesses in your area have been notified.</p>
        <p>We'll email you as soon as you receive a quote.</p>
        <a class="btn" href="${process.env.FRONTEND_URL}/customer/jobs/${job.id}">View Your Job</a>`),
    }),

  newJobForBusiness: (business, job) =>
    send({
      to: business.email,
      subject: `New ${job.service_type} job in your area`,
      html: base(`<p>Hi ${business.business_name},</p>
        <p>A new <strong>${job.service_type}</strong> job is available in <strong>${job.city}, ${job.zip_code}</strong>.</p>
        <p>${job.description || ''}</p>
        <p>Preferred date: ${job.preferred_date || 'Flexible'}</p>
        <a class="btn" href="${process.env.FRONTEND_URL}/business/jobs">View & Submit Quote</a>`),
    }),

  newQuoteReceived: (customer, job, business) =>
    send({
      to: customer.email,
      subject: `New quote received for your ${job.service_type} job`,
      html: base(`<p>Hi ${customer.name},</p>
        <p><strong>${business.business_name}</strong> has submitted a quote for your <strong>${job.service_type}</strong> job.</p>
        <a class="btn" href="${process.env.FRONTEND_URL}/customer/jobs/${job.id}">Review Quotes</a>`),
    }),

  quoteAccepted: (business, job, quote) =>
    send({
      to: business.email,
      subject: `Your quote was accepted! — ${job.service_type}`,
      html: base(`<p>Hi ${business.business_name},</p>
        <p>Great news! Your quote of <strong>$${parseFloat(quote.amount).toFixed(2)}</strong> for the <strong>${job.service_type}</strong> job has been accepted.</p>
        <p>The full customer address is now visible in your dashboard.</p>
        <a class="btn" href="${process.env.FRONTEND_URL}/business/active-jobs">View Active Jobs</a>`),
    }),

  quoteDeclined: (business, job) =>
    send({
      to: business.email,
      subject: `Quote update — ${job.service_type}`,
      html: base(`<p>Hi ${business.business_name},</p>
        <p>The customer has accepted another quote for the <strong>${job.service_type}</strong> job. Better luck next time!</p>
        <a class="btn" href="${process.env.FRONTEND_URL}/business/jobs">Find New Jobs</a>`),
    }),

  jobCompleted: (customer, job) =>
    send({
      to: customer.email,
      subject: `Your job is complete — please leave a review!`,
      html: base(`<p>Hi ${customer.name},</p>
        <p>Your <strong>${job.service_type}</strong> job has been marked complete. How did it go?</p>
        <a class="btn" href="${process.env.FRONTEND_URL}/customer/jobs/${job.id}">Leave a Review</a>`),
    }),

  paymentConfirmation: (to, name, amount, jobType) =>
    send({
      to,
      subject: 'BidRinse Payment Confirmation',
      html: base(`<p>Hi ${name},</p>
        <p>A payment of <strong>$${parseFloat(amount).toFixed(2)}</strong> for the <strong>${jobType}</strong> job has been processed.</p>
        <p>Thank you for using BidRinse!</p>`),
    }),

  jobNoQuotes: (customer, job) =>
    send({
      to: customer.email,
      subject: `Your ${job.service_type} job hasn't received quotes yet`,
      html: base(`<p>Hi ${customer.name},</p>
        <p>Your <strong>${job.service_type}</strong> job posted 72 hours ago hasn't received any quotes yet. You can re-post or update the job details to attract more bids.</p>
        <a class="btn" href="${process.env.FRONTEND_URL}/customer/jobs">View My Jobs</a>`),
    }),
};
