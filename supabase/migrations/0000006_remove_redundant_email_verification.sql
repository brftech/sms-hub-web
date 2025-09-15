-- Remove redundant email verification tracking from user_profiles
-- Supabase auth.users table already tracks email_confirmed_at
ALTER TABLE user_profiles 
DROP COLUMN IF EXISTS email_verified,
DROP COLUMN IF EXISTS email_verified_at;

-- Drop the index as well
DROP INDEX IF EXISTS idx_user_profiles_email_verified;