# Claude Code Agent Instructions - SMS Hub Web

## 🚀 Project Overview

You are working on **SMS Hub Web**, a standalone React application that serves as a marketing website with admin dashboard functionality. This is a production-ready platform with multi-hub support for different business brands.

### Core Architecture

- **Standalone React App**: Marketing website with contact forms, pricing, and admin dashboard
- **Database**: Supabase (PostgreSQL) with web-dev and web-prod environments
- **Authentication**: Admin access via access codes and 24-hour tokens
- **Frontend**: React 19 + Vite + TypeScript with Tailwind CSS + styled-components
- **Backend**: Supabase Edge Functions for contact form handling
- **Multi-tenancy**: 4 distinct business hubs with isolated branding and data
- **Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 📜 Historical Context

### Project Evolution

**Phase 1: Monorepo Era (2024)**
- Started as Turbo monorepo with multiple apps (web, unified, admin, user)
- Complex workspace configuration with shared packages
- Multiple Vercel deployments with configuration conflicts
- Overlapping functionality across apps created maintenance burden

**Phase 2: Migration & Consolidation (Late 2024 - Early 2025)**
- Recognized need for simplification and focus
- Migrated to standalone React application
- Consolidated admin dashboard into marketing site
- Removed legacy apps and streamlined architecture
- Achieved significant reduction in complexity

**Phase 3: Optimization & Maturity (January 2025)**
- Code quality improvements (zero TypeScript/ESLint errors)
- Console cleanup (removed 55+ unnecessary statements)
- Environment-based login routing
- Comprehensive testing infrastructure
- Admin dashboard with full CRUD operations

**Phase 4: Current State (September 30, 2025)**
- UI optimization with lean import patterns
- Database migration to marketing-focused schema
- Bundle size optimization and performance improvements
- Documentation overhaul with historical context
- Production-ready with clear future roadmap

### Key Lessons Learned

1. **Simplicity Wins**: Standalone app is easier to maintain than monorepo
2. **Consolidation**: Integrated admin dashboard works better than separate app
3. **Type Safety**: Strict TypeScript catches bugs early
4. **Testing**: Comprehensive tests provide confidence in changes
5. **Documentation**: Clear docs are essential for team coordination

## 📁 Project Structure

```
sms-hub-web/
├── src/
│   ├── components/     # React components (Navigation, Footer, etc.)
│   ├── pages/         # Page components (Home, Contact, Pricing, etc.)
│   ├── services/      # API services (contactService, etc.)
│   ├── config/        # Configuration (environment, webEnvironment)
│   └── lib/          # Utilities
├── packages/
│   ├── ui/           # Shared UI components and styling
│   ├── hub-logic/    # Hub configuration and branding
│   ├── supabase/     # Supabase client and types
│   ├── utils/        # Utility functions
│   └── logger/       # Logging utilities
├── supabase/
│   ├── functions/    # Edge Functions (submit-contact, etc.)
│   └── migrations/   # Database migrations
├── test/             # Test files
│   ├── unit/        # Unit tests
│   ├── e2e/         # E2E tests
│   └── integration/ # Integration tests
├── public/           # Static assets (logos, favicons)
└── docs/             # Documentation
```

## 🎯 Current Status (September 30, 2025)

### Production Status: ✅ **FULLY OPERATIONAL**

#### Core Features (Complete)
- ✅ **Multi-Hub Marketing Site**: 4 distinct business brands
- ✅ **Admin Dashboard**: Full CRUD operations for leads
- ✅ **Contact Forms**: Lead capture with Supabase Edge Functions
- ✅ **Authentication**: Environment-based login routing
- ✅ **Responsive Design**: Mobile-first with Tailwind CSS

#### Technical Excellence (Achieved)
- ✅ **Zero Errors**: TypeScript and ESLint fully compliant
- ✅ **Clean Code**: No console warnings, strict mode enabled
- ✅ **Comprehensive Testing**: Vitest + Playwright coverage
- ✅ **Performance**: Optimized bundle splitting
- ✅ **Security**: Proper auth, data isolation, secure keys

#### Recent Accomplishments (September 30, 2025)
- ✅ **UI Optimization**: Lean import options for better bundle splitting
- ✅ **Database Migration**: Marketing-focused schema with 15+ tables
- ✅ **Import Patterns**: Optimized component imports, reduced bundle size
- ✅ **Documentation**: Complete overhaul with history and roadmap

### Application Flow

1. **Web App (port 3000)**: Marketing website with admin dashboard
   - Landing pages for each hub (Gnymble, PercyMD, PercyText, PercyTech)
   - Contact forms with lead capture functionality
   - Pricing pages with Stripe integration
   - Admin dashboard with database access and CRUD operations
   - Hub-specific branding and theming
   - Floating debug panel (development only)
   - Floating hub switcher (development only)
   - Floating admin button with access code authentication
   - Environment-based login routing

2. **Admin Dashboard Flow**:
   ```
   Marketing Site → Admin Access Code → Admin Dashboard → Database Management
   ```

3. **Login Flow**:
   ```
   Development: Login Button → localhost:3001/login
   Production: Login Button → app.gnymble.com
   ```

