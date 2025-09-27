-- SMS Hub Web - Initial Marketing Database Schema
-- For brand new Supabase database
-- Supabase Project: vgpovgpwqkjnpnrjelyg
-- Purpose: Marketing site, lead capture, email lists, SMS lists, authentication
-- Created: 2025-01-XX

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE REFERENCE TABLES
-- =====================================================

-- Create hubs table (multi-tenant reference)
CREATE TABLE IF NOT EXISTS hubs (
    hub_number INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    domain TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LEAD MANAGEMENT TABLES
-- =====================================================

-- Create leads table (primary lead capture)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    lead_phone_number TEXT,
    company_name TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    source TEXT DEFAULT 'contact_form' CHECK (source IN ('contact_form', 'landing_page', 'referral', 'organic', 'paid', 'social', 'email_campaign')),
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
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    platform_interest TEXT,
    budget_range TEXT,
    timeline TEXT,
    interaction_count INTEGER DEFAULT 0,
    last_interaction_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    converted_to_customer_id UUID, -- Links to customer app when converted
    assigned_to_user_id UUID, -- For lead assignment
    notes TEXT,
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_activities table (tracking all lead interactions)
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    activity_type TEXT NOT NULL CHECK (activity_type IN ('note', 'email_sent', 'email_opened', 'email_clicked', 'phone_call', 'meeting', 'demo', 'proposal', 'contract_sent', 'converted', 'lost')),
    activity_data JSONB DEFAULT '{}',
    performed_by_user_id UUID, -- For tracking who performed the activity
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EMAIL MARKETING TABLES
-- =====================================================

-- Create email_lists table (email marketing lists)
CREATE TABLE IF NOT EXISTS email_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    list_name TEXT NOT NULL,
    description TEXT,
    list_type TEXT DEFAULT 'marketing' CHECK (list_type IN ('marketing', 'newsletter', 'product_updates', 'onboarding', 'nurture')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    subscriber_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hub_id, list_name)
);

-- Create email_subscribers table (email list subscribers)
CREATE TABLE IF NOT EXISTS email_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    email_list_id UUID NOT NULL REFERENCES email_lists(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    company_name TEXT,
    job_title TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'import', 'api', 'referral')),
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email_list_id, email)
);

-- Create email_campaigns table (email marketing campaigns)
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    email_list_id UUID NOT NULL REFERENCES email_lists(id),
    campaign_name TEXT NOT NULL,
    subject_line TEXT NOT NULL,
    preview_text TEXT,
    html_content TEXT,
    text_content TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
    send_type TEXT DEFAULT 'immediate' CHECK (send_type IN ('immediate', 'scheduled', 'automated')),
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    total_recipients INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    complaint_count INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    created_by_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SMS MARKETING TABLES
-- =====================================================

-- Create sms_lists table (SMS marketing lists)
CREATE TABLE IF NOT EXISTS sms_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    list_name TEXT NOT NULL,
    description TEXT,
    list_type TEXT DEFAULT 'marketing' CHECK (list_type IN ('marketing', 'notifications', 'updates', 'alerts')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    subscriber_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hub_id, list_name)
);

-- Create sms_subscribers table (SMS list subscribers)
CREATE TABLE IF NOT EXISTS sms_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    sms_list_id UUID NOT NULL REFERENCES sms_lists(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    company_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'invalid', 'opted_out')),
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'import', 'api', 'referral')),
    consent_given BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMPTZ,
    consent_ip_address INET,
    consent_text TEXT,
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sms_list_id, phone_number)
);

-- Create sms_campaigns table (SMS marketing campaigns)
CREATE TABLE IF NOT EXISTS sms_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    sms_list_id UUID NOT NULL REFERENCES sms_lists(id),
    campaign_name TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
    send_type TEXT DEFAULT 'immediate' CHECK (send_type IN ('immediate', 'scheduled', 'automated')),
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    total_recipients INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    delivery_rate DECIMAL(5,2) DEFAULT 0,
    created_by_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- MARKETING CAMPAIGNS TABLE
-- =====================================================

