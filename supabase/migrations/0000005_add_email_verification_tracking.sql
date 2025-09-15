-- Add email verification tracking to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at timestamp with time zone;

-- Add index for faster queries on email verification status
CREATE INDEX IF NOT EXISTS idx_user_profiles_email_verified 
ON user_profiles(email_verified);

-- Update existing users to be verified (since they're already in the system)
UPDATE user_profiles 
SET email_verified = true, 
    email_verified_at = COALESCE(created_at, NOW())
WHERE email_verified IS NULL;