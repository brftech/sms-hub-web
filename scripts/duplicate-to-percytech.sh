#!/bin/bash

# Simplified Database Duplication to PercyTech Production
# Uses Supabase CLI for easier migration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Duplicate Database to PercyTech Production${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Configuration
DEV_PROJECT_REF="vgpovgpwqkjnpnrjelyg"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Get production project ref
echo -e "${YELLOW}Please provide PercyTech Supabase credentials:${NC}"
echo ""
read -p "PercyTech Project Reference ID: " PROD_PROJECT_REF
read -s -p "PercyTech Database Password: " PROD_PASSWORD
echo ""
echo ""

# Confirm settings
echo -e "${BLUE}Configuration:${NC}"
echo -e "  From: ${GREEN}sms-hub-monorepo${NC} (development)"
echo -e "  To:   ${YELLOW}PercyTech${NC} (production)"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

# Step 1: Export schema from development
echo ""
echo -e "${GREEN}Step 1: Exporting development database schema...${NC}"

# Make sure we're linked to dev project
npx supabase link --project-ref ${DEV_PROJECT_REF}

# Create backup directory
mkdir -p supabase/backups

# Export schema only (no data)
npx supabase db dump --schema-only > "supabase/backups/dev_schema_${TIMESTAMP}.sql"

# Also create a migration file for production
cat > "supabase/migrations/${TIMESTAMP}_initial_production.sql" << 'EOF'
-- Initial Production Schema for PercyTech
-- This creates all necessary tables for the SMS Hub platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hub_id INTEGER NOT NULL DEFAULT 0,
    public_name TEXT NOT NULL,
    legal_name TEXT,
    company_account_number TEXT UNIQUE,
    signup_type TEXT DEFAULT 'new_company',
    is_active BOOLEAN DEFAULT true,
    first_admin_user_id UUID,
    created_by_user_id UUID,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT DEFAULT 'US',
    industry_vertical TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    account_number TEXT UNIQUE,
    hub_id INTEGER DEFAULT 0,
    first_name TEXT,
    last_name TEXT,
    mobile_phone_number TEXT,
    role TEXT DEFAULT 'USER',
    signup_type TEXT DEFAULT 'new_company',
    company_admin BOOLEAN DEFAULT false,
    company_admin_since TIMESTAMPTZ,
    company_id UUID REFERENCES public.companies(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships table
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    hub_id INTEGER NOT NULL DEFAULT 0,
    role TEXT DEFAULT 'USER',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, company_id)
);

-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id),
    user_id UUID REFERENCES auth.users(id),
    billing_email TEXT,
    payment_status TEXT DEFAULT 'pending',
    payment_type TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding submissions table
CREATE TABLE IF NOT EXISTS public.onboarding_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id),
    user_id UUID REFERENCES auth.users(id),
    hub_id INTEGER DEFAULT 0,
    current_step TEXT DEFAULT 'payment',
    stripe_status TEXT DEFAULT 'pending',
    submission_data JSONB DEFAULT '{}',
    step_data JSONB DEFAULT '{}',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts table (for SMS contacts)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id),
    hub_id INTEGER DEFAULT 0,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    email TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id),
    hub_id INTEGER DEFAULT 0,
    name TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (SMS history)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES public.campaigns(id),
    contact_id UUID REFERENCES public.contacts(id),
    company_id UUID REFERENCES public.companies(id),
    hub_id INTEGER DEFAULT 0,
    phone_number TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phone numbers table (company phone numbers)
CREATE TABLE IF NOT EXISTS public.phone_numbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id),
    hub_id INTEGER DEFAULT 0,
    phone_number TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'standard',
    status TEXT DEFAULT 'active',
    provider TEXT,
    capabilities JSONB DEFAULT '{"sms": true, "voice": false}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_hub_id ON public.companies(hub_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_company ON public.memberships(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_company ON public.customers(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON public.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_company ON public.campaigns(company_id);
