-- Migration: Create Superadmin User
-- Date: 2025-01-01
-- Description: Creates a real superadmin user in Supabase for testing and development

-- Create a superadmin user profile
-- Note: This will create the user in user_profiles only
-- The actual auth user will need to be created through Supabase Auth API

-- First, let's create a function to safely create the superadmin user
CREATE OR REPLACE FUNCTION create_superadmin_user()
RETURNS void AS $$
DECLARE
    superadmin_user_id UUID;
    existing_company_id UUID;
BEGIN
    -- Check if superadmin user already exists
    IF EXISTS (SELECT 1 FROM user_profiles WHERE email = 'superadmin@sms-hub.com') THEN
        RAISE NOTICE 'Superadmin user already exists';
        RETURN;
    END IF;

    -- Generate a UUID for the superadmin user
    superadmin_user_id := gen_random_uuid();
    
    -- Find an existing company to associate with (or create a minimal one)
    -- For now, let's just use a placeholder company_id
    SELECT id INTO existing_company_id FROM companies LIMIT 1;
    
    -- If no companies exist, we'll create the user without a company for now
    -- In production, you'd want to create a proper superadmin company

    -- Create the superadmin user profile
    INSERT INTO user_profiles (
        id,
        email,
        phone,
        first_name,
        last_name,
        company_id,
        hub_id,
        role,
        signup_type,
        company_admin,
        company_admin_since,
        payment_status,
        subscription_status,
        account_onboarding_step,
        platform_onboarding_step,
        verification_setup_completed,
        verification_setup_completed_at,
        last_login_method,
        created_at,
        updated_at
    ) VALUES (
        superadmin_user_id,
        'superadmin@sms-hub.com',
        '+15551234567',
        'Super',
        'Admin',
        existing_company_id, -- Will be NULL if no companies exist
        1, -- PercyTech hub
        'SUPERADMIN',
        'superadmin',
        true,
        NOW(),
        'completed',
        'active',
        'completed',
        'completed',
        true,
        NOW(),
        'password',
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Superadmin user created with ID: %', superadmin_user_id;
    IF existing_company_id IS NOT NULL THEN
        RAISE NOTICE 'Associated with existing company ID: %', existing_company_id;
    ELSE
        RAISE NOTICE 'No company association (no companies exist yet)';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create the superadmin user
SELECT create_superadmin_user();

-- Clean up the function
DROP FUNCTION create_superadmin_user();

-- Add a comment for documentation
COMMENT ON TABLE user_profiles IS 'User profiles including superadmin for platform management';
