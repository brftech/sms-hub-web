-- Migration: Complete verifications table rename and update all related objects
-- Date: 2025-01-01
-- Description: This migration completes the temp_signups to verifications rename
-- by updating foreign key constraints, functions, and constraint names

BEGIN;

-- 1. Update verification_attempts table foreign key
-- Rename the foreign key column
ALTER TABLE verification_attempts
RENAME COLUMN temp_signup_id TO verification_id;

-- Drop the old foreign key constraint
ALTER TABLE verification_attempts
DROP CONSTRAINT IF EXISTS verification_attempts_temp_signup_id_fkey;

-- Add the new foreign key constraint
ALTER TABLE verification_attempts
ADD CONSTRAINT verification_attempts_verification_id_fkey
FOREIGN KEY (verification_id) REFERENCES verifications(id) ON DELETE CASCADE;

-- 2. Rename the cleanup function
-- Drop the old function
DROP FUNCTION IF EXISTS cleanup_expired_temp_signups();

-- Create the new function
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM verifications
  WHERE expires_at < NOW()
  RETURNING COUNT(*) INTO deleted_count;

  RETURN deleted_count;
END;
$$;

-- 3. Rename foreign key constraints to match new table name
-- Rename existing_user_id constraint
ALTER TABLE verifications
RENAME CONSTRAINT temp_signups_existing_user_id_fkey TO verifications_existing_user_id_fkey;

-- Rename hub_id constraint
ALTER TABLE verifications
RENAME CONSTRAINT temp_signups_hub_id_fkey TO verifications_hub_id_fkey;

-- Rename primary key constraint
ALTER TABLE verifications
RENAME CONSTRAINT temp_signups_pkey TO verifications_pkey;

-- 4. Rename any indexes that contain the old table name
-- Note: PostgreSQL automatically renames most indexes, but we'll handle any custom ones
DO $$
DECLARE
  index_record RECORD;
BEGIN
  FOR index_record IN 
    SELECT indexname 
    FROM pg_indexes 
    WHERE tablename = 'verifications' 
    AND indexname LIKE '%temp_signups%'
  LOOP
    EXECUTE 'ALTER INDEX ' || quote_ident(index_record.indexname) || 
            ' RENAME TO ' || replace(index_record.indexname, 'temp_signups', 'verifications');
  END LOOP;
END $$;

-- 5. Update RLS policies (if any exist)
-- Drop old policies
DROP POLICY IF EXISTS "temp_signups_select_policy" ON verifications;
DROP POLICY IF EXISTS "temp_signups_insert_policy" ON verifications;
DROP POLICY IF EXISTS "temp_signups_update_policy" ON verifications;
DROP POLICY IF EXISTS "temp_signups_delete_policy" ON verifications;

-- Note: New RLS policies should be created separately if needed
-- The table rename automatically updates existing policies, but policy names remain the same

-- 6. Add updated comment
COMMENT ON TABLE verifications IS 'Handles user verification processes including email, phone, and other verification methods. Renamed from temp_signups for clarity.';

-- 7. Verify the migration
-- Check that the table exists with the new name
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'verifications') THEN
    RAISE EXCEPTION 'Table verifications does not exist after migration';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'temp_signups') THEN
    RAISE EXCEPTION 'Table temp_signups still exists after migration';
  END IF;
  
  RAISE NOTICE 'Migration completed successfully: temp_signups renamed to verifications';
END $$;

COMMIT;
