-- Consolidated schema migration for multi-hub SaaS platform
-- Migration: 20241229000000_consolidated_schema.sql
-- Combines: initial_schema + schema_enhancements + robust_business_logic + RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: cron extension may not be available in local development
-- It will be available in production Supabase
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_available_extensions WHERE name = 'cron'
  ) THEN
    CREATE EXTENSION IF NOT EXISTS "cron";
  ELSE
    RAISE NOTICE 'cron extension not available - skipping (will be available in production)';
  END IF;
END $$;

-- 1. Create user role enum (defined before use to avoid conflicts)
CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'OWNER', 'ADMIN', 'SUPPORT', 'VIEWER', 'MEMBER');

-- 2. HUBS TABLE (Core hub configuration)
CREATE TABLE IF NOT EXISTS public.hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_number INTEGER NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(200) NOT NULL,
  domain VARCHAR(255) UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HUB_CONFIGS TABLE (Hub-specific styling and features)
CREATE TABLE IF NOT EXISTS public.hub_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  primary_color VARCHAR(7) NOT NULL,
  secondary_color VARCHAR(7) NOT NULL,
  accent_color VARCHAR(7) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hub_id)
);

-- 4. TEMP_SIGNUPS TABLE (Temporary signup data before verification)
CREATE TABLE IF NOT EXISTS public.temp_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  company_name VARCHAR(200) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  mobile_phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  auth_method VARCHAR(20) NOT NULL DEFAULT 'sms',
  verification_code VARCHAR(10),
  verification_attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VERIFICATION_ATTEMPTS TABLE (Track verification attempts)
CREATE TABLE IF NOT EXISTS public.verification_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temp_signup_id UUID NOT NULL REFERENCES public.temp_signups(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  verification_code VARCHAR(10) NOT NULL,
  is_successful BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. COMPANIES TABLE (Stripe customers with hub association)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  company_account_number VARCHAR(20) UNIQUE NOT NULL,
  public_name VARCHAR(200) NOT NULL,
  legal_name VARCHAR(200),
  ein VARCHAR(20),
  website VARCHAR(255),
  address TEXT,
  address_street VARCHAR(255),
  city VARCHAR(100),
  state_region VARCHAR(100),
  postal_code VARCHAR(20),
  country_of_registration VARCHAR(100),
  tax_issuing_country VARCHAR(100),
  industry VARCHAR(100),
  size VARCHAR(50),
  vertical_type VARCHAR(100),
  legal_form VARCHAR(100),
  company_phone_number VARCHAR(20),
  point_of_contact_email VARCHAR(255),
  stripe_customer_id VARCHAR(255) UNIQUE,
  subscription_status VARCHAR(50) DEFAULT 'inactive',
  subscription_tier VARCHAR(50),
  billing_email VARCHAR(255) NOT NULL,
  billing_address JSONB,
  is_active BOOLEAN DEFAULT true,
  created_by_profile_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. USER_PROFILES TABLE (Extended user data - extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  mobile_phone_number VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'MEMBER',
  lead_id UUID,
  stripe_session_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_date TIMESTAMP WITH TIME ZONE,
  onboarding_step VARCHAR(50) DEFAULT 'signup',
  onboarding_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id, hub_id)
);

-- 8. LEADS TABLE for lead management
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(200),
  lead_phone_number VARCHAR(20),
  company_name VARCHAR(200),
  platform_interest VARCHAR(100),
  source VARCHAR(100),
  message TEXT,
  ip_address INET,
  interaction_count INTEGER DEFAULT 1,
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. MEMBERSHIPS TABLE for user-company relationships
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  hub_id INTEGER REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  role user_role DEFAULT 'MEMBER',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, company_id, hub_id)
);

-- 10. ONBOARDING_STEPS TABLE (Universal 7-step process)
CREATE TABLE IF NOT EXISTS public.onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  step_number INTEGER NOT NULL,
  step_name VARCHAR(100) NOT NULL,
  step_description TEXT,
  is_required BOOLEAN DEFAULT true,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  step_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hub_id, step_number)
);

-- 11. ONBOARDING_SUBMISSIONS TABLE (Enhanced version)
CREATE TABLE IF NOT EXISTS public.onboarding_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  stripe_status VARCHAR(50) DEFAULT 'pending',
  tcr_brand_id VARCHAR(255),
  tcr_campaign_id VARCHAR(255),
  assigned_phone_number VARCHAR(20),
  current_step VARCHAR(50) DEFAULT 'verification',
  step_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, hub_id)
);

