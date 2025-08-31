-- Initial data for hubs and configurations
-- Migration: 20241229000002_initial_data.sql

-- Insert initial hub data
INSERT INTO public.hubs (hub_number, name, display_name, domain, is_active) VALUES
(0, 'percytech', 'PercyTech', 'percytech.com', true),
(1, 'gnymble', 'Gnymble', 'gnymble.com', true),
(2, 'percymd', 'PercyMD', 'percymd.com', true),
(3, 'percytext', 'PercyText', 'percytext.com', true)
ON CONFLICT (hub_number) DO NOTHING;

-- Insert hub configurations with exact colors from requirements
INSERT INTO public.hub_configs (hub_id, primary_color, secondary_color, accent_color, features, settings) VALUES
(0, '#1F2937', '#6B7280', '#3B82F6', '["super_admin", "analytics", "support_texting"]', '{"tcr_enabled": true, "bandwidth_enabled": true}'),
(1, '#059669', '#10B981', '#34D399', '["texting", "tcr", "bandwidth", "onboarding"]', '{"tcr_enabled": true, "bandwidth_enabled": true, "regulated_industry": true}'),
(2, '#DC2626', '#EF4444', '#F87171', '["texting", "tcr", "bandwidth", "onboarding"]', '{"tcr_enabled": true, "bandwidth_enabled": true, "healthcare_focused": true}'),
(3, '#7C3AED', '#8B5CF6', '#A78BFA', '["texting", "tcr", "bandwidth", "onboarding"]', '{"tcr_enabled": true, "bandwidth_enabled": true, "texting_focused": true}')
ON CONFLICT (hub_id) DO NOTHING;

-- Insert universal onboarding steps for all hubs
INSERT INTO public.onboarding_steps (hub_id, step_number, step_name, step_description, is_required) VALUES
-- PercyTech (hub_id: 0)
(0, 0, 'verification', 'Phone/Email verification', true),
(0, 1, 'payment', 'Stripe payment processing', true),
(0, 2, 'brand', 'The Campaign Registry brand setup', true),
(0, 3, 'privacy_terms', 'Privacy policy and terms confirmation', true),
(0, 4, 'campaign', 'The Campaign Registry campaign setup', true),
(0, 5, 'bandwidth', 'Bandwidth phone number assignment', true),
(0, 6, 'activation', 'Hub texting activation', true),
-- Gnymble (hub_id: 1)
(1, 0, 'verification', 'Phone/Email verification', true),
(1, 1, 'payment', 'Stripe payment processing', true),
(1, 2, 'brand', 'The Campaign Registry brand setup', true),
(1, 3, 'privacy_terms', 'Privacy policy and terms confirmation', true),
(1, 4, 'campaign', 'The Campaign Registry campaign setup', true),
(1, 5, 'bandwidth', 'Bandwidth phone number assignment', true),
(1, 6, 'activation', 'Hub texting activation', true),
-- PercyMD (hub_id: 2)
(2, 0, 'verification', 'Phone/Email verification', true),
(2, 1, 'payment', 'Stripe payment processing', true),
(2, 2, 'brand', 'The Campaign Registry brand setup', true),
(2, 3, 'privacy_terms', 'Privacy policy and terms confirmation', true),
(2, 4, 'campaign', 'The Campaign Registry campaign setup', true),
(2, 5, 'bandwidth', 'Bandwidth phone number assignment', true),
(2, 6, 'activation', 'Hub texting activation', true),
-- PercyText (hub_id: 3)
(3, 0, 'verification', 'Phone/Email verification', true),
(3, 1, 'payment', 'Stripe payment processing', true),
(3, 2, 'brand', 'The Campaign Registry brand setup', true),
(3, 3, 'privacy_terms', 'Privacy policy and terms confirmation', true),
(3, 4, 'campaign', 'The Campaign Registry campaign setup', true),
(3, 5, 'bandwidth', 'Bandwidth phone number assignment', true),
(3, 6, 'activation', 'Hub texting activation', true)
ON CONFLICT (hub_id, step_number) DO NOTHING;

-- Set up cron job to clean up expired temp signups (only if cron extension is available)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_available_extensions WHERE name = 'cron'
  ) THEN
    PERFORM cron.schedule(
      'cleanup-expired-temp-signups',
      '0 * * * *', -- Every hour
      'SELECT cleanup_expired_temp_signups();'
    );
    RAISE NOTICE 'Cron job scheduled for cleanup-expired-temp-signups';
  ELSE
    RAISE NOTICE 'Cron extension not available - cleanup job not scheduled (will be available in production)';
  END IF;
END $$;