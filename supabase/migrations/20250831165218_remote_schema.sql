drop extension if exists "pg_net";

alter table "public"."admin_audit_logs" enable row level security;

alter table "public"."bandwidth_accounts" enable row level security;

alter table "public"."brands" enable row level security;

alter table "public"."campaign_phone_assignments" enable row level security;

alter table "public"."campaigns" enable row level security;

alter table "public"."companies" add column "billing_address" jsonb;

alter table "public"."companies" add column "billing_email" character varying(255) not null;

alter table "public"."companies" add column "created_by_profile_id" uuid;

alter table "public"."companies" enable row level security;

alter table "public"."hub_configs" enable row level security;

alter table "public"."hubs" enable row level security;

alter table "public"."lead_activities" alter column "activity_data" drop default;

alter table "public"."lead_activities" enable row level security;

alter table "public"."leads" enable row level security;

alter table "public"."memberships" enable row level security;

alter table "public"."onboarding_steps" enable row level security;

alter table "public"."onboarding_submissions" enable row level security;

alter table "public"."payment_history" add column "invoice_url" text;

alter table "public"."payment_history" add column "receipt_url" text;

alter table "public"."payment_history" alter column "currency" set default 'USD'::character varying;

alter table "public"."payment_history" enable row level security;

alter table "public"."phone_numbers" enable row level security;

alter table "public"."tcr_integrations" drop column "tcr_account_id";

alter table "public"."tcr_integrations" add column "tcr_brand_id" character varying(255);

alter table "public"."tcr_integrations" add column "tcr_campaign_id" character varying(255);

alter table "public"."tcr_integrations" enable row level security;

alter table "public"."temp_signups" drop column "is_verified";

alter table "public"."temp_signups" drop column "verified_at";

alter table "public"."temp_signups" enable row level security;

alter table "public"."user_profiles" drop column "stripe_customer_id";

alter table "public"."user_profiles" add column "company_id" uuid;

alter table "public"."user_profiles" add column "lead_id" uuid;

alter table "public"."user_profiles" add column "onboarding_data" jsonb default '{}'::jsonb;

alter table "public"."user_profiles" add column "payment_date" timestamp with time zone;

alter table "public"."user_profiles" add column "payment_status" character varying(50) default 'pending'::character varying;

alter table "public"."user_profiles" add column "stripe_session_id" character varying(255);

alter table "public"."user_profiles" alter column "first_name" drop not null;

alter table "public"."user_profiles" alter column "id" drop default;

alter table "public"."user_profiles" alter column "last_name" drop not null;

alter table "public"."user_profiles" alter column "mobile_phone_number" drop not null;

alter table "public"."user_profiles" alter column "onboarding_step" set default 'signup'::character varying;

alter table "public"."user_profiles" enable row level security;

alter table "public"."verification_attempts" enable row level security;

CREATE UNIQUE INDEX admin_audit_logs_pkey ON public.admin_audit_logs USING btree (id);

CREATE UNIQUE INDEX bandwidth_accounts_bandwidth_account_id_key ON public.bandwidth_accounts USING btree (bandwidth_account_id);

CREATE UNIQUE INDEX bandwidth_accounts_pkey ON public.bandwidth_accounts USING btree (id);

CREATE UNIQUE INDEX brands_pkey ON public.brands USING btree (id);

CREATE UNIQUE INDEX brands_tcr_brand_id_key ON public.brands USING btree (tcr_brand_id);

CREATE UNIQUE INDEX campaign_phone_assignments_campaign_id_phone_number_id_key ON public.campaign_phone_assignments USING btree (campaign_id, phone_number_id);

CREATE UNIQUE INDEX campaign_phone_assignments_pkey ON public.campaign_phone_assignments USING btree (id);

CREATE UNIQUE INDEX campaigns_pkey ON public.campaigns USING btree (id);

CREATE UNIQUE INDEX campaigns_tcr_campaign_id_key ON public.campaigns USING btree (tcr_campaign_id);

