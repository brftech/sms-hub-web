-- Initial Database Schema Migration
-- This creates the complete database schema from scratch

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hubs table (referenced by many other tables)
CREATE TABLE IF NOT EXISTS hubs (
    hub_number INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    domain TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_name TEXT NOT NULL,
    legal_name TEXT,
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_account_number TEXT UNIQUE,
    billing_email TEXT,
    signup_type TEXT DEFAULT 'new_company',
    is_active BOOLEAN DEFAULT TRUE,
    payment_status TEXT DEFAULT 'pending',
    payment_type TEXT,
    customer_id UUID,
    created_by_user_id UUID,
    first_admin_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID,
    billing_email TEXT NOT NULL,
    customer_type TEXT DEFAULT 'company',
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    stripe_customer_id TEXT UNIQUE,
    subscription_status TEXT DEFAULT 'inactive',
    subscription_tier TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id),
    UNIQUE(user_id)
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    account_number TEXT UNIQUE,
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    first_name TEXT,
    last_name TEXT,
    mobile_phone_number TEXT,
    role TEXT DEFAULT 'MEMBER',
    signup_type TEXT DEFAULT 'new_company',
    company_admin BOOLEAN DEFAULT FALSE,
    company_admin_since TIMESTAMPTZ,
    verification_setup_completed BOOLEAN DEFAULT FALSE,
    verification_setup_completed_at TIMESTAMPTZ,
    payment_status TEXT DEFAULT 'pending',
    is_active BOOLEAN DEFAULT TRUE,
    company_id UUID REFERENCES companies(id),
    customer_id UUID REFERENCES customers(id),
    invited_by_user_id UUID REFERENCES user_profiles(id),
    invitation_accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    name TEXT NOT NULL,
    dba_brand_name TEXT,
    status TEXT,
    tcr_brand_id TEXT UNIQUE,
    vertical_type TEXT,
    brand_relationship TEXT DEFAULT 'BASIC_ACCOUNT',
    stock_symbol TEXT,
    alternate_business_id TEXT,
    alternate_business_id_type TEXT,
    tcr_submission_date TIMESTAMPTZ,
    tcr_approval_date TIMESTAMPTZ,
    tcr_rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    name TEXT NOT NULL,
    description TEXT,
    message_flow TEXT,
    use_case TEXT,
    sub_use_cases JSONB DEFAULT '[]'::jsonb,
    message_samples JSONB DEFAULT '[]'::jsonb,
    content_type TEXT DEFAULT 'promotional',
    call_to_action TEXT,
    sample_1 TEXT,
    sample_2 TEXT,
    sample_3 TEXT,
    sample_4 TEXT,
    sample_5 TEXT,
    opt_in_message TEXT,
    opt_out_message TEXT,
    help_message TEXT,
    subscriber_optin TEXT DEFAULT 'WEB_FORM',
    subscriber_optout TEXT DEFAULT 'STOP',
    subscriber_help TEXT DEFAULT 'HELP',
    age_gated BOOLEAN DEFAULT FALSE,
    direct_lending BOOLEAN DEFAULT FALSE,
    embedded_link BOOLEAN DEFAULT FALSE,
    embedded_phone BOOLEAN DEFAULT FALSE,
    number_pool BOOLEAN DEFAULT FALSE,
    affiliate_marketing BOOLEAN DEFAULT FALSE,
    tcr_submission_date TIMESTAMPTZ,
    tcr_approval_date TIMESTAMPTZ,
    tcr_rejection_reason TEXT,
    monthly_volume INTEGER DEFAULT 10000,
    subscriber_count INTEGER DEFAULT 0,
    status TEXT,
    tcr_campaign_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create phone_numbers table
CREATE TABLE IF NOT EXISTS phone_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_id UUID REFERENCES companies(id),
    phone_number TEXT NOT NULL UNIQUE,
    assigned_to_campaign BOOLEAN DEFAULT FALSE,
    campaign_id UUID REFERENCES campaigns(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create campaign_phone_assignments table
CREATE TABLE IF NOT EXISTS campaign_phone_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id),
    phone_number_id UUID NOT NULL REFERENCES phone_numbers(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, phone_number_id)
);

-- Create inboxes table
CREATE TABLE IF NOT EXISTS inboxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_id UUID NOT NULL REFERENCES companies(id),
    phone_number_id UUID NOT NULL REFERENCES phone_numbers(id),
    inbox_name TEXT NOT NULL,
    auto_reply_enabled BOOLEAN DEFAULT FALSE,
    auto_reply_message TEXT,
    business_hours_enabled BOOLEAN DEFAULT FALSE,
    business_hours_start TIME,
    business_hours_end TIME,
    timezone TEXT DEFAULT 'UTC',
    notification_preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_inbox_assignments table
