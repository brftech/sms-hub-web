-- Check recent auth users
SELECT 
  id,
  email,
  created_at,
  confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
EOF < /dev/null