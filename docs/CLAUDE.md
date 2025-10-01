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

## 📜 Historical Context: Project Evolution

### Phase 1: Monorepo Era (2024)

**Context**: Initial development phase

- Started as Turbo monorepo with multiple apps (web, unified, admin, user)
- Complex workspace configuration with shared packages
- Multiple Vercel deployments with configuration conflicts
- Overlapping functionality across apps created maintenance burden
- **Pain Points**: Slow deployments, difficult debugging, complex dependencies

### Phase 2: Migration & Consolidation (Late 2024 - Early 2025)

**Context**: Strategic simplification

- Recognized need for simplification and focus
- Migrated to standalone React application
- Consolidated admin dashboard into marketing site
- Removed legacy apps and streamlined architecture
- Achieved significant reduction in complexity
- **Benefits**: Faster deployments, easier debugging, clearer architecture

### Phase 3: Foundation & Maturity (January 2025)

**Context**: Production readiness

- **Week 1 (Jan 15-20)**: Complete monorepo migration, standalone architecture
- **Week 2 (Jan 21-25)**: Admin dashboard integration with full CRUD
- **Week 3 (Jan 26-28)**: Code quality (console cleanup, TypeScript strict mode)
- **Week 4 (Jan 29)**: Environment-based login, comprehensive testing
- **Week 5 (Jan 30)**: UI optimization planning, database research
- **Achievement**: Production-ready codebase with zero errors

### Phase 4: Optimization & Excellence (September - October 2025)

**Context**: Performance optimization, Sales Dashboard enhancement, and code simplification

**Recent Work (October 1, 2025)**:

1. **Sales Dashboard Enhancement**:
   - Rebranded Admin Dashboard to "Sales Dashboard"
   - Implemented hub-specific filtering for all data
   - Added hub-branded UI elements ("Add Lead" button with hub colors)
   - Improved layout with intuitive button placement
   - Minimized debug float by default for cleaner UI

2. **Code Simplification**:
   - Removed @sms-hub/logger package (~1,000 lines eliminated)
   - Replaced with simple console.log/error for marketing site
   - Reduced bundle size and complexity
   - Maintained clean build with zero errors

**Previous Work (September 30, 2025)**:

1. **UI Optimization**:
   - Fixed missing exports in `packages/ui/src/index-marketing.ts`
   - Added HubSwitcher, Badge, Sidebar components to marketing bundle
   - Corrected type exports (HubType vs Hub)
   - Implemented lean import patterns

2. **Build Quality**:
   - Achieved successful typecheck with zero errors
   - Clean lint with zero warnings
   - Production build: 302KB → 91KB gzipped (main bundle)
   - 27 optimized chunks with route-based code splitting

3. **Documentation Excellence**:
   - Complete restructure of all documentation files
   - Clear history → present → future narrative
   - Specific accomplishments for each phase
   - Comprehensive roadmap with timelines

4. **Database Planning**:
   - Created DATABASE_MIGRATION.sql with 15+ tables
   - Marketing-focused schema (email/SMS campaigns, analytics)
   - Migration path from customer management to marketing

### Key Lessons Learned

