# BidRinse — Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- (Optional) Stripe account for payments
- (Optional) Gmail account for email notifications

---

## Quick Start

### 1. Install dependencies
```bash
cd BidRinse
npm install          # installs root deps (concurrently)
cd server && npm install
cd ../client && npm install
```

### 2. Set up environment variables
```bash
cp server/.env.example server/.env
# Edit server/.env with your values
```

Minimum required to run locally:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/bidrinse
JWT_SECRET=any_long_random_string
```

### 3. Create the database
```bash
# Create the database in PostgreSQL
psql -U postgres -c "CREATE DATABASE bidrinse;"

# Run the schema migration
psql -U postgres -d bidrinse -f server/migrations/001_schema.sql
```

### 4. Run the app
```bash
# From the root BidRinse/ folder
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Default Admin Account
- Email: `admin@bidrinse.com`
- Password: `admin123`

**Change this password immediately in production!**

---

## Email Setup (Gmail)
1. Enable 2-factor auth on your Gmail account
2. Generate an App Password: Google Account → Security → App Passwords
3. Set in server/.env:
   ```
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=your_16_char_app_password
   ```

---

## Stripe Setup
1. Create a Stripe account at stripe.com
2. Get your test API keys from Stripe Dashboard → Developers → API Keys
3. Set in server/.env:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. For webhooks, install Stripe CLI and run:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
   Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## Deployment (Railway / Render)

### Server
- Add a PostgreSQL service
- Set all environment variables from server/.env
- Set `NODE_ENV=production`
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`
- Run migration once: `psql $DATABASE_URL -f server/migrations/001_schema.sql`

### Client
- Set build command: `cd client && npm install && npm run build`
- Set output directory: `client/dist`
- Set `VITE_API_URL` if deploying separately

---

## Architecture

```
BidRinse/
├── server/                 # Node.js + Express API
│   ├── migrations/         # PostgreSQL schema
│   ├── src/
│   │   ├── app.js          # Express entry point
│   │   ├── database.js     # PostgreSQL connection
│   │   ├── middleware/     # auth.js, upload.js
│   │   ├── routes/         # All API routes
│   │   └── services/       # email.js (Nodemailer)
│   └── uploads/            # User-uploaded images
└── client/                 # React + Tailwind frontend
    └── src/
        ├── pages/
        │   ├── customer/   # Customer dashboard
        │   ├── business/   # Business dashboard
        │   └── admin/      # Admin panel
        ├── components/     # Shared UI components
        ├── contexts/       # AuthContext
        └── utils/          # api.js, constants.js
```