CREATE UNIQUE INDEX companies_company_account_number_key ON public.companies USING btree (company_account_number);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX companies_stripe_customer_id_key ON public.companies USING btree (stripe_customer_id);

CREATE UNIQUE INDEX hub_configs_hub_id_key ON public.hub_configs USING btree (hub_id);

CREATE UNIQUE INDEX hub_configs_pkey ON public.hub_configs USING btree (id);

CREATE UNIQUE INDEX hubs_domain_key ON public.hubs USING btree (domain);

CREATE UNIQUE INDEX hubs_hub_number_key ON public.hubs USING btree (hub_number);

CREATE UNIQUE INDEX hubs_name_key ON public.hubs USING btree (name);

CREATE UNIQUE INDEX hubs_pkey ON public.hubs USING btree (id);

CREATE INDEX idx_admin_audit_logs_action_type ON public.admin_audit_logs USING btree (action_type);

CREATE INDEX idx_admin_audit_logs_admin_user_id ON public.admin_audit_logs USING btree (admin_user_id);

CREATE INDEX idx_admin_audit_logs_created_at ON public.admin_audit_logs USING btree (created_at);

CREATE INDEX idx_admin_audit_logs_hub_id ON public.admin_audit_logs USING btree (hub_id);

CREATE INDEX idx_bandwidth_accounts_bandwidth_account_id ON public.bandwidth_accounts USING btree (bandwidth_account_id);

CREATE INDEX idx_bandwidth_accounts_company_id ON public.bandwidth_accounts USING btree (company_id);

CREATE INDEX idx_bandwidth_accounts_hub_id ON public.bandwidth_accounts USING btree (hub_id);

CREATE INDEX idx_brands_company_id ON public.brands USING btree (company_id);

CREATE INDEX idx_brands_hub_id ON public.brands USING btree (hub_id);

CREATE INDEX idx_brands_tcr_brand_id ON public.brands USING btree (tcr_brand_id);

CREATE INDEX idx_campaign_phone_assignments_campaign_id ON public.campaign_phone_assignments USING btree (campaign_id);

CREATE INDEX idx_campaign_phone_assignments_phone_number_id ON public.campaign_phone_assignments USING btree (phone_number_id);

CREATE INDEX idx_campaigns_brand_id ON public.campaigns USING btree (brand_id);

CREATE INDEX idx_campaigns_hub_id ON public.campaigns USING btree (hub_id);

CREATE INDEX idx_campaigns_tcr_campaign_id ON public.campaigns USING btree (tcr_campaign_id);

CREATE INDEX idx_companies_company_account_number ON public.companies USING btree (company_account_number);

CREATE INDEX idx_companies_hub_id ON public.companies USING btree (hub_id);

CREATE INDEX idx_companies_public_name ON public.companies USING btree (public_name);

CREATE INDEX idx_companies_stripe_customer_id ON public.companies USING btree (stripe_customer_id);

CREATE INDEX idx_hub_configs_hub_id ON public.hub_configs USING btree (hub_id);

CREATE INDEX idx_hubs_domain ON public.hubs USING btree (domain);

CREATE INDEX idx_hubs_hub_number ON public.hubs USING btree (hub_number);

CREATE INDEX idx_hubs_name ON public.hubs USING btree (name);

CREATE INDEX idx_lead_activities_activity_type ON public.lead_activities USING btree (activity_type);

CREATE INDEX idx_lead_activities_created_at ON public.lead_activities USING btree (created_at);

CREATE INDEX idx_lead_activities_hub_id ON public.lead_activities USING btree (hub_id);

CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities USING btree (lead_id);

CREATE INDEX idx_leads_company_name ON public.leads USING btree (company_name);

CREATE INDEX idx_leads_created_at ON public.leads USING btree (created_at);

CREATE INDEX idx_leads_email ON public.leads USING btree (email);

CREATE INDEX idx_leads_hub_id ON public.leads USING btree (hub_id);

CREATE INDEX idx_memberships_company_id ON public.memberships USING btree (company_id);

CREATE INDEX idx_memberships_hub_id ON public.memberships USING btree (hub_id);

