-- Performance indexes and RLS policies
-- Migration: 20241229000001_indexes_and_rls.sql

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hubs_hub_number ON public.hubs(hub_number);
CREATE INDEX IF NOT EXISTS idx_hubs_name ON public.hubs(name);
CREATE INDEX IF NOT EXISTS idx_hubs_domain ON public.hubs(domain);

CREATE INDEX IF NOT EXISTS idx_hub_configs_hub_id ON public.hub_configs(hub_id);

CREATE INDEX IF NOT EXISTS idx_temp_signups_hub_id ON public.temp_signups(hub_id);
CREATE INDEX IF NOT EXISTS idx_temp_signups_email ON public.temp_signups(email);
CREATE INDEX IF NOT EXISTS idx_temp_signups_mobile_phone ON public.temp_signups(mobile_phone_number);
CREATE INDEX IF NOT EXISTS idx_temp_signups_expires_at ON public.temp_signups(expires_at);

CREATE INDEX IF NOT EXISTS idx_verification_attempts_temp_signup_id ON public.verification_attempts(temp_signup_id);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_created_at ON public.verification_attempts(created_at);

CREATE INDEX IF NOT EXISTS idx_companies_hub_id ON public.companies(hub_id);
CREATE INDEX IF NOT EXISTS idx_companies_company_account_number ON public.companies(company_account_number);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer_id ON public.companies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_companies_public_name ON public.companies(public_name);

CREATE INDEX IF NOT EXISTS idx_user_profiles_hub_id ON public.user_profiles(hub_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_account_number ON public.user_profiles(account_number);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON public.user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

CREATE INDEX IF NOT EXISTS idx_leads_hub_id ON public.leads(hub_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_company_name ON public.leads(company_name);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_company_id ON public.memberships(company_id);
CREATE INDEX IF NOT EXISTS idx_memberships_hub_id ON public.memberships(hub_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role ON public.memberships(role);

CREATE INDEX IF NOT EXISTS idx_onboarding_steps_hub_id ON public.onboarding_steps(hub_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_step_number ON public.onboarding_steps(step_number);

CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_company_id ON public.onboarding_submissions(company_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_user_id ON public.onboarding_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_hub_id ON public.onboarding_submissions(hub_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_current_step ON public.onboarding_submissions(current_step);

CREATE INDEX IF NOT EXISTS idx_brands_hub_id ON public.brands(hub_id);
CREATE INDEX IF NOT EXISTS idx_brands_company_id ON public.brands(company_id);
CREATE INDEX IF NOT EXISTS idx_brands_tcr_brand_id ON public.brands(tcr_brand_id);

CREATE INDEX IF NOT EXISTS idx_campaigns_hub_id ON public.campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON public.campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_tcr_campaign_id ON public.campaigns(tcr_campaign_id);

CREATE INDEX IF NOT EXISTS idx_phone_numbers_hub_id ON public.phone_numbers(hub_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_phone_number ON public.phone_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_assigned_to_campaign ON public.phone_numbers(assigned_to_campaign);

CREATE INDEX IF NOT EXISTS idx_campaign_phone_assignments_campaign_id ON public.campaign_phone_assignments(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_phone_assignments_phone_number_id ON public.campaign_phone_assignments(phone_number_id);

CREATE INDEX IF NOT EXISTS idx_tcr_integrations_hub_id ON public.tcr_integrations(hub_id);
CREATE INDEX IF NOT EXISTS idx_tcr_integrations_company_id ON public.tcr_integrations(company_id);
CREATE INDEX IF NOT EXISTS idx_tcr_integrations_tcr_brand_id ON public.tcr_integrations(tcr_brand_id);
CREATE INDEX IF NOT EXISTS idx_tcr_integrations_tcr_campaign_id ON public.tcr_integrations(tcr_campaign_id);

CREATE INDEX IF NOT EXISTS idx_bandwidth_accounts_hub_id ON public.bandwidth_accounts(hub_id);
CREATE INDEX IF NOT EXISTS idx_bandwidth_accounts_company_id ON public.bandwidth_accounts(company_id);
CREATE INDEX IF NOT EXISTS idx_bandwidth_accounts_bandwidth_account_id ON public.bandwidth_accounts(bandwidth_account_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_hub_id ON public.admin_audit_logs(hub_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user_id ON public.admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action_type ON public.admin_audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_lead_activities_hub_id ON public.lead_activities(hub_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_activity_type ON public.lead_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON public.lead_activities(created_at);

CREATE INDEX IF NOT EXISTS idx_payment_history_hub_id ON public.payment_history(hub_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_profile_id ON public.payment_history(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_payment_intent_id ON public.payment_history(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON public.payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON public.payment_history(created_at);

-- Enable Row Level Security on all tables
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temp_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_phone_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tcr_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bandwidth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
-- HUBS: Read-only for authenticated users, full access for super admins
CREATE POLICY "hubs_read_policy" ON public.hubs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "hubs_admin_policy" ON public.hubs FOR ALL USING (auth.role() = 'authenticated' AND (
  is_superadmin() OR EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'OWNER' AND hub_id = 0
  )
));

-- HUB_CONFIGS: Read for authenticated users, update for hub admins
CREATE POLICY "hub_configs_read_policy" ON public.hub_configs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "hub_configs_update_policy" ON public.hub_configs FOR UPDATE USING (auth.role() = 'authenticated' AND (
  is_superadmin() OR EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = hub_configs.hub_id AND role IN ('OWNER', 'ADMIN')
  )
));

-- TEMP_SIGNUPS: Create for anyone, read/update for own signup or hub admins
CREATE POLICY "temp_signups_create_policy" ON public.temp_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "temp_signups_read_policy" ON public.temp_signups FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = temp_signups.hub_id AND role IN ('OWNER', 'ADMIN'))
  )
);
CREATE POLICY "temp_signups_update_policy" ON public.temp_signups FOR UPDATE USING (
  auth.role() = 'authenticated' AND (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = temp_signups.hub_id AND role IN ('OWNER', 'ADMIN'))
  )
);

-- VERIFICATION_ATTEMPTS: Full access for temp signup owner or hub admins
CREATE POLICY "verification_attempts_policy" ON public.verification_attempts FOR ALL USING (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM public.temp_signups ts 
      WHERE ts.id = verification_attempts.temp_signup_id 
      AND ts.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.hub_id = (SELECT hub_id FROM public.temp_signups WHERE id = verification_attempts.temp_signup_id)
      AND up.role IN ('OWNER', 'ADMIN')
    )
  )
);

-- COMPANIES: Read for company members, full access for company owners/admins
CREATE POLICY "companies_read_policy" ON public.companies FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM public.memberships m 
      WHERE m.company_id = companies.id 
      AND m.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.hub_id = companies.hub_id 
      AND up.role IN ('OWNER', 'ADMIN')
    )
  )
);
CREATE POLICY "companies_full_policy" ON public.companies FOR ALL USING (
  auth.role() = 'authenticated' AND (
    is_superadmin() OR
    EXISTS (
      SELECT 1 FROM public.memberships m 
      WHERE m.company_id = companies.id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('OWNER', 'ADMIN')
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.hub_id = companies.hub_id 
      AND up.role IN ('OWNER', 'ADMIN')
    )
  )
);

-- USER_PROFILES: Read own profile, full access for hub admins
CREATE POLICY "user_profiles_read_policy" ON public.user_profiles FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.hub_id = user_profiles.hub_id 
      AND up.role IN ('OWNER', 'ADMIN')
    )
  )
);
CREATE POLICY "user_profiles_update_policy" ON public.user_profiles FOR UPDATE USING (
  auth.role() = 'authenticated' AND (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.hub_id = user_profiles.hub_id 
      AND up.role IN ('OWNER', 'ADMIN')
    )
  )
);

