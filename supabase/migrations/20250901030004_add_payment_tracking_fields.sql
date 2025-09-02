-- Migration: Add Payment Tracking Fields for Onboarding Submissions
-- Date: 2025-01-30
-- Description: Add fields to track payment details in onboarding submissions

-- Add payment tracking fields to onboarding_submissions table
ALTER TABLE onboarding_submissions 
ADD COLUMN IF NOT EXISTS payment_amount INTEGER, -- Amount in cents
ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'usd',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_stripe_status ON onboarding_submissions(stripe_status);
