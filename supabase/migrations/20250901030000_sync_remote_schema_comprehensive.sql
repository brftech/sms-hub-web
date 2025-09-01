-- Migration: Sync Remote Schema and Add Missing TCR Fields
-- Date: 2025-01-01
-- Description: This migration syncs our local schema with the remote database
-- and adds only the missing TCR fields that are actually needed for compliance

-- First, let's document what we have in the remote database:
-- The remote database already has these tables with their current structure:
-- - admin_audit_logs, bandwidth_accounts, brands, campaign_phone_assignments
-- - campaigns, companies, contacts, hub_configs, hubs
-- - lead_activities, leads, memberships, messages, onboarding_steps
-- - onboarding_submissions, payment_history, phone_numbers
-- - tcr_integrations, temp_signups, user_profiles, verification_attempts

-- Add missing TCR fields to brands table (only what's not already there)
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS vertical_type TEXT,
ADD COLUMN IF NOT EXISTS brand_relationship TEXT DEFAULT 'BASIC_ACCOUNT',
ADD COLUMN IF NOT EXISTS stock_symbol TEXT,
ADD COLUMN IF NOT EXISTS alternate_business_id TEXT,
ADD COLUMN IF NOT EXISTS alternate_business_id_type TEXT,
ADD COLUMN IF NOT EXISTS tcr_submission_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_approval_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_rejection_reason TEXT;

-- Add missing TCR fields to campaigns table (only what's not already there)
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS message_flow TEXT,
ADD COLUMN IF NOT EXISTS use_case TEXT,
ADD COLUMN IF NOT EXISTS sub_use_cases JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS message_samples JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'promotional',
ADD COLUMN IF NOT EXISTS call_to_action TEXT,
ADD COLUMN IF NOT EXISTS sample_1 TEXT,
ADD COLUMN IF NOT EXISTS sample_2 TEXT,
ADD COLUMN IF NOT EXISTS sample_3 TEXT,
ADD COLUMN IF NOT EXISTS sample_4 TEXT,
ADD COLUMN IF NOT EXISTS sample_5 TEXT,
ADD COLUMN IF NOT EXISTS opt_in_message TEXT,
ADD COLUMN IF NOT EXISTS opt_out_message TEXT,
ADD COLUMN IF NOT EXISTS help_message TEXT,
ADD COLUMN IF NOT EXISTS subscriber_optin TEXT DEFAULT 'WEB_FORM',
ADD COLUMN IF NOT EXISTS subscriber_optout TEXT DEFAULT 'STOP',
ADD COLUMN IF NOT EXISTS subscriber_help TEXT DEFAULT 'HELP',
ADD COLUMN IF NOT EXISTS age_gated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS direct_lending BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS embedded_link BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS embedded_phone BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS number_pool BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS affiliate_marketing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tcr_submission_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_approval_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS monthly_volume INTEGER DEFAULT 10000,
ADD COLUMN IF NOT EXISTS subscriber_count INTEGER DEFAULT 0;

-- Add phone provisioning tracking to companies (only what's not already there)
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS phone_number_provisioned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_number_provisioned_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS platform_access_granted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS platform_access_granted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_policy_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_policy_version TEXT;

-- Enhance temp_signups table for improved onboarding flow
ALTER TABLE temp_signups
ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_verification_attempt_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS preferred_verification_method TEXT DEFAULT 'sms',
ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'company_info',
ADD COLUMN IF NOT EXISTS step_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_policy_accepted_at TIMESTAMPTZ;

-- Add constraints for temp_signups (using DO block to handle IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_auth_method') THEN
        ALTER TABLE temp_signups ADD CONSTRAINT check_auth_method 
        CHECK (auth_method IN ('sms', 'email'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_preferred_verification_method') THEN
        ALTER TABLE temp_signups ADD CONSTRAINT check_preferred_verification_method 
        CHECK (preferred_verification_method IN ('sms', 'email'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_onboarding_step') THEN
        ALTER TABLE temp_signups ADD CONSTRAINT check_onboarding_step 
        CHECK (onboarding_step IN ('company_info', 'contact_info', 'verification', 'completed'));
    END IF;
END $$;

-- The phone_numbers table already exists in the remote database, but needs company_id column
-- Add company_id column to phone_numbers for proper relationship tracking
ALTER TABLE phone_numbers 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- Create indexes for performance (only if they don't exist)

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_brands_tcr_brand_id ON brands(tcr_brand_id);
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_tcr_campaign_id ON campaigns(tcr_campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_use_case ON campaigns(use_case);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_company_id ON phone_numbers(company_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_phone_number ON phone_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_campaign_id ON phone_numbers(assigned_to_campaign);

-- Add check constraints for TCR validation (only if they don't exist)
DO $$
BEGIN
    -- Add brand status constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_brand_status' AND conrelid = 'brands'::regclass
    ) THEN
        ALTER TABLE brands ADD CONSTRAINT check_brand_status 
        CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));
    END IF;

    -- Add brand relationship constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_brand_relationship' AND conrelid = 'brands'::regclass
    ) THEN
        ALTER TABLE brands ADD CONSTRAINT check_brand_relationship 
        CHECK (brand_relationship IN ('BASIC_ACCOUNT', 'SOLE_PROPRIETOR', 'LOW_VOLUME', 'STANDARD'));
    END IF;

    -- Add alternate business id type constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_alternate_business_id_type' AND conrelid = 'brands'::regclass
    ) THEN
        ALTER TABLE brands ADD CONSTRAINT check_alternate_business_id_type 
        CHECK (
            alternate_business_id_type IS NULL OR 
            alternate_business_id_type IN ('DUNS', 'GIIN', 'LEI')
        );
    END IF;

    -- Add campaign status constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_campaign_status' AND conrelid = 'campaigns'::regclass
    ) THEN
        ALTER TABLE campaigns ADD CONSTRAINT check_campaign_status 
        CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'suspended', 'expired'));
    END IF;

    -- Add content type constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_content_type' AND conrelid = 'campaigns'::regclass
    ) THEN
        ALTER TABLE campaigns ADD CONSTRAINT check_content_type 
        CHECK (content_type IN ('promotional', 'transactional', 'conversational', 'mixed'));
    END IF;

    -- Add subscriber optin constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_subscriber_optin' AND conrelid = 'campaigns'::regclass
    ) THEN
        ALTER TABLE campaigns ADD CONSTRAINT check_subscriber_optin 
        CHECK (
            subscriber_optin IN ('VERBAL', 'WEB_FORM', 'PAPER', 'VIA_SMS', 'MOBILE_QR_CODE', 'KEYWORD')
        );
    END IF;

    -- Add use case constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_use_case' AND conrelid = 'campaigns'::regclass
    ) THEN
        ALTER TABLE campaigns ADD CONSTRAINT check_use_case 
        CHECK (
            use_case IN (
                'marketing', 'notifications', 'alerts', 'customer_care', 
                'delivery', 'appointment', '2fa', 'surveys', 'mixed',
                'higher_education', 'k12_education', 'low_volume', 'charity'
            )
        );
    END IF;
END $$;

-- The phone_numbers table already has RLS enabled in the remote database
-- Just ensure our policies are in place (only if they don't exist)
DO $$
BEGIN
    -- Check if policy exists before creating
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'phone_numbers' AND policyname = 'Users can view their company''s phone numbers'
    ) THEN
        CREATE POLICY "Users can view their company's phone numbers" ON phone_numbers
        FOR SELECT USING (
            company_id IN (
                SELECT company_id FROM user_profiles WHERE id = auth.uid()
            )
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'phone_numbers' AND policyname = 'Users can insert phone numbers for their company'
    ) THEN
        CREATE POLICY "Users can insert phone numbers for their company" ON phone_numbers
        FOR INSERT WITH CHECK (
            company_id IN (
                SELECT company_id FROM user_profiles WHERE id = auth.uid()
            )
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'phone_numbers' AND policyname = 'Users can update their company''s phone numbers'
    ) THEN
        CREATE POLICY "Users can update their company's phone numbers" ON phone_numbers
        FOR UPDATE USING (
            company_id IN (
                SELECT company_id FROM user_profiles WHERE id = auth.uid()
            )
        );
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN brands.tcr_brand_id IS 'The Campaign Registry brand ID';
COMMENT ON COLUMN brands.vertical_type IS 'Industry vertical for TCR classification';
COMMENT ON COLUMN campaigns.tcr_campaign_id IS 'The Campaign Registry campaign ID';
COMMENT ON COLUMN campaigns.use_case IS 'Primary use case for TCR compliance';
COMMENT ON COLUMN campaigns.call_to_action IS 'Minimum 40 character description of opt-in process';
COMMENT ON COLUMN companies.phone_number_provisioned IS 'Whether company has provisioned at least one phone number';
COMMENT ON COLUMN companies.platform_access_granted IS 'Whether company has completed onboarding and been granted platform access';

-- Add comments for enhanced onboarding flow
COMMENT ON COLUMN temp_signups.verification_sent_at IS 'When verification code was last sent';
COMMENT ON COLUMN temp_signups.last_verification_attempt_at IS 'When last verification attempt was made';
COMMENT ON COLUMN temp_signups.preferred_verification_method IS 'User preferred verification method (sms/email)';
COMMENT ON COLUMN temp_signups.onboarding_step IS 'Current step in onboarding process';
COMMENT ON COLUMN temp_signups.step_data IS 'JSON data for current step progress';
COMMENT ON COLUMN temp_signups.marketing_consent IS 'Whether user consented to marketing communications';
COMMENT ON COLUMN temp_signups.terms_accepted_at IS 'When terms of service were accepted';
COMMENT ON COLUMN temp_signups.privacy_policy_accepted_at IS 'When privacy policy was accepted';

-- Add new fields for revised onboarding flow
ALTER TABLE temp_signups
ADD COLUMN IF NOT EXISTS is_existing_user BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS existing_user_id UUID REFERENCES user_profiles(id),
ADD COLUMN IF NOT EXISTS verification_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS user_created_at TIMESTAMPTZ;

-- Add new fields for user_profiles pre-onboarding
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS pre_onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS pre_onboarding_completed_at TIMESTAMPTZ;

-- Enhance user_profiles for better payment flow tracking
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
ADD COLUMN IF NOT EXISTS last_payment_attempt_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_failure_reason TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Add constraints for user_profiles payment fields (using DO block to handle IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_subscription_status') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_subscription_status 
        CHECK (subscription_status IN ('inactive', 'pending', 'active', 'past_due', 'canceled', 'unpaid'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_payment_status') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_payment_status 
        CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));
    END IF;
END $$;

-- Add comments for payment flow
COMMENT ON COLUMN user_profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN user_profiles.stripe_subscription_id IS 'Stripe subscription ID if subscription exists';
COMMENT ON COLUMN user_profiles.subscription_status IS 'Current subscription status';
COMMENT ON COLUMN user_profiles.subscription_tier IS 'Subscription tier/plan level';
COMMENT ON COLUMN user_profiles.last_payment_attempt_at IS 'When last payment attempt was made';
COMMENT ON COLUMN user_profiles.payment_failure_reason IS 'Reason for payment failure if applicable';
COMMENT ON COLUMN user_profiles.onboarding_completed_at IS 'When onboarding was completed';

-- Add comments for new onboarding flow fields
COMMENT ON COLUMN temp_signups.is_existing_user IS 'Whether this verification is for an existing user';
COMMENT ON COLUMN temp_signups.existing_user_id IS 'Reference to existing user if verification is for existing user';
COMMENT ON COLUMN temp_signups.verification_completed_at IS 'When verification was successfully completed';
COMMENT ON COLUMN temp_signups.user_created_at IS 'When new user was created after verification';

COMMENT ON COLUMN user_profiles.pre_onboarding_completed IS 'Whether pre-onboarding info gathering is complete';
COMMENT ON COLUMN user_profiles.company_name IS 'Company name gathered during pre-onboarding';
COMMENT ON COLUMN user_profiles.first_name IS 'First name gathered during pre-onboarding';
COMMENT ON COLUMN user_profiles.last_name IS 'Last name gathered during pre-onboarding';
COMMENT ON COLUMN user_profiles.pre_onboarding_completed_at IS 'When pre-onboarding was completed';

-- Add new tables and fields for comprehensive onboarding flow
-- Create inbox table for gPhone preferences
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

-- Add onboarding step tracking to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS account_onboarding_step TEXT DEFAULT 'authentication',
ADD COLUMN IF NOT EXISTS platform_onboarding_step TEXT DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS tcr_brand_submitted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_brand_approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_brand_rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_brand_rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS tcr_campaign_submitted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_campaign_approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_campaign_rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_campaign_rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS gphone_procured_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS account_setup_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS platform_onboarding_started_at TIMESTAMPTZ;

-- Add onboarding step tracking to companies
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS account_onboarding_step TEXT DEFAULT 'authentication',
ADD COLUMN IF NOT EXISTS tcr_brand_submitted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_brand_approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_brand_rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_brand_rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS tcr_campaign_submitted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_campaign_approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_campaign_rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_campaign_rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS privacy_policies_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS privacy_policies_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS gphone_procured_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS account_setup_completed_at TIMESTAMPTZ;

-- Add constraints for onboarding steps (using DO block to handle IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_account_onboarding_step') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_account_onboarding_step
        CHECK (account_onboarding_step IN ('authentication', 'payment', 'personal_info', 'business_info', 'brand_submission', 'privacy_setup', 'campaign_submission', 'gphone_procurement', 'account_setup', 'completed'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_platform_onboarding_step') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_platform_onboarding_step
        CHECK (platform_onboarding_step IN ('not_started', 'in_progress', 'completed'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_company_onboarding_step') THEN
        ALTER TABLE companies ADD CONSTRAINT check_company_onboarding_step
        CHECK (account_onboarding_step IN ('authentication', 'payment', 'personal_info', 'business_info', 'brand_submission', 'privacy_setup', 'campaign_submission', 'gphone_procurement', 'account_setup', 'completed'));
    END IF;
END $$;

-- Add indexes for onboarding tracking
CREATE INDEX IF NOT EXISTS idx_user_profiles_account_onboarding ON user_profiles(account_onboarding_step);
CREATE INDEX IF NOT EXISTS idx_user_profiles_platform_onboarding ON user_profiles(platform_onboarding_step);
CREATE INDEX IF NOT EXISTS idx_companies_account_onboarding ON companies(account_onboarding_step);
CREATE INDEX IF NOT EXISTS idx_inboxes_company_id ON inboxes(company_id);
CREATE INDEX IF NOT EXISTS idx_inboxes_phone_number_id ON inboxes(phone_number_id);

-- Add comments for comprehensive onboarding flow
COMMENT ON TABLE inboxes IS 'Stores gPhone inbox preferences and settings';
COMMENT ON COLUMN inboxes.inbox_name IS 'Display name for the inbox';
COMMENT ON COLUMN inboxes.auto_reply_enabled IS 'Whether auto-reply is enabled for this inbox';
COMMENT ON COLUMN inboxes.auto_reply_message IS 'Auto-reply message content';
COMMENT ON COLUMN inboxes.business_hours_enabled IS 'Whether business hours restrictions apply';
COMMENT ON COLUMN inboxes.business_hours_start IS 'Start time for business hours';
COMMENT ON COLUMN inboxes.business_hours_end IS 'End time for business hours';
COMMENT ON COLUMN inboxes.timezone IS 'Timezone for business hours';
COMMENT ON COLUMN inboxes.notification_preferences IS 'JSON preferences for notifications';

-- User profile onboarding step comments
COMMENT ON COLUMN user_profiles.account_onboarding_step IS 'Current step in account onboarding process';
COMMENT ON COLUMN user_profiles.platform_onboarding_step IS 'Current step in platform onboarding process';
COMMENT ON COLUMN user_profiles.tcr_brand_submitted_at IS 'When brand was submitted to TCR';
COMMENT ON COLUMN user_profiles.tcr_brand_approved_at IS 'When brand was approved by TCR';
COMMENT ON COLUMN user_profiles.tcr_brand_rejected_at IS 'When brand was rejected by TCR';
COMMENT ON COLUMN user_profiles.tcr_brand_rejection_reason IS 'Reason for TCR brand rejection';
COMMENT ON COLUMN user_profiles.tcr_campaign_submitted_at IS 'When campaign was submitted to TCR';
COMMENT ON COLUMN user_profiles.tcr_campaign_approved_at IS 'When campaign was approved by TCR';
COMMENT ON COLUMN user_profiles.tcr_campaign_rejected_at IS 'When campaign was rejected by TCR';
COMMENT ON COLUMN user_profiles.tcr_campaign_rejection_reason IS 'Reason for TCR campaign rejection';
COMMENT ON COLUMN user_profiles.gphone_procured_at IS 'When gPhone was procured';
COMMENT ON COLUMN user_profiles.account_setup_completed_at IS 'When account setup was completed';
COMMENT ON COLUMN user_profiles.platform_onboarding_started_at IS 'When platform onboarding was started';

-- Company onboarding step comments
COMMENT ON COLUMN companies.account_onboarding_step IS 'Current step in company account onboarding process';
COMMENT ON COLUMN companies.tcr_brand_submitted_at IS 'When company brand was submitted to TCR';
COMMENT ON COLUMN companies.tcr_brand_approved_at IS 'When company brand was approved by TCR';
COMMENT ON COLUMN companies.tcr_brand_rejected_at IS 'When company brand was rejected by TCR';
COMMENT ON COLUMN companies.tcr_brand_rejection_reason IS 'Reason for TCR brand rejection';
COMMENT ON COLUMN companies.tcr_campaign_submitted_at IS 'When company campaign was submitted to TCR';
COMMENT ON COLUMN companies.tcr_campaign_approved_at IS 'When company campaign was approved by TCR';
COMMENT ON COLUMN companies.tcr_campaign_rejected_at IS 'When company campaign was rejected by TCR';
COMMENT ON COLUMN companies.tcr_campaign_rejection_reason IS 'Reason for TCR campaign rejection';
COMMENT ON COLUMN companies.privacy_policies_verified IS 'Whether privacy policies have been verified';
COMMENT ON COLUMN companies.privacy_policies_verified_at IS 'When privacy policies were verified';
COMMENT ON COLUMN companies.gphone_procured_at IS 'When company gPhone was procured';
COMMENT ON COLUMN companies.account_setup_completed_at IS 'When company account setup was completed';

-- Add legacy user support and verification tracking
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS verification_setup_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_setup_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_login_method TEXT DEFAULT 'password',
ADD COLUMN IF NOT EXISTS verification_recommendation_shown BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_recommendation_shown_at TIMESTAMPTZ;

-- Add verification tracking to companies
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS verification_setup_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_setup_completed_at TIMESTAMPTZ;

-- Add constraints for verification and login methods (using DO block to handle IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_last_login_method') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_last_login_method
        CHECK (last_login_method IN ('password', 'sms', 'email', 'tfa'));
    END IF;
END $$;

-- Add comments for legacy user support
COMMENT ON COLUMN user_profiles.verification_setup_completed IS 'Whether user has completed verification setup (SMS/email)';
COMMENT ON COLUMN user_profiles.verification_setup_completed_at IS 'When verification setup was completed';
COMMENT ON COLUMN user_profiles.last_login_method IS 'Method used for last successful login';
COMMENT ON COLUMN user_profiles.verification_recommendation_shown IS 'Whether verification recommendation has been shown to user';
COMMENT ON COLUMN user_profiles.verification_recommendation_shown_at IS 'When verification recommendation was last shown';

COMMENT ON COLUMN companies.verification_setup_completed IS 'Whether company has completed verification setup';
COMMENT ON COLUMN companies.verification_setup_completed_at IS 'When company verification setup was completed';

-- Add user invitation and company association system
-- Create invitations table for existing companies to invite new users
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

-- Create user_inbox_assignments table to ensure every user has inbox access
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

-- Add company association tracking to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS signup_type TEXT DEFAULT 'new_company',
ADD COLUMN IF NOT EXISTS invited_by_user_id UUID REFERENCES user_profiles(id),
ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS company_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS company_admin_since TIMESTAMPTZ;

-- Add company creation tracking
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES user_profiles(id),
ADD COLUMN IF NOT EXISTS signup_type TEXT DEFAULT 'new_company',
ADD COLUMN IF NOT EXISTS first_admin_user_id UUID REFERENCES user_profiles(id);

-- Add constraints for signup types and roles (using DO block to handle IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_signup_type') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_signup_type
        CHECK (signup_type IN ('new_company', 'invited_user', 'support', 'superadmin'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_user_role') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_user_role
        CHECK (role IN ('MEMBER', 'ADMIN', 'OWNER', 'SUPPORT', 'VIEWER', 'SUPERADMIN'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_invitation_status') THEN
        ALTER TABLE user_invitations ADD CONSTRAINT check_invitation_status
        CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_invitation_role') THEN
        ALTER TABLE user_invitations ADD CONSTRAINT check_invitation_role
        CHECK (role IN ('MEMBER', 'ADMIN', 'USER'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_assignment_role') THEN
        ALTER TABLE user_inbox_assignments ADD CONSTRAINT check_assignment_role
        CHECK (role IN ('USER', 'ADMIN', 'OWNER'));
    END IF;
END $$;

-- Add indexes for invitation and assignment tracking
CREATE INDEX IF NOT EXISTS idx_user_invitations_company_id ON user_invitations(company_id);
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_status ON user_invitations(status);
CREATE INDEX IF NOT EXISTS idx_user_inbox_assignments_user_id ON user_inbox_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inbox_assignments_company_id ON user_inbox_assignments(company_id);
CREATE INDEX IF NOT EXISTS idx_user_inbox_assignments_inbox_id ON user_inbox_assignments(inbox_id);

-- Add comments for invitation and assignment system
COMMENT ON TABLE user_invitations IS 'Stores invitations for existing companies to add new users';
COMMENT ON COLUMN user_invitations.invited_by_user_id IS 'User who sent the invitation (must have admin privileges)';
COMMENT ON COLUMN user_invitations.invitation_token IS 'Unique token for invitation acceptance';
COMMENT ON COLUMN user_invitations.status IS 'Current status of the invitation';
COMMENT ON COLUMN user_invitations.permissions IS 'JSON permissions for the invited user';

COMMENT ON TABLE user_inbox_assignments IS 'Ensures every user has access to at least one inbox for texting';
COMMENT ON COLUMN user_inbox_assignments.role IS 'User role within this specific inbox';
COMMENT ON COLUMN user_inbox_assignments.permissions IS 'JSON permissions for inbox access';

COMMENT ON COLUMN user_profiles.signup_type IS 'How the user was added to the system';
COMMENT ON COLUMN user_profiles.invited_by_user_id IS 'User who invited this user (if applicable)';
COMMENT ON COLUMN user_profiles.company_admin IS 'Whether user is admin of their company';
COMMENT ON COLUMN user_profiles.company_admin_since IS 'When user became company admin';

COMMENT ON COLUMN companies.created_by_user_id IS 'User who created this company';
COMMENT ON COLUMN companies.signup_type IS 'How the company was added to the system';
COMMENT ON COLUMN companies.first_admin_user_id IS 'First user who became admin of this company';
