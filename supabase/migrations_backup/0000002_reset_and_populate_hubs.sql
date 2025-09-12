-- Reset and Populate Hubs Migration
-- This migration:
-- 1. Clears all existing data
-- 2. Creates new superadmin with email superadmin@gnymble.com
-- 3. Populates hubs table with hub IDs 0-3

BEGIN;

-- First, disable RLS temporarily to ensure we can delete everything
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_inbox_assignments DISABLE ROW LEVEL SECURITY;

-- Delete data in correct order to respect foreign key constraints
TRUNCATE TABLE 
  user_inbox_assignments,
  messages,
  contacts,
  verifications,
  leads,
  phone_numbers,
  user_profiles,
  customers,
  companies,
  hubs
CASCADE;

-- Re-enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inbox_assignments ENABLE ROW LEVEL SECURITY;

-- Populate hubs table with all 4 hubs
INSERT INTO hubs (hub_number, name, domain, created_at, updated_at) VALUES
(0, 'percytech', 'PercyTech', NOW(), NOW()),
(1, 'gnymble', 'Gnymble', NOW(), NOW()),
(2, 'percymd', 'PercyMD', NOW(), NOW()),
(3, 'percytext', 'PercyText', NOW(), NOW());

-- Create superadmin company (SMS Hub System)
INSERT INTO companies (
  id,
  hub_id,
  public_name,
  legal_name,
  company_account_number,
  billing_email,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  1, -- Gnymble hub
  'SMS Hub System',
  'SMS Hub System LLC',
  'GNYMBLE-SA001',
  'billing@gnymble.com',
  true,
  NOW(),
  NOW()
);

-- Create customer record BEFORE user_profiles since user_profiles references it
INSERT INTO customers (
  id,
  company_id,
  billing_email,
  customer_type,
  hub_id,
  stripe_customer_id,
  subscription_status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'billing@gnymble.com',
  'company',
  1,
  'cus_dev_superadmin',
  'active',
  true,
  NOW(),
  NOW()
);

-- Update company with customer_id
UPDATE companies 
SET customer_id = '00000000-0000-0000-0000-000000000003'
WHERE id = '00000000-0000-0000-0000-000000000002';

-- Create superadmin user in auth.users
DO $$
DECLARE
  v_user_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Delete existing user if present (shouldn't be any after TRUNCATE, but being safe)
  DELETE FROM auth.users WHERE id = v_user_id OR email = 'superadmin@gnymble.com';
  
  -- Insert new superadmin user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_sent_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    instance_id
  ) VALUES (
    v_user_id,
    'superadmin@gnymble.com',
    crypt('SuperAdmin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object(
      'provider', 'email',
      'providers', jsonb_build_array('email'),
      'role', 'superadmin'
    ),
    jsonb_build_object(
      'full_name', 'Super Admin',
      'hub_id', 1
    ),
    true,
    'authenticated',
    '00000000-0000-0000-0000-000000000000'
  );
  
  RAISE NOTICE 'Superadmin auth user created successfully!';
END $$;

-- Create superadmin profile (AFTER customers table is populated)
INSERT INTO user_profiles (
  id,
  email,
  account_number,
  hub_id,
  first_name,
  last_name,
  mobile_phone_number,
  role,
  signup_type,
  company_admin,
  verification_setup_completed,
  payment_status,
  is_active,
  company_id,
  customer_id,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'superadmin@gnymble.com',
  'GNYMBLE-SA001',
  1, -- Gnymble hub
  'Super',
  'Admin',
  '+15551234567',
  'SUPERADMIN',
  'superadmin',
  true,
  true,
  'completed',
  true,
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  NOW(),
  NOW()
);

-- Output completion message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Hubs created:';
  RAISE NOTICE '  - Hub 0: PercyTech';
  RAISE NOTICE '  - Hub 1: Gnymble';
  RAISE NOTICE '  - Hub 2: PercyMD';
  RAISE NOTICE '  - Hub 3: PercyText';
  RAISE NOTICE '';
  RAISE NOTICE 'Superadmin created:';
  RAISE NOTICE '  - Email: superadmin@gnymble.com';
  RAISE NOTICE '  - Password: SuperAdmin123!';
  RAISE NOTICE '  - Hub: Gnymble (ID: 1)';
  RAISE NOTICE '  - Company: SMS Hub System';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

COMMIT;