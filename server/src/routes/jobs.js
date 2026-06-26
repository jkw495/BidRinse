const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const email = require('../services/email');
const sms = require('../services/sms');

const router = express.Router();

// POST /api/jobs — customer posts a job
router.post(
  '/',
  authenticate,
  requireRole('customer'),
  upload.single('photo'),
  [
    body('service_type').notEmpty(),
    body('address').notEmpty(),
    body('zip_code').notEmpty(),
    body('description').notEmpty(),
    body('job_type').isIn(['residential', 'commercial']).withMessage('Job type must be residential or commercial'),
    body('max_quotes').isInt({ min: 1, max: 10 }).withMessage('Max quotes must be between 1 and 10'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      service_type, address, city, zip_code,
      description, preferred_date, preferred_time,
      job_type, max_quotes,
    } = req.body;

    try {
      const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
      const expires_at = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72h

      const result = await db.query(
        `INSERT INTO jobs
          (customer_id,service_type,address,city,zip_code,description,preferred_date,preferred_time,photo_url,expires_at,job_type,max_quotes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [
          req.user.id, service_type, address, city, zip_code,
          description, preferred_date || null, preferred_time || 'flexible',
          photo_url, expires_at, job_type, parseInt(max_quotes),
        ]
      );
      const job = result.rows[0];

      // Find matching businesses (service + zip area)
      const businesses = await db.query(
        `SELECT u.email, u.phone, b.id AS business_id, b.business_name, b.user_id AS biz_user_id
         FROM businesses b
         JOIN users u ON u.id = b.user_id
         JOIN business_services bs ON bs.business_id = b.id
         JOIN business_zip_codes bz ON bz.business_id = b.id
         WHERE bs.service_type = $1
           AND bz.zip_code = $2
           AND b.is_approved = true
           AND b.is_suspended = false
           AND u.is_active = true`,
        [service_type, zip_code]
      );

      const customer = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
      await email.jobPostedConfirmation(customer.rows[0], job);

      for (const biz of businesses.rows) {
        // Email notification
        await email.newJobForBusiness(biz, job);

        // SMS notification
        if (biz.phone) {
          await sms.newJobAlert(biz.phone, job);
        }

        // In-dashboard notification
        await db.query(
          `INSERT INTO notifications (user_id,type,title,message,related_job_id)
           VALUES ($1,'new_job','New Job Available',$2,$3)`,
          [
            biz.biz_user_id,
            `New ${job_type} ${service_type} job in ${city || zip_code}. Tap to view and quote.`,
            job.id,
          ]
        );
      }

      res.status(201).json(job);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to post job' });
    }
  }
);

// GET /api/jobs — customer gets their jobs
router.get('/', authenticate, requireRole('customer'), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT j.*,
        (SELECT COUNT(*) FROM quotes q WHERE q.job_id=j.id AND q.status != 'expired') AS quote_count
       FROM jobs j
       WHERE j.customer_id=$1
       ORDER BY j.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/available/feed — business sees open jobs in their area
router.get('/available/feed', authenticate, requireRole('business'), async (req, res) => {
  try {
    const bizRes = await db.query('SELECT * FROM businesses WHERE user_id=$1', [req.user.id]);
    const biz = bizRes.rows[0];
    if (!biz || !biz.is_approved) return res.status(403).json({ error: 'Business not approved' });

    const result = await db.query(
      `SELECT j.id, j.service_type, j.job_type, j.city, j.zip_code,
              j.preferred_date, j.preferred_time, j.description, j.status, j.created_at,
              j.max_quotes,
              (SELECT COUNT(*) FROM quotes WHERE job_id=j.id AND status != 'expired') AS quote_count,
              EXISTS(SELECT 1 FROM quotes WHERE job_id=j.id AND business_id=$1) AS already_quoted
       FROM jobs j
       JOIN business_services bs ON bs.service_type = j.service_type AND bs.business_id=$1
       JOIN business_zip_codes bz ON bz.zip_code = j.zip_code AND bz.business_id=$1
       WHERE j.status IN ('pending','quotes_received')
         AND j.expires_at > NOW()
         AND (SELECT COUNT(*) FROM quotes WHERE job_id=j.id AND status != 'expired') < j.max_quotes
       ORDER BY j.created_at DESC`,
      [biz.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch available jobs' });
  }
});

// GET /api/jobs/:id — job detail with quotes
router.get('/:id', authenticate, async (req, res) => {
  try {
    const jobRes = await db.query('SELECT * FROM jobs WHERE id=$1', [req.params.id]);
    if (!jobRes.rows.length) return res.status(404).json({ error: 'Job not found' });
    const job = jobRes.rows[0];

    if (req.user.role === 'customer' && job.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const quotesRes = await db.query(
      `SELECT q.*, b.business_name, b.avg_rating, b.review_count, b.is_featured,
              u.phone AS business_phone
       FROM quotes q
       JOIN businesses b ON b.id = q.business_id
       JOIN users u ON u.id = b.user_id
       WHERE q.job_id=$1
       ORDER BY b.is_featured DESC, q.amount ASC`,
      [job.id]
    );

    let responseJob = { ...job };
    if (req.user.role === 'business') {
      const biz = await db.query('SELECT id FROM businesses WHERE user_id=$1', [req.user.id]);
      const bizId = biz.rows[0]?.id;
      const accepted = quotesRes.rows.find((q) => q.status === 'accepted' && q.business_id === bizId);
      if (!accepted) {
        responseJob.address = `${job.city}, NC ${job.zip_code}`;
      }
    }

    res.json({ job: responseJob, quotes: quotesRes.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// PUT /api/jobs/:id/cancel
router.put('/:id/cancel', authenticate, requireRole('customer'), async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE jobs SET status='cancelled'
       WHERE id=$1 AND customer_id=$2 AND status IN ('pending','quotes_received')
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Job not found or cannot be cancelled' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel job' });
  }
});

module.exports = router;