CREATE INDEX idx_memberships_role ON public.memberships USING btree (role);

CREATE INDEX idx_memberships_user_id ON public.memberships USING btree (user_id);

CREATE INDEX idx_onboarding_steps_hub_id ON public.onboarding_steps USING btree (hub_id);

CREATE INDEX idx_onboarding_steps_step_number ON public.onboarding_steps USING btree (step_number);

CREATE INDEX idx_onboarding_submissions_company_id ON public.onboarding_submissions USING btree (company_id);

CREATE INDEX idx_onboarding_submissions_current_step ON public.onboarding_submissions USING btree (current_step);

CREATE INDEX idx_onboarding_submissions_hub_id ON public.onboarding_submissions USING btree (hub_id);

CREATE INDEX idx_onboarding_submissions_user_id ON public.onboarding_submissions USING btree (user_id);

CREATE INDEX idx_payment_history_created_at ON public.payment_history USING btree (created_at);

CREATE INDEX idx_payment_history_hub_id ON public.payment_history USING btree (hub_id);

CREATE INDEX idx_payment_history_status ON public.payment_history USING btree (status);

CREATE INDEX idx_payment_history_stripe_payment_intent_id ON public.payment_history USING btree (stripe_payment_intent_id);

CREATE INDEX idx_payment_history_user_profile_id ON public.payment_history USING btree (user_profile_id);

CREATE INDEX idx_phone_numbers_assigned_to_campaign ON public.phone_numbers USING btree (assigned_to_campaign);

CREATE INDEX idx_phone_numbers_hub_id ON public.phone_numbers USING btree (hub_id);

CREATE INDEX idx_phone_numbers_phone_number ON public.phone_numbers USING btree (phone_number);

CREATE INDEX idx_tcr_integrations_company_id ON public.tcr_integrations USING btree (company_id);

CREATE INDEX idx_tcr_integrations_hub_id ON public.tcr_integrations USING btree (hub_id);

CREATE INDEX idx_tcr_integrations_tcr_brand_id ON public.tcr_integrations USING btree (tcr_brand_id);

CREATE INDEX idx_tcr_integrations_tcr_campaign_id ON public.tcr_integrations USING btree (tcr_campaign_id);

CREATE INDEX idx_temp_signups_email ON public.temp_signups USING btree (email);

CREATE INDEX idx_temp_signups_expires_at ON public.temp_signups USING btree (expires_at);

CREATE INDEX idx_temp_signups_hub_id ON public.temp_signups USING btree (hub_id);

CREATE INDEX idx_temp_signups_mobile_phone ON public.temp_signups USING btree (mobile_phone_number);

CREATE INDEX idx_user_profiles_account_number ON public.user_profiles USING btree (account_number);

CREATE INDEX idx_user_profiles_company_id ON public.user_profiles USING btree (company_id);

CREATE INDEX idx_user_profiles_email ON public.user_profiles USING btree (email);

CREATE INDEX idx_user_profiles_hub_id ON public.user_profiles USING btree (hub_id);

CREATE INDEX idx_user_profiles_role ON public.user_profiles USING btree (role);

CREATE INDEX idx_verification_attempts_created_at ON public.verification_attempts USING btree (created_at);

CREATE INDEX idx_verification_attempts_temp_signup_id ON public.verification_attempts USING btree (temp_signup_id);

CREATE UNIQUE INDEX lead_activities_pkey ON public.lead_activities USING btree (id);

CREATE UNIQUE INDEX leads_pkey ON public.leads USING btree (id);

CREATE UNIQUE INDEX memberships_pkey ON public.memberships USING btree (id);

CREATE UNIQUE INDEX memberships_user_id_company_id_hub_id_key ON public.memberships USING btree (user_id, company_id, hub_id);

CREATE UNIQUE INDEX onboarding_steps_hub_id_step_number_key ON public.onboarding_steps USING btree (hub_id, step_number);

CREATE UNIQUE INDEX onboarding_steps_pkey ON public.onboarding_steps USING btree (id);

