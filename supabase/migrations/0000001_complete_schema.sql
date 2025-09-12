-- SMS Hub Complete Database Schema
-- This single migration file replaces all previous migrations
-- Created: 2025-09-12

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hubs table (core multi-tenant structure)
CREATE TABLE IF NOT EXISTS hubs (
    hub_number INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    domain TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create companies table (business entities)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_name TEXT NOT NULL,
    legal_name TEXT,
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_account_number TEXT UNIQUE,
    signup_type TEXT DEFAULT 'new_company',
    is_active BOOLEAN DEFAULT TRUE,
    created_by_user_id UUID,
    first_admin_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table (paying entities - B2B or B2C)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    user_id UUID,
    billing_email TEXT NOT NULL,
    customer_type TEXT DEFAULT 'company',
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    payment_status TEXT DEFAULT 'pending',
    payment_type TEXT,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'inactive',
    subscription_tier TEXT,
    subscription_ends_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    trial_ends_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
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
    is_active BOOLEAN DEFAULT TRUE,
    company_id UUID REFERENCES companies(id),
    customer_id UUID REFERENCES customers(id),
    invited_by_user_id UUID REFERENCES user_profiles(id),
    invitation_accepted_at TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '{}'::jsonb,
    last_login_at TIMESTAMPTZ,
    last_login_method TEXT,
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
    invited_email TEXT NOT NULL,
    invited_by_user_id UUID NOT NULL REFERENCES user_profiles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    role TEXT DEFAULT 'MEMBER',
    invitation_token UUID DEFAULT gen_random_uuid(),
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_user_id UUID REFERENCES user_profiles(id),
    UNIQUE(invitation_token)
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    role TEXT DEFAULT 'MEMBER',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, company_id)
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
    tags JSONB DEFAULT '[]',
    opted_in BOOLEAN DEFAULT TRUE,
    opted_in_at TIMESTAMPTZ DEFAULT NOW(),
    opted_out_at TIMESTAMPTZ,
    custom_fields JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by_user_id UUID REFERENCES user_profiles(id),
    UNIQUE(company_id, phone_number)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_id UUID NOT NULL REFERENCES companies(id),
    inbox_id UUID NOT NULL REFERENCES inboxes(id),
    contact_id UUID REFERENCES contacts(id),
    phone_number_id UUID NOT NULL REFERENCES phone_numbers(id),
    from_number TEXT NOT NULL,
    to_number TEXT NOT NULL,
    message_content TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    external_id TEXT,
    cost DECIMAL(10, 4),
    segments INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by_user_id UUID REFERENCES user_profiles(id)
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    lead_phone_number TEXT,
    company_name TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    source TEXT,
    campaign_source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    landing_page_url TEXT,
    lead_score INTEGER DEFAULT 0,
    platform_interest TEXT,
    interaction_count INTEGER DEFAULT 0,
    last_interaction_at TIMESTAMPTZ,
    assigned_to_user_id UUID REFERENCES user_profiles(id),
    converted_at TIMESTAMPTZ,
    converted_to_company_id UUID REFERENCES companies(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_activities table
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    performed_by_user_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sms_verifications table (for post-payment SMS consent and verification)
CREATE TABLE IF NOT EXISTS sms_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    phone_number TEXT NOT NULL,
    verification_code TEXT NOT NULL,
    -- Consent tracking (CRITICAL for SMS compliance)
    consent_given BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMPTZ,
    consent_ip_address INET,
    consent_text TEXT, -- What they consented to
    -- Verification tracking
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '15 minutes'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bandwidth_accounts table
CREATE TABLE IF NOT EXISTS bandwidth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    bandwidth_account_id TEXT,
    bandwidth_credentials JSONB NOT NULL DEFAULT '{}',
    phone_numbers JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tcr_integrations table
CREATE TABLE IF NOT EXISTS tcr_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    brand_id UUID REFERENCES brands(id),
    tcr_brand_id TEXT,
    tcr_brand_status TEXT,
    tcr_campaign_id TEXT,
    tcr_campaign_status TEXT,
    tcr_credentials JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id),
    stripe_payment_intent_id TEXT UNIQUE,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL,
    payment_method TEXT,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create onboarding_steps table
CREATE TABLE IF NOT EXISTS onboarding_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    step_name TEXT NOT NULL,
    step_status TEXT DEFAULT 'pending',
    step_data JSONB DEFAULT '{}',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create onboarding_submissions table
