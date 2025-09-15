-- Fix cascade deletion for foreign key constraints
-- This ensures proper cleanup when users are deleted

-- Fix user_profiles.company_id constraint
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_company_id_fkey;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES companies(id) 
ON DELETE CASCADE;

-- Fix companies.first_admin_user_id constraint  
ALTER TABLE companies 
DROP CONSTRAINT IF EXISTS companies_first_admin_user_id_fkey;

ALTER TABLE companies 
ADD CONSTRAINT companies_first_admin_user_id_fkey 
FOREIGN KEY (first_admin_user_id) REFERENCES user_profiles(id) 
ON DELETE SET NULL;

-- Fix user_profiles.user_id constraint
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) 
ON DELETE CASCADE;
