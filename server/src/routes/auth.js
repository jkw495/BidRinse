const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// POST /api/auth/register/customer
router.post(
  '/register/customer',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('zip_code').trim().notEmpty().withMessage('Zip code is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone, zip_code } = req.body;

    try {
      const existing = await db.query('SELECT id FROM users WHERE email=$1', [email]);
      if (existing.rows.length) return res.status(409).json({ error: 'Email already registered' });

      const hash = await bcrypt.hash(password, 12);
      const result = await db.query(
        'INSERT INTO users (email,password_hash,role,name,phone,zip_code) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [email, hash, 'customer', name, phone, zip_code]
      );

      res.status(201).json({ token: signToken(result.rows[0]), user: sanitize(result.rows[0]) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// POST /api/auth/register/business
router.post(
  '/register/business',
  [
    body('owner_name').trim().notEmpty(),
    body('business_name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').trim().notEmpty(),
    body('is_insured').equals('true').withMessage('Insurance confirmation required'),
    body('services').isArray({ min: 1 }).withMessage('Select at least one service'),
    body('counties').isArray({ min: 1 }).withMessage('Select at least one county'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      owner_name, business_name, email, password, phone,
      website_url, years_in_business, services, counties, zip_codes,
    } = req.body;

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const existing = await client.query('SELECT id FROM users WHERE email=$1', [email]);
      if (existing.rows.length) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Email already registered' });
      }

      const hash = await bcrypt.hash(password, 12);
      const userRes = await client.query(
        'INSERT INTO users (email,password_hash,role,name,phone) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [email, hash, 'business', owner_name, phone]
      );
      const user = userRes.rows[0];

      const bizRes = await client.query(
        `INSERT INTO businesses (user_id,business_name,owner_name,website_url,years_in_business,is_insured,is_approved)
         VALUES ($1,$2,$3,$4,$5,$6,false) RETURNING *`,
        [user.id, business_name, owner_name, website_url || null, years_in_business || null, true]
      );
      const biz = bizRes.rows[0];

      for (const svc of services) {
        await client.query(
          'INSERT INTO business_services (business_id,service_type) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [biz.id, svc]
        );
      }
      for (const county of counties) {
        await client.query(
          'INSERT INTO business_counties (business_id,county) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [biz.id, county]
        );
      }
      if (zip_codes) {
        const zips = zip_codes.split(',').map((z) => z.trim()).filter(Boolean);
        for (const zip of zips) {
          await client.query(
            'INSERT INTO business_zip_codes (business_id,zip_code) VALUES ($1,$2) ON CONFLICT DO NOTHING',
            [biz.id, zip]
          );
        }
      }

      await client.query('COMMIT');
      res.status(201).json({
        token: signToken(user),
        user: sanitize(user),
        business: biz,
        message: 'Registration successful. Your account is pending admin approval.',
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    } finally {
      client.release();
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const result = await db.query('SELECT * FROM users WHERE email=$1 AND is_active=true', [email]);
      const user = result.rows[0];
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      let extra = {};
      if (user.role === 'business') {
        const biz = await db.query('SELECT * FROM businesses WHERE user_id=$1', [user.id]);
        extra.business = biz.rows[0] || null;
      }

      res.json({ token: signToken(user), user: sanitize(user), ...extra });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    let extra = {};
    if (user.role === 'business') {
      const biz = await db.query(
        `SELECT b.*,
          ARRAY(SELECT service_type FROM business_services WHERE business_id=b.id) AS services,
          ARRAY(SELECT county FROM business_counties WHERE business_id=b.id) AS counties,
          ARRAY(SELECT zip_code FROM business_zip_codes WHERE business_id=b.id) AS zip_codes
         FROM businesses b WHERE b.user_id=$1`,
        [user.id]
      );
      extra.business = biz.rows[0] || null;
    }

    res.json({ user: sanitize(user), ...extra });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/auth/password
router.put(
  '/password',
  authenticate,
  [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const result = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
      const user = result.rows[0];
      const valid = await bcrypt.compare(req.body.current_password, user.password_hash);
      if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

      const hash = await bcrypt.hash(req.body.new_password, 12);
      await db.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, user.id]);
      res.json({ message: 'Password updated' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  }
);

const sanitize = (u) => ({ id: u.id, email: u.email, role: u.role, name: u.name, phone: u.phone, zip_code: u.zip_code, created_at: u.created_at });

module.exports = router;
