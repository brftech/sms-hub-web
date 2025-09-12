-- Data Migration Script: Companies/Customers -> Accounts
-- This script migrates existing companies and customers to the new accounts table
-- Run this AFTER the accounts table has been created

-- Step 1: Migrate Companies to Accounts (B2B)
INSERT INTO accounts (
    hub_id,
    account_type,
    status,
    billing_email,
    stripe_customer_id,
    subscription_status,
    subscription_tier,
    trial_ends_at,
    company_name,
    company_website,
    company_industry,
    company_size,
    company_vertical_type,
    is_active,
    created_at,
    updated_at
)
SELECT 
    c.hub_id,
    'company' as account_type,
    CASE 
        WHEN c.is_active = true THEN 'active'
        ELSE 'inactive'
    END as status,
    cust.billing_email,
    cust.stripe_customer_id,
    cust.subscription_status,
    cust.subscription_tier,
    cust.trial_ends_at,
    c.name as company_name,
    c.website as company_website,
    c.industry as company_industry,
    c.size as company_size,
    c.vertical_type as company_vertical_type,
    c.is_active,
    c.created_at,
    c.updated_at
FROM companies c
LEFT JOIN customers cust ON cust.company_id = c.id
WHERE NOT EXISTS (
    -- Don't migrate if account already exists for this company
    SELECT 1 FROM accounts a 
    WHERE a.company_name = c.name 
    AND a.hub_id = c.hub_id
);

-- Step 2: Migrate Individual Customers to Accounts (B2C)
INSERT INTO accounts (
    hub_id,
    account_type,
    status,
    billing_email,
    stripe_customer_id,
    subscription_status,
    subscription_tier,
    trial_ends_at,
    first_name,
    last_name,
    mobile_phone_number,
    is_active,
    created_at,
    updated_at
)
SELECT 
    cust.hub_id,
    'individual' as account_type,
    CASE 
        WHEN cust.is_active = true THEN 'active'
        ELSE 'inactive'
    END as status,
    cust.billing_email,
    cust.stripe_customer_id,
    cust.subscription_status,
    cust.subscription_tier,
    cust.trial_ends_at,
    up.first_name,
    up.last_name,
    up.mobile_phone_number,
    cust.is_active,
    cust.created_at,
    cust.updated_at
FROM customers cust
JOIN user_profiles up ON up.id = cust.user_id
WHERE cust.customer_type = 'individual'
AND cust.user_id IS NOT NULL
AND NOT EXISTS (
    -- Don't migrate if account already exists for this user
    SELECT 1 FROM accounts a 
    WHERE a.first_name = up.first_name 
    AND a.last_name = up.last_name
    AND a.billing_email = cust.billing_email
    AND a.hub_id = cust.hub_id
);

-- Step 3: Create Account Members for Company Accounts
INSERT INTO account_members (
    account_id,
    user_id,
    email,
    first_name,
    last_name,
    role,
    is_primary_contact,
    is_active,
    created_at,
    updated_at
)
SELECT 
    a.id as account_id,
    up.id as user_id,
    up.email,
    up.first_name,
    up.last_name,
    CASE 
        WHEN up.company_admin = true THEN 'admin'
        ELSE 'member'
    END as role,
    CASE 
        WHEN up.company_admin = true THEN true
        ELSE false
    END as is_primary_contact,
    up.is_active,
    up.created_at,
    up.updated_at
FROM accounts a
JOIN companies c ON c.name = a.company_name AND c.hub_id = a.hub_id
JOIN user_profiles up ON up.company_id = c.id
WHERE a.account_type = 'company'
AND NOT EXISTS (
    -- Don't create if member already exists
    SELECT 1 FROM account_members am 
    WHERE am.account_id = a.id 
    AND am.user_id = up.id
);

-- Step 4: Create Account Members for Individual Accounts
INSERT INTO account_members (
    account_id,
    user_id,
    email,
    first_name,
    last_name,
    role,
    is_primary_contact,
    is_active,
    created_at,
    updated_at
)
SELECT 
    a.id as account_id,
    up.id as user_id,
    up.email,
    up.first_name,
    up.last_name,
    'admin' as role, -- Individual accounts are always admin
    true as is_primary_contact, -- Individual accounts are always primary contact
    up.is_active,
    up.created_at,
    up.updated_at
FROM accounts a
JOIN user_profiles up ON (
    up.first_name = a.first_name 
    AND up.last_name = a.last_name 
    AND up.email = a.billing_email
    AND up.hub_id = a.hub_id
)
WHERE a.account_type = 'individual'
AND NOT EXISTS (
    -- Don't create if member already exists
    SELECT 1 FROM account_members am 
    WHERE am.account_id = a.id 
    AND am.user_id = up.id
);

-- Step 5: Update user_profiles to reference accounts instead of companies
-- Add account_id column to user_profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'account_id'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN account_id UUID REFERENCES accounts(id);
    END IF;
END $$;

-- Update user_profiles with account_id
UPDATE user_profiles 
SET account_id = am.account_id
FROM account_members am
WHERE user_profiles.id = am.user_id;

-- Step 6: Verification Queries (Optional - for checking migration results)
-- Uncomment these to verify the migration worked correctly

-- Check account counts by type
-- SELECT 
--     account_type,
--     COUNT(*) as count
-- FROM accounts 
-- GROUP BY account_type;

-- Check account members
-- SELECT 
--     a.account_type,
--     COUNT(am.id) as member_count
-- FROM accounts a
-- LEFT JOIN account_members am ON am.account_id = a.id
-- GROUP BY a.account_type;

-- Check for any orphaned data
-- SELECT 'Companies without accounts' as check_type, COUNT(*) as count
-- FROM companies c
-- WHERE NOT EXISTS (
--     SELECT 1 FROM accounts a 
--     WHERE a.company_name = c.name AND a.hub_id = c.hub_id
-- )
-- UNION ALL
-- SELECT 'Individual customers without accounts' as check_type, COUNT(*) as count
-- FROM customers cust
-- WHERE cust.customer_type = 'individual'
-- AND NOT EXISTS (
--     SELECT 1 FROM accounts a 
--     JOIN user_profiles up ON up.id = cust.user_id
--     WHERE a.first_name = up.first_name 
--     AND a.last_name = up.last_name
--     AND a.billing_email = cust.billing_email
--     AND a.hub_id = cust.hub_id
-- );