## 🚀 Future Roadmap

### Short Term (Q4 2025)
- [ ] **Email Marketing Integration**: Connect campaigns to Resend API
- [ ] **SMS Campaign Management**: Build campaign creation/tracking UI
- [ ] **Analytics Dashboard**: Visualize analytics and conversions
- [ ] **Lead Scoring**: Automated scoring based on engagement
- [ ] **A/B Testing**: Landing page variant testing

### Medium Term (Q1-Q2 2026)
- [ ] **Advanced Segmentation**: Audience segments for targeting
- [ ] **Marketing Automation**: Drip campaigns and workflows
- [ ] **Integration Hub**: Third-party marketing tools (Zapier, Make)
- [ ] **Custom Reports**: Advanced reporting and exports
- [ ] **Multi-Language**: International expansion with i18n

### Long Term (Q3-Q4 2026)
- [ ] **AI-Powered Features**: Content generation and optimization
- [ ] **Advanced Analytics**: Predictive analytics and LTV
- [ ] **White Label**: Allow customer white-labeling
- [ ] **Mobile Apps**: Native iOS/Android apps
- [ ] **API Marketplace**: Ecosystem of integrations

### Infrastructure Goals
- [ ] **Performance**: <2s page load globally
- [ ] **Scalability**: 100k+ leads per hub
- [ ] **Reliability**: 99.9% uptime SLA
- [ ] **Security**: SOC 2 compliance
- [ ] **Developer Experience**: Improved tooling

## 🔑 Critical Implementation Details

### 1. Multi-Tenancy (ALWAYS Required)

```typescript
// WRONG - Missing hub_id
await supabase.from("leads").insert({ name: "John" });

// CORRECT - Always include hub_id
await supabase.from("leads").insert({
  name: "John",
  hub_id: hubConfig.hubNumber, // Required for data isolation
});
```

### 2. Hub IDs Reference

- **PercyTech**: 0 (red theme)
- **Gnymble**: 1 (orange theme, default)
- **PercyMD**: 2 (red theme)
- **PercyText**: 3 (purple theme)

### 3. Styling Rules (STRICT)

```typescript
// ❌ NEVER do this
import "./styles.css";
import styles from "./Component.module.css";

// ✅ ALWAYS use Tailwind CSS with hub-specific classes
import { getHubColorClasses } from "@sms-hub/utils";
const hubColors = getHubColorClasses(currentHub);
```

### 4. Environment Variables

```typescript
// ❌ WRONG in Vite apps
process.env.VITE_SUPABASE_URL;

// ✅ CORRECT in Vite apps
import.meta.env.VITE_SUPABASE_URL;
```

### 5. Supabase Client Usage

```typescript
// Use environment configuration for dynamic connections
import { getEnvironmentConfig } from "../config/environment";
const envConfig = getEnvironmentConfig();
const supabase = createClient(
  envConfig.supabaseUrl,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 6. Console Statements (STRICT)

```typescript
// ❌ NEVER do this
console.log("Debug info");

// ✅ ALLOWED for error logging
console.error("Error occurred:", error);
console.warn("Warning message");
```

## 🛠️ Development Workflow

### Port Assignments

- **Web App**: 3000 (marketing, contact forms, admin dashboard)

### Starting the Development Environment

```bash
# Install dependencies
npm install --legacy-peer-deps

# Install Playwright browsers
npx playwright install --with-deps

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Run E2E tests
npx playwright test

# Build for production
npm run build

# Full build check
npm run build:check
```

### Database Operations

```bash
# Generate TypeScript types from database
npx supabase gen types typescript --project-id hmumtnpnyxuplvqcmnfk > packages/supabase/src/database.ts

# Run migrations
npx supabase db push

# Create new migration
npx supabase migration new <migration_name>
```

## 🐛 Common Issues & Solutions

### "Process is not defined" Error
**Solution**: Use `import.meta.env` in Vite apps, not `process.env`

### Type Errors After Schema Changes
**Solution**: Run `npm run type-check` to identify mismatches, then update service files

### "Foreign key constraint" Database Errors
**Solution**: Ensure proper order of operations and all required fields

### CSS Import Errors
**Solution**: Use Tailwind CSS with hub-specific color classes

### Admin Dashboard Access Issues
**Solution**: Check environment variables for `VITE_ADMIN_ACCESS_CODE` in Vercel

### Console Warnings in Production
**Solution**: All console statements have been cleaned up - only console.error and console.warn are allowed

### Login Button Redirects to Wrong URL
**Solution**: Login URLs are now environment-based - production redirects to app.gnymble.com, dev to localhost:3001

## 🔐 Security Guidelines

### Frontend Security (CRITICAL)

1. **NEVER expose service role key in frontend**
   ```typescript
   // ❌ WRONG - Security breach!
   const supabase = createClient(url, SERVICE_ROLE_KEY);

   // ✅ CORRECT - Use anon key only
   const supabase = createClient(url, ANON_KEY);
   ```

2. **Admin operations must use proper authentication**
   - Admin dashboard requires access code
   - 24-hour token expiration
   - Production restrictions

3. **Environment-specific behavior**
   - Development: Debug panels and hub switcher visible
   - Production: Admin access only via access code

## 🚀 Deployment & Development Commands

### Quick Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod --yes
```