CREATE INDEX IF NOT EXISTS idx_messages_campaign ON public.messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_company ON public.phone_numbers(company_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I', t, t);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t, t);
    END LOOP;
END;
$$;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- For anon role (frontend)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- For authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- For service role (Edge Functions)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

COMMENT ON SCHEMA public IS 'PercyTech SMS Hub Production Schema';
EOF

echo -e "  ${GREEN}✅${NC} Schema exported to: supabase/backups/dev_schema_${TIMESTAMP}.sql"
echo -e "  ${GREEN}✅${NC} Migration created: supabase/migrations/${TIMESTAMP}_initial_production.sql"

# Step 2: Link to production
echo ""
echo -e "${GREEN}Step 2: Linking to PercyTech production project...${NC}"
npx supabase link --project-ref "${PROD_PROJECT_REF}"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to link to production. Please check your project ref.${NC}"
    exit 1
fi

echo -e "  ${GREEN}✅${NC} Linked to PercyTech production"

# Step 3: Apply schema to production
echo ""
echo -e "${GREEN}Step 3: Applying schema to production database...${NC}"
echo -e "${YELLOW}This will create all necessary tables in production.${NC}"
read -p "Apply schema now? (yes/no): " apply_schema

if [ "$apply_schema" = "yes" ]; then
    npx supabase db push
    echo -e "  ${GREEN}✅${NC} Schema applied to production"
else
    echo -e "  ${YELLOW}⏭️${NC} Skipped - you can run 'npx supabase db push' later"
fi

# Step 4: Deploy Edge Functions
echo ""
echo -e "${GREEN}Step 4: Deploying Edge Functions to production...${NC}"
read -p "Deploy Edge Functions? (yes/no): " deploy_functions

if [ "$deploy_functions" = "yes" ]; then
    echo "  Deploying signup-native..."
    npx supabase functions deploy signup-native

    echo "  Deploying complete-signup..."
    npx supabase functions deploy complete-signup

    echo "  Deploying resend-verification..."
    npx supabase functions deploy resend-verification

    echo -e "  ${GREEN}✅${NC} Edge Functions deployed"
else
    echo -e "  ${YELLOW}⏭️${NC} Skipped Edge Functions deployment"
fi

# Step 5: Set production secrets
echo ""
echo -e "${GREEN}Step 5: Setting production environment variables...${NC}"
read -p "Set production secrets for Edge Functions? (yes/no): " set_secrets

if [ "$set_secrets" = "yes" ]; then
    echo "  Setting environment variables..."
    npx supabase secrets set ENVIRONMENT=production
    npx supabase secrets set PUBLIC_SITE_URL=https://gnymble.com
    npx supabase secrets set PUBLIC_APP_URL=https://app.gnymble.com
    npx supabase secrets set SKIP_EMAIL_CONFIRMATION=false
    npx supabase secrets set VERCEL_ENV=production

    echo -e "  ${GREEN}✅${NC} Production secrets configured"
    echo ""
    echo -e "${YELLOW}Don't forget to also set:${NC}"
    echo "  - STRIPE_SECRET_KEY (if using payments)"
    echo "  - RESEND_API_KEY (if using email)"
    echo "  - ZAPIER_SMS_WEBHOOK_URL (if using SMS)"
else
    echo -e "  ${YELLOW}⏭️${NC} Skipped secrets configuration"
fi

# Step 6: Switch back to development
echo ""
echo -e "${GREEN}Step 6: Switching back to development project...${NC}"
npx supabase link --project-ref "${DEV_PROJECT_REF}"

# Summary
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ PercyTech Production Setup Complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. ${BLUE}Configure PercyTech Supabase Authentication:${NC}"
echo "   - Go to Authentication → URL Configuration"
echo "   - Set Site URL: https://gnymble.com"
echo "   - Add Redirect URLs:"
echo "     • https://gnymble.com/verify-auth"
echo "     • https://app.gnymble.com"
echo ""
echo "2. ${BLUE}Update Vercel Environment Variables:${NC}"
echo "   Production:"
echo "   - VITE_SUPABASE_URL=https://${PROD_PROJECT_REF}.supabase.co"
echo "   - VITE_SUPABASE_ANON_KEY=[get from PercyTech API settings]"
echo ""
echo "3. ${BLUE}Test the signup flow:${NC}"
echo "   - Push to staging branch first"
echo "   - Test at staging.gnymble.com"
echo "   - Then deploy to production"
echo ""
echo -e "${GREEN}Your production database is ready! 🚀${NC}"