-- Migration: Create Superadmin User
-- Date: 2025-01-01
-- Description: Creates a real superadmin user in Supabase for testing and development

-- Create superadmin user profile
-- Note: This will create the user in user_profiles only
-- The actual auth user will need to be created through Supabase Auth API

-- Insert superadmin user profile
INSERT INTO user_profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    signup_type,
    company_admin,
    verification_setup_completed,
    payment_status,
    onboarding_completed,
    permissions,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Fixed UUID for superadmin
    'superadmin@sms-hub.com',
    'Super',
    'Admin',
    'SUPERADMIN',
    'superadmin',
    true,
    true,
    'completed',
    true,
    '{
        "can_access_all_apps": true,
        "can_manage_users": true,
        "can_manage_companies": true,
        "can_manage_campaigns": true,
        "can_view_analytics": true,
        "can_manage_billing": true,
        "can_access_admin_panel": true,
        "can_manage_system_settings": true
    }'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'SUPERADMIN',
    signup_type = 'superadmin',
    company_admin = true,
    verification_setup_completed = true,
    payment_status = 'completed',
    onboarding_completed = true,
    permissions = '{
        "can_access_all_apps": true,
        "can_manage_users": true,
        "can_manage_companies": true,
        "can_manage_campaigns": true,
        "can_view_analytics": true,
        "can_manage_billing": true,
        "can_access_admin_panel": true,
        "can_manage_system_settings": true
    }'::jsonb,
    updated_at = NOW();

-- Create a system company for superadmin (if it doesn't exist)
INSERT INTO companies (
    id,
    public_name,
    signup_type,
    created_by_user_id,
    first_admin_user_id,
    verification_setup_completed,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Fixed UUID for system company
    'SMS Hub System',
    'superadmin',
    '00000000-0000-0000-0000-000000000001', -- superadmin user ID
    '00000000-0000-0000-0000-000000000001', -- superadmin user ID
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Update superadmin user to be associated with system company
UPDATE user_profiles 
SET company_id = '00000000-0000-0000-0000-000000000001'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Add comments
COMMENT ON COLUMN user_profiles.permissions IS 'JSON permissions for the user, including superadmin capabilities';
COMMENT ON COLUMN companies.public_name IS 'Public display name for the company';

-- Add index for superadmin queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_signup_type ON user_profiles(signup_type);
