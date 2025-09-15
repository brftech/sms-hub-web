#!/bin/bash

# SMS Hub - Remote Development Script
# This script starts the development environment using remote Supabase databases only

echo "🚀 Starting SMS Hub Development Environment (Remote Supabase Only)"
echo "🔧 Development Database: vgpovgpwqkjnpnrjelyg.supabase.co"
echo "🌐 Production Database: howjinnvvtvaufihwers.supabase.co"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Please create it with your Supabase credentials."
    echo "📋 Copy from REMOTE_SETUP.md and update with your keys."
    echo ""
    echo "Required environment variables:"
    echo "  VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co"
    echo "  VITE_SUPABASE_ANON_KEY=your_dev_anon_key_here"
    echo "  VITE_UNIFIED_APP_URL=http://localhost:3001"
    echo "  VITE_WEB_APP_URL=http://localhost:3000"
    echo ""
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v npx supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Link to development database
echo "🔗 Linking to development database..."
npx supabase link --project-ref vgpovgpwqkjnpnrjelyg --password 'Ali1dog2@@##' --no-verify-ssl

if [ $? -ne 0 ]; then
    echo "❌ Failed to link to development database"
    echo "💡 Make sure you have the correct password and project access"
    exit 1
fi

echo "✅ Successfully linked to development database"
echo ""

# Start the development servers
echo "🔧 Starting development servers..."
echo "📱 Web App: http://localhost:3000"
echo "🔐 Unified App: http://localhost:3001"
echo "📚 API Docs: http://localhost:3002"
echo ""
echo "🔗 Supabase Dashboards:"
echo "   Development: https://supabase.com/dashboard/project/vgpovgpwqkjnpnrjelyg"
echo "   Production: https://supabase.com/dashboard/project/howjinnvvtvaufihwers"
echo ""

# Start the development servers
pnpm dev
