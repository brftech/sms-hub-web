-- Simple Superadmin User Creation
-- Just the bare minimum to login and explore

DO $$
DECLARE
  v_user_id UUID := '00000000-0000-0000-0000-000000000001';
  v_company_id UUID := '00000000-0000-0000-0000-000000000002';
  v_customer_id UUID := '00000000-0000-0000-0000-000000000003';
BEGIN
  -- 1. Create auth user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    v_user_id,
    'superadmin@sms-hub.com',
    crypt('SuperAdmin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"first_name": "Super", "last_name": "Admin"}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Create company (without user references - they're nullable)
  INSERT INTO companies (
    id,
    public_name,
    hub_id,
    company_account_number,
    billing_email,
    legal_name,
    signup_type,
    is_active,
    payment_status,
    created_at,
    updated_at
  ) VALUES (
    v_company_id,
    'SMS Hub System',
    1,
    'PERCY-SA001',
    'superadmin@sms-hub.com',
    'SMS Hub System',
    'superadmin',
    true,
    'completed',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. Create customer with ALL required fields
  INSERT INTO customers (
    id,
    company_id,
    billing_email,
    customer_type,
    hub_id,
    stripe_customer_id,
    subscription_status,
    created_at,
    updated_at
  ) VALUES (
    v_customer_id,
    v_company_id,
    'superadmin@sms-hub.com',
    'company',
    1,
    'cus_dev_superadmin',
    'active',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO NOTHING;

  -- 4. Update company with customer_id
  UPDATE companies 
  SET customer_id = v_customer_id
  WHERE id = v_company_id;

  -- 5. Create user_profile with ALL required fields
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
    v_user_id,
    'superadmin@sms-hub.com',
    'PERCY-SA001',
    1,
    'Super',
    'Admin',
    '+15551234567',
    'SUPERADMIN',
    'superadmin',
    true,
    true,
    'completed',
    true,
    v_company_id,
    v_customer_id,
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO NOTHING;

  -- 6. Update company with user references
  UPDATE companies 
  SET 
    created_by_user_id = v_user_id,
    first_admin_user_id = v_user_id
  WHERE id = v_company_id;

  RAISE NOTICE 'Superadmin created successfully!';
  RAISE NOTICE 'Email: superadmin@sms-hub.com';
  RAISE NOTICE 'Password: SuperAdmin123!';
END $$;