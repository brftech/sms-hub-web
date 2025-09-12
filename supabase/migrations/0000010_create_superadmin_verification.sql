-- Create verification record for superadmin user
DO $$
DECLARE
    superadmin_user_id UUID;
    superadmin_email TEXT;
BEGIN
    -- Get the superadmin user ID and email
    SELECT id, email INTO superadmin_user_id, superadmin_email
    FROM auth.users 
    WHERE email LIKE '%superadmin%' OR email LIKE '%admin%' 
    LIMIT 1;
    
    IF superadmin_user_id IS NULL THEN
        RAISE NOTICE 'No superadmin user found.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found superadmin user: % (%)', superadmin_email, superadmin_user_id;
    
    -- Create verification record if it doesn't exist
    INSERT INTO verifications (
        id, email, mobile_phone, hub_id, verification_code, 
        verification_sent_at, verification_completed_at, 
        step_data, created_at, updated_at
    )
    SELECT 
        gen_random_uuid(),
        superadmin_email,
        '+15551234567', -- Placeholder phone
        1, -- Gnymble hub
        '000000', -- Placeholder verification code
        NOW() - INTERVAL '1 hour', -- Sent 1 hour ago
        NOW() - INTERVAL '30 minutes', -- Completed 30 minutes ago
        '{"customer_type": "company"}'::jsonb,
        NOW() - INTERVAL '1 hour',
        NOW() - INTERVAL '30 minutes'
    WHERE NOT EXISTS (
        SELECT 1 FROM verifications 
        WHERE email = superadmin_email
    );
    
    RAISE NOTICE 'Verification record created for superadmin';
    
END $$;
