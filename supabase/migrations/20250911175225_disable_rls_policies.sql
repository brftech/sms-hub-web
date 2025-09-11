-- Disable RLS Policies Migration
-- This migration disables Row Level Security on all tables to allow unrestricted access
-- This is for debugging authentication issues

BEGIN;

-- Disable RLS on all tables
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_inbox_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE hubs DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies (if any)
DROP POLICY IF EXISTS "Enable read access for all users" ON companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON companies;
DROP POLICY IF EXISTS "Enable update for users based on email" ON companies;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON companies;

DROP POLICY IF EXISTS "Enable read access for all users" ON customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON customers;
DROP POLICY IF EXISTS "Enable update for users based on email" ON customers;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON customers;

DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON user_profiles;

DROP POLICY IF EXISTS "Enable read access for all users" ON leads;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON leads;
DROP POLICY IF EXISTS "Enable update for users based on email" ON leads;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON leads;

DROP POLICY IF EXISTS "Enable read access for all users" ON verifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON verifications;
DROP POLICY IF EXISTS "Enable update for users based on email" ON verifications;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON verifications;

DROP POLICY IF EXISTS "Enable read access for all users" ON contacts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON contacts;
DROP POLICY IF EXISTS "Enable update for users based on email" ON contacts;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON contacts;

DROP POLICY IF EXISTS "Enable read access for all users" ON messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON messages;
DROP POLICY IF EXISTS "Enable update for users based on email" ON messages;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON messages;

DROP POLICY IF EXISTS "Enable read access for all users" ON phone_numbers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON phone_numbers;
DROP POLICY IF EXISTS "Enable update for users based on email" ON phone_numbers;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON phone_numbers;

DROP POLICY IF EXISTS "Enable read access for all users" ON user_inbox_assignments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_inbox_assignments;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_inbox_assignments;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON user_inbox_assignments;

DROP POLICY IF EXISTS "Enable read access for all users" ON hubs;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON hubs;
DROP POLICY IF EXISTS "Enable update for users based on email" ON hubs;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON hubs;

-- Output completion message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS Disabled Successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'All tables now have RLS disabled:';
  RAISE NOTICE '  - companies';
  RAISE NOTICE '  - customers';
  RAISE NOTICE '  - user_profiles';
  RAISE NOTICE '  - leads';
  RAISE NOTICE '  - verifications';
  RAISE NOTICE '  - contacts';
  RAISE NOTICE '  - messages';
  RAISE NOTICE '  - phone_numbers';
  RAISE NOTICE '  - user_inbox_assignments';
  RAISE NOTICE '  - hubs';
  RAISE NOTICE '';
  RAISE NOTICE 'All existing policies have been dropped.';
  RAISE NOTICE 'This allows unrestricted access for debugging.';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

COMMIT;
