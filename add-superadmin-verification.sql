-- Add verification record for superadmin
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
    '00000000-0000-0000-0000-000000000001', -- Superadmin user ID
    NOW(),
    1, -- Gnymble hub
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM verifications 
    WHERE existing_user_id = '00000000-0000-0000-0000-000000000001'
);
