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

- **PercyTech**: Hub ID 0 (red theme, technology focus)
- **Gnymble**: Hub ID 1 (orange theme, default)
- **PercyMD**: Hub ID 2 (red theme, medical focus)
- **PercyText**: Hub ID 3 (purple theme, text messaging focus)

### Authentication & Login

- **Development**: Login button redirects to `localhost:3001/login`
- **Production**: Login button redirects to `app.gnymble.com`
- **Admin Access**: Available at `/admin` route with password protection

### Subscription Tiers

The platform supports multiple subscription tiers with enforced limits:

- **Starter ($79/month)**: 200 SMS/month, 50 contacts, 1 user, 1 phone number, 10/min throughput, 1 segment
- **Core ($179/month)**: 1,500 SMS/month, 500 contacts, 3 users, 1 phone number, 40/min throughput, 3 segments
- **Elite ($349/month)**: 8,000 SMS/month, 3,000 contacts, unlimited users, 2 phone numbers, 200/min throughput, 8 segments, AI/Zapier
- **Enterprise**: 50,000+ SMS/month, all unlimited
- **VIP**: Unlimited everything, white-glove service

Limits are enforced via `getSubscriptionLimits()` in `packages/supabase/src/subscription-queries.ts`.

### Database Schema

The application uses a marketing-focused database schema with 15+ tables:

- **Core Tables**: `hubs`, `leads`, `email_subscribers`, `sms_subscribers`
- **Subscription Management**: `customers` table with subscription_tier and subscription_status
- **Lists**: `email_lists`, `sms_lists`
- **Campaigns**: `email_campaigns`, `sms_campaigns`, `marketing_campaigns`
- **Analytics**: `website_analytics`, `conversions`, `lead_activities`
- **User Management**: `user_profiles`, `verifications`, `verification_attempts`
- **Forms**: `contact_form_submissions`

See `docs/DATABASE_MIGRATION.sql` for complete schema.

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

# Test coverage
npm run test:coverage
```

### Database Operations

```bash
# Generate types from database
supabase gen types typescript --project-id hmumtnpnyxuplvqcmnfk > packages/supabase/src/database.ts

# Run migrations
supabase db push

# Create new migration
supabase migration new <migration_name>

# Link to development database
supabase link --project-ref hmumtnpnyxuplvqcmnfk

# Link to production database
supabase link --project-ref fwlivygerbqzowbzxesw
```

### Admin Dashboard Access

1. **Development**: Click red shield button in bottom-left corner
2. **Production**:
   - Visit site with `?admin=YOUR_ACCESS_CODE` parameter
   - Or click red shield button and enter access code when prompted
3. **Features**: 
   - View database statistics
   - Manage leads with full CRUD operations
   - Export data as JSON
   - Monitor recent activity

## 🐛 Common Issues

### "Process is not defined" Error
**Solution**: Use `import.meta.env` in Vite apps, not `process.env`

### Type errors after schema changes
**Solution**: Run `npm run type-check` and regenerate database types

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

### Import errors after UI optimization
**Solution**: Use optimized imports from `@sms-hub/ui/marketing` or `@sms-hub/ui/lean`

## 📁 Key Files

### Application Files
- `src/pages/AdminDashboard.tsx` - Admin dashboard with CRUD operations
- `src/pages/Contact.tsx` - Contact form with lead capture
- `src/components/FloatingAdminButton.tsx` - Admin access button
- `src/components/Navigation.tsx` - Navigation with environment-based login URLs
- `src/App.tsx` - Main application routing

### Package Files
- `packages/supabase/src/database.ts` - Database types
- `packages/hub-logic/src/index.ts` - Hub configurations
- `packages/ui/src/index.ts` - Full UI component library
- `packages/ui/src/index-marketing.ts` - Marketing-specific components
- `packages/ui/src/index-lean.ts` - Lean component imports

### Backend Files
- `supabase/functions/` - Edge Functions
- `supabase/migrations/` - Database migrations
- `docs/DATABASE_MIGRATION.sql` - Marketing schema migration

## 🎯 Development Rules

1. **NO CSS files** - Use Tailwind CSS only
2. **Always include hub_id** in database operations
3. **Use import.meta.env** in Vite apps, not process.env
4. **Never expose service role key** in frontend
5. **Always handle errors** gracefully
6. **No console.log statements** - use console.error/warn only
7. **Follow TypeScript strict mode** - fix all type errors
8. **Use optimized imports** - Import from specific paths when possible
9. **Test multi-tenant isolation** - Verify hub_id filtering works
10. **Document non-obvious code** - Add comments for complex logic
11. **Check subscription limits** - Enforce tier limits before operations
12. **Validate tier access** - Ensure features match subscription tier

## 📚 Documentation

- `docs/CLAUDE.md` - Complete development guide with latest changes
- `docs/README.md` - Documentation overview
- `docs/ADMIN_DASHBOARD.md` - Admin dashboard documentation
- `docs/ENVIRONMENT_VARIABLES_CHECKLIST.md` - Environment setup guide
- `docs/PORT_ASSIGNMENTS.md` - Port configuration
- `docs/VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions
- `docs/DATABASE_MIGRATION.sql` - Database migration script

## 🔧 Environment Variables

### Development (.env.local)

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

### Production (Vercel)

```bash
# Production Environment Configuration
NODE_ENV=production
VERCEL_ENV=production

# Supabase Configuration (Production Database)
VITE_SUPABASE_URL=https://fwlivygerbqzowbzxesw.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# App URLs (Production)
VITE_WEB_APP_URL=https://www.gnymble.com

# Public URLs for Edge Functions
PUBLIC_SITE_URL=https://www.gnymble.com

# Feature Flags (Production)
VITE_ENABLE_DEBUG=false
VITE_ENABLE_DEV_AUTH=false
VITE_ENABLE_HUB_SWITCHER=false

# Admin Access Code
VITE_ADMIN_ACCESS_CODE=your-secure-admin-code

# Stripe Payment Links
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/production-link
```

## 🎯 Current Status (September 30, 2025)

### Recently Completed ✅

#### Latest (September 30, 2025)
- **UI Optimization**: Lean import options for better bundle splitting
- **Database Migration**: Marketing-focused schema with 15+ tables
- **Import Patterns**: Optimized component imports, reduced bundle size
- **Documentation**: Complete overhaul with history and roadmap

#### Previous Milestones (January 2025)
- **Console Cleanup**: Removed 55+ unnecessary console statements
- **Code Quality**: Zero TypeScript and ESLint errors
- **Login URL Updates**: Environment-based login routing
- **Admin Dashboard CRUD**: Full Create, Read, Update, Delete functionality for leads
- **Dynamic Database Connection**: web-dev in development, web-prod in production
- **Contact Form Fixes**: Consistent styling and proper hub branding
- **Environment Controls**: Debug panels and hub switcher hidden in production
- **Logo Standardization**: Consistent branding across all hubs
- **Accessibility Improvements**: Better contrast ratios and text visibility
- **Testing Infrastructure**: Comprehensive unit and E2E test coverage

### Development Status

- ✅ **Admin Dashboard**: Full CRUD operations with secure authentication
- ✅ **Contact Forms**: Consistent styling and proper branding
- ✅ **Environment Controls**: Proper dev/prod behavior
- ✅ **Logo Organization**: Standardized across all hubs
- ✅ **Accessibility**: Improved contrast and WCAG compliance
- ✅ **Type Safety**: Comprehensive with zero errors
- ✅ **Code Quality**: Clean codebase with proper error handling
- ✅ **Testing**: Comprehensive unit and E2E test coverage
- ✅ **Performance**: Optimized bundle splitting and lazy loading
- ✅ **Database Schema**: Marketing-focused with migration script

### Upcoming Features (Roadmap)

#### Short Term (Q4 2025)
- [ ] Email marketing integration with Resend API
- [ ] SMS campaign management UI
- [ ] Analytics dashboard visualization
- [ ] Automated lead scoring
- [ ] A/B testing for landing pages

#### Medium Term (Q1-Q2 2026)
- [ ] Advanced audience segmentation
- [ ] Marketing automation workflows
- [ ] Third-party integrations (Zapier, Make)
- [ ] Custom reporting and exports
- [ ] Multi-language support (i18n)

#### Long Term (Q3-Q4 2026)
- [ ] AI-powered content generation
- [ ] Predictive analytics
- [ ] White label solution
- [ ] Native mobile apps
- [ ] API marketplace

**Status: PRODUCTION READY with Clear Roadmap!** 🚀

**Latest Achievement**: Optimized codebase with comprehensive documentation and clear future vision.

## 💡 Pro Tips

1. **Use TodoWrite**: Track complex multi-step tasks systematically
2. **Batch Tool Calls**: Run multiple operations in parallel for efficiency
3. **Check Patterns**: Look at existing code before implementing new features
4. **Test Edge Cases**: Always test empty states, errors, and loading states
5. **Mobile First**: Design and test on mobile screens first
6. **Document Decisions**: Add comments explaining non-obvious choices
7. **Clean Commits**: Make atomic commits with clear messages
8. **Environment Aware**: Always consider dev vs production behavior
9. **Type Safety**: Let TypeScript catch bugs early
10. **Bundle Size**: Monitor bundle size with `npm run build:analyze`

## 🚀 Next Steps

### For New Developers
1. Read `docs/CLAUDE.md` for complete overview
2. Complete initial setup above
3. Run all tests to verify setup
4. Review key files listed above
5. Try accessing admin dashboard

### For Experienced Developers
1. Review recent git commits for latest changes
2. Check `docs/DATABASE_MIGRATION.sql` for schema changes
3. Review optimized import patterns in `packages/ui/src/`
4. Explore upcoming features in roadmap
5. Consider contributing to documentation

---

**Last Updated**: September 30, 2025 | **Status**: Production Ready | **Version**: 0.1.0