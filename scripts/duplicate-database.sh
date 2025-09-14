#!/bin/bash

# Script to duplicate Supabase database from development to production
# Copies schema and optionally initial data (excluding test users)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}       Supabase Database Duplication Tool${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Configuration
DEV_PROJECT_REF="vgpovgpwqkjnpnrjelyg"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Check for required environment variables or arguments
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo -e "${RED}❌ Missing required arguments${NC}"
    echo ""
    echo "Usage: ./scripts/duplicate-database.sh <dev-password> <prod-project-ref> <prod-password>"
    echo ""
    echo "Example: ./scripts/duplicate-database.sh 'DevPass123!' 'abc123xyz' 'ProdPass456!'"
    echo ""
    echo "You can find passwords in Supabase Dashboard → Settings → Database"
    exit 1
fi

DEV_PASSWORD="$1"
PROD_PROJECT_REF="$2"
PROD_PASSWORD="$3"

# Database URLs
DEV_DB_URL="postgresql://postgres:${DEV_PASSWORD}@db.${DEV_PROJECT_REF}.supabase.co:5432/postgres"
PROD_DB_URL="postgresql://postgres:${PROD_PASSWORD}@db.${PROD_PROJECT_REF}.supabase.co:5432/postgres"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo -e "  Development Project: ${BLUE}${DEV_PROJECT_REF}${NC}"
echo -e "  Production Project:  ${GREEN}${PROD_PROJECT_REF}${NC}"
echo ""

# Step 1: Test connections
echo -e "${GREEN}🔌 Step 1: Testing database connections...${NC}"

# Test dev connection
echo -n "  Testing development database... "
if psql "${DEV_DB_URL}" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    echo -e "${RED}Failed to connect to development database${NC}"
    exit 1
fi

# Test prod connection
echo -n "  Testing production database... "
if psql "${PROD_DB_URL}" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    echo -e "${RED}Failed to connect to production database${NC}"
    exit 1
fi

# Step 2: Create backups
echo ""
echo -e "${GREEN}💾 Step 2: Creating backups...${NC}"
mkdir -p supabase/backups

# Backup dev schema
echo "  Backing up development schema..."
pg_dump "${DEV_DB_URL}" \
    --schema-only \
    --no-owner \
    --no-privileges \
    --exclude-schema=auth \
    --exclude-schema=storage \
    --exclude-schema=supabase_functions \
    > "supabase/backups/dev_schema_${TIMESTAMP}.sql"

echo -e "  ${GREEN}✅${NC} Schema backup saved"

# Step 3: Ask about data migration
echo ""
echo -e "${YELLOW}📊 Step 3: Data Migration Options${NC}"
echo "  1. Schema only (recommended for production)"
echo "  2. Schema + lookup data (hubs, configs, etc.)"
echo "  3. Schema + all data (including test users)"
echo ""
read -p "Select option (1-3): " DATA_OPTION

# Step 4: Export from development
echo ""
echo -e "${GREEN}📤 Step 4: Exporting from development...${NC}"