1. **Simplicity Wins**: Standalone app is easier to maintain than monorepo
2. **Consolidation Over Separation**: Integrated admin dashboard works better than separate app
3. **Type Safety Pays Off**: Strict TypeScript catches bugs before runtime
4. **Testing Provides Confidence**: Comprehensive tests enable faster iteration
5. **Documentation Is Investment**: Clear docs save time and enable collaboration
6. **Optimization Is Iterative**: Bundle optimization happens in phases, not all at once

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
│   │   ├── index.ts          # Full UI library
│   │   ├── index-marketing.ts # Marketing-optimized (TODAY'S WORK)
│   │   └── index-lean.ts      # Minimal imports
│   ├── hub-logic/    # Hub configuration and branding
│   ├── supabase/     # Supabase client and types
│   └── utils/        # Utility functions
├── supabase/
│   ├── functions/    # Edge Functions (submit-contact, etc.)
│   └── migrations/   # Database migrations
├── test/             # Test files
│   ├── unit/        # Unit tests
│   ├── e2e/         # E2E tests
│   └── integration/ # Integration tests
├── docs/            # Comprehensive documentation
│   ├── DATABASE_MIGRATION.sql # Created today
│   └── [other docs]
├── public/           # Static assets (logos, favicons)
└── dist/            # Production build output
```

## 🎯 Current Status (October 1, 2025)

### Production Status: ✅ **FULLY OPERATIONAL & OPTIMIZED**

#### Core Features (Production Deployed)

- ✅ **Multi-Hub Marketing Site**: 4 distinct business brands
- ✅ **Sales Dashboard**: Hub-filtered CRUD operations with branded UI
- ✅ **Contact Forms**: Lead capture with Supabase Edge Functions
- ✅ **Authentication**: Environment-based login routing
- ✅ **Responsive Design**: Mobile-first with Tailwind CSS

#### Technical Excellence (Verified)

- ✅ **Zero TypeScript Errors**: Strict mode fully compliant
- ✅ **Zero ESLint Warnings**: Code quality checks passed
- ✅ **Clean Production Build**: No console warnings
- ✅ **Optimized Performance**: 91KB gzipped main bundle (down from 302KB)
- ✅ **Comprehensive Testing**: Vitest + Playwright coverage
- ✅ **Security**: Proper auth, data isolation, secure keys
- ✅ **Simplified Codebase**: Removed unnecessary logger package (~1,000 lines)

#### Recent Accomplishments (October 1, 2025)

**Sales Dashboard Enhancement**:

- ✅ Rebranded to "Sales Dashboard" with sales-focused UI
- ✅ Hub-specific data filtering (leads, subscribers, campaigns)
- ✅ Branded "Add Lead" button with hub-specific colors
- ✅ Improved layout with optimized button placement
- ✅ Minimized debug float by default

**Code Simplification**:

- ✅ Removed @sms-hub/logger package entirely (~1,000 lines)
- ✅ Replaced with simple console.log/error for marketing site
- ✅ Reduced bundle size and code complexity
- ✅ Maintained clean build with zero errors

**Previous (September 30, 2025)**:

- ✅ Fixed all TypeScript export errors
- ✅ Optimized bundle with lean imports
- ✅ Created marketing-focused migration script
- ✅ Comprehensive documentation updates

### Application Flow

1. **Web App (port 3000)**: Marketing website with Sales Dashboard
   - Landing pages for each hub (Gnymble, PercyMD, PercyText, PercyTech)
   - Contact forms with lead capture functionality
   - Pricing pages with Stripe integration
   - Sales Dashboard with hub-filtered database access and CRUD operations
   - Hub-specific branding and theming
   - Floating debug panel (development only, minimized by default)
   - Floating hub switcher (development only)
   - Floating admin button with access code authentication
   - Environment-based login routing

2. **Sales Dashboard Flow**:

   ```
   Marketing Site → Admin Access Code → Sales Dashboard → Hub-Filtered Data Management
   ```

3. **Login Flow**:
   ```
   Development: Login Button → localhost:3001/login
   Production: Login Button → app.gnymble.com
   ```

## 🚀 Future Roadmap

### Short Term (Q4 2025) - Foundation Enhancement

- [ ] **Email Marketing Integration**: Connect campaigns to Resend API
- [ ] **SMS Campaign Management**: Build campaign creation/tracking UI
- [ ] **Analytics Dashboard**: Visualize analytics and conversions
- [ ] **Lead Scoring**: Automated scoring based on engagement
- [ ] **A/B Testing**: Landing page variant testing

### Medium Term (Q1-Q2 2026) - Advanced Features

- [ ] **Advanced Segmentation**: Audience segments for targeting
- [ ] **Marketing Automation**: Drip campaigns and workflows
- [ ] **Integration Hub**: Third-party marketing tools (Zapier, Make)
- [ ] **Custom Reports**: Advanced reporting and exports
- [ ] **Multi-Language**: International expansion with i18n

### Long Term (Q3-Q4 2026) - Innovation & Scale

- [ ] **AI-Powered Features**: Content generation and optimization
- [ ] **Advanced Analytics**: Predictive analytics and LTV
- [ ] **White Label**: Allow customer white-labeling
- [ ] **Mobile Apps**: Native iOS/Android apps
- [ ] **API Marketplace**: Ecosystem of integrations

### Infrastructure Goals (Ongoing)

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
const supabase = createClient(envConfig.supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### 6. Console Statements (STRICT)

```typescript
// ❌ NEVER do this
console.log("Debug info");

// ✅ ALLOWED for error logging
console.error("Error occurred:", error);
console.warn("Warning message");
```

### 7. Optimized Imports (NEW - September 30, 2025)

```typescript
// ❌ AVOID - Imports entire UI library
import { Button, Card } from "@sms-hub/ui";

