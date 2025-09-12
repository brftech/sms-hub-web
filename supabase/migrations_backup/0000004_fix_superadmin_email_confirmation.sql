-- Fix Superadmin Email Confirmation
-- This migration ensures the superadmin user has proper email confirmation

BEGIN;

-- Update the existing superadmin user to have confirmed email
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmation_sent_at = NOW(),
  email_change_confirm_status = 0,
  email_change_sent_at = NULL,
  email_change = NULL,
  email_change_token_current = NULL
WHERE email = 'superadmin@gnymble.com';

-- Also ensure the user is properly activated
UPDATE auth.users 
SET 
  is_super_admin = true,
  role = 'authenticated',
  aud = 'authenticated'
WHERE email = 'superadmin@gnymble.com';

-- Output completion message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Superadmin Email Confirmation Fixed!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'User: superadmin@gnymble.com';
  RAISE NOTICE 'Status: Email confirmed and user activated';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

COMMIT;
