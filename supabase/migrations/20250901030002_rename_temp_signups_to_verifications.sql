-- Migration: Rename temp_signups table to verifications
-- This better reflects the table's purpose for handling verification processes

-- Rename the table
ALTER TABLE temp_signups RENAME TO verifications;

-- Update any foreign key constraints that reference temp_signups
-- (If there are any, they would need to be dropped and recreated)

-- Update any indexes that reference the old table name
-- PostgreSQL automatically renames indexes when the table is renamed

-- Update any triggers that reference the old table name
-- PostgreSQL automatically renames triggers when the table is renamed

-- Update any views that reference the old table name
-- Note: If you have views referencing temp_signups, they will need to be updated separately

-- Update any RLS policies that reference the old table name
-- Note: RLS policies are automatically updated when the table is renamed

-- Update any functions that reference the old table name
-- Note: Functions will need to be updated separately if they contain hardcoded table names

-- Add a comment to document the change
COMMENT ON TABLE verifications IS 'Handles user verification processes including email, phone, and other verification methods. Renamed from temp_signups for clarity.';

-- 2. Add missing columns to user_profiles (if not present)

-- Add account_number if it doesn't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS account_number VARCHAR NOT NULL DEFAULT '';

-- Add verification_id to link to verifications table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS verification_id UUID REFERENCES verifications(id);

-- Make first_name and last_name NOT NULL with defaults
ALTER TABLE user_profiles
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN first_name SET DEFAULT '',
ALTER COLUMN last_name SET NOT NULL,
ALTER COLUMN last_name SET DEFAULT '';

-- 3. Update memberships table structure

-- Ensure memberships has proper columns
ALTER TABLE memberships
ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'MEMBER',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 4. Update companies table

-- Remove NOT NULL constraint from customer_id since it's added after payment
ALTER TABLE companies
ALTER COLUMN customer_id DROP NOT NULL;
