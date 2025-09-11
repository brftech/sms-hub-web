-- Reset superadmin password to a known value
-- Run with: npx supabase db push < reset-superadmin-password.sql

UPDATE auth.users 
SET encrypted_password = crypt('SuperAdmin123!', gen_salt('bf'))
WHERE email = 'superadmin@gnymble.com';

-- Verify the update
DO $$
DECLARE
  rows_updated INTEGER;
BEGIN
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  
  IF rows_updated > 0 THEN
    RAISE NOTICE 'SUCCESS: Password updated for superadmin@gnymble.com';
  ELSE
    RAISE NOTICE 'WARNING: No user found with email superadmin@gnymble.com';
  END IF;
END $$;