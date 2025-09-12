-- Migration #3: Seed initial data with hub-appropriate businesses
-- This migration creates the superadmin user and sample records for each hub

-- Create the superadmin auth user first
-- Note: This user needs to be created through Supabase Auth
-- Use the dashboard or auth.users API to create: superadmin@gnymble.com
-- This migration assumes the auth user already exists

DO $$
DECLARE
  v_superadmin_id UUID := '00000000-0000-0000-0000-000000000001';
  v_percytech_company_id UUID := '00000000-0000-0000-0000-000000000001';
  v_gnymble_company_id UUID := '00000000-0000-0000-0000-000000000001';
  v_percymd_company_id UUID := '00000000-0000-0000-0000-000000000001';
  v_percytext_user_id UUID := '00000000-0000-0000-0000-000000000001';
  v_percytext_customer_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Check if superadmin exists in auth.users (must be created first via Supabase Auth)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'superadmin@gnymble.com') THEN
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'IMPORTANT: Superadmin user must be created first!';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Please create the superadmin user via Supabase Dashboard:';
    RAISE NOTICE '1. Go to Authentication > Users';
    RAISE NOTICE '2. Click "Add user"';
    RAISE NOTICE '3. Email: superadmin@gnymble.com';
    RAISE NOTICE '4. Password: SuperAdmin123!';
    RAISE NOTICE '5. Auto Confirm User: Yes';
    RAISE NOTICE '';
    RAISE NOTICE 'Then run this migration again.';
    RAISE NOTICE '===============================================';
    RETURN; -- Exit early if superadmin doesn't exist
  END IF;

  -- Get the actual superadmin ID from auth.users
  SELECT id INTO v_superadmin_id FROM auth.users WHERE email = 'superadmin@gnymble.com';

  -- 1. Create PercyTech company (for superadmin)
  INSERT INTO companies (
    id, public_name, legal_company_name, hub_id, company_account_number,
    signup_type, is_active, created_by_user_id, first_admin_user_id,
    ein, company_type, address, city, state, zip, country,
    phone, website, primary_contact_name, primary_contact_email,
    primary_contact_phone, primary_contact_title, year_established,
    number_of_employees, industry_vertical
  ) VALUES (
    v_percytech_company_id,
    'PercyTech SMS Platform',
    'PercyTech Solutions LLC',
    0, -- PercyTech hub
    'PERCY-000001',
    'internal',
    true,
    v_superadmin_id,
    v_superadmin_id,
    '12-3456789',
    'LLC',
    '123 Tech Plaza',
    'San Francisco',
    'CA',
    '94105',
    'USA',
    '+14155551234',
    'https://percytech.com',
    'System Administrator',
    'admin@percytech.com',
    '+14155551234',
    'CTO',
    2020,
    '11-50',
    'Technology'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Create superadmin user profile
  INSERT INTO user_profiles (
    id, email, account_number, hub_id, first_name, last_name,
    mobile_phone_number, role, signup_type, company_admin,
    company_admin_since, verification_setup_completed,
    verification_setup_completed_at, is_active, company_id,
    onboarding_completed, permissions
  ) VALUES (
    v_superadmin_id,
    'superadmin@gnymble.com',
    'PERCY-000001',
    0, -- PercyTech hub
    'System',
    'Administrator',
    '+14155551234',
    'SUPERADMIN',
    'internal',
    true,
    NOW(),
    true,
    NOW(),
    true,
    v_percytech_company_id,
    true,
    jsonb_build_object(
      'can_manage_users', true,
      'can_manage_companies', true,
      'can_manage_billing', true,
      'can_view_analytics', true,
      'can_manage_system', true,
      'can_access_all_hubs', true
    )
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. Create PercyTech customer record (even internal companies need customer records)
  INSERT INTO customers (
    id, company_id, billing_email, customer_type, hub_id,
    payment_status, payment_type, subscription_status,
    subscription_tier, is_active
  ) VALUES (
    v_percytech_company_id,
    v_percytech_company_id,
    'billing@percytech.com',
    'company',
    0,
    'completed',
    'internal',
    'active',
    'enterprise',
    true
  ) ON CONFLICT (id) DO NOTHING;

  -- 4. Create Gnymble sample company (Cigar Lounge - B2B)
  INSERT INTO companies (
    id, public_name, legal_company_name, hub_id, company_account_number,
    signup_type, is_active, ein, company_type, address, city, state, zip,
    phone, website, primary_contact_name, primary_contact_email,
    primary_contact_phone, primary_contact_title, year_established,
    number_of_employees, annual_revenue, industry_vertical, brand_name
  ) VALUES (
    v_gnymble_company_id,
    'The Havana Room',
    'Havana Room Cigar Lounge LLC',
    1, -- Gnymble hub
    'GNYM-000001',
    'self_serve',
    true,
    '45-6789012',
    'LLC',
    '456 Luxury Ave',
    'Miami',
    'FL',
    '33139',
    '+13055552345',
    'https://havanaroom.com',
    'Carlos Rodriguez',
    'carlos@havanaroom.com',
    '+13055552345',
    'Owner',
    2018,
    '1-10',
    '<$1M',
    'Retail',
    'Havana Room'
  ) ON CONFLICT (id) DO NOTHING;

  -- 5. Create PercyMD sample company (Medical Practice - B2B)
  INSERT INTO companies (
    id, public_name, legal_company_name, hub_id, company_account_number,
    signup_type, is_active, ein, company_type, address, city, state, zip,
    phone, website, primary_contact_name, primary_contact_email,
    primary_contact_phone, primary_contact_title, year_established,
    number_of_employees, annual_revenue, industry_vertical
  ) VALUES (
    v_percymd_company_id,
    'Riverside Family Medicine',
    'Riverside Family Medicine PC',
    2, -- PercyMD hub
    'PMMD-000001',
    'self_serve',
    true,
    '78-9012345',
    'Corporation',
    '789 Medical Center Dr',
    'Austin',
    'TX',
    '78701',
    '+15125553456',
    'https://riversidefamilymed.com',
    'Dr. Sarah Chen',
    'dr.chen@riversidefamilymed.com',
    '+15125553456',
    'Medical Director',
    2015,
    '11-50',
    '$1M-$10M',
    'Healthcare'
  ) ON CONFLICT (id) DO NOTHING;

  -- 6. Create PercyText individual user (B2C)
  -- First create the user profile
  INSERT INTO user_profiles (
    id, email, account_number, hub_id, first_name, last_name,
    mobile_phone_number, role, signup_type, company_admin,
    verification_setup_completed, is_active, onboarding_completed
  ) VALUES (
    v_percytext_user_id,
    'john.doe@gmail.com',
    'PTXT-000001',
    3, -- PercyText hub
    'John',
    'Doe',
    '+14045554567',
    'ONBOARDED',
    'individual',
    false,
    true,
    true,
    true
  ) ON CONFLICT (id) DO NOTHING;

  -- Create customer record for individual (B2C)
  INSERT INTO customers (
    id, user_id, billing_email, customer_type, hub_id,
    payment_status, payment_type, subscription_status,
    subscription_tier, is_active
  ) VALUES (
    v_percytext_customer_id,
    v_percytext_user_id,
    'john.doe@gmail.com',
    'individual',
    3,
    'completed',
    'card',
    'active',
    'basic',
    true
  ) ON CONFLICT (id) DO NOTHING;

  -- 7. Create sample users for each B2B company
  -- Gnymble company admin
  INSERT INTO user_profiles (
    id, email, account_number, hub_id, first_name, last_name,
    mobile_phone_number, role, signup_type, company_admin,
    company_admin_since, company_id, verification_setup_completed,
    is_active, onboarding_completed
  ) VALUES (
    gen_random_uuid(),
    'carlos@havanaroom.com',
    'GNYM-000002',
    1,
    'Carlos',
    'Rodriguez',
    '+13055552345',
    'ADMIN',
    'self_serve',
    true,
    NOW(),
    v_gnymble_company_id,
    true,
    true,
    true
  ) ON CONFLICT (email) DO NOTHING;

  -- PercyMD company admin
  INSERT INTO user_profiles (
    id, email, account_number, hub_id, first_name, last_name,
    mobile_phone_number, role, signup_type, company_admin,
    company_admin_since, company_id, verification_setup_completed,
    is_active, onboarding_completed
  ) VALUES (
    gen_random_uuid(),
    'dr.chen@riversidefamilymed.com',
    'PMMD-000002',
    2,
    'Sarah',
    'Chen',
    '+15125553456',
    'ADMIN',
    'self_serve',
    true,
    NOW(),
    v_percymd_company_id,
    true,
    true,
    true
  ) ON CONFLICT (email) DO NOTHING;

  -- 8. Create customer records for B2B companies
  INSERT INTO customers (
    company_id, billing_email, customer_type, hub_id,
    payment_status, payment_type, subscription_status,
    subscription_tier, is_active, trial_ends_at
  ) VALUES
  (
    v_gnymble_company_id,
    'billing@havanaroom.com',
    'company',
    1,
    'pending',
    'card',
    'trial',
    'professional',
    true,
    NOW() + INTERVAL '14 days'
  ),
  (
    v_percymd_company_id,
    'billing@riversidefamilymed.com',
    'company',
    2,
    'completed',
    'card',
    'active',
    'professional',
    true,
    NULL
  ) ON CONFLICT (company_id) DO NOTHING;

  -- 9. Create sample phone numbers for each company
  INSERT INTO phone_numbers (hub_id, company_id, phone_number) VALUES
  (1, v_gnymble_company_id, '+13055559001'),
  (1, v_gnymble_company_id, '+13055559002'),
  (2, v_percymd_company_id, '+15125559001'),
  (2, v_percymd_company_id, '+15125559002')
  ON CONFLICT (phone_number) DO NOTHING;

  -- 10. Log the setup
  RAISE NOTICE '===============================================';
  RAISE NOTICE 'INITIAL DATA SEED COMPLETE';
  RAISE NOTICE '===============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Created accounts:';
  RAISE NOTICE '';
  RAISE NOTICE '1. SUPERADMIN (PercyTech):';
  RAISE NOTICE '   Email: superadmin@gnymble.com';
  RAISE NOTICE '   Company: PercyTech SMS Platform';
  RAISE NOTICE '   Access: All hubs';
  RAISE NOTICE '';
  RAISE NOTICE '2. Gnymble B2B Sample:';
  RAISE NOTICE '   Company: The Havana Room (Cigar Lounge)';
  RAISE NOTICE '   Admin: carlos@havanaroom.com';
  RAISE NOTICE '   Status: Trial (14 days)';
  RAISE NOTICE '';
  RAISE NOTICE '3. PercyMD B2B Sample:';
  RAISE NOTICE '   Company: Riverside Family Medicine';
  RAISE NOTICE '   Admin: dr.chen@riversidefamilymed.com';
  RAISE NOTICE '   Status: Active subscriber';
  RAISE NOTICE '';
  RAISE NOTICE '4. PercyText B2C Sample:';
  RAISE NOTICE '   User: john.doe@gmail.com';
  RAISE NOTICE '   Type: Individual subscriber';
  RAISE NOTICE '   Status: Active';
  RAISE NOTICE '===============================================';

END $$;