-- LEADS: Read for hub admins, create for anyone
CREATE POLICY "leads_create_policy" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_read_policy" ON public.leads FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = leads.hub_id AND role IN ('OWNER', 'ADMIN')
  )
);

-- MEMBERSHIPS: Read for company members, full access for company owners/admins
CREATE POLICY "memberships_read_policy" ON public.memberships FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.memberships m 
      WHERE m.company_id = memberships.company_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('OWNER', 'ADMIN')
    )
  )
);
CREATE POLICY "memberships_full_policy" ON public.memberships FOR ALL USING (
  auth.role() = 'authenticated' AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.memberships m 
      WHERE m.company_id = memberships.company_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('OWNER', 'ADMIN')
    )
  )
);

-- ONBOARDING_STEPS: Read for hub users, update for hub admins
CREATE POLICY "onboarding_steps_read_policy" ON public.onboarding_steps FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = onboarding_steps.hub_id
  )
);
CREATE POLICY "onboarding_steps_update_policy" ON public.onboarding_steps FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = onboarding_steps.hub_id AND role IN ('OWNER', 'ADMIN')
  )
);

-- ONBOARDING_SUBMISSIONS: Read for company members, full access for company owners/admins
CREATE POLICY "onboarding_submissions_read_policy" ON public.onboarding_submissions FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.memberships m 
      WHERE m.company_id = onboarding_submissions.company_id 
      AND m.user_id = auth.uid()
    )
  )
);
CREATE POLICY "onboarding_submissions_full_policy" ON public.onboarding_submissions FOR ALL USING (
  auth.role() = 'authenticated' AND (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.memberships m 
      WHERE m.company_id = onboarding_submissions.company_id 
      AND m.user_id = auth.uid() 
      AND m.role IN ('OWNER', 'ADMIN')
    )
  )
);