CREATE TABLE IF NOT EXISTS user_inbox_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    inbox_id UUID NOT NULL REFERENCES inboxes(id),
    role TEXT DEFAULT 'USER',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by_user_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_invitations table
CREATE TABLE IF NOT EXISTS user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_id UUID NOT NULL REFERENCES companies(id),
    invited_by_user_id UUID NOT NULL REFERENCES user_profiles(id),
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'MEMBER',
    permissions JSONB DEFAULT '{}',
    invitation_token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verifications table (renamed from temp_signups)
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    email TEXT,
    mobile_phone TEXT,
    verification_code TEXT,
    verification_sent_at TIMESTAMPTZ,
    last_verification_attempt_at TIMESTAMPTZ,
    preferred_verification_method TEXT DEFAULT 'sms',
    onboarding_step TEXT DEFAULT 'company_info',
    step_data JSONB DEFAULT '{}',
    marketing_consent BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMPTZ,
    privacy_policy_accepted_at TIMESTAMPTZ,
    is_existing_user BOOLEAN DEFAULT FALSE,
    existing_user_id UUID REFERENCES user_profiles(id),
    verification_completed_at TIMESTAMPTZ,
    user_created_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification_attempts table
CREATE TABLE IF NOT EXISTS verification_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID NOT NULL REFERENCES verifications(id),
    attempt_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_name TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'medium',
    source_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_activities table
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    activity_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_id UUID NOT NULL REFERENCES companies(id),
    campaign_id UUID REFERENCES campaigns(id),
    to_number TEXT NOT NULL,
    from_number TEXT NOT NULL,
    message_content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_id UUID NOT NULL REFERENCES companies(id),
    phone_number TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    opt_out BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL,
    stripe_payment_intent_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create onboarding_steps table
CREATE TABLE IF NOT EXISTS onboarding_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    step_number INTEGER NOT NULL,
    step_name TEXT NOT NULL,
    step_description TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hub_id, step_number)
);

-- Create onboarding_submissions table
CREATE TABLE IF NOT EXISTS onboarding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    current_step TEXT,
    stripe_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, hub_id)
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    role TEXT DEFAULT 'MEMBER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, company_id, hub_id)
);

-- Create tcr_integrations table
CREATE TABLE IF NOT EXISTS tcr_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    tcr_brand_id TEXT UNIQUE,
    tcr_campaign_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bandwidth_accounts table
CREATE TABLE IF NOT EXISTS bandwidth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    bandwidth_account_id TEXT UNIQUE,
    bandwidth_credentials JSONB NOT NULL,
    phone_numbers JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES user_profiles(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    action_type TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    action_scope TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hub_configs table
CREATE TABLE IF NOT EXISTS hub_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number) UNIQUE,
    config_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default hub
INSERT INTO hubs (hub_number, name, domain) VALUES (1, 'Gnymble', 'gnymble.com') ON CONFLICT (hub_number) DO NOTHING;

-- Insert default hub config
INSERT INTO hub_configs (hub_id, config_data) VALUES (1, '{}') ON CONFLICT (hub_id) DO NOTHING;

-- Create superadmin user
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

  -- 2. Create company
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

  -- 3. Create customer
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

  -- 5. Create user_profile
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hub_id ON user_profiles(hub_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_companies_hub_id ON companies(hub_id);
CREATE INDEX IF NOT EXISTS idx_companies_company_account_number ON companies(company_account_number);
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_brands_company_id ON brands(company_id);
CREATE INDEX IF NOT EXISTS idx_brands_hub_id ON brands(hub_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_hub_id ON campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_hub_id ON phone_numbers(hub_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_company_id ON phone_numbers(company_id);
CREATE INDEX IF NOT EXISTS idx_messages_hub_id ON messages(hub_id);
CREATE INDEX IF NOT EXISTS idx_messages_company_id ON messages(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_hub_id ON leads(hub_id);
CREATE INDEX IF NOT EXISTS idx_verifications_hub_id ON verifications(hub_id);
CREATE INDEX IF NOT EXISTS idx_verifications_email ON verifications(email);
CREATE INDEX IF NOT EXISTS idx_verifications_mobile_phone ON verifications(mobile_phone);