-- 12. BRANDS TABLE (Separate table for brand management)
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  dba_brand_name VARCHAR(200),
  tcr_brand_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. CAMPAIGNS TABLE (Separate table for campaign management)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  tcr_campaign_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. PHONE_NUMBERS TABLE (Dedicated table for Bandwidth phone numbers)
CREATE TABLE IF NOT EXISTS public.phone_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  bandwidth_account_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  assigned_to_campaign UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. CAMPAIGN_PHONE_ASSIGNMENTS TABLE (Links campaigns to phone numbers)
CREATE TABLE IF NOT EXISTS public.campaign_phone_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  phone_number_id UUID NOT NULL REFERENCES public.phone_numbers(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, phone_number_id)
);

-- 16. TCR_INTEGRATIONS TABLE (Manages TCR brand and campaign IDs per company/hub)
CREATE TABLE IF NOT EXISTS public.tcr_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  tcr_brand_id VARCHAR(255) UNIQUE,
  tcr_campaign_id VARCHAR(255) UNIQUE,
  tcr_credentials JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. BANDWIDTH_ACCOUNTS TABLE (Manages Bandwidth phone numbers per company/hub)
CREATE TABLE IF NOT EXISTS public.bandwidth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  bandwidth_account_id VARCHAR(255) UNIQUE,
  bandwidth_credentials JSONB NOT NULL,
  phone_numbers JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. ADMIN_AUDIT_LOGS TABLE (Comprehensive audit trail for admin actions)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  action_type VARCHAR(100) NOT NULL,
  action_scope VARCHAR(50),
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. LEAD_ACTIVITIES TABLE (Detailed tracking of lead interactions)
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  activity_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. PAYMENT_HISTORY TABLE (Records complete payment transactions)
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id INTEGER NOT NULL REFERENCES public.hubs(hub_number) ON DELETE RESTRICT,
  user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(100),
  receipt_url TEXT,
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_lead_id_fkey 
FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;

-- Create functions for account number generation
CREATE OR REPLACE FUNCTION generate_account_number(hub_name TEXT)
RETURNS VARCHAR(20) AS $$
DECLARE
  next_number INTEGER;
  prefix VARCHAR(10);
BEGIN
  -- Determine prefix based on hub name
  CASE 
    WHEN hub_name = 'percytech' THEN prefix := 'PT';
    WHEN hub_name = 'gnymble' THEN prefix := 'GN';
    WHEN hub_name = 'percymd' THEN prefix := 'PM';
    WHEN hub_name = 'percytext' THEN prefix := 'PX';
    ELSE prefix := 'UN';
  END CASE;
  
  -- Get next sequential number
  SELECT COALESCE(MAX(CAST(SUBSTRING(account_number FROM LENGTH(prefix) + 2) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.user_profiles
  WHERE account_number LIKE prefix || '_%';
  
  -- Return formatted account number
  RETURN prefix || '_' || LPAD(next_number::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_company_account_number(hub_name TEXT)
RETURNS VARCHAR(20) AS $$
DECLARE
  next_number INTEGER;
  prefix VARCHAR(10);
BEGIN
  -- Determine prefix based on hub name
  CASE 
    WHEN hub_name = 'percytech' THEN prefix := 'cPT';
    WHEN hub_name = 'gnymble' THEN prefix := 'cGN';
    WHEN hub_name = 'percymd' THEN prefix := 'cPM';
    WHEN hub_name = 'percytext' THEN prefix := 'cPX';
    ELSE prefix := 'cUN';
  END CASE;
  
  -- Get next sequential number
  SELECT COALESCE(MAX(CAST(SUBSTRING(company_account_number FROM LENGTH(prefix) + 2) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.companies
  WHERE company_account_number LIKE prefix || '_%';
  
  -- Return formatted account number
  RETURN prefix || '_' || LPAD(next_number::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create cleanup function for expired temp signups
CREATE OR REPLACE FUNCTION cleanup_expired_temp_signups()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.temp_signups 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create SUPERADMIN helper function for cleaner RLS policies
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'SUPERADMIN'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;