CREATE UNIQUE INDEX onboarding_submissions_company_id_hub_id_key ON public.onboarding_submissions USING btree (company_id, hub_id);

CREATE UNIQUE INDEX onboarding_submissions_pkey ON public.onboarding_submissions USING btree (id);

CREATE UNIQUE INDEX payment_history_pkey ON public.payment_history USING btree (id);

CREATE UNIQUE INDEX payment_history_stripe_payment_intent_id_key ON public.payment_history USING btree (stripe_payment_intent_id);

CREATE UNIQUE INDEX phone_numbers_phone_number_key ON public.phone_numbers USING btree (phone_number);

CREATE UNIQUE INDEX phone_numbers_pkey ON public.phone_numbers USING btree (id);

CREATE UNIQUE INDEX tcr_integrations_pkey ON public.tcr_integrations USING btree (id);

CREATE UNIQUE INDEX tcr_integrations_tcr_brand_id_key ON public.tcr_integrations USING btree (tcr_brand_id);

CREATE UNIQUE INDEX tcr_integrations_tcr_campaign_id_key ON public.tcr_integrations USING btree (tcr_campaign_id);

CREATE UNIQUE INDEX temp_signups_pkey ON public.temp_signups USING btree (id);

CREATE UNIQUE INDEX user_profiles_account_number_key ON public.user_profiles USING btree (account_number);

CREATE UNIQUE INDEX user_profiles_id_hub_id_key ON public.user_profiles USING btree (id, hub_id);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

CREATE UNIQUE INDEX verification_attempts_pkey ON public.verification_attempts USING btree (id);

alter table "public"."admin_audit_logs" add constraint "admin_audit_logs_pkey" PRIMARY KEY using index "admin_audit_logs_pkey";

alter table "public"."bandwidth_accounts" add constraint "bandwidth_accounts_pkey" PRIMARY KEY using index "bandwidth_accounts_pkey";

alter table "public"."brands" add constraint "brands_pkey" PRIMARY KEY using index "brands_pkey";

alter table "public"."campaign_phone_assignments" add constraint "campaign_phone_assignments_pkey" PRIMARY KEY using index "campaign_phone_assignments_pkey";

alter table "public"."campaigns" add constraint "campaigns_pkey" PRIMARY KEY using index "campaigns_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."hub_configs" add constraint "hub_configs_pkey" PRIMARY KEY using index "hub_configs_pkey";

alter table "public"."hubs" add constraint "hubs_pkey" PRIMARY KEY using index "hubs_pkey";

alter table "public"."lead_activities" add constraint "lead_activities_pkey" PRIMARY KEY using index "lead_activities_pkey";

alter table "public"."leads" add constraint "leads_pkey" PRIMARY KEY using index "leads_pkey";

alter table "public"."memberships" add constraint "memberships_pkey" PRIMARY KEY using index "memberships_pkey";

alter table "public"."onboarding_steps" add constraint "onboarding_steps_pkey" PRIMARY KEY using index "onboarding_steps_pkey";

alter table "public"."onboarding_submissions" add constraint "onboarding_submissions_pkey" PRIMARY KEY using index "onboarding_submissions_pkey";

alter table "public"."payment_history" add constraint "payment_history_pkey" PRIMARY KEY using index "payment_history_pkey";

alter table "public"."phone_numbers" add constraint "phone_numbers_pkey" PRIMARY KEY using index "phone_numbers_pkey";

alter table "public"."tcr_integrations" add constraint "tcr_integrations_pkey" PRIMARY KEY using index "tcr_integrations_pkey";

alter table "public"."temp_signups" add constraint "temp_signups_pkey" PRIMARY KEY using index "temp_signups_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."verification_attempts" add constraint "verification_attempts_pkey" PRIMARY KEY using index "verification_attempts_pkey";

alter table "public"."admin_audit_logs" add constraint "admin_audit_logs_admin_user_id_fkey" FOREIGN KEY (admin_user_id) REFERENCES auth.users(id) ON DELETE RESTRICT not valid;

