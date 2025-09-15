#!/bin/bash

# SMS Hub Database Sync Script
# Syncs schema and data between development and production databases

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configurations
DEV_PROJECT="vgpovgpwqkjnpnrjelyg"
PROD_PROJECT="howjinnvvtvaufihwers"
PASSWORD="Ali1dog2@@##"

echo -e "${BLUE}🔄 SMS Hub Database Sync Process${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
if ! command_exists npx; then
    print_error "npx not found. Please install Node.js and npm."
    exit 1
fi

if ! command_exists psql; then
    print_warning "psql not found. Some operations may not work."
fi

print_status "Prerequisites check complete"
echo ""

# Function to sync migrations
sync_migrations() {
    echo -e "${BLUE}📦 Syncing migrations...${NC}"
    
    # Link to dev and push migrations
    echo "Linking to development database..."
    npx supabase link --project-ref $DEV_PROJECT --password "$PASSWORD" --yes
    
    echo "Pushing migrations to development..."
    npx supabase db push --include-all --yes
    
    # Link to prod and push migrations
    echo "Linking to production database..."
    npx supabase link --project-ref $PROD_PROJECT --password "$PASSWORD" --yes
    
    echo "Pushing migrations to production..."
    npx supabase db push --include-all --yes
    
    print_status "Migrations synced successfully"
}

# Function to sync Edge Functions
sync_functions() {
    echo -e "${BLUE}⚡ Syncing Edge Functions...${NC}"
    
    # Deploy to development
    echo "Deploying to development..."
    npx supabase link --project-ref $DEV_PROJECT --password "$PASSWORD" --yes
    npx supabase functions deploy signup-native create-user create-account verify-payment create-checkout-session delete-account check-superadmin validate-invitation resend-verification login-native complete-signup stripe-webhook
    
    # Deploy to production
    echo "Deploying to production..."
    npx supabase link --project-ref $PROD_PROJECT --password "$PASSWORD" --yes
    npx supabase functions deploy signup-native create-user create-account verify-payment create-checkout-session delete-account check-superadmin validate-invitation resend-verification login-native complete-signup stripe-webhook
    
    print_status "Edge Functions synced successfully"
}

# Function to create superadmin in production
create_superadmin() {
    echo -e "${BLUE}👤 Creating superadmin in production...${NC}"
    
    # Link to production
    npx supabase link --project-ref $PROD_PROJECT --password "$PASSWORD" --yes
    
    echo "Creating superadmin auth user..."
    # This will need to be done manually in Supabase Dashboard
    echo "Please go to: https://supabase.com/dashboard/project/$PROD_PROJECT/auth/users"
    echo "Create a user with email: superadmin@percytech.com"
    echo "Then run: npx supabase db push --include-all"
    
    read -p "Press Enter after creating the auth user..."
    
    echo "Running superadmin migration..."
    npx supabase db push --include-all --yes
    
    print_status "Superadmin created successfully"
}

# Function to verify sync
verify_sync() {
    echo -e "${BLUE}🔍 Verifying sync...${NC}"
    
    # Check dev database
    echo "Checking development database..."
    npx supabase link --project-ref $DEV_PROJECT --password "$PASSWORD" --yes
    echo "Dev database linked: ✅"
    
    # Check prod database
    echo "Checking production database..."
    npx supabase link --project-ref $PROD_PROJECT --password "$PASSWORD" --yes
    echo "Prod database linked: ✅"
    
    print_status "Sync verification complete"
}

# Main menu
show_menu() {
    echo -e "${BLUE}Choose an option:${NC}"
    echo "1) Sync migrations only"
    echo "2) Sync Edge Functions only"
    echo "3) Sync everything (migrations + functions)"
    echo "4) Create superadmin in production"
    echo "5) Verify sync status"
    echo "6) Full sync (migrations + functions + superadmin)"
    echo "0) Exit"
    echo ""
    read -p "Enter your choice [0-6]: " choice
}

# Main execution
main() {
    case $1 in
        "migrations")
            sync_migrations
            ;;
        "functions")
            sync_functions
            ;;
        "superadmin")
            create_superadmin
            ;;
        "verify")
            verify_sync
            ;;
        "full")
            sync_migrations
            sync_functions
            create_superadmin
            verify_sync
            ;;
        *)
            show_menu
            case $choice in
                1) sync_migrations ;;
                2) sync_functions ;;
                3) 
                    sync_migrations
                    sync_functions
                    ;;
                4) create_superadmin ;;
                5) verify_sync ;;
                6)
                    sync_migrations
                    sync_functions
                    create_superadmin
                    verify_sync
                    ;;
                0) 
                    echo "Goodbye!"
                    exit 0
                    ;;
                *)
                    print_error "Invalid option"
                    exit 1
                    ;;
            esac
            ;;
    esac
}

# Run main function
main "$@"