case $DATA_OPTION in
    1)
        echo "  Exporting schema only..."
        pg_dump "${DEV_DB_URL}" \
            --schema-only \
            --no-owner \
            --no-privileges \
            --exclude-schema=auth \
            --exclude-schema=storage \
            --exclude-schema=supabase_functions \
            --exclude-schema=realtime \
            --exclude-schema=_analytics \
            --exclude-schema=_realtime \
            > "supabase/temp_export.sql"
        ;;
    2)
        echo "  Exporting schema + lookup data..."
        # Export schema first
        pg_dump "${DEV_DB_URL}" \
            --schema-only \
            --no-owner \
            --no-privileges \
            --exclude-schema=auth \
            --exclude-schema=storage \
            --exclude-schema=supabase_functions \
            --exclude-schema=realtime \
            --exclude-schema=_analytics \
            --exclude-schema=_realtime \
            > "supabase/temp_export.sql"

        # Add specific lookup data
        echo "" >> "supabase/temp_export.sql"
        echo "-- Lookup Data" >> "supabase/temp_export.sql"

        # Export hub configurations if they exist
        psql "${DEV_DB_URL}" -t -A -c \
            "SELECT 'INSERT INTO hubs VALUES (' ||
             string_agg(quote_literal(hub_id) || ',' || quote_literal(hub_name), ');INSERT INTO hubs VALUES (') ||
             ');' FROM hubs;" >> "supabase/temp_export.sql" 2>/dev/null || true
        ;;
    3)
        echo "  Exporting schema + all data..."
        echo -e "${YELLOW}  ⚠️  Warning: This includes test users and data!${NC}"
        pg_dump "${DEV_DB_URL}" \
            --no-owner \
            --no-privileges \
            --exclude-schema=auth \
            --exclude-schema=storage \
            --exclude-schema=supabase_functions \
            --exclude-schema=realtime \
            --exclude-schema=_analytics \
            --exclude-schema=_realtime \
            > "supabase/temp_export.sql"
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo -e "  ${GREEN}✅${NC} Export complete"

# Step 5: Clean production (optional)
echo ""
echo -e "${YELLOW}🧹 Step 5: Prepare production database${NC}"
read -p "Clean existing production tables? (yes/no): " CLEAN_PROD

if [ "$CLEAN_PROD" = "yes" ]; then
    echo "  Cleaning production database..."
    psql "${PROD_DB_URL}" << EOF
-- Drop all tables in public schema (cascade)
DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END\$\$;
EOF
    echo -e "  ${GREEN}✅${NC} Production cleaned"
fi

# Step 6: Import to production
echo ""
echo -e "${GREEN}📥 Step 6: Importing to production...${NC}"
echo "  Applying schema and data..."

# Apply the export
psql "${PROD_DB_URL}" < "supabase/temp_export.sql" 2>&1 | grep -v "NOTICE" | grep -v "already exists" || true

echo -e "  ${GREEN}✅${NC} Import complete"

# Step 7: Set up Edge Functions
echo ""
echo -e "${GREEN}🚀 Step 7: Deploy Edge Functions${NC}"
read -p "Deploy Edge Functions to production? (yes/no): " DEPLOY_FUNCTIONS

if [ "$DEPLOY_FUNCTIONS" = "yes" ]; then
    echo "  Linking to production project..."
    npx supabase link --project-ref "${PROD_PROJECT_REF}"

    echo "  Deploying functions..."
    npx supabase functions deploy signup-native
    npx supabase functions deploy complete-signup
    npx supabase functions deploy resend-verification

    echo "  Setting production secrets..."
    npx supabase secrets set ENVIRONMENT=production
    npx supabase secrets set PUBLIC_SITE_URL=https://gnymble.com
    npx supabase secrets set PUBLIC_APP_URL=https://app.gnymble.com
    npx supabase secrets set SKIP_EMAIL_CONFIRMATION=false

    echo -e "  ${GREEN}✅${NC} Edge Functions deployed"

    # Switch back to dev
    echo "  Switching back to development..."
    npx supabase link --project-ref "${DEV_PROJECT_REF}"
fi

# Step 8: Cleanup
echo ""
echo -e "${GREEN}🧹 Step 8: Cleaning up temporary files...${NC}"
rm -f supabase/temp_export.sql
echo -e "  ${GREEN}✅${NC} Cleanup complete"

# Summary
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Database duplication complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update Vercel environment variables:"
echo "   - VITE_SUPABASE_URL=https://${PROD_PROJECT_REF}.supabase.co"
echo "   - VITE_SUPABASE_ANON_KEY=[get from Supabase dashboard]"
echo ""
echo "2. Configure authentication in Supabase Dashboard:"
echo "   - Set Site URL to https://gnymble.com"
echo "   - Add redirect URLs"
echo ""
echo "3. Test the signup flow in staging first"
echo ""
echo -e "${BLUE}Backup saved to:${NC} supabase/backups/dev_schema_${TIMESTAMP}.sql"