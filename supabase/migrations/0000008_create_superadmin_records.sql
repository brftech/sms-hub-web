-- Create superadmin records for complete dashboard tracking
-- This migration adds missing records for the superadmin user

-- First, let's check what superadmin records exist
DO $$
DECLARE
    superadmin_user_id UUID;
    superadmin_company_id UUID;
    superadmin_customer_id UUID;
BEGIN
    -- Get the superadmin user ID
    SELECT id INTO superadmin_user_id 
    FROM auth.users 
    WHERE email LIKE '%superadmin%' OR email LIKE '%admin%' 
    LIMIT 1;
    
    IF superadmin_user_id IS NULL THEN
        RAISE NOTICE 'No superadmin user found. Please create the superadmin user first.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found superadmin user ID: %', superadmin_user_id;
    
    -- Create user profile if it doesn't exist
    INSERT INTO user_profiles (
        id, email, hub_id, account_number, mobile_phone_number, 
        signup_type, is_active, first_name, last_name, created_at, updated_at
    )
    SELECT 
        superadmin_user_id,
        au.email,
        1, -- Gnymble hub
        'SUPERADMIN-' || EXTRACT(EPOCH FROM NOW())::text,
        '+15551234567', -- Placeholder phone
        'company',
        true,
        'Super',
        'Admin',
        NOW(),
        NOW()
    FROM auth.users au
    WHERE au.id = superadmin_user_id
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'User profile created/verified for superadmin';
    
    -- Create company if it doesn't exist
    INSERT INTO companies (
        id, hub_id, public_name, legal_name, company_account_number,
        created_by_user_id, first_admin_user_id, signup_type, is_active, created_at, updated_at
    )
    SELECT 
        gen_random_uuid(),
        1, -- Gnymble hub
        'Gnymble Support',
        'Gnymble Support LLC',
        'COMP-SUPERADMIN-' || EXTRACT(EPOCH FROM NOW())::text,
        superadmin_user_id,
        superadmin_user_id,
        'company',
        true,
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM companies 
        WHERE public_name LIKE '%superadmin%' OR public_name LIKE '%Gnymble Support%'
    )
    RETURNING id INTO superadmin_company_id;
    
    -- Get company ID if it already existed
    IF superadmin_company_id IS NULL THEN
        SELECT id INTO superadmin_company_id 
        FROM companies 
        WHERE public_name LIKE '%superadmin%' OR public_name LIKE '%Gnymble Support%'
        LIMIT 1;
    END IF;
    
    RAISE NOTICE 'Company ID: %', superadmin_company_id;
    
    -- Create customer record if it doesn't exist
    INSERT INTO customers (
        id, company_id, user_id, billing_email, customer_type, hub_id,
        payment_status, subscription_status, is_active, created_at, updated_at
    )
    SELECT 
        gen_random_uuid(),
        superadmin_company_id,
        superadmin_user_id,
        au.email,
        'company',
        1, -- Gnymble hub
        'completed', -- Superadmin doesn't need payment
        'active',
        true,
        NOW(),
        NOW()
    FROM auth.users au
    WHERE au.id = superadmin_user_id
    AND NOT EXISTS (
        SELECT 1 FROM customers 
        WHERE user_id = superadmin_user_id
    )
    ON CONFLICT (company_id) DO NOTHING
    RETURNING id INTO superadmin_customer_id;
    
    -- Get customer ID if it already existed
    IF superadmin_customer_id IS NULL THEN
        SELECT id INTO superadmin_customer_id 
        FROM customers 
        WHERE user_id = superadmin_user_id
        LIMIT 1;
    END IF;
    
    RAISE NOTICE 'Customer ID: %', superadmin_customer_id;
    
    -- Create membership if it doesn't exist
    INSERT INTO memberships (
        id, user_id, company_id, role, hub_id, created_at, updated_at
    )
    SELECT 
        gen_random_uuid(),
        superadmin_user_id,
        superadmin_company_id,
        'OWNER',
        1, -- Gnymble hub
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM memberships 
        WHERE user_id = superadmin_user_id
    );
    
    RAISE NOTICE 'Membership created/verified for superadmin';
    
    -- Create onboarding submission if it doesn't exist
    INSERT INTO onboarding_submissions (
        id, user_id, company_id, hub_id, current_step, stripe_status, created_at, updated_at
    )
    SELECT 
        gen_random_uuid(),
        superadmin_user_id,
        superadmin_company_id,
        1, -- Gnymble hub
        'complete', -- Superadmin is fully onboarded
        'completed', -- Payment completed
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM onboarding_submissions 
        WHERE user_id = superadmin_user_id
    );
    
    RAISE NOTICE 'Onboarding submission created/verified for superadmin';
    
END $$;
