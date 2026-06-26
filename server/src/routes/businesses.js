const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticate, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/businesses/profile — get own business profile
router.get('/profile', authenticate, requireRole('business'), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.*,
        ARRAY(SELECT service_type FROM business_services WHERE business_id=b.id) AS services,
        ARRAY(SELECT county FROM business_counties WHERE business_id=b.id) AS counties,
        ARRAY(SELECT zip_code FROM business_zip_codes WHERE business_id=b.id) AS zip_codes,
        ARRAY(SELECT url FROM business_photos WHERE business_id=b.id) AS photos
       FROM businesses b WHERE b.user_id=$1`,
      [req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Business not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/businesses/profile — update business profile
router.put('/profile', authenticate, requireRole('business'), async (req, res) => {
  const {
    business_name, description, website_url,
    years_in_business, services, counties, zip_codes,
  } = req.body;

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const bizRes = await client.query('SELECT id FROM businesses WHERE user_id=$1', [req.user.id]);
    const bizId = bizRes.rows[0]?.id;
    if (!bizId) return res.status(404).json({ error: 'Business not found' });

    await client.query(
      `UPDATE businesses SET business_name=COALESCE($1,business_name), description=COALESCE($2,description),
        website_url=COALESCE($3,website_url), years_in_business=COALESCE($4,years_in_business), updated_at=NOW()
       WHERE id=$5`,
      [business_name, description, website_url, years_in_business, bizId]
    );

    if (services) {
      await client.query('DELETE FROM business_services WHERE business_id=$1', [bizId]);
      for (const svc of services) {
        await client.query('INSERT INTO business_services (business_id,service_type) VALUES ($1,$2)', [bizId, svc]);
      }
    }
    if (counties) {
      await client.query('DELETE FROM business_counties WHERE business_id=$1', [bizId]);
      for (const c of counties) {
        await client.query('INSERT INTO business_counties (business_id,county) VALUES ($1,$2)', [bizId, c]);
      }
    }
    if (zip_codes !== undefined) {
      await client.query('DELETE FROM business_zip_codes WHERE business_id=$1', [bizId]);
      const zips = (typeof zip_codes === 'string' ? zip_codes.split(',') : zip_codes)
        .map((z) => z.trim()).filter(Boolean);
      for (const zip of zips) {
        await client.query('INSERT INTO business_zip_codes (business_id,zip_code) VALUES ($1,$2)', [bizId, zip]);
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Profile updated' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  } finally {
    client.release();
  }
});

// POST /api/businesses/photos — upload business photo
router.post('/photos', authenticate, requireRole('business'), upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No photo uploaded' });
  try {
    const bizRes = await db.query('SELECT id FROM businesses WHERE user_id=$1', [req.user.id]);
    const url = `/uploads/${req.file.filename}`;
    await db.query('INSERT INTO business_photos (business_id,url) VALUES ($1,$2)', [bizRes.rows[0].id, url]);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// GET /api/businesses/stats — dashboard stats for business
router.get('/stats', authenticate, requireRole('business'), async (req, res) => {
  try {
    const bizRes = await db.query('SELECT id FROM businesses WHERE user_id=$1', [req.user.id]);
    const bizId = bizRes.rows[0]?.id;
    if (!bizId) return res.status(404).json({ error: 'Business not found' });

    const [activeJobs, quotesSubmitted, jobsWon, earnings] = await Promise.all([
      db.query(
        `SELECT COUNT(*) FROM jobs j JOIN business_zip_codes bz ON bz.zip_code=j.zip_code
         JOIN business_services bs ON bs.service_type=j.service_type
         WHERE bz.business_id=$1 AND bs.business_id=$1 AND j.status IN ('pending','quotes_received')`,
        [bizId]
      ),
      db.query('SELECT COUNT(*) FROM quotes WHERE business_id=$1', [bizId]),
      db.query(`SELECT COUNT(*) FROM quotes WHERE business_id=$1 AND status='accepted'`, [bizId]),
      db.query(
        `SELECT COALESCE(SUM(net_amount),0) AS total
         FROM transactions WHERE business_id=$1 AND status='completed'
         AND created_at >= date_trunc('month',NOW())`,
        [bizId]
      ),
    ]);

    res.json({
      active_jobs_in_area: parseInt(activeJobs.rows[0].count),
      quotes_submitted: parseInt(quotesSubmitted.rows[0].count),
      jobs_won: parseInt(jobsWon.rows[0].count),
      earned_this_month: parseFloat(earnings.rows[0].total),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/businesses/earnings — earnings history
router.get('/earnings', authenticate, requireRole('business'), async (req, res) => {
  try {
    const bizRes = await db.query('SELECT id FROM businesses WHERE user_id=$1', [req.user.id]);
    const bizId = bizRes.rows[0]?.id;

    const result = await db.query(
      `SELECT t.*, j.service_type, j.city, j.zip_code
       FROM transactions t JOIN jobs j ON j.id=t.job_id
       WHERE t.business_id=$1
       ORDER BY t.created_at DESC`,
      [bizId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
});

// GET /api/businesses/:id/public — public profile view
router.get('/:id/public', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.id, b.business_name, b.owner_name, b.website_url, b.years_in_business,
              b.avg_rating, b.review_count, b.description, b.is_featured,
              ARRAY(SELECT service_type FROM business_services WHERE business_id=b.id) AS services,
              ARRAY(SELECT county FROM business_counties WHERE business_id=b.id) AS counties,
              ARRAY(SELECT url FROM business_photos WHERE business_id=b.id) AS photos
       FROM businesses b WHERE b.id=$1 AND b.is_approved=true AND b.is_suspended=false`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Business not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch business' });
  }
});

module.exports = router;
