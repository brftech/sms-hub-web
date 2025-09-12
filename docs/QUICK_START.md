# SMS Hub - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account and project
- Stripe account (for payments)
- Zapier account (for SMS)

### Initial Setup
```bash
# Clone and install
git clone <repository-url>
cd sms-hub-monorepo
pnpm install

# Set up environment
cp .env.example .env.local
# Add your Supabase and other API keys

# Start development
pnpm dev
```

### Access Points
- **Web App**: http://localhost:3000 (marketing, auth)
- **Unified App**: http://localhost:3001 (main app)
- **Superadmin**: http://localhost:3001/?superadmin=dev123

## 🔑 Key Concepts

### Hub System
- **PercyTech**: Hub ID 0
- **Gnymble**: Hub ID 1  
- **PercyMD**: Hub ID 2
- **PercyText**: Hub ID 3

### User Roles
- **User**: Basic SMS functionality
- **Admin**: Company management
- **Superadmin**: Cross-hub access

### Authentication
- **Real Auth**: superadmin@gnymble.com / SuperAdmin123!
- **Dev Mode**: Add `?superadmin=dev123` to URL

## 🛠️ Common Tasks

### Type Checking
```bash
pnpm type-check
```

### Database Operations
```bash
# Generate types
supabase gen types typescript --project-id vgpovgpwqkjnpnrjelyg > packages/types/src/database-comprehensive.ts

# Run migrations
supabase db push
```

### Clean Up Data
1. Go to admin dashboard
2. Scroll to "Data Cleanup" section
3. Click "Preview Cleanup" to see what would be deleted
4. Click "Execute Cleanup" to delete payment track data

## 🐛 Common Issues

### "Multiple GoTrueClient instances"
**Solution**: Use `getSupabaseClient()` singleton

### Type errors after schema changes
**Solution**: Run `pnpm type-check` and update service files

### SMS not working
**Solution**: Check Zapier webhook configuration

### Payment issues
**Solution**: Verify Stripe configuration and webhook setup

## 📁 Key Files

- `apps/web/src/pages/Signup.tsx` - User signup
- `apps/unified/src/pages/admin/Dashboard.tsx` - Admin dashboard
- `packages/types/src/database-comprehensive.ts` - Database types
- `supabase/functions/` - Edge Functions

## 🎯 Development Rules

1. **NO CSS files** - Use styled-components only
2. **Always include hub_id** in database operations
3. **Use import.meta.env** in Vite apps, not process.env
4. **Never expose service role key** in frontend
5. **Always handle errors** gracefully

## 📚 Documentation

- `CLAUDE.md` - Complete development guide
- `docs/ONBOARDING_FLOW.md` - User journey documentation
- `docs/ARCHITECTURE_STATUS.md` - Current architecture
- `docs/PROJECT_SUMMARY.md` - Comprehensive overview

## 🔧 Environment Variables

```bash
# Required for all apps
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# Development
VITE_DEVELOPMENT_MODE=true
VITE_DEV_AUTH_TOKEN=dev123

# Edge Functions
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
ZAPIER_SMS_WEBHOOK_URL=[your-zapier-webhook]
RESEND_API_KEY=[your-resend-key]
STRIPE_SECRET_KEY=[your-stripe-key]
```

## 🎯 Current Status

- ✅ **Schema Alignment**: Complete
- ✅ **Type Safety**: Comprehensive
- ✅ **Payment Track Cleanup**: Implemented
- 🚧 **UI Component Updates**: In progress
- 🚧 **Error Handling**: Improvements needed

**Ready for development!** 🚀