// ✅ BETTER - Use marketing-optimized bundle
import { Button, Card } from "@sms-hub/ui/marketing";

// ✅ BEST - Direct imports for critical paths
import { Button } from "@sms-hub/ui/components/button";
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

### Missing Component Exports (Fixed Today)

**Solution**: Components now properly exported from `@sms-hub/ui/marketing`

### Type Export Errors (Fixed Today)

**Solution**: Use `HubType` instead of `Hub` for type imports

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
- `/packages/ui/src/index-marketing.ts` - Marketing-optimized components
- `/src/App.tsx` - Main routing
- `/src/pages/AdminDashboard.tsx` - Sales Dashboard with hub-filtered CRUD
- `/src/pages/Contact.tsx` - Contact form
- `/src/components/Navigation.tsx` - Navigation with environment-based login
- `/.env.local` - Environment variables

### Documentation

- `docs/ADMIN_DASHBOARD.md` - Sales Dashboard documentation
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
13. **PREFER** optimized imports from `@sms-hub/ui/marketing` (NEW)

## 🎯 Architecture Principles

1. **Separation of Concerns**: Marketing vs Admin functionality
2. **Code Reusability**: Shared packages for common functionality
3. **Type Safety**: Full TypeScript coverage with strict mode
4. **Performance**: Optimized builds and lazy loading
5. **Security**: Proper authentication and data isolation
6. **Maintainability**: Clear structure, consistent patterns
7. **Scalability**: Modular architecture, efficient data queries
8. **Code Quality**: Clean codebase with zero warnings
9. **Bundle Optimization**: Strategic imports and code splitting (NEW)

## 💡 Pro Tips

1. **Use TodoWrite tool**: Track complex tasks systematically
2. **Batch tool calls**: Run multiple operations in parallel
3. **Check existing patterns**: Look at similar code before implementing
4. **Test edge cases**: Empty states, errors, loading states
5. **Consider mobile**: All interfaces must be responsive
6. **Document decisions**: Add comments for non-obvious choices
7. **Clean code**: Remove console statements and fix linting issues
8. **Environment awareness**: Consider dev vs production behavior
9. **Optimize imports**: Use `@sms-hub/ui/marketing` for better bundles (NEW)
10. **Monitor bundle size**: Run `npm run build:analyze` regularly (NEW)

## 🔄 Recent Changes

### September 30, 2025 (Today - Current)

**UI Optimization & Documentation Excellence**

- Fixed missing component exports (HubSwitcher, Badge, Sidebar)
- Corrected type exports (HubType vs Hub)
- Achieved zero TypeScript/ESLint errors
- Production build: 91KB gzipped main bundle
- Created DATABASE_MIGRATION.sql with 15+ tables
- Complete documentation overhaul with clear history → present → future
- All dates updated to September 30, 2025

### January 2025

**Foundation & Production Readiness**

- Console Cleanup: Removed 55+ unnecessary statements
- Login URL Updates: Environment-based routing
- Code Quality: Zero TypeScript/ESLint errors
- Testing Infrastructure: Vitest + Playwright
- Admin Dashboard: Full CRUD operations

### Late 2024 - Early 2025

**Migration & Consolidation**

- Migration: Monorepo to standalone app
- Consolidation: Integrated admin dashboard
- Architecture: Simplified deployment
- Type Safety: Comprehensive TypeScript coverage

## 🎯 Current State Summary

**Status**: ✅ **PRODUCTION READY & OPTIMIZED** - Mature, well-documented, production-deployed

**Today's Achievement**: ✅ **BUILD OPTIMIZATION & DOCUMENTATION EXCELLENCE** - UI optimization complete, comprehensive documentation, zero errors

**Key Strengths**:

- Clean, maintainable codebase (zero errors/warnings)
- Optimized performance (91KB gzipped main bundle)
- Comprehensive testing coverage (unit + E2E)
- Clear historical context and future vision
- Strong multi-tenant architecture
- Production-proven reliability
- Complete documentation suite

The SMS Hub Web application is a mature, production-ready React application with comprehensive documentation, clear roadmap, strong foundation for future growth, and optimized performance achieved through strategic import patterns and bundle splitting.

---

**Last Updated**: October 1, 2025 | **Version**: 0.1.0 | **Status**: Production Ready & Optimized
