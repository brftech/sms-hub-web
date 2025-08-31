-- Migration: 20250831164140_sync_with_production_schema.sql
-- Purpose: Sync local schema with production database
-- Description: Create all tables and fields that exist in production, without RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create user role enum
DO $$ BEGIN
    CREATE TYPE "public"."user_role" AS ENUM ('SUPERADMIN', 'OWNER', 'ADMIN', 'SUPPORT', 'VIEWER', 'MEMBER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create all tables with their current production schema

-- HUBS TABLE
CREATE TABLE IF NOT EXISTS "public"."hubs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_number" integer NOT NULL,
  "name" character varying(100) NOT NULL,
  "display_name" character varying(200) NOT NULL,
  "domain" character varying(255),
  "logo_url" text,
  "is_active" boolean DEFAULT true,
  "deleted_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- HUB_CONFIGS TABLE
CREATE TABLE IF NOT EXISTS "public"."hub_configs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "primary_color" character varying(7) NOT NULL,
  "secondary_color" character varying(7) NOT NULL,
  "accent_color" character varying(7) NOT NULL,
  "features" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "settings" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- TEMP_SIGNUPS TABLE
CREATE TABLE IF NOT EXISTS "public"."temp_signups" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "company_name" character varying(200) NOT NULL,
  "first_name" character varying(100) NOT NULL,
  "last_name" character varying(100) NOT NULL,
  "mobile_phone_number" character varying(20) NOT NULL,
  "email" character varying(255) NOT NULL,
  "auth_method" character varying(20) NOT NULL DEFAULT 'sms'::character varying,
  "verification_code" character varying(10),
  "verification_attempts" integer DEFAULT 0,
  "max_attempts" integer DEFAULT 3,
  "expires_at" timestamp with time zone NOT NULL DEFAULT (now() + interval '15 minutes'),
  "stripe_customer_id" character varying(255),
  "is_verified" boolean DEFAULT false,
  "verified_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now()
);

-- VERIFICATION_ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS "public"."verification_attempts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "temp_signup_id" uuid NOT NULL,
  "attempt_number" integer NOT NULL,
  "verification_code" character varying(10) NOT NULL,
  "is_successful" boolean DEFAULT false,
  "ip_address" inet,
  "user_agent" text,
  "created_at" timestamp with time zone DEFAULT now()
);

-- COMPANIES TABLE
CREATE TABLE IF NOT EXISTS "public"."companies" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "company_account_number" character varying(20) NOT NULL,
  "public_name" character varying(200) NOT NULL,
  "legal_name" character varying(200),
  "ein" character varying(20),
  "website" character varying(255),
  "address" text,
  "address_street" character varying(255),
  "city" character varying(100),
  "state_region" character varying(100),
  "postal_code" character varying(20),
  "country_of_registration" character varying(100),
  "tax_issuing_country" character varying(100),
  "industry" character varying(100),
  "size" character varying(50),
  "vertical_type" character varying(100),
  "legal_form" character varying(100),
  "company_phone_number" character varying(20),
  "point_of_contact_email" character varying(255),
  "stripe_customer_id" character varying(255),
  "subscription_status" character varying(50) DEFAULT 'inactive'::character varying,
  "subscription_tier" character varying(50),
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- USER_PROFILES TABLE
CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "account_number" character varying(20) NOT NULL,
  "first_name" character varying(100) NOT NULL,
  "last_name" character varying(100) NOT NULL,
  "mobile_phone_number" character varying(20) NOT NULL,
  "email" character varying(255) NOT NULL,
  "role" "public"."user_role" DEFAULT 'MEMBER'::"public"."user_role",
  "onboarding_step" character varying(50) DEFAULT 'verification'::character varying,
  "stripe_customer_id" character varying(255),
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- LEADS TABLE (with all production fields)
CREATE TABLE IF NOT EXISTS "public"."leads" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "email" character varying(255) NOT NULL,
  "name" character varying(200),
  "lead_phone_number" character varying(20),
  "company_name" character varying(200),
  "platform_interest" character varying(100),
  "source" character varying(100),
  "message" text,
  "ip_address" inet,
  "interaction_count" integer DEFAULT 1,
  "last_interaction_at" timestamp with time zone DEFAULT now(),
  "created_at" timestamp with time zone DEFAULT now(),
  -- Additional fields that exist in production
  "first_name" character varying(100),
  "last_name" character varying(100),
  "phone" character varying(20),
  "status" character varying(50) DEFAULT 'new',
  "updated_at" timestamp with time zone DEFAULT now(),
  "lead_score" integer DEFAULT 0,
  "priority" character varying(20),
  "source_type" character varying(100),
  "user_agent" text
);

-- LEAD_ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS "public"."lead_activities" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "lead_id" uuid NOT NULL,
  "activity_type" character varying(100) NOT NULL,
  "activity_data" jsonb DEFAULT '{}'::jsonb,
  "ip_address" inet,
  "user_agent" text,
  "created_at" timestamp with time zone DEFAULT now(),
  -- Additional field that exists in production
  "description" text
);

-- MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS "public"."memberships" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "company_id" uuid NOT NULL,
  "hub_id" integer,
  "role" "public"."user_role" DEFAULT 'MEMBER'::"public"."user_role",
  "status" character varying(50) DEFAULT 'active'::character varying,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- ONBOARDING_STEPS TABLE
CREATE TABLE IF NOT EXISTS "public"."onboarding_steps" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "step_number" integer NOT NULL,
  "step_name" character varying(100) NOT NULL,
  "step_description" text,
  "is_required" boolean DEFAULT true,
  "is_completed" boolean DEFAULT false,
  "completed_at" timestamp with time zone,
  "step_data" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- ONBOARDING_SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS "public"."onboarding_submissions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "company_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "stripe_status" character varying(50) DEFAULT 'pending'::character varying,
  "tcr_brand_id" character varying(255),
  "tcr_campaign_id" character varying(255),
  "assigned_phone_number" character varying(20),
  "current_step" character varying(50) DEFAULT 'verification'::character varying,
  "step_data" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- BRANDS TABLE
CREATE TABLE IF NOT EXISTS "public"."brands" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "company_id" uuid NOT NULL,
  "name" character varying(200) NOT NULL,
  "dba_brand_name" character varying(200),
  "tcr_brand_id" character varying(255),
  "status" character varying(50) DEFAULT 'pending'::character varying,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS "public"."campaigns" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "brand_id" uuid NOT NULL,
  "name" character varying(200) NOT NULL,
  "tcr_campaign_id" character varying(255),
  "status" character varying(50) DEFAULT 'pending'::character varying,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- PHONE_NUMBERS TABLE
CREATE TABLE IF NOT EXISTS "public"."phone_numbers" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "phone_number" character varying(20) NOT NULL,
  "bandwidth_account_id" character varying(255),
  "is_active" boolean DEFAULT true,
  "assigned_to_campaign" uuid,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- CAMPAIGN_PHONE_ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS "public"."campaign_phone_assignments" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "campaign_id" uuid NOT NULL,
  "phone_number_id" uuid NOT NULL,
  "assigned_at" timestamp with time zone DEFAULT now()
);

-- BANDWIDTH_ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS "public"."bandwidth_accounts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "company_id" uuid NOT NULL,
  "bandwidth_account_id" character varying(255),
  "bandwidth_credentials" jsonb NOT NULL,
  "phone_numbers" jsonb DEFAULT '[]'::jsonb,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- TCR_INTEGRATIONS TABLE
CREATE TABLE IF NOT EXISTS "public"."tcr_integrations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "company_id" uuid NOT NULL,
  "tcr_account_id" character varying(255),
  "tcr_credentials" jsonb NOT NULL,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- PAYMENT_HISTORY TABLE
CREATE TABLE IF NOT EXISTS "public"."payment_history" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "user_profile_id" uuid NOT NULL,
  "stripe_payment_intent_id" character varying(255),
  "amount" integer NOT NULL,
  "currency" character varying(3) DEFAULT 'usd'::character varying,
  "status" character varying(50) NOT NULL,
  "payment_method" character varying(100),
  "created_at" timestamp with time zone DEFAULT now()
);

-- ADMIN_AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS "public"."admin_audit_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "hub_id" integer NOT NULL,
  "admin_user_id" uuid NOT NULL,
  "action_type" character varying(100) NOT NULL,
  "action_scope" character varying(50),
  "table_name" character varying(100),
  "record_id" uuid,
  "old_values" jsonb,
  "new_values" jsonb,
  "ip_address" inet,
  "user_agent" text,
  "created_at" timestamp with time zone DEFAULT now()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_leads_first_name" ON "public"."leads"("first_name");
CREATE INDEX IF NOT EXISTS "idx_leads_last_name" ON "public"."leads"("last_name");
CREATE INDEX IF NOT EXISTS "idx_leads_phone" ON "public"."leads"("phone");
CREATE INDEX IF NOT EXISTS "idx_leads_status" ON "public"."leads"("status");
CREATE INDEX IF NOT EXISTS "idx_leads_updated_at" ON "public"."leads"("updated_at");
CREATE INDEX IF NOT EXISTS "idx_leads_priority" ON "public"."leads"("priority");
CREATE INDEX IF NOT EXISTS "idx_leads_source_type" ON "public"."leads"("source_type");
CREATE INDEX IF NOT EXISTS "idx_lead_activities_description" ON "public"."lead_activities"("description");

-- 4. Create functions
CREATE OR REPLACE FUNCTION "public"."generate_account_number"("hub_name" text)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION "public"."generate_company_account_number"("hub_name" text)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION "public"."cleanup_expired_temp_signups"()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.temp_signups 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

-- 5. Add comments for documentation
COMMENT ON COLUMN "public"."leads"."first_name" IS 'First name of the lead contact';
COMMENT ON COLUMN "public"."leads"."last_name" IS 'Last name of the lead contact';
COMMENT ON COLUMN "public"."leads"."phone" IS 'Phone number of the lead contact (alias for lead_phone_number)';
COMMENT ON COLUMN "public"."leads"."status" IS 'Current status of the lead (new, contacted, qualified, converted, lost)';
COMMENT ON COLUMN "public"."leads"."updated_at" IS 'Timestamp when the lead was last updated';
COMMENT ON COLUMN "public"."leads"."lead_score" IS 'Lead scoring value (0-100)';
COMMENT ON COLUMN "public"."leads"."priority" IS 'Priority level of the lead (low, medium, high, urgent)';
COMMENT ON COLUMN "public"."leads"."source_type" IS 'Type of lead source for categorization';
COMMENT ON COLUMN "public"."leads"."user_agent" IS 'User agent string from lead submission';
COMMENT ON COLUMN "public"."lead_activities"."description" IS 'Human-readable description of the lead activity';

-- 6. Verify the schema creation
DO $$
BEGIN
  RAISE NOTICE 'Production schema sync completed successfully!';
  RAISE NOTICE 'All tables created without RLS policies';
END $$;
