const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews — customer leaves a review
router.post(
  '/',
  authenticate,
  requireRole('customer'),
  [
    body('job_id').isInt(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { job_id, rating, comment } = req.body;

    try {
      const jobRes = await db.query(
        `SELECT j.*, q.business_id FROM jobs j
         JOIN quotes q ON q.id=j.accepted_quote_id
         WHERE j.id=$1 AND j.customer_id=$2 AND j.status='completed'`,
        [job_id, req.user.id]
      );
      if (!jobRes.rows.length) return res.status(404).json({ error: 'Job not found or not completed' });

      const job = jobRes.rows[0];

      const result = await db.query(
        `INSERT INTO reviews (job_id,customer_id,business_id,rating,comment)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (job_id) DO UPDATE SET rating=$4, comment=$5
         RETURNING *`,
        [job_id, req.user.id, job.business_id, rating, comment || null]
      );

      // Update business avg_rating
      await db.query(
        `UPDATE businesses SET
          avg_rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE business_id=$1),
          review_count = (SELECT COUNT(*) FROM reviews WHERE business_id=$1)
         WHERE id=$1`,
        [job.business_id]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  }
);

// GET /api/reviews/business/:id — get reviews for a business
router.get('/business/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, u.name AS customer_name, j.service_type
       FROM reviews r
       JOIN users u ON u.id=r.customer_id
       JOIN jobs j ON j.id=r.job_id
       WHERE r.business_id=$1
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/job/:id — get review for a specific job
router.get('/job/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, u.name AS customer_name FROM reviews r
       JOIN users u ON u.id=r.customer_id
       WHERE r.job_id=$1`,
      [req.params.id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

module.exports = router;
