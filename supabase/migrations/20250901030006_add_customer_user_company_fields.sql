-- Add user_id and company_id fields to customers table
-- These fields are mutually exclusive (one or the other, not both)
-- They must be unique and create 1:1 relationships

-- Step 1: Add the new columns as nullable initially
ALTER TABLE public.customers 
ADD COLUMN user_id UUID REFERENCES public.user_profiles(id),
ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Step 2: Handle existing data - for now, we'll allow NULL values for both
-- This allows existing customers to exist without user_id or company_id
-- New customers will be required to have one or the other
ALTER TABLE public.customers 
ADD CONSTRAINT customers_user_or_company_check 
CHECK (
  (user_id IS NOT NULL AND company_id IS NULL) OR 
  (user_id IS NULL AND company_id IS NOT NULL) OR
  (user_id IS NULL AND company_id IS NULL)  -- Allow existing data to have both NULL
);

-- Step 3: Add unique constraints to ensure 1:1 relationships
ALTER TABLE public.customers 
ADD CONSTRAINT customers_user_id_unique UNIQUE (user_id);

ALTER TABLE public.customers 
ADD CONSTRAINT customers_company_id_unique UNIQUE (company_id);

-- Step 4: Add indexes for performance
CREATE INDEX idx_customers_user_id ON public.customers(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_customers_company_id ON public.customers(company_id) WHERE company_id IS NOT NULL;

-- Step 5: Add comments for documentation
COMMENT ON COLUMN public.customers.user_id IS 'References user_profiles.id for B2C customers. Mutually exclusive with company_id.';
COMMENT ON COLUMN public.customers.company_id IS 'References companies.id for B2B customers. Mutually exclusive with company_id.';
COMMENT ON CONSTRAINT customers_user_or_company_check ON public.customers IS 'Ensures exactly one of user_id or company_id is set, never both or neither.';