alter table "public"."admin_audit_logs" validate constraint "admin_audit_logs_admin_user_id_fkey";

alter table "public"."admin_audit_logs" add constraint "admin_audit_logs_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."admin_audit_logs" validate constraint "admin_audit_logs_hub_id_fkey";

alter table "public"."bandwidth_accounts" add constraint "bandwidth_accounts_bandwidth_account_id_key" UNIQUE using index "bandwidth_accounts_bandwidth_account_id_key";

alter table "public"."bandwidth_accounts" add constraint "bandwidth_accounts_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."bandwidth_accounts" validate constraint "bandwidth_accounts_company_id_fkey";

alter table "public"."bandwidth_accounts" add constraint "bandwidth_accounts_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."bandwidth_accounts" validate constraint "bandwidth_accounts_hub_id_fkey";

alter table "public"."brands" add constraint "brands_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."brands" validate constraint "brands_company_id_fkey";

alter table "public"."brands" add constraint "brands_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."brands" validate constraint "brands_hub_id_fkey";

alter table "public"."brands" add constraint "brands_tcr_brand_id_key" UNIQUE using index "brands_tcr_brand_id_key";

alter table "public"."campaign_phone_assignments" add constraint "campaign_phone_assignments_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE not valid;

alter table "public"."campaign_phone_assignments" validate constraint "campaign_phone_assignments_campaign_id_fkey";

alter table "public"."campaign_phone_assignments" add constraint "campaign_phone_assignments_campaign_id_phone_number_id_key" UNIQUE using index "campaign_phone_assignments_campaign_id_phone_number_id_key";

alter table "public"."campaign_phone_assignments" add constraint "campaign_phone_assignments_phone_number_id_fkey" FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id) ON DELETE CASCADE not valid;

alter table "public"."campaign_phone_assignments" validate constraint "campaign_phone_assignments_phone_number_id_fkey";

alter table "public"."campaigns" add constraint "campaigns_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE not valid;

alter table "public"."campaigns" validate constraint "campaigns_brand_id_fkey";

alter table "public"."campaigns" add constraint "campaigns_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."campaigns" validate constraint "campaigns_hub_id_fkey";

alter table "public"."campaigns" add constraint "campaigns_tcr_campaign_id_key" UNIQUE using index "campaigns_tcr_campaign_id_key";

alter table "public"."companies" add constraint "companies_company_account_number_key" UNIQUE using index "companies_company_account_number_key";

alter table "public"."companies" add constraint "companies_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."companies" validate constraint "companies_hub_id_fkey";

alter table "public"."companies" add constraint "companies_stripe_customer_id_key" UNIQUE using index "companies_stripe_customer_id_key";

alter table "public"."hub_configs" add constraint "hub_configs_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."hub_configs" validate constraint "hub_configs_hub_id_fkey";

alter table "public"."hub_configs" add constraint "hub_configs_hub_id_key" UNIQUE using index "hub_configs_hub_id_key";

alter table "public"."hubs" add constraint "hubs_domain_key" UNIQUE using index "hubs_domain_key";

alter table "public"."hubs" add constraint "hubs_hub_number_key" UNIQUE using index "hubs_hub_number_key";

alter table "public"."hubs" add constraint "hubs_name_key" UNIQUE using index "hubs_name_key";

alter table "public"."lead_activities" add constraint "lead_activities_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."lead_activities" validate constraint "lead_activities_hub_id_fkey";

alter table "public"."lead_activities" add constraint "lead_activities_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE not valid;

alter table "public"."lead_activities" validate constraint "lead_activities_lead_id_fkey";

alter table "public"."leads" add constraint "leads_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."leads" validate constraint "leads_hub_id_fkey";

alter table "public"."memberships" add constraint "memberships_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."memberships" validate constraint "memberships_company_id_fkey";

alter table "public"."memberships" add constraint "memberships_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."memberships" validate constraint "memberships_hub_id_fkey";

