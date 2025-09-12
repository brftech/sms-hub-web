-- Direct fix for superadmin user IDs
-- Update the specific records we know exist

-- Update the Gnymble Support company
UPDATE companies 
SET 
    created_by_user_id = '00000000-0000-0000-0000-000000000001',
    first_admin_user_id = '00000000-0000-0000-0000-000000000001',
    updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000002';

-- Update the customer record for that company
UPDATE customers 
SET 
    user_id = '00000000-0000-0000-0000-000000000001',
    updated_at = NOW()
WHERE company_id = '00000000-0000-0000-0000-000000000002';

-- Update memberships for that company
UPDATE memberships 
SET 
    user_id = '00000000-0000-0000-0000-000000000001',
    updated_at = NOW()
WHERE company_id = '00000000-0000-0000-0000-000000000002';

-- Update onboarding_submissions for that company
UPDATE onboarding_submissions 
SET 
    user_id = '00000000-0000-0000-0000-000000000001',
    updated_at = NOW()
WHERE company_id = '00000000-0000-0000-0000-000000000002';

-- Add verification record if it doesn't exist
INSERT INTO verifications (
    id, mobile_phone, verification_code, verification_sent_at, 
    verification_completed_at, existing_user_id, user_created_at, 
    hub_id, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    '+15551234567',
    '123456',
    NOW(),
    NOW(),
    '00000000-0000-0000-0000-000000000001',
    NOW(),
    1,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM verifications 
    WHERE existing_user_id = '00000000-0000-0000-0000-000000000001'
);
