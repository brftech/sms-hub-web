-- Fix superadmin user IDs to match regular user structure
-- This ensures superadmin records have proper user_id relationships

DO $$
DECLARE
    superadmin_user_id UUID;
    superadmin_company_id UUID;
BEGIN
    -- Get the superadmin user ID
    SELECT id INTO superadmin_user_id 
    FROM auth.users 
    WHERE email = 'superadmin@gnymble.com'
    LIMIT 1;
    
    IF superadmin_user_id IS NULL THEN
        RAISE NOTICE 'No superadmin user found. Please create the superadmin user first.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found superadmin user ID: %', superadmin_user_id;
    
    -- Get the superadmin company ID
    SELECT id INTO superadmin_company_id 
    FROM companies 
    WHERE public_name LIKE '%Gnymble Support%' OR public_name LIKE '%superadmin%'
    LIMIT 1;
    
    IF superadmin_company_id IS NULL THEN
        RAISE NOTICE 'No superadmin company found.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found superadmin company ID: %', superadmin_company_id;
    
    -- Update companies table to have proper user IDs
    UPDATE companies 
    SET 
        created_by_user_id = superadmin_user_id,
        first_admin_user_id = superadmin_user_id,
        updated_at = NOW()
    WHERE id = superadmin_company_id;
    
    RAISE NOTICE 'Updated companies table with superadmin user IDs';
    
    -- Update customers table to have proper user ID
    UPDATE customers 
    SET 
        user_id = superadmin_user_id,
        updated_at = NOW()
    WHERE company_id = superadmin_company_id;
    
    RAISE NOTICE 'Updated customers table with superadmin user ID';
    
    -- Update memberships table to have proper user ID
    UPDATE memberships 
    SET 
        user_id = superadmin_user_id,
        updated_at = NOW()
    WHERE company_id = superadmin_company_id;
    
    RAISE NOTICE 'Updated memberships table with superadmin user ID';
    
    -- Update onboarding_submissions table to have proper user ID
    UPDATE onboarding_submissions 
    SET 
        user_id = superadmin_user_id,
        updated_at = NOW()
    WHERE company_id = superadmin_company_id;
    
    RAISE NOTICE 'Updated onboarding_submissions table with superadmin user ID';
    
    -- Create a verification record for superadmin if it doesn't exist
    INSERT INTO verifications (
        id, mobile_phone, verification_code, verification_sent_at, 
        verification_completed_at, existing_user_id, user_created_at, 
        hub_id, created_at, updated_at
    )
    SELECT 
        gen_random_uuid(),
        '+15551234567', -- Placeholder phone
        '123456', -- Placeholder code
        NOW(),
        NOW(), -- Mark as completed
        superadmin_user_id,
        NOW(),
        1, -- Gnymble hub
        NOW(),
        NOW()
    WHERE NOT EXISTS (
        SELECT 1 FROM verifications 
        WHERE existing_user_id = superadmin_user_id
    );
    
    RAISE NOTICE 'Created verification record for superadmin';
    
    RAISE NOTICE 'Superadmin user ID fix completed successfully';
    
END $$;