alter table "public"."memberships" add constraint "memberships_user_id_company_id_hub_id_key" UNIQUE using index "memberships_user_id_company_id_hub_id_key";

alter table "public"."memberships" add constraint "memberships_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."memberships" validate constraint "memberships_user_id_fkey";

alter table "public"."onboarding_steps" add constraint "onboarding_steps_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."onboarding_steps" validate constraint "onboarding_steps_hub_id_fkey";

alter table "public"."onboarding_steps" add constraint "onboarding_steps_hub_id_step_number_key" UNIQUE using index "onboarding_steps_hub_id_step_number_key";

alter table "public"."onboarding_submissions" add constraint "onboarding_submissions_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."onboarding_submissions" validate constraint "onboarding_submissions_company_id_fkey";

alter table "public"."onboarding_submissions" add constraint "onboarding_submissions_company_id_hub_id_key" UNIQUE using index "onboarding_submissions_company_id_hub_id_key";

alter table "public"."onboarding_submissions" add constraint "onboarding_submissions_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."onboarding_submissions" validate constraint "onboarding_submissions_hub_id_fkey";

alter table "public"."onboarding_submissions" add constraint "onboarding_submissions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."onboarding_submissions" validate constraint "onboarding_submissions_user_id_fkey";

alter table "public"."payment_history" add constraint "payment_history_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."payment_history" validate constraint "payment_history_hub_id_fkey";

alter table "public"."payment_history" add constraint "payment_history_stripe_payment_intent_id_key" UNIQUE using index "payment_history_stripe_payment_intent_id_key";

alter table "public"."payment_history" add constraint "payment_history_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE not valid;

alter table "public"."payment_history" validate constraint "payment_history_user_profile_id_fkey";

alter table "public"."phone_numbers" add constraint "phone_numbers_assigned_to_campaign_fkey" FOREIGN KEY (assigned_to_campaign) REFERENCES campaigns(id) ON DELETE SET NULL not valid;

alter table "public"."phone_numbers" validate constraint "phone_numbers_assigned_to_campaign_fkey";

alter table "public"."phone_numbers" add constraint "phone_numbers_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."phone_numbers" validate constraint "phone_numbers_hub_id_fkey";

alter table "public"."phone_numbers" add constraint "phone_numbers_phone_number_key" UNIQUE using index "phone_numbers_phone_number_key";

alter table "public"."tcr_integrations" add constraint "tcr_integrations_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."tcr_integrations" validate constraint "tcr_integrations_company_id_fkey";

alter table "public"."tcr_integrations" add constraint "tcr_integrations_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."tcr_integrations" validate constraint "tcr_integrations_hub_id_fkey";

alter table "public"."tcr_integrations" add constraint "tcr_integrations_tcr_brand_id_key" UNIQUE using index "tcr_integrations_tcr_brand_id_key";

alter table "public"."tcr_integrations" add constraint "tcr_integrations_tcr_campaign_id_key" UNIQUE using index "tcr_integrations_tcr_campaign_id_key";

alter table "public"."temp_signups" add constraint "temp_signups_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."temp_signups" validate constraint "temp_signups_hub_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_account_number_key" UNIQUE using index "user_profiles_account_number_key";

alter table "public"."user_profiles" add constraint "user_profiles_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_company_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_hub_id_fkey" FOREIGN KEY (hub_id) REFERENCES hubs(hub_number) ON DELETE RESTRICT not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_hub_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_id_hub_id_key" UNIQUE using index "user_profiles_id_hub_id_key";

alter table "public"."user_profiles" add constraint "user_profiles_lead_id_fkey" FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL not valid;

alter table "public"."user_profiles" validate constraint "user_profiles_lead_id_fkey";

alter table "public"."verification_attempts" add constraint "verification_attempts_temp_signup_id_fkey" FOREIGN KEY (temp_signup_id) REFERENCES temp_signups(id) ON DELETE CASCADE not valid;

alter table "public"."verification_attempts" validate constraint "verification_attempts_temp_signup_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_superadmin()
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'SUPERADMIN'
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER trigger_update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_leads_updated_at();


