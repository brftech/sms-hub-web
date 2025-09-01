-- Migration: Add Customers Table for B2B and B2C Billing Flexibility
-- Date: 2025-01-01
-- Description: This migration adds a centralized customers table that handles billing
-- for both B2B (companies) and B2C (individuals) scenarios, replacing the scattered
-- Stripe fields across multiple tables with a clean, unified billing system.

-- ============================================================================
-- NEW: Add customers table for B2B and B2C billing flexibility
-- ============================================================================

-- Create customers table with comprehensive billing support
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id INTEGER NOT NULL REFERENCES hubs(hub_number),
    customer_type TEXT NOT NULL CHECK (customer_type IN ('company', 'individual')),

    -- Stripe fields (core billing)
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    subscription_status TEXT,
    subscription_tier TEXT,
    billing_email TEXT NOT NULL,
    billing_address JSONB,

    -- Payment tracking
    last_payment_at TIMESTAMPTZ,
    last_payment_amount DECIMAL(10,2),
    total_spent DECIMAL(10,2) DEFAULT 0,
    payment_method_last4 TEXT,
    payment_method_brand TEXT,

    -- Status tracking
    is_active BOOLEAN DEFAULT true,
    trial_ends_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraints for customer subscription status (using DO block to handle IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_customer_subscription_status') THEN
        ALTER TABLE customers ADD CONSTRAINT check_customer_subscription_status
        CHECK (subscription_status IN ('inactive', 'pending', 'active', 'past_due', 'canceled', 'unpaid', 'trialing'));
    END IF;
END $$;

-- Link companies to customers (B2B path)
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id);

-- Link individual users directly to customers for B2C
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id),
ADD COLUMN IF NOT EXISTS is_individual_customer BOOLEAN DEFAULT FALSE;

-- Remove Stripe fields from companies (they move to customers)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE companies DROP COLUMN stripe_customer_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'stripe_subscription_id') THEN
        ALTER TABLE companies DROP COLUMN stripe_subscription_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'subscription_status') THEN
        ALTER TABLE companies DROP COLUMN subscription_status;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'subscription_tier') THEN
        ALTER TABLE companies DROP COLUMN subscription_tier;
    END IF;
END $$;

-- Remove Stripe fields from user_profiles (they move to customers)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE user_profiles DROP COLUMN stripe_customer_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'stripe_subscription_id') THEN
        ALTER TABLE user_profiles DROP COLUMN stripe_subscription_id;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_status') THEN
        ALTER TABLE user_profiles DROP COLUMN subscription_status;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_tier') THEN
        ALTER TABLE user_profiles DROP COLUMN subscription_tier;
    END IF;
END $$;

-- Create indexes for customer relationships
CREATE INDEX IF NOT EXISTS idx_customers_hub_id ON customers(hub_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_subscription_status ON customers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_customers_is_active ON customers(is_active);
CREATE INDEX IF NOT EXISTS idx_customers_trial_ends_at ON customers(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_companies_customer_id ON companies(customer_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_customer_id ON user_profiles(customer_id);

-- Add comments for customer system
COMMENT ON TABLE customers IS 'Centralized billing and customer management for both B2B and B2C with comprehensive payment tracking';
COMMENT ON COLUMN customers.hub_id IS 'Hub this customer belongs to for multi-tenant isolation';
COMMENT ON COLUMN customers.customer_type IS 'Whether this is a company or individual customer';
COMMENT ON COLUMN customers.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN customers.stripe_subscription_id IS 'Stripe subscription ID if subscription exists';
COMMENT ON COLUMN customers.subscription_status IS 'Current subscription status including trial states';
COMMENT ON COLUMN customers.subscription_tier IS 'Subscription tier/plan level';
COMMENT ON COLUMN customers.billing_email IS 'Primary billing email address';
COMMENT ON COLUMN customers.billing_address IS 'JSON billing address information';
COMMENT ON COLUMN customers.last_payment_at IS 'When the last successful payment was made';
COMMENT ON COLUMN customers.last_payment_amount IS 'Amount of the last successful payment';
COMMENT ON COLUMN customers.total_spent IS 'Total amount spent by this customer';
COMMENT ON COLUMN customers.payment_method_last4 IS 'Last 4 digits of payment method';
COMMENT ON COLUMN customers.payment_method_brand IS 'Brand of payment method (visa, mastercard, etc.)';
COMMENT ON COLUMN customers.is_active IS 'Whether this customer account is active';
COMMENT ON COLUMN customers.trial_ends_at IS 'When the trial period ends';
COMMENT ON COLUMN customers.subscription_ends_at IS 'When the subscription ends';
COMMENT ON COLUMN customers.metadata IS 'Additional customer metadata for extensibility';

COMMENT ON COLUMN companies.customer_id IS 'Reference to customers table for billing (B2B path)';
COMMENT ON COLUMN user_profiles.customer_id IS 'Reference to customers table for billing (B2C path)';
COMMENT ON COLUMN user_profiles.is_individual_customer IS 'Whether this user is a B2C customer';

-- Add RLS policies for customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Users can view customers in their hub that they're associated with
CREATE POLICY "Users can view customers in their hub" ON customers
FOR SELECT USING (
    hub_id IN (
        SELECT hub_id FROM user_profiles WHERE id = auth.uid()
    )
    AND (
        id IN (
            SELECT customer_id FROM companies WHERE id IN (
                SELECT company_id FROM user_profiles WHERE id = auth.uid()
            )
        )
        OR
        id IN (
            SELECT customer_id FROM user_profiles WHERE id = auth.uid()
        )
    )
);

-- Users can update customers they're associated with
CREATE POLICY "Users can update their associated customers" ON customers
FOR UPDATE USING (
    id IN (
        SELECT customer_id FROM companies WHERE id IN (
            SELECT company_id FROM user_profiles WHERE id = auth.uid()
        )
        UNION
        SELECT customer_id FROM user_profiles WHERE id = auth.uid()
    )
);

-- Users can insert customers for their company or themselves
CREATE POLICY "Users can insert customers for their company or themselves" ON customers
FOR INSERT WITH CHECK (
    hub_id IN (
        SELECT hub_id FROM user_profiles WHERE id = auth.uid()
    )
    AND (
        customer_type = 'company' AND id IN (
            SELECT customer_id FROM companies WHERE id IN (
                SELECT company_id FROM user_profiles WHERE id = auth.uid()
            )
        )
        OR
        customer_type = 'individual' AND id IN (
            SELECT customer_id FROM user_profiles WHERE id = auth.uid()
        )
    )
);

-- ============================================================================
-- Migration Summary
-- ============================================================================
-- 
-- This migration accomplishes:
-- 
-- 1. Creates a centralized customers table for all billing relationships
-- 2. Supports both B2B (company -> customer) and B2C (user -> customer) paths
-- 3. Provides comprehensive payment tracking and analytics
-- 4. Implements proper hub isolation for multi-tenant security
-- 5. Removes duplicate Stripe fields from companies and user_profiles tables
-- 6. Sets up proper RLS policies for data security
-- 7. Adds performance indexes for common queries
-- 
-- The new architecture supports:
-- - Individual customers (B2C) with direct billing
-- - Company customers (B2B) with shared billing
-- - Trial management and subscription lifecycle
-- - Payment method tracking and spending analytics
-- - Hub-based multi-tenant isolation
-- - Future extensibility through metadata fields
