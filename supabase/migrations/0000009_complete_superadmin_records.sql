-- Complete superadmin records - handle existing customer record
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
        RAISE NOTICE 'No superadmin user found.';
        RETURN;
    END IF;
    
    -- Get the superadmin company ID
    SELECT id INTO superadmin_company_id 
    FROM companies 
    WHERE public_name LIKE '%superadmin%' OR public_name LIKE '%Gnymble Support%'
    LIMIT 1;
    
    IF superadmin_company_id IS NULL THEN
        RAISE NOTICE 'No superadmin company found.';
        RETURN;
    END IF;
    
    -- Get existing customer ID
    SELECT id INTO superadmin_customer_id 
    FROM customers 
    WHERE company_id = superadmin_company_id
    LIMIT 1;
    
    -- Create customer record if it doesn't exist
    IF superadmin_customer_id IS NULL THEN
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
        RETURNING id INTO superadmin_customer_id;
        
        RAISE NOTICE 'Customer record created: %', superadmin_customer_id;
    ELSE
        RAISE NOTICE 'Customer record already exists: %', superadmin_customer_id;
    END IF;
    
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