-- Create marketing_campaigns table (cross-channel campaign tracking)
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    campaign_name TEXT NOT NULL,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('email', 'sms', 'multi_channel', 'lead_generation', 'brand_awareness')),
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    budget DECIMAL(10,2),
    target_audience TEXT,
    goals JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    created_by_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WEBSITE ANALYTICS TABLES
-- =====================================================

-- Create website_analytics table (website traffic and engagement)
CREATE TABLE IF NOT EXISTS website_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    page_url TEXT NOT NULL,
    page_title TEXT,
    visitor_id TEXT,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    event_type TEXT DEFAULT 'page_view' CHECK (event_type IN ('page_view', 'click', 'form_submit', 'download', 'video_play')),
    event_data JSONB DEFAULT '{}',
    duration_seconds INTEGER,
    bounce BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONTACT FORM SUBMISSIONS
-- =====================================================

-- Create contact_form_submissions table
CREATE TABLE IF NOT EXISTS contact_form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    form_name TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    company_name TEXT,
    message TEXT,
    form_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'responded', 'closed')),
    assigned_to_user_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUTHENTICATION TABLES
-- =====================================================

-- Create user_profiles table (for marketing team/admin users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'marketing_user' CHECK (role IN ('admin', 'marketing_user', 'viewer')),
    is_active BOOLEAN DEFAULT TRUE,
    email_confirmed BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create verifications table (for email verification)
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    mobile_phone TEXT,
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    verification_code TEXT NOT NULL,
    verification_sent_at TIMESTAMPTZ,
    verification_completed_at TIMESTAMPTZ,
    preferred_verification_method TEXT DEFAULT 'email',
    step_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create verification_attempts table
CREATE TABLE IF NOT EXISTS verification_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID NOT NULL REFERENCES verifications(id),
    attempted_code TEXT NOT NULL,
    is_successful BOOLEAN DEFAULT FALSE,
    attempted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- =====================================================
-- CONVERSION TRACKING TABLES
-- =====================================================

-- Create conversions table (tracking lead to customer conversions)
CREATE TABLE IF NOT EXISTS conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    lead_id UUID REFERENCES leads(id),
    conversion_type TEXT NOT NULL CHECK (conversion_type IN ('lead_to_customer', 'trial_to_paid', 'free_to_premium', 'demo_to_sale')),
    conversion_value DECIMAL(10,2),
    customer_id UUID, -- Links to customer app
    conversion_source TEXT,
    conversion_medium TEXT,
    conversion_campaign TEXT,
    conversion_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Hubs indexes
CREATE INDEX IF NOT EXISTS idx_hubs_name ON hubs(name);
CREATE INDEX IF NOT EXISTS idx_hubs_domain ON hubs(domain);

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_hub_id ON leads(hub_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source);
CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign ON leads(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to_user_id);

-- Lead activities indexes
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_hub_id ON lead_activities(hub_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_type ON lead_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON lead_activities(created_at);

-- Email lists indexes
CREATE INDEX IF NOT EXISTS idx_email_lists_hub_id ON email_lists(hub_id);
CREATE INDEX IF NOT EXISTS idx_email_lists_status ON email_lists(status);
CREATE INDEX IF NOT EXISTS idx_email_lists_type ON email_lists(list_type);

-- Email subscribers indexes
CREATE INDEX IF NOT EXISTS idx_email_subscribers_hub_id ON email_subscribers(hub_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email_list_id ON email_subscribers(email_list_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);

-- Email campaigns indexes
CREATE INDEX IF NOT EXISTS idx_email_campaigns_hub_id ON email_campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_email_list_id ON email_campaigns(email_list_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);

-- SMS lists indexes
CREATE INDEX IF NOT EXISTS idx_sms_lists_hub_id ON sms_lists(hub_id);
CREATE INDEX IF NOT EXISTS idx_sms_lists_status ON sms_lists(status);

-- SMS subscribers indexes
CREATE INDEX IF NOT EXISTS idx_sms_subscribers_hub_id ON sms_subscribers(hub_id);
CREATE INDEX IF NOT EXISTS idx_sms_subscribers_sms_list_id ON sms_subscribers(sms_list_id);
CREATE INDEX IF NOT EXISTS idx_sms_subscribers_phone_number ON sms_subscribers(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_subscribers_status ON sms_subscribers(status);

-- SMS campaigns indexes
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_hub_id ON sms_campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_sms_list_id ON sms_campaigns(sms_list_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_status ON sms_campaigns(status);

-- Marketing campaigns indexes
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_hub_id ON marketing_campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_type ON marketing_campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);

-- Website analytics indexes
CREATE INDEX IF NOT EXISTS idx_website_analytics_hub_id ON website_analytics(hub_id);
CREATE INDEX IF NOT EXISTS idx_website_analytics_page_url ON website_analytics(page_url);
CREATE INDEX IF NOT EXISTS idx_website_analytics_visitor_id ON website_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_website_analytics_session_id ON website_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_website_analytics_event_type ON website_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_website_analytics_created_at ON website_analytics(created_at);

-- Contact form submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_hub_id ON contact_form_submissions(hub_id);
CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_form_name ON contact_form_submissions(form_name);
CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_email ON contact_form_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_status ON contact_form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_created_at ON contact_form_submissions(created_at);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_hub_id ON user_profiles(hub_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Verifications indexes
CREATE INDEX IF NOT EXISTS idx_verifications_email ON verifications(email);
CREATE INDEX IF NOT EXISTS idx_verifications_hub_id ON verifications(hub_id);
CREATE INDEX IF NOT EXISTS idx_verifications_code ON verifications(verification_code);

-- Verification attempts indexes
CREATE INDEX IF NOT EXISTS idx_verification_attempts_verification_id ON verification_attempts(verification_id);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_attempted_at ON verification_attempts(attempted_at);

-- Conversions indexes
CREATE INDEX IF NOT EXISTS idx_conversions_hub_id ON conversions(hub_id);
CREATE INDEX IF NOT EXISTS idx_conversions_lead_id ON conversions(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversions_type ON conversions(conversion_type);
CREATE INDEX IF NOT EXISTS idx_conversions_date ON conversions(conversion_date);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE hubs IS 'Multi-tenant hubs (PercyTech, Gnymble, PercyMD, PercyText)';
COMMENT ON TABLE leads IS 'Marketing leads from landing pages and contact forms';
COMMENT ON TABLE lead_activities IS 'Tracking lead interactions and engagement';
COMMENT ON TABLE email_lists IS 'Email marketing lists for campaigns';
COMMENT ON TABLE email_subscribers IS 'Email list subscribers with engagement tracking';
COMMENT ON TABLE email_campaigns IS 'Email marketing campaigns and performance metrics';
COMMENT ON TABLE sms_lists IS 'SMS marketing lists for campaigns';
COMMENT ON TABLE sms_subscribers IS 'SMS list subscribers with consent tracking';
COMMENT ON TABLE sms_campaigns IS 'SMS marketing campaigns and delivery metrics';
COMMENT ON TABLE marketing_campaigns IS 'Cross-channel marketing campaign tracking';
COMMENT ON TABLE website_analytics IS 'Website traffic and engagement analytics';
COMMENT ON TABLE contact_form_submissions IS 'Contact form submissions and lead capture';
COMMENT ON TABLE user_profiles IS 'Marketing team user profiles';
COMMENT ON TABLE verifications IS 'Email verification records for user authentication';
COMMENT ON TABLE verification_attempts IS 'Tracking verification code attempts for security';
COMMENT ON TABLE conversions IS 'Lead to customer conversion tracking';

-- Log the migration
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Initial schema migration completed successfully';
  RAISE NOTICE '- Created all core tables for SMS Hub Web';
  RAISE NOTICE '- Added lead management tables';
  RAISE NOTICE '- Added email marketing tables';
  RAISE NOTICE '- Added SMS marketing tables';
  RAISE NOTICE '- Added website analytics tables';
  RAISE NOTICE '- Added contact form submission tables';
  RAISE NOTICE '- Added authentication tables';
  RAISE NOTICE '- Added conversion tracking tables';
  RAISE NOTICE '- Created all necessary indexes';
  RAISE NOTICE '========================================';
END $$;