-- BRANDS: Read for company members, full access for company owners/admins
CREATE POLICY "brands_read_policy" ON public.brands FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.memberships m 
    WHERE m.company_id = brands.company_id 
    AND m.user_id = auth.uid()
  )
);
CREATE POLICY "brands_full_policy" ON public.brands FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.memberships m 
    WHERE m.company_id = brands.company_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('OWNER', 'ADMIN')
  )
);

-- CAMPAIGNS: Read for company members, full access for company owners/admins
CREATE POLICY "campaigns_read_policy" ON public.campaigns FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.brands b 
    JOIN public.memberships m ON m.company_id = b.company_id 
    WHERE b.id = campaigns.brand_id 
    AND m.user_id = auth.uid()
  )
);
CREATE POLICY "campaigns_full_policy" ON public.campaigns FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.brands b 
    JOIN public.memberships m ON m.company_id = b.company_id 
    WHERE b.id = campaigns.brand_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('OWNER', 'ADMIN')
  )
);

-- PHONE_NUMBERS: Read for hub users, full access for hub admins
CREATE POLICY "phone_numbers_read_policy" ON public.phone_numbers FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = phone_numbers.hub_id
  )
);
CREATE POLICY "phone_numbers_full_policy" ON public.phone_numbers FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = phone_numbers.hub_id AND role IN ('OWNER', 'ADMIN')
  )
);

-- CAMPAIGN_PHONE_ASSIGNMENTS: Read for company members, full access for company owners/admins
CREATE POLICY "campaign_phone_assignments_read_policy" ON public.campaign_phone_assignments FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.campaigns c 
    JOIN public.brands b ON b.id = c.brand_id 
    JOIN public.memberships m ON m.company_id = b.company_id 
    WHERE c.id = campaign_phone_assignments.campaign_id 
    AND m.user_id = auth.uid()
  )
);
CREATE POLICY "campaign_phone_assignments_full_policy" ON public.campaign_phone_assignments FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.campaigns c 
    JOIN public.brands b ON b.id = c.brand_id 
    JOIN public.memberships m ON m.company_id = b.company_id 
    WHERE c.id = campaign_phone_assignments.campaign_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('OWNER', 'ADMIN')
  )
);

-- TCR_INTEGRATIONS: Read for company members, full access for company owners/admins
CREATE POLICY "tcr_integrations_read_policy" ON public.tcr_integrations FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.memberships m 
    WHERE m.company_id = tcr_integrations.company_id 
    AND m.user_id = auth.uid()
  )
);
CREATE POLICY "tcr_integrations_full_policy" ON public.tcr_integrations FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.memberships m 
    WHERE m.company_id = tcr_integrations.company_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('OWNER', 'ADMIN')
  )
);

-- BANDWIDTH_ACCOUNTS: Read for company members, full access for company owners/admins
CREATE POLICY "bandwidth_accounts_read_policy" ON public.bandwidth_accounts FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.memberships m 
    WHERE m.company_id = bandwidth_accounts.company_id 
    AND m.user_id = auth.uid()
  )
);
CREATE POLICY "bandwidth_accounts_full_policy" ON public.bandwidth_accounts FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.memberships m 
    WHERE m.company_id = bandwidth_accounts.company_id 
    AND m.user_id = auth.uid() 
    AND m.role IN ('OWNER', 'ADMIN')
  )
);

-- ADMIN_AUDIT_LOGS: Read for hub admins, create for system
CREATE POLICY "admin_audit_logs_read_policy" ON public.admin_audit_logs FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = admin_audit_logs.hub_id AND role IN ('OWNER', 'ADMIN')
  )
);
CREATE POLICY "admin_audit_logs_create_policy" ON public.admin_audit_logs FOR INSERT WITH CHECK (true);

-- LEAD_ACTIVITIES: Read for hub admins, create for system
CREATE POLICY "lead_activities_read_policy" ON public.lead_activities FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = lead_activities.hub_id AND role IN ('OWNER', 'ADMIN')
  )
);
CREATE POLICY "lead_activities_create_policy" ON public.lead_activities FOR INSERT WITH CHECK (true);

-- PAYMENT_HISTORY: Read for own payments, full access for hub admins
CREATE POLICY "payment_history_read_policy" ON public.payment_history FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    user_profile_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND hub_id = payment_history.hub_id AND role IN ('OWNER', 'ADMIN')
    )
  )
);
CREATE POLICY "payment_history_create_policy" ON public.payment_history FOR INSERT WITH CHECK (true);