CREATE TABLE IF NOT EXISTS onboarding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    submission_type TEXT NOT NULL,
    submission_data JSONB NOT NULL DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    current_step TEXT DEFAULT 'verification',
    stripe_status TEXT,
    step_data JSONB DEFAULT '{}',
    reviewed_by_user_id UUID REFERENCES user_profiles(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    admin_user_id UUID NOT NULL REFERENCES user_profiles(id),
    action_type TEXT NOT NULL,
    action_scope TEXT,
    table_name TEXT,
    record_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hub_configs table
CREATE TABLE IF NOT EXISTS hub_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number) UNIQUE,
    config_data JSONB NOT NULL DEFAULT '{}',
    features JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_hub_id ON companies(hub_id);
CREATE INDEX IF NOT EXISTS idx_companies_account_number ON companies(company_account_number);
CREATE INDEX IF NOT EXISTS idx_customers_hub_id ON customers(hub_id);
CREATE INDEX IF NOT EXISTS idx_customers_payment_status ON customers(payment_status);
CREATE INDEX IF NOT EXISTS idx_customers_subscription_status ON customers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_customers_billing_email ON customers(billing_email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hub_id ON user_profiles(hub_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_messages_hub_id ON messages(hub_id);
CREATE INDEX IF NOT EXISTS idx_messages_company_id ON messages(company_id);
CREATE INDEX IF NOT EXISTS idx_messages_inbox_id ON messages(inbox_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_hub_id ON contacts(hub_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone_number ON contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_leads_hub_id ON leads(hub_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_user_id ON sms_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_phone_number ON sms_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_memberships_user_company ON memberships(user_id, company_id);

-- Add foreign key constraints for user_profiles
ALTER TABLE companies ADD CONSTRAINT companies_created_by_user_id_fkey 
    FOREIGN KEY (created_by_user_id) REFERENCES user_profiles(id);
ALTER TABLE companies ADD CONSTRAINT companies_first_admin_user_id_fkey 
    FOREIGN KEY (first_admin_user_id) REFERENCES user_profiles(id);
ALTER TABLE customers ADD CONSTRAINT customers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id);

-- Create functions for generating account numbers
CREATE OR REPLACE FUNCTION generate_user_account_number(hub_name TEXT)
RETURNS TEXT AS $$
DECLARE
    counter INTEGER;
    account_number TEXT;
BEGIN
    -- Get the next counter value
    SELECT COALESCE(MAX(CAST(SUBSTRING(account_number FROM 5) AS INTEGER)), 0) + 1
    INTO counter
    FROM user_profiles
    WHERE account_number LIKE hub_name || '-%';
    
    -- Format the account number
    account_number := hub_name || '-' || LPAD(counter::TEXT, 6, '0');
    
    RETURN account_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_company_account_number(hub_name TEXT)
RETURNS TEXT AS $$
DECLARE
    counter INTEGER;
    account_number TEXT;
BEGIN
    -- Get the next counter value
    SELECT COALESCE(MAX(CAST(SUBSTRING(company_account_number FROM 5) AS INTEGER)), 0) + 1
    INTO counter
    FROM companies
    WHERE company_account_number LIKE hub_name || '-%';
    
    -- Format the account number
    account_number := hub_name || '-' || LPAD(counter::TEXT, 6, '0');
    
    RETURN account_number;
END;
$$ LANGUAGE plpgsql;

-- Insert initial hub data
INSERT INTO hubs (hub_number, name, domain) VALUES 
    (0, 'PercyTech', 'percytech.com'),
    (1, 'Gnymble', 'gnymble.com'),
    (2, 'PercyMD', 'percymd.com'),
    (3, 'PercyText', 'percytext.com')
ON CONFLICT (hub_number) DO NOTHING;

-- Add table comments for clarity
COMMENT ON TABLE companies IS 'Business entities - represents companies/organizations';
COMMENT ON TABLE customers IS 'Paying entities - represents customers who pay for services (B2B or B2C)';
COMMENT ON TABLE user_profiles IS 'User profiles - id should match auth.users.id for proper linking';
COMMENT ON TABLE sms_verifications IS 'SMS phone verification and consent tracking - used AFTER payment';
COMMENT ON TABLE messages IS 'SMS messages sent and received';
COMMENT ON TABLE leads IS 'Marketing leads from landing pages';
COMMENT ON TABLE hubs IS 'Multi-tenant hubs (PercyTech, Gnymble, PercyMD, PercyText)';

-- Note: RLS policies are intentionally NOT included
-- RLS is disabled for this project due to complexity with multi-tenant monorepo
-- Multi-tenancy is handled via manual hub_id filtering in Edge Functions and services