-- BidRinse Database Schema
-- Run this file against your PostgreSQL database to initialize

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  email          VARCHAR(255) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  role           VARCHAR(20)  NOT NULL CHECK (role IN ('customer', 'business', 'admin')),
  name           VARCHAR(255) NOT NULL,
  phone          VARCHAR(20),
  zip_code       VARCHAR(10),
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── BUSINESSES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS businesses (
  id                   SERIAL PRIMARY KEY,
  user_id              INTEGER REFERENCES users(id) ON DELETE CASCADE,
  business_name        VARCHAR(255) NOT NULL,
  owner_name           VARCHAR(255) NOT NULL,
  website_url          VARCHAR(500),
  years_in_business    VARCHAR(20) CHECK (years_in_business IN ('1-2','3-5','6-10','10+')),
  is_insured           BOOLEAN DEFAULT false,
  is_approved          BOOLEAN DEFAULT false,
  is_suspended         BOOLEAN DEFAULT false,
  is_featured          BOOLEAN DEFAULT false,
  avg_rating           DECIMAL(3,2) DEFAULT 0.00,
  review_count         INTEGER DEFAULT 0,
  description          TEXT,
  stripe_account_id    VARCHAR(255),
  stripe_onboarded     BOOLEAN DEFAULT false,
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── BUSINESS SERVICES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_services (
  id           SERIAL PRIMARY KEY,
  business_id  INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL,
  UNIQUE (business_id, service_type)
);

-- ─── BUSINESS SERVICE AREAS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_counties (
  id           SERIAL PRIMARY KEY,
  business_id  INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  county       VARCHAR(100) NOT NULL,
  UNIQUE (business_id, county)
);

CREATE TABLE IF NOT EXISTS business_zip_codes (
  id           SERIAL PRIMARY KEY,
  business_id  INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  zip_code     VARCHAR(10) NOT NULL,
  UNIQUE (business_id, zip_code)
);

-- ─── BUSINESS PHOTOS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS business_photos (
  id           SERIAL PRIMARY KEY,
  business_id  INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  url          VARCHAR(500) NOT NULL,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── JOBS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id               SERIAL PRIMARY KEY,
  customer_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_type     VARCHAR(100) NOT NULL,
  address          TEXT NOT NULL,
  city             VARCHAR(100),
  state            VARCHAR(50) DEFAULT 'NC',
  zip_code         VARCHAR(10) NOT NULL,
  description      TEXT,
  preferred_date   DATE,
  preferred_time   VARCHAR(20) CHECK (preferred_time IN ('morning','afternoon','flexible')),
  photo_url        VARCHAR(500),
  status           VARCHAR(30) DEFAULT 'pending'
                     CHECK (status IN ('pending','quotes_received','accepted','completed','cancelled','expired')),
  accepted_quote_id INTEGER,
  expires_at       TIMESTAMP WITH TIME ZONE,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── QUOTES ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id                        SERIAL PRIMARY KEY,
  job_id                    INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  business_id               INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  amount                    DECIMAL(10,2) NOT NULL,
  message                   TEXT,
  estimated_completion_time VARCHAR(100),
  status                    VARCHAR(20) DEFAULT 'pending'
                              CHECK (status IN ('pending','accepted','declined','expired')),
  expires_at                TIMESTAMP WITH TIME ZONE,
  created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (job_id, business_id)
);

-- Add foreign key for accepted_quote_id after quotes table exists
ALTER TABLE jobs ADD CONSTRAINT fk_accepted_quote
  FOREIGN KEY (accepted_quote_id) REFERENCES quotes(id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- ─── REVIEWS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           SERIAL PRIMARY KEY,
  job_id       INTEGER REFERENCES jobs(id) ON DELETE CASCADE UNIQUE,
  customer_id  INTEGER REFERENCES users(id),
  business_id  INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
  rating       INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment      TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── TRANSACTIONS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id                       SERIAL PRIMARY KEY,
  job_id                   INTEGER REFERENCES jobs(id),
  quote_id                 INTEGER REFERENCES quotes(id),
  customer_id              INTEGER REFERENCES users(id),
  business_id              INTEGER REFERENCES businesses(id),
  gross_amount             DECIMAL(10,2) NOT NULL,
  platform_fee             DECIMAL(10,2) NOT NULL,
  net_amount               DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  stripe_transfer_id       VARCHAR(255),
  status                   VARCHAR(20) DEFAULT 'pending'
                             CHECK (status IN ('pending','completed','refunded')),
  created_at               TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type             VARCHAR(50) NOT NULL,
  title            VARCHAR(255),
  message          TEXT,
  is_read          BOOLEAN DEFAULT false,
  related_job_id   INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  related_quote_id INTEGER REFERENCES quotes(id) ON DELETE SET NULL,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_jobs_customer    ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status      ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_zip         ON jobs(zip_code);
CREATE INDEX IF NOT EXISTS idx_quotes_job       ON quotes(job_id);
CREATE INDEX IF NOT EXISTS idx_quotes_business  ON quotes(business_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status    ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_notifs_user      ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_biz_user         ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_biz_zip          ON business_zip_codes(zip_code);
CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_businesses_updated
  BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_jobs_updated
  BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quotes_updated
  BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── DEFAULT ADMIN ACCOUNT ──────────────────────────────────────────────────
-- Password: admin123  (CHANGE THIS in production)
INSERT INTO users (email, password_hash, role, name, phone)
VALUES (
  'admin@bidrinse.com',
  '$2b$12$LQv3c1yqBwEHFj5e6v5ZxuLfXbGxjGJ6KqjFzKJfJRKMgxmZSMnSi',
  'admin',
  'BidRinse Admin',
  '000-000-0000'
) ON CONFLICT (email) DO NOTHING;
