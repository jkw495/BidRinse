-- Migration 002: quote limits, job type, commercial commission

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS max_quotes INTEGER DEFAULT 3
  CHECK (max_quotes >= 1 AND max_quotes <= 10);

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_type VARCHAR(20) DEFAULT 'residential'
  CHECK (job_type IN ('residential', 'commercial'));
