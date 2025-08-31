-- Disable all RLS policies
-- Migration: 20250831000000_disable_all_rls.sql

-- Drop all existing policies
DROP POLICY IF EXISTS "hubs_read_policy" ON public.hubs;
DROP POLICY IF EXISTS "hubs_admin_policy" ON public.hubs;

DROP POLICY IF EXISTS "hub_configs_read_policy" ON public.hub_configs;
DROP POLICY IF EXISTS "hub_configs_update_policy" ON public.hub_configs;

DROP POLICY IF EXISTS "temp_signups_create_policy" ON public.temp_signups;
DROP POLICY IF EXISTS "temp_signups_read_policy" ON public.temp_signups;
DROP POLICY IF EXISTS "temp_signups_update_policy" ON public.temp_signups;

DROP POLICY IF EXISTS "verification_attempts_policy" ON public.verification_attempts;

DROP POLICY IF EXISTS "companies_read_policy" ON public.companies;
DROP POLICY IF EXISTS "companies_full_policy" ON public.companies;

DROP POLICY IF EXISTS "user_profiles_read_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_policy" ON public.user_profiles;

DROP POLICY IF EXISTS "leads_create_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_read_policy" ON public.leads;

DROP POLICY IF EXISTS "memberships_read_policy" ON public.memberships;
DROP POLICY IF EXISTS "memberships_full_policy" ON public.memberships;

DROP POLICY IF EXISTS "onboarding_steps_read_policy" ON public.onboarding_steps;
DROP POLICY IF EXISTS "onboarding_steps_update_policy" ON public.onboarding_steps;

DROP POLICY IF EXISTS "onboarding_submissions_read_policy" ON public.onboarding_submissions;
DROP POLICY IF EXISTS "onboarding_submissions_full_policy" ON public.onboarding_submissions;

DROP POLICY IF EXISTS "brands_read_policy" ON public.brands;
DROP POLICY IF EXISTS "brands_full_policy" ON public.brands;

DROP POLICY IF EXISTS "campaigns_read_policy" ON public.campaigns;
DROP POLICY IF EXISTS "campaigns_full_policy" ON public.campaigns;

DROP POLICY IF EXISTS "phone_numbers_read_policy" ON public.phone_numbers;
DROP POLICY IF EXISTS "phone_numbers_full_policy" ON public.phone_numbers;

DROP POLICY IF EXISTS "campaign_phone_assignments_read_policy" ON public.campaign_phone_assignments;
DROP POLICY IF EXISTS "campaign_phone_assignments_full_policy" ON public.campaign_phone_assignments;

DROP POLICY IF EXISTS "tcr_integrations_read_policy" ON public.tcr_integrations;
DROP POLICY IF EXISTS "tcr_integrations_full_policy" ON public.tcr_integrations;

DROP POLICY IF EXISTS "bandwidth_accounts_read_policy" ON public.bandwidth_accounts;
DROP POLICY IF EXISTS "bandwidth_accounts_full_policy" ON public.bandwidth_accounts;

DROP POLICY IF EXISTS "admin_audit_logs_read_policy" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "admin_audit_logs_create_policy" ON public.admin_audit_logs;

DROP POLICY IF EXISTS "lead_activities_read_policy" ON public.lead_activities;
DROP POLICY IF EXISTS "lead_activities_create_policy" ON public.lead_activities;

DROP POLICY IF EXISTS "payment_history_read_policy" ON public.payment_history;
DROP POLICY IF EXISTS "payment_history_create_policy" ON public.payment_history;

-- Disable RLS on all tables
ALTER TABLE public.hubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_configs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.temp_signups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_numbers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_phone_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tcr_integrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandwidth_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history DISABLE ROW LEVEL SECURITY;