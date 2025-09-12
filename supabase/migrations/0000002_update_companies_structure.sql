-- Migration #2: Update companies table structure for TCR compliance
-- This migration updates the companies table to include all fields required for
-- The Campaign Registry (TCR) and proper business operations

-- Add all missing columns to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS legal_company_name TEXT,
ADD COLUMN IF NOT EXISTS ein TEXT,
ADD COLUMN IF NOT EXISTS company_type TEXT, -- LLC, Corporation, Sole Proprietorship, etc.
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS address_line_2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_email TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_title TEXT,
ADD COLUMN IF NOT EXISTS business_registration_number TEXT, -- State registration number
ADD COLUMN IF NOT EXISTS business_registration_state TEXT, -- State of incorporation
ADD COLUMN IF NOT EXISTS year_established INTEGER,
ADD COLUMN IF NOT EXISTS number_of_employees TEXT, -- Range: 1-10, 11-50, etc.
ADD COLUMN IF NOT EXISTS annual_revenue TEXT, -- Range for TCR
ADD COLUMN IF NOT EXISTS industry_vertical TEXT, -- TCR vertical category
ADD COLUMN IF NOT EXISTS brand_name TEXT, -- DBA name if different from legal name
ADD COLUMN IF NOT EXISTS tcr_brand_status TEXT DEFAULT 'not_submitted',
ADD COLUMN IF NOT EXISTS tcr_brand_id TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_companies_ein ON companies(ein);
CREATE INDEX IF NOT EXISTS idx_companies_tcr_brand_id ON companies(tcr_brand_id);
CREATE INDEX IF NOT EXISTS idx_companies_tcr_brand_status ON companies(tcr_brand_status);
CREATE INDEX IF NOT EXISTS idx_companies_state ON companies(state);
CREATE INDEX IF NOT EXISTS idx_companies_company_type ON companies(company_type);

-- Add comments to document field purposes
COMMENT ON COLUMN companies.legal_company_name IS 'Legal registered name for TCR';
COMMENT ON COLUMN companies.ein IS 'Employer Identification Number (Tax ID)';
COMMENT ON COLUMN companies.company_type IS 'LLC, Corporation, Sole Proprietorship, Partnership, Non-Profit';
COMMENT ON COLUMN companies.tcr_brand_status IS 'not_submitted, pending, approved, rejected';
COMMENT ON COLUMN companies.number_of_employees IS '1-10, 11-50, 51-200, 201-500, 501-1000, 1000+';
COMMENT ON COLUMN companies.annual_revenue IS '<$1M, $1M-$10M, $10M-$50M, $50M-$100M, $100M+';
COMMENT ON COLUMN companies.industry_vertical IS 'Technology, Healthcare, Finance, Retail, etc.';

-- Update constraints
ALTER TABLE companies
ADD CONSTRAINT companies_ein_format CHECK (ein ~ '^\d{2}-\d{7}$' OR ein IS NULL),
ADD CONSTRAINT companies_phone_format CHECK (phone ~ '^\+1\d{10}$' OR phone IS NULL),
ADD CONSTRAINT companies_zip_format CHECK (zip ~ '^\d{5}(-\d{4})?$' OR zip IS NULL);

-- Ensure foreign key constraint exists for user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_id_fkey'
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles
    ADD CONSTRAINT user_profiles_id_fkey 
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add comprehensive indexes for all tables with hub_id (if not already exist)
-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hub_id ON user_profiles(hub_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_hub ON user_profiles(company_id, hub_id);

-- Companies indexes (including existing fields)
CREATE INDEX IF NOT EXISTS idx_companies_hub_id ON companies(hub_id);
CREATE INDEX IF NOT EXISTS idx_companies_created_by_user_id ON companies(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);

-- Customers indexes  
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_payment_status ON customers(payment_status);
CREATE INDEX IF NOT EXISTS idx_customers_hub_id ON customers(hub_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON customers(customer_type);

-- Memberships indexes
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_company_id ON memberships(company_id);
CREATE INDEX IF NOT EXISTS idx_memberships_hub_id ON memberships(hub_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_company ON memberships(user_id, company_id);

-- Additional indexes for other tables
CREATE INDEX IF NOT EXISTS idx_leads_hub_id ON leads(hub_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_hub_id ON phone_numbers(hub_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_hub_id ON onboarding_submissions(hub_id);
CREATE INDEX IF NOT EXISTS idx_brands_hub_id ON brands(hub_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_hub_id ON campaigns(hub_id);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_user_id ON sms_verifications(user_id);

-- Log the update
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'DATABASE STRUCTURE UPDATE COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Companies table enhanced with:';
  RAISE NOTICE '  - TCR-required fields';
  RAISE NOTICE '  - Full address breakdown';
  RAISE NOTICE '  - Business details tracking';
  RAISE NOTICE '  - Contact information';
  RAISE NOTICE '';
  RAISE NOTICE 'Added indexes for:';
  RAISE NOTICE '  - All hub_id columns (multi-tenant queries)';
  RAISE NOTICE '  - Foreign key relationships';
  RAISE NOTICE '  - Frequently queried fields';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Run: npx supabase db push';
  RAISE NOTICE '  2. Generate types: npx supabase gen types typescript';
  RAISE NOTICE '  3. Run migration #3 for sample data';
  RAISE NOTICE '========================================';
END $$;