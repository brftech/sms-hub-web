-- Migration #3: Create ONLY the superadmin user profile
-- Minimal migration to debug the issue

DO $$
DECLARE
  v_superadmin_id UUID;
  v_percytech_company_id UUID;
BEGIN
  -- Step 1: Check if superadmin exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'superadmin@percytech.com') THEN
    RAISE EXCEPTION 'Superadmin auth user does not exist. Create it first in Supabase Dashboard.';
  END IF;

  -- Step 2: Get the superadmin ID from auth.users
  SELECT id INTO v_superadmin_id FROM auth.users WHERE email = 'superadmin@percytech.com';
  RAISE NOTICE 'Found auth.users record with ID: %', v_superadmin_id;

  -- Step 3: Check if user profile already exists
  IF EXISTS (SELECT 1 FROM user_profiles WHERE id = v_superadmin_id) THEN
    RAISE NOTICE 'User profile already exists for superadmin';
    RETURN; -- Exit early
  END IF;

  -- Step 4: Create user profile (WITHOUT company_id - just like real signup)
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
    company_admin_since,
    verification_setup_completed,
    verification_setup_completed_at,
    is_active,
    company_id, -- NULL initially
    onboarding_completed,
    permissions,
    created_at,
    updated_at
  ) VALUES (
    v_superadmin_id,
    'superadmin@percytech.com',
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
    NULL, -- No company yet
    true,
    jsonb_build_object(
      'can_manage_users', true,
      'can_manage_companies', true,
      'can_manage_billing', true,
      'can_view_analytics', true,
      'can_manage_system', true,
      'can_access_all_hubs', true
    ),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created user profile for superadmin';

  -- Step 5: Generate company ID
  v_percytech_company_id := gen_random_uuid();
  
  -- Step 6: Create company (now that user profile exists)
  INSERT INTO companies (
    id,
    public_name,
    hub_id,
    company_account_number,
    signup_type,
    is_active,
    created_by_user_id,
    first_admin_user_id,
    created_at,
    updated_at
  ) VALUES (
    v_percytech_company_id,
    'PercyTech SMS Platform',
    0, -- PercyTech hub
    'PERCY-000001',
    'internal',
    true,
    v_superadmin_id, -- This references user_profiles(id)
    v_superadmin_id, -- This references user_profiles(id)
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created company with ID: %', v_percytech_company_id;

  -- Step 7: Update user profile with company_id
  UPDATE user_profiles 
  SET 
    company_id = v_percytech_company_id,
    updated_at = NOW()
  WHERE id = v_superadmin_id;

  RAISE NOTICE 'Updated user profile with company_id';

  -- Step 8: Create customer record
  INSERT INTO customers (
    id,
    company_id,
    billing_email,
    customer_type,
    hub_id,
    payment_status,
    payment_type,
    subscription_status,
    subscription_tier,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_percytech_company_id,
    'billing@percytech.com',
    'company',
    0,
    'completed',
    'internal',
    'active',
    'enterprise',
    true,
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created customer record';

  -- Step 9: Create membership
  INSERT INTO memberships (
    id,
    user_id,
    company_id,
    hub_id,
    role,
    is_active,
    joined_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_superadmin_id,
    v_percytech_company_id,
    0,
    'OWNER',
    true,
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Created membership record';

  RAISE NOTICE '===============================================';
  RAISE NOTICE 'SUPERADMIN SETUP COMPLETE';
  RAISE NOTICE '===============================================';
  RAISE NOTICE 'Email: superadmin@percytech.com';
  RAISE NOTICE 'Company: PercyTech SMS Platform';
  RAISE NOTICE 'Role: SUPERADMIN with full access';
  RAISE NOTICE '===============================================';

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '===============================================';
  RAISE NOTICE 'ERROR OCCURRED:';
  RAISE NOTICE 'Message: %', SQLERRM;
  RAISE NOTICE 'State: %', SQLSTATE;
  RAISE NOTICE '===============================================';
  RAISE;
END $$;