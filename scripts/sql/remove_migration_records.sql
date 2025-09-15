-- Remove migration records 5 and 6 from the dev database
-- Run this in the Supabase SQL editor for the dev database (sms-hub-monorepo)

-- Delete migration records
DELETE FROM supabase_migrations.schema_migrations 
WHERE name IN ('0000005_add_email_verification_tracking', '0000006_remove_redundant_email_verification');

-- Verify the deletions
SELECT name, executed_at 
FROM supabase_migrations.schema_migrations 
ORDER BY name;