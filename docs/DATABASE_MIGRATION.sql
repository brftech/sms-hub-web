-- SMS Hub Web - Database Migration Script
-- Purpose: Remove customer tables, add marketing-focused tables
-- Target: sms-hub-web Supabase instance (vgpovgpwqkjnpnrjelyg)
-- Created: 2025-01-XX

-- =====================================================
-- STEP 1: BACKUP EXISTING DATA (OPTIONAL)
-- =====================================================

-- Uncomment to backup existing data before migration
-- CREATE TABLE leads_backup AS SELECT * FROM leads;
-- CREATE TABLE lead_activities_backup AS SELECT * FROM lead_activities;
-- CREATE TABLE verifications_backup AS SELECT * FROM verifications;
-- CREATE TABLE user_profiles_backup AS SELECT * FROM user_profiles;

-- =====================================================
-- STEP 2: REMOVE CUSTOMER MANAGEMENT TABLES
-- =====================================================

-- Drop customer management tables that aren't needed for marketing
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS onboarding_submissions CASCADE;
DROP TABLE IF EXISTS onboarding_steps CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS phone_numbers CASCADE;
DROP TABLE IF EXISTS campaign_phone_assignments CASCADE;
DROP TABLE IF EXISTS inboxes CASCADE;
DROP TABLE IF EXISTS user_inbox_assignments CASCADE;
DROP TABLE IF EXISTS user_invitations CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS sms_verifications CASCADE;
DROP TABLE IF EXISTS bandwidth_accounts CASCADE;
DROP TABLE IF EXISTS tcr_integrations CASCADE;
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS hub_configs CASCADE;

-- =====================================================
-- STEP 3: ADD MARKETING-FOCUSED TABLES
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
    status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced', 'complained')),
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'import', 'api', 'referral')),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    last_email_sent_at TIMESTAMPTZ,
    last_email_opened_at TIMESTAMPTZ,
    last_email_clicked_at TIMESTAMPTZ,
    email_score INTEGER DEFAULT 0 CHECK (email_score >= 0 AND email_score <= 100),
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email_list_id, email)
);

-- Create email_campaigns table (email marketing campaigns)
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    campaign_name TEXT NOT NULL,
    subject_line TEXT NOT NULL,
    preview_text TEXT,
    campaign_type TEXT DEFAULT 'marketing' CHECK (campaign_type IN ('marketing', 'newsletter', 'product_update', 'onboarding', 'nurture')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
    email_list_id UUID REFERENCES email_lists(id),
    send_date TIMESTAMPTZ,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    complaint_count INTEGER DEFAULT 0,
    campaign_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sms_lists table (SMS marketing lists)
CREATE TABLE IF NOT EXISTS sms_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    list_name TEXT NOT NULL,
    description TEXT,
    list_type TEXT DEFAULT 'marketing' CHECK (list_type IN ('marketing', 'alerts', 'notifications', 'nurture')),
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
    status TEXT DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'invalid', 'opted_out')),
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'import', 'api', 'referral')),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    last_sms_sent_at TIMESTAMPTZ,
    last_sms_opened_at TIMESTAMPTZ,
    last_sms_clicked_at TIMESTAMPTZ,
    sms_score INTEGER DEFAULT 0 CHECK (sms_score >= 0 AND sms_score <= 100),
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sms_list_id, phone_number)
);

-- Create sms_campaigns table (SMS marketing campaigns)
CREATE TABLE IF NOT EXISTS sms_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    campaign_name TEXT NOT NULL,
    message_content TEXT NOT NULL,
    campaign_type TEXT DEFAULT 'marketing' CHECK (campaign_type IN ('marketing', 'alert', 'notification', 'nurture')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
    sms_list_id UUID REFERENCES sms_lists(id),
    send_date TIMESTAMPTZ,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    campaign_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create marketing_campaigns table (tracking marketing campaigns)
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    campaign_name TEXT NOT NULL,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('paid_search', 'paid_social', 'display', 'email', 'sms', 'content', 'referral', 'organic')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    budget DECIMAL(10,2),
    spent DECIMAL(10,2) DEFAULT 0,
    target_audience JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact_form_submissions table (additional contact forms)
CREATE TABLE IF NOT EXISTS contact_form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    form_name TEXT NOT NULL,
    form_data JSONB NOT NULL DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    landing_page_url TEXT,
    utm_data JSONB DEFAULT '{}',
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    lead_id UUID REFERENCES leads(id), -- Link to lead if created
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create website_analytics table (basic website analytics)
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STEP 4: UPDATE EXISTING TABLES
-- =====================================================

-- Add new columns to leads table for better lead management
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to_user_id UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- Add new columns to user_profiles for conversion tracking
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS converted_to_customer BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS converted_to_customer_at TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS converted_customer_id UUID;

-- =====================================================
-- STEP 5: CREATE INDEXES
-- =====================================================

-- Email marketing indexes
CREATE INDEX IF NOT EXISTS idx_email_lists_hub_id ON email_lists(hub_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_list_id ON email_subscribers(email_list_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_hub_id ON email_campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);

-- SMS marketing indexes
CREATE INDEX IF NOT EXISTS idx_sms_lists_hub_id ON sms_lists(hub_id);
CREATE INDEX IF NOT EXISTS idx_sms_subscribers_list_id ON sms_subscribers(sms_list_id);
CREATE INDEX IF NOT EXISTS idx_sms_subscribers_phone ON sms_subscribers(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_subscribers_status ON sms_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_hub_id ON sms_campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_sms_campaigns_status ON sms_campaigns(status);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_hub_id ON marketing_campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_contact_forms_hub_id ON contact_form_submissions(hub_id);
CREATE INDEX IF NOT EXISTS idx_contact_forms_form_name ON contact_form_submissions(form_name);
CREATE INDEX IF NOT EXISTS idx_website_analytics_hub_id ON website_analytics(hub_id);
CREATE INDEX IF NOT EXISTS idx_website_analytics_page_url ON website_analytics(page_url);
CREATE INDEX IF NOT EXISTS idx_website_analytics_created_at ON website_analytics(created_at DESC);

-- Enhanced lead management indexes
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_user ON leads(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_converted ON user_profiles(converted_to_customer);

-- =====================================================
-- STEP 6: INSERT DEFAULT DATA
-- =====================================================

-- Create default email lists for each hub
INSERT INTO email_lists (hub_id, list_name, description, list_type) VALUES
    (0, 'PercyTech Newsletter', 'Main newsletter for PercyTech subscribers', 'newsletter'),
    (1, 'Gnymble Updates', 'Product updates and news for Gnymble subscribers', 'product_updates'),
    (2, 'PercyMD Newsletter', 'Main newsletter for PercyMD subscribers', 'newsletter'),
    (3, 'PercyText Updates', 'Product updates and news for PercyText subscribers', 'product_updates')
ON CONFLICT (hub_id, list_name) DO NOTHING;

-- Create default SMS lists for each hub
INSERT INTO sms_lists (hub_id, list_name, description, list_type) VALUES
    (0, 'PercyTech Alerts', 'Important alerts and notifications', 'alerts'),
    (1, 'Gnymble Updates', 'Product updates and notifications', 'notifications'),
    (2, 'PercyMD Alerts', 'Important alerts and notifications', 'alerts'),
    (3, 'PercyText Updates', 'Product updates and notifications', 'notifications')
ON CONFLICT (hub_id, list_name) DO NOTHING;

-- =====================================================
-- STEP 7: CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically update subscriber counts
CREATE OR REPLACE FUNCTION update_email_list_subscriber_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE email_lists 
        SET subscriber_count = (
            SELECT COUNT(*) 
            FROM email_subscribers 
            WHERE email_list_id = NEW.email_list_id 
            AND status = 'subscribed'
        )
        WHERE id = NEW.email_list_id;
    END IF;
    
    IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
        UPDATE email_lists 
        SET subscriber_count = (
            SELECT COUNT(*) 
            FROM email_subscribers 
            WHERE email_list_id = OLD.email_list_id 
            AND status = 'subscribed'
        )
        WHERE id = OLD.email_list_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to automatically update SMS list subscriber counts
CREATE OR REPLACE FUNCTION update_sms_list_subscriber_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE sms_lists 
        SET subscriber_count = (
            SELECT COUNT(*) 
            FROM sms_subscribers 
            WHERE sms_list_id = NEW.sms_list_id 
            AND status = 'subscribed'
        )
        WHERE id = NEW.sms_list_id;
    END IF;
    
    IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
        UPDATE sms_lists 
        SET subscriber_count = (
            SELECT COUNT(*) 
            FROM sms_subscribers 
            WHERE sms_list_id = OLD.sms_list_id 
            AND status = 'subscribed'
        )
        WHERE id = OLD.sms_list_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update email list subscriber counts
DROP TRIGGER IF EXISTS trigger_update_email_list_count ON email_subscribers;
CREATE TRIGGER trigger_update_email_list_count
    AFTER INSERT OR UPDATE OR DELETE ON email_subscribers
    FOR EACH ROW EXECUTE FUNCTION update_email_list_subscriber_count();

-- Trigger to update SMS list subscriber counts
DROP TRIGGER IF EXISTS trigger_update_sms_list_count ON sms_subscribers;
CREATE TRIGGER trigger_update_sms_list_count
    AFTER INSERT OR UPDATE OR DELETE ON sms_subscribers
    FOR EACH ROW EXECUTE FUNCTION update_sms_list_subscriber_count();

-- =====================================================
-- STEP 8: ADD TABLE COMMENTS
-- =====================================================

COMMENT ON TABLE email_lists IS 'Email marketing lists for campaigns';
COMMENT ON TABLE email_subscribers IS 'Email list subscribers with engagement tracking';
COMMENT ON TABLE email_campaigns IS 'Email marketing campaigns and performance';
COMMENT ON TABLE sms_lists IS 'SMS marketing lists for campaigns';
COMMENT ON TABLE sms_subscribers IS 'SMS list subscribers with engagement tracking';
COMMENT ON TABLE sms_campaigns IS 'SMS marketing campaigns and performance';
COMMENT ON TABLE marketing_campaigns IS 'Marketing campaign tracking and analytics';
COMMENT ON TABLE contact_form_submissions IS 'Additional contact form submissions';
COMMENT ON TABLE website_analytics IS 'Basic website analytics and tracking';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify the migration was successful
SELECT 
    'Migration completed successfully!' as status,
    COUNT(*) as total_tables,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%email%') as email_tables,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%sms%') as sms_tables,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%lead%') as lead_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
