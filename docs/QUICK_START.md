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

- **Web App**: http://localhost:3000 (marketing website with admin dashboard)
- **Admin Dashboard**: Access via admin access code (set in Vercel environment variables)
- **Development Mode**: Debug panels and hub switcher automatically visible

## 🔑 Key Concepts

### Hub System

- **PercyTech**: Hub ID 0
- **Gnymble**: Hub ID 1
- **PercyMD**: Hub ID 2
- **PercyText**: Hub ID 3

### Admin Access

- **Development**: Admin dashboard automatically accessible
- **Production**: Requires admin access code for authentication
- **Token Expiration**: 24-hour authentication tokens
- **Security**: Access codes removed from URL after authentication

### Hub Branding

- **PercyTech**: Red theme (Hub ID 0)
- **Gnymble**: Orange theme (Hub ID 1, default)
- **PercyMD**: Red theme (Hub ID 2)
- **PercyText**: Purple theme (Hub ID 3)

## 🛠️ Common Tasks

### Type Checking

```bash
npm run type-check
```

### Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npx playwright test

# Run tests in watch mode
npm run test:watch
```

### Database Operations

```bash
# Generate types
supabase gen types typescript --project-id vgpovgpwqkjnpnrjelyg > packages/supabase/src/types.ts

# Run migrations
supabase db push
```

### Admin Dashboard Access

1. **Development**: Click red shield button in bottom-left corner
2. **Production**:
   - Visit site with `?admin=YOUR_ACCESS_CODE` parameter
   - Or click red shield button and enter access code when prompted
3. **Features**: View database statistics, manage leads with CRUD operations

## 🐛 Common Issues (Updated)

### "Process is not defined" Error

**Solution**: Use `import.meta.env` in Vite apps, not `process.env`

### Type errors after schema changes

**Solution**: Run `npm run type-check` and update service files

### "Admin access code not working"

**Solution**: Verify `VITE_ADMIN_ACCESS_CODE` is set in Vercel environment variables

### Contact form styling issues

**Solution**: Check Tailwind CSS classes and hub-specific color configurations

### "Debug panels showing in production"

**Solution**: Verify environment detection - panels should be hidden in production

### Build failures

**Solution**: Run `npm run type-check` and `npm run lint` to identify issues

## 📁 Key Files

- `src/pages/AdminDashboard.tsx` - Admin dashboard with CRUD operations
- `src/pages/Contact.tsx` - Contact form with lead capture
- `src/components/FloatingAdminButton.tsx` - Admin access button
- `packages/supabase/src/types/database.ts` - Database types
- `supabase/functions/` - Edge Functions

## 🎯 Development Rules

1. **NO CSS files** - Use Tailwind CSS only
2. **Always include hub_id** in database operations
3. **Use import.meta.env** in Vite apps, not process.env
4. **Never expose service role key** in frontend
5. **Always handle errors** gracefully

## 📚 Documentation (Updated)

- `docs/CLAUDE.md` - Complete development guide with latest changes
- `docs/ADMIN_DASHBOARD.md` - Admin dashboard documentation
- `docs/ENVIRONMENT_VARIABLES_CHECKLIST.md` - Environment setup guide
- `docs/PORT_ASSIGNMENTS.md` - Port configuration
- `docs/VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions

## 🔧 Environment Variables

```bash
# Required for web app
VITE_SUPABASE_URL=https://hmumtnpnyxuplvqcmnfk.supabase.co  # web-dev
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# Admin access
VITE_ADMIN_ACCESS_CODE=[your-secure-admin-code]

# Stripe integration (optional)
VITE_STRIPE_PAYMENT_LINK=[your-stripe-payment-link]
VITE_STRIPE_PAYMENT_LINK_STARTER=[starter-plan-link]
VITE_STRIPE_PAYMENT_LINK_CORE=[core-plan-link]
VITE_STRIPE_PAYMENT_LINK_ELITE=[elite-plan-link]
```

## 🎯 Current Status (December 2024)

### Recently Completed ✅

- **Admin Dashboard CRUD**: Full Create, Read, Update, Delete functionality for leads
- **Dynamic Database Connection**: web-dev in development, web-prod in production
- **Contact Form Fixes**: Consistent styling and proper hub branding
- **Environment Controls**: Debug panels and hub switcher hidden in production
- **Logo Standardization**: Consistent branding across all hubs
- **Accessibility Improvements**: Better contrast ratios and text visibility
- **Code Quality**: Zero TypeScript and ESLint errors
- **Documentation Updates**: All docs reflect current architecture

### Development Status

- ✅ **Admin Dashboard**: Full CRUD operations with secure authentication
- ✅ **Contact Forms**: Consistent styling and proper branding
- ✅ **Environment Controls**: Proper dev/prod behavior
- ✅ **Logo Organization**: Standardized across all hubs
- ✅ **Accessibility**: Improved contrast and WCAG compliance
- ✅ **Type Safety**: Comprehensive with zero errors

**Status: PRODUCTION READY with Complete Admin Functionality!** 🚀

**Latest Achievement**: Admin dashboard with full CRUD operations and dynamic database connections implemented.
