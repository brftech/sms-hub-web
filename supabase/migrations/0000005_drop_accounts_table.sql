-- Drop accounts table and related dependencies
-- This migration removes the accounts table that was created earlier

-- First, drop any foreign key constraints that reference the accounts table
-- Check if account_members table exists and drop it first
DROP TABLE IF EXISTS account_members CASCADE;

-- Drop any indexes on the accounts table
DROP INDEX IF EXISTS idx_accounts_hub_id;
DROP INDEX IF EXISTS idx_accounts_user_id;
DROP INDEX IF EXISTS idx_accounts_company_id;

-- Drop the accounts table
DROP TABLE IF EXISTS accounts CASCADE;

-- Note: CASCADE will automatically drop any dependent objects like:
-- - Foreign key constraints
-- - Views that depend on the table
-- - Functions that depend on the table
