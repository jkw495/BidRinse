require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes         = require('./routes/auth');
const jobRoutes          = require('./routes/jobs');
const quoteRoutes        = require('./routes/quotes');
const businessRoutes     = require('./routes/businesses');
const reviewRoutes       = require('./routes/reviews');
const paymentRoutes      = require('./routes/payments');
const adminRoutes        = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Stripe webhooks need raw body — must come before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth',          authRoutes);
app.use('/api/jobs',          jobRoutes);
app.use('/api/quotes',        quoteRoutes);
app.use('/api/businesses',    businessRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BidRinse server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
