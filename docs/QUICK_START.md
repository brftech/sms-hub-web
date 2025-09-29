# SMS Hub Web - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- Playwright browsers (installed automatically)

### Initial Setup

```bash
# Clone and install
git clone <repository-url>
cd sms-hub-web
npm install --legacy-peer-deps

# Install Playwright browsers
npx playwright install --with-deps

# Set up environment
cp .env.local.example .env.local
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
- **Gnymble**: Hub ID 1 (default)
- **PercyMD**: Hub ID 2
- **PercyText**: Hub ID 3

### Authentication & Login

- **Development**: Login button redirects to `localhost:3001/login`
- **Production**: Login button redirects to `app.gnymble.com`
- **Admin Access**: Available at `/admin` route with password protection

### Hub Branding

- **PercyTech**: Red theme (Hub ID 0)
- **Gnymble**: Orange theme (Hub ID 1, default)
- **PercyMD**: Red theme (Hub ID 2)
- **PercyText**: Purple theme (Hub ID 3)

## 🛠️ Common Tasks

### Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:check  # Strict mode

# Code formatting
npm run format
npm run format:check

# Full build check
npm run build:check
```

### Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npx playwright test

# Run tests in watch mode
npm run test:watch

# E2E tests with UI
npm run test:e2e:ui
```

### Database Operations

```bash
# Generate types
supabase gen types typescript --project-id hmumtnpnyxuplvqcmnfk > packages/supabase/src/database.ts

# Run migrations
supabase db push
```

### Admin Dashboard Access

1. **Development**: Click red shield button in bottom-left corner
2. **Production**:
   - Visit site with `?admin=YOUR_ACCESS_CODE` parameter
   - Or click red shield button and enter access code when prompted
3. **Features**: View database statistics, manage leads with CRUD operations

## 🐛 Common Issues

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

### Console warnings in production

**Solution**: All console statements have been cleaned up - only `console.error` and `console.warn` are allowed

## 📁 Key Files

- `src/pages/AdminDashboard.tsx` - Admin dashboard with CRUD operations
- `src/pages/Contact.tsx` - Contact form with lead capture
- `src/components/FloatingAdminButton.tsx` - Admin access button
- `src/components/Navigation.tsx` - Navigation with environment-based login URLs
- `packages/supabase/src/database.ts` - Database types
- `supabase/functions/` - Edge Functions

## 🎯 Development Rules

1. **NO CSS files** - Use Tailwind CSS only
2. **Always include hub_id** in database operations
3. **Use import.meta.env** in Vite apps, not process.env
4. **Never expose service role key** in frontend
5. **Always handle errors** gracefully
6. **No console.log statements** - use console.error/warn only
7. **Follow TypeScript strict mode** - fix all type errors

## 📚 Documentation

- `docs/CLAUDE.md` - Complete development guide with latest changes
- `docs/ADMIN_DASHBOARD.md` - Admin dashboard documentation
- `docs/ENVIRONMENT_VARIABLES_CHECKLIST.md` - Environment setup guide
- `docs/PORT_ASSIGNMENTS.md` - Port configuration
- `docs/VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions

## 🔧 Environment Variables

```bash
# Development Environment Configuration
NODE_ENV=development
VERCEL_ENV=development

# Supabase Configuration (Development Database)
VITE_SUPABASE_URL=https://hmumtnpnyxuplvqcmnfk.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# App URLs (Local Development)
VITE_WEB_APP_URL=http://localhost:3000

# Public URLs for Edge Functions
PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_DEV_AUTH=true
VITE_ENABLE_HUB_SWITCHER=true

# Dev Authentication Token
VITE_DEV_AUTH_TOKEN=your-dev-auth-token

# Stripe Payment Links
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_28E5kF2Ag5jW9va1Ks3ZK0c
```

## 🎯 Current Status (January 2025)

### Recently Completed ✅

- **Console Cleanup**: Removed 55+ unnecessary console statements
- **Code Quality**: Zero TypeScript and ESLint errors
- **Login URL Updates**: Environment-based login routing
- **Admin Dashboard CRUD**: Full Create, Read, Update, Delete functionality for leads
- **Dynamic Database Connection**: web-dev in development, web-prod in production
- **Contact Form Fixes**: Consistent styling and proper hub branding
- **Environment Controls**: Debug panels and hub switcher hidden in production
- **Logo Standardization**: Consistent branding across all hubs
- **Accessibility Improvements**: Better contrast ratios and text visibility
- **Documentation Updates**: All docs reflect current architecture

### Development Status

- ✅ **Admin Dashboard**: Full CRUD operations with secure authentication
- ✅ **Contact Forms**: Consistent styling and proper branding
- ✅ **Environment Controls**: Proper dev/prod behavior
- ✅ **Logo Organization**: Standardized across all hubs
- ✅ **Accessibility**: Improved contrast and WCAG compliance
- ✅ **Type Safety**: Comprehensive with zero errors
- ✅ **Code Quality**: Clean codebase with proper error handling
- ✅ **Testing**: Comprehensive unit and E2E test coverage

**Status: PRODUCTION READY with Complete Admin Functionality!** 🚀

**Latest Achievement**: Clean, production-ready codebase with environment-based login routing and comprehensive testing.