### Database Management

```bash
# Development database
Project: web-dev
ID: hmumtnpnyxuplvqcmnfk

# Production database (web-prod)
Project: web-prod
ID: fwlivygerbqzowbzxesw

# Switch between databases
supabase link --project-ref [ID]
```

## 🚦 Testing & Quality Assurance

### Before Committing Code

1. Run type checking: `npm run type-check`
2. Run linting: `npm run lint`
3. Run tests: `npm run test`
4. Run E2E tests: `npx playwright test`
5. Test contact form functionality
6. Verify admin dashboard access
7. Check responsive design
8. Verify hub-specific branding

### Admin Dashboard Testing

- **Access**: Use access code in production
- **Development**: Automatic access in dev mode
- **CRUD Operations**: Test create, read, update, delete for leads
- **Data Isolation**: Verify hub-specific data separation

## 📚 Important Resources

### Key Files

- `/packages/supabase/src/database.ts` - Database schema
- `/packages/hub-logic/src/index.ts` - Hub configurations
- `/src/App.tsx` - Main routing
- `/src/pages/AdminDashboard.tsx` - Admin dashboard
- `/src/pages/Contact.tsx` - Contact form
- `/src/components/Navigation.tsx` - Navigation with environment-based login
- `/.env.local` - Environment variables

### Documentation

- `docs/ADMIN_DASHBOARD.md` - Admin dashboard documentation
- `docs/README.md` - Documentation overview
- `docs/QUICK_START.md` - Quick start guide
- `docs/VERCEL_DEPLOYMENT_GUIDE.md` - Deployment guide
- `docs/DATABASE_MIGRATION.sql` - Database migration script
- `supabase/migrations/` - Database schema evolution
- `packages/ui/src/` - Component library examples

## ⚠️ Critical Rules - NEVER Break These

1. **NEVER** create CSS files - use Tailwind CSS only
2. **NEVER** forget hub_id in database operations
3. **NEVER** use process.env in browser code
4. **NEVER** expose API keys in client code
5. **NEVER** modify database without migrations
6. **ALWAYS** handle errors gracefully
7. **ALWAYS** maintain type safety
8. **ALWAYS** consider multi-tenant data isolation
9. **ALWAYS** use environment-specific behavior
10. **ALWAYS** test admin access in production
11. **NEVER** use console.log - use console.error/warn only
12. **ALWAYS** follow TypeScript strict mode

## 🎯 Architecture Principles

1. **Separation of Concerns**: Marketing vs Admin functionality
2. **Code Reusability**: Shared packages for common functionality
3. **Type Safety**: Full TypeScript coverage with strict mode
4. **Performance**: Optimized builds and lazy loading
5. **Security**: Proper authentication and data isolation
6. **Maintainability**: Clear structure, consistent patterns
7. **Scalability**: Modular architecture, efficient data queries
8. **Code Quality**: Clean codebase with zero warnings

## 💡 Pro Tips

1. **Use TodoWrite tool**: Track complex tasks systematically
2. **Batch tool calls**: Run multiple operations in parallel
3. **Check existing patterns**: Look at similar code before implementing
4. **Test edge cases**: Empty states, errors, loading states
5. **Consider mobile**: All interfaces must be responsive
6. **Document decisions**: Add comments for non-obvious choices
7. **Clean code**: Remove console statements and fix linting issues
8. **Environment awareness**: Consider dev vs production behavior

## 🔄 Recent Changes

### September 30, 2025 (Current)
- **UI Optimization**: Lean import options, reduced bundle size
- **Database Migration**: Marketing-focused schema with 15+ tables
- **Documentation**: Complete overhaul with history and roadmap
- **Import Patterns**: Optimized component imports

### January 2025
- **Console Cleanup**: Removed 55+ unnecessary statements
- **Login URL Updates**: Environment-based routing
- **Code Quality**: Zero TypeScript/ESLint errors
- **Testing Infrastructure**: Vitest + Playwright
- **Admin Dashboard**: Full CRUD operations

### Late 2024 - Early 2025
- **Migration**: Monorepo to standalone app
- **Consolidation**: Integrated admin dashboard
- **Architecture**: Simplified deployment
- **Type Safety**: Comprehensive TypeScript coverage

## 🎯 Current State Summary

**Status**: ✅ **PRODUCTION READY** - Mature, well-documented, production-deployed

**Latest Achievement**: ✅ **OPTIMIZED & DOCUMENTED** - UI optimization, database migration, complete documentation overhaul

**Key Strengths**:
- Clean, maintainable codebase
- Comprehensive testing coverage
- Clear historical context and future vision
- Strong multi-tenant architecture
- Production-proven reliability

The SMS Hub Web application is a mature, production-ready React application with comprehensive documentation, clear roadmap, and strong foundation for future growth.

---

**Last Updated**: September 30, 2025 | **Version**: 0.1.0 | **Status**: Production Ready