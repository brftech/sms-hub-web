-- Check if superadmin user exists in auth.users
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email = 'superadmin@gnymble.com';

-- Check user_profiles for superadmin
SELECT id, email, first_name, last_name, created_at
FROM user_profiles 
WHERE email = 'superadmin@gnymble.com';

-- Check companies for superadmin
SELECT id, public_name, legal_name, created_at
FROM companies 
WHERE public_name ILIKE '%superadmin%' OR legal_name ILIKE '%superadmin%';
