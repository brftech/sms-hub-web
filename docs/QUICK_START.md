# SMS Hub Web - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- Zapier account (for SMS)

### Initial Setup
```bash
# Clone and install
git clone <repository-url>
cd sms-hub-web
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env.development
# Add your Supabase and other API keys

# Start development
npm run dev
```

### Access Points
- **Web App**: http://localhost:3000 (marketing and auth gateway)
- **Development Superadmin**: http://localhost:3000/?superadmin=dev123
- **Protected Superadmin Accounts**:
  - superadmin@percytech.com (protected from deletion)
  - superadmin@gnymble.com (protected from deletion)

## 🔑 Key Concepts

### Hub System
- **PercyTech**: Hub ID 0
- **Gnymble**: Hub ID 1  
- **PercyMD**: Hub ID 2
- **PercyText**: Hub ID 3

### User Roles (Fixed Hierarchy)
- **User**: Basic SMS functionality (corrected from MEMBER role)
- **Onboarded**: Full access after completing onboarding
- **Admin**: Company management with **global view default**
- **Superadmin**: Cross-hub access with **account protection**

### Authentication (Enhanced)
- **Magic Link Auth**: Enhanced signup flow prevents session carryover
- **Protected Superadmin Access**: 
  - superadmin@percytech.com (protected from deletion)
  - superadmin@gnymble.com (protected from deletion)
- **Development Mode**: Add `?superadmin=dev123` to URL (bypass auth)
- **B2B/B2C Support**: Comprehensive account creation for both business models
- **Enhanced Security**: Proper session isolation and validation

## 🛠️ Common Tasks

### Type Checking
```bash
npm run type-check
```

### Database Operations
```bash
# Generate types
supabase gen types typescript --project-id vgpovgpwqkjnpnrjelyg > packages/supabase/src/types.ts

# Run migrations
supabase db push
```

### Clean Up Data (Enhanced Protection)
1. Go to admin dashboard (defaults to **global view**)
2. Scroll to "Data Cleanup" section
3. Click "Preview Cleanup" to see what would be deleted
4. Click "Execute Cleanup" to delete payment track data
5. **Protected accounts** (superadmin@percytech.com, superadmin@gnymble.com) are automatically preserved
6. **Delete buttons disabled** for protected accounts in user management

## 🐛 Common Issues (Updated)

### "Magic link authentication failed"
**Solution**: Clear browser storage, ensure proper session isolation, avoid mixing auth methods

### "Incorrect role assignment (MEMBER instead of USER)"
**Solution**: **FIXED** - Edge Functions now properly assign USER role

### "Multiple GoTrueClient instances"
**Solution**: Use `getSupabaseClient()` singleton in Unified app

### Type errors after schema changes
**Solution**: Run `pnpm type-check` and update service files

### "Superadmin account deletion blocked"
**Solution**: **WORKING AS INTENDED** - Protected accounts cannot be deleted

### SMS not working
**Solution**: Check Zapier webhook configuration and Edge Function logs

### Payment issues
**Solution**: Verify Stripe configuration, webhook setup, and enhanced validation logic

### "Session carryover between users"
**Solution**: **FIXED** - Magic link authentication prevents this issue

## 📁 Key Files

- `src/pages/Signup.tsx` - User signup
- `src/pages/Login.tsx` - User login
- `packages/supabase/src/types.ts` - Database types
- `supabase/functions/` - Edge Functions

## 🎯 Development Rules

1. **NO CSS files** - Use styled-components only
2. **Always include hub_id** in database operations
3. **Use import.meta.env** in Vite apps, not process.env
4. **Never expose service role key** in frontend
5. **Always handle errors** gracefully

## 📚 Documentation (Updated)

- `CLAUDE.md` - Complete development guide with latest changes
- `docs/ONBOARDING_FLOW.md` - User journey with **magic link authentication**
- `docs/ARCHITECTURE_STATUS.md` - Current architecture with **security enhancements**
- `docs/PROJECT_SUMMARY.md` - Comprehensive overview with **recent improvements**
- `docs/ENVIRONMENT_VARIABLES_CHECKLIST.md` - Environment setup guide
- `docs/PORT_ASSIGNMENTS.md` - Port configuration with **recent updates**

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

## 🎯 Current Status (September 2025)

### Recently Completed ✅
- **Magic Link Authentication**: Prevents session carryover, enhanced security
- **Role Management Fix**: USER role correctly assigned (was MEMBER)
- **Superadmin Protection**: Account deletion prevention implemented
- **B2B/B2C Enhancement**: Comprehensive account creation support
- **Global View Default**: Admin dashboard improved UX
- **UI Improvements**: Responsive design and better user experience
- **Enhanced Edge Functions**: Comprehensive validation and error handling
- **Schema Alignment**: Complete with type safety
- **Payment Track Cleanup**: Implemented with protection

### Development Status
- ✅ **Authentication & Security**: Enhanced and production-ready
- ✅ **Role Management**: Fixed and working correctly
- ✅ **Account Protection**: Superadmin accounts protected
- ✅ **UI/UX**: Responsive and improved
- ✅ **Type Safety**: Comprehensive
- ✅ **Database**: Aligned with enhanced validation

**Status: PRODUCTION READY with Enhanced Security!** 🚀

**Latest Achievement**: Magic link authentication, role fixes, and comprehensive security enhancements implemented.
