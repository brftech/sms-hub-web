-- Add missing TCR fields to support full TCR API integration
-- This migration adds fields required by The Campaign Registry for brand and campaign registration

-- Add address and TCR-specific fields to brands table
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS address_street TEXT,
ADD COLUMN IF NOT EXISTS address_city TEXT,
ADD COLUMN IF NOT EXISTS address_state TEXT,
ADD COLUMN IF NOT EXISTS address_postal_code TEXT,
ADD COLUMN IF NOT EXISTS address_country TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS vertical_type TEXT,
ADD COLUMN IF NOT EXISTS brand_relationship TEXT DEFAULT 'BASIC_ACCOUNT',
ADD COLUMN IF NOT EXISTS stock_symbol TEXT,
ADD COLUMN IF NOT EXISTS alternate_business_id TEXT,
ADD COLUMN IF NOT EXISTS alternate_business_id_type TEXT,
ADD COLUMN IF NOT EXISTS tcr_submission_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_approval_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tcr_rejection_reason TEXT;

-- Add comprehensive campaign fields for TCR
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

-- Add phone provisioning tracking to companies
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS phone_number_provisioned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_number_provisioned_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS platform_access_granted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS platform_access_granted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_policy_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_policy_version TEXT;

-- Create phone_numbers table if it doesn't exist
CREATE TABLE IF NOT EXISTS phone_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  hub_id INTEGER NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  area_code TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  price DECIMAL(10, 2),
  capabilities JSONB DEFAULT '{"sms": true, "mms": true, "voice": false}'::jsonb,
  provider TEXT DEFAULT 'bandwidth',
  provider_id TEXT,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  provisioned_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_brands_tcr_brand_id ON brands(tcr_brand_id);
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_tcr_campaign_id ON campaigns(tcr_campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_use_case ON campaigns(use_case);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_company_id ON phone_numbers(company_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_phone_number ON phone_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_campaign_id ON phone_numbers(campaign_id);

-- Add check constraints for TCR validation
ALTER TABLE brands
ADD CONSTRAINT check_brand_status CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
ADD CONSTRAINT check_brand_relationship CHECK (brand_relationship IN ('BASIC_ACCOUNT', 'SOLE_PROPRIETOR', 'LOW_VOLUME', 'STANDARD')),
ADD CONSTRAINT check_alternate_business_id_type CHECK (
  alternate_business_id_type IS NULL OR 
  alternate_business_id_type IN ('DUNS', 'GIIN', 'LEI')
);

ALTER TABLE campaigns
ADD CONSTRAINT check_campaign_status CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'suspended', 'expired')),
ADD CONSTRAINT check_content_type CHECK (content_type IN ('promotional', 'transactional', 'conversational', 'mixed')),
ADD CONSTRAINT check_subscriber_optin CHECK (
  subscriber_optin IN ('VERBAL', 'WEB_FORM', 'PAPER', 'VIA_SMS', 'MOBILE_QR_CODE', 'KEYWORD')
),
ADD CONSTRAINT check_use_case CHECK (
  use_case IN (
    'marketing', 'notifications', 'alerts', 'customer_care', 
    'delivery', 'appointment', '2fa', 'surveys', 'mixed',
    'higher_education', 'k12_education', 'low_volume', 'charity'
  )
);

-- Add RLS policies for phone_numbers table
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's phone numbers" ON phone_numbers
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert phone numbers for their company" ON phone_numbers
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company's phone numbers" ON phone_numbers
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Grant permissions
GRANT ALL ON phone_numbers TO authenticated;
GRANT ALL ON phone_numbers TO service_role;

-- Add comments for documentation
COMMENT ON TABLE phone_numbers IS 'Stores provisioned phone numbers for SMS messaging';
COMMENT ON COLUMN brands.tcr_brand_id IS 'The Campaign Registry brand ID';
COMMENT ON COLUMN brands.vertical_type IS 'Industry vertical for TCR classification';
COMMENT ON COLUMN campaigns.tcr_campaign_id IS 'The Campaign Registry campaign ID';
COMMENT ON COLUMN campaigns.use_case IS 'Primary use case for TCR compliance';
COMMENT ON COLUMN campaigns.call_to_action IS 'Minimum 40 character description of opt-in process';
COMMENT ON COLUMN companies.phone_number_provisioned IS 'Whether company has provisioned at least one phone number';
COMMENT ON COLUMN companies.platform_access_granted IS 'Whether company has completed onboarding and been granted platform access';