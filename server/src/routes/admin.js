const express = require('express');
const db = require('../database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireRole('admin'));

// GET /api/admin/stats
router.get('/stats', async (_req, res) => {
  try {
    const [businesses, customers, jobs, completed, revenue] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM businesses`),
      db.query(`SELECT COUNT(*) FROM users WHERE role='customer'`),
      db.query(`SELECT COUNT(*) FROM jobs`),
      db.query(`SELECT COUNT(*) FROM jobs WHERE status='completed'`),
      db.query(`SELECT COALESCE(SUM(platform_fee),0) AS total FROM transactions WHERE status='completed'`),
    ]);
    res.json({
      total_businesses: parseInt(businesses.rows[0].count),
      total_customers: parseInt(customers.rows[0].count),
      total_jobs: parseInt(jobs.rows[0].count),
      completed_jobs: parseInt(completed.rows[0].count),
      total_revenue: parseFloat(revenue.rows[0].total),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/businesses
router.get('/businesses', async (req, res) => {
  const { status } = req.query;
  let where = '';
  if (status === 'pending') where = `WHERE b.is_approved=false AND b.is_suspended=false`;
  else if (status === 'approved') where = `WHERE b.is_approved=true`;
  else if (status === 'suspended') where = `WHERE b.is_suspended=true`;

  try {
    const result = await db.query(
      `SELECT b.*, u.email, u.phone, u.created_at AS user_created,
        ARRAY(SELECT service_type FROM business_services WHERE business_id=b.id) AS services,
        ARRAY(SELECT county FROM business_counties WHERE business_id=b.id) AS counties
       FROM businesses b JOIN users u ON u.id=b.user_id
       ${where}
       ORDER BY b.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
});

// PUT /api/admin/businesses/:id/approve
router.put('/businesses/:id/approve', async (req, res) => {
  try {
    await db.query(`UPDATE businesses SET is_approved=true, is_suspended=false WHERE id=$1`, [req.params.id]);
    res.json({ message: 'Business approved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve' });
  }
});

// PUT /api/admin/businesses/:id/reject
router.put('/businesses/:id/reject', async (req, res) => {
  try {
    await db.query(`UPDATE businesses SET is_approved=false WHERE id=$1`, [req.params.id]);
    res.json({ message: 'Business rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject' });
  }
});

// PUT /api/admin/businesses/:id/suspend
router.put('/businesses/:id/suspend', async (req, res) => {
  try {
    await db.query(`UPDATE businesses SET is_suspended=$1 WHERE id=$2`, [req.body.suspend, req.params.id]);
    res.json({ message: 'Business updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

// GET /api/admin/customers
router.get('/customers', async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.name, u.phone, u.zip_code, u.is_active, u.created_at,
        (SELECT COUNT(*) FROM jobs WHERE customer_id=u.id) AS job_count
       FROM users u WHERE u.role='customer'
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// PUT /api/admin/customers/:id/toggle
router.put('/customers/:id/toggle', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE users SET is_active = NOT is_active WHERE id=$1 AND role='customer' RETURNING is_active`,
      [req.params.id]
    );
    res.json({ is_active: result.rows[0].is_active });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle' });
  }
});

// GET /api/admin/jobs
router.get('/jobs', async (req, res) => {
  const { status } = req.query;
  try {
    const result = await db.query(
      `SELECT j.*, u.name AS customer_name, u.email AS customer_email,
        (SELECT COUNT(*) FROM quotes WHERE job_id=j.id) AS quote_count
       FROM jobs j JOIN users u ON u.id=j.customer_id
       ${status ? `WHERE j.status=$1` : ''}
       ORDER BY j.created_at DESC`,
      status ? [status] : []
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/admin/transactions
router.get('/transactions', async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, j.service_type, u.name AS customer_name, b.business_name
       FROM transactions t
       JOIN jobs j ON j.id=t.job_id
       JOIN users u ON u.id=t.customer_id
       JOIN businesses b ON b.id=t.business_id
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
