-- Clean up redundant fields between companies and customers tables
-- Companies = business entities, Customers = paying entities

-- Step 1: Add new fields to customers table (if they don't exist)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_type TEXT;

-- Step 2: Migrate payment data from companies to customers
-- For companies that have customers, move payment info to the customer record
UPDATE customers 
SET 
    payment_status = companies.payment_status,
    payment_type = companies.payment_type
FROM companies 
WHERE customers.company_id = companies.id 
AND companies.payment_status IS NOT NULL;

-- Step 3: For companies without customers but with payment info, create customer records
INSERT INTO customers (
    company_id,
    user_id,
    billing_email,
    customer_type,
    hub_id,
    payment_status,
    payment_type,
    is_active,
    created_at,
    updated_at
)
SELECT 
    c.id as company_id,
    c.created_by_user_id as user_id,
    c.billing_email,
    'company' as customer_type,
    c.hub_id,
    c.payment_status,
    c.payment_type,
    c.is_active,
    c.created_at,
    c.updated_at
FROM companies c
LEFT JOIN customers cust ON cust.company_id = c.id
WHERE cust.id IS NULL 
AND (c.payment_status IS NOT NULL OR c.billing_email IS NOT NULL);

-- Step 4: Remove redundant fields from companies table
ALTER TABLE companies 
DROP COLUMN IF EXISTS billing_email,
DROP COLUMN IF EXISTS payment_status,
DROP COLUMN IF EXISTS payment_type,
DROP COLUMN IF EXISTS customer_id;

-- Step 5: Update any references to companies.payment_status in the codebase
-- (This will be handled in the application code)

-- Step 6: Add comments to clarify the new structure
COMMENT ON TABLE companies IS 'Business entities - represents companies/organizations';
COMMENT ON TABLE customers IS 'Paying entities - represents customers who pay for services (B2B or B2C)';

COMMENT ON COLUMN customers.payment_status IS 'Payment status for this customer (moved from companies table)';
COMMENT ON COLUMN customers.payment_type IS 'Payment type for this customer (moved from companies table)';
COMMENT ON COLUMN customers.billing_email IS 'Billing email for this customer (moved from companies table)';
COMMENT ON COLUMN customers.hub_id IS 'Hub this customer belongs to (moved from companies table)';

-- Step 7: Update indexes if needed
-- Ensure we have proper indexes for the new structure
CREATE INDEX IF NOT EXISTS idx_customers_payment_status ON customers(payment_status);
CREATE INDEX IF NOT EXISTS idx_customers_subscription_status ON customers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_customers_billing_email ON customers(billing_email);
