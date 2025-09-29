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

## 🏗️ Current Architecture & Status

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

### Recent Major Updates (January 2025)

#### Latest Enhancements (Current)

- ✅ **Console Cleanup**: Removed 55+ unnecessary console statements
- ✅ **Code Quality**: Zero TypeScript and ESLint errors
- ✅ **Login URL Updates**: Environment-based login routing
- ✅ **Admin Dashboard**: Full CRUD functionality for leads management
- ✅ **Dynamic Supabase Connection**: web-dev in dev, web-prod in production
- ✅ **Contact Form Fixes**: Consistent styling and proper branding
- ✅ **Environment Controls**: Debug and hub selector hidden in production
- ✅ **Logo Organization**: Consolidated and standardized all hub logos
- ✅ **Accessibility Fixes**: Improved contrast ratios and WCAG compliance

#### Completed Foundation (Previous)

- ✅ **Standalone Architecture**: Migrated from monorepo to focused web app
- ✅ **Hub System**: Multi-brand support with isolated data and branding
- ✅ **Admin Authentication**: Secure access code system with token expiration
- ✅ **Database Integration**: Dynamic connection to appropriate Supabase project
- ✅ **Type Safety**: Comprehensive TypeScript coverage
- ✅ **Testing Infrastructure**: Complete test coverage with Vitest + Playwright

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

- **PercyTech**: 0
- **Gnymble**: 1 (default)
- **PercyMD**: 2
- **PercyText**: 3

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

## 📋 Current Tasks & Priorities

### Current Status (January 2025)

1. ✅ **Console Cleanup**: Removed 55+ unnecessary console statements
2. ✅ **Code Quality**: Zero TypeScript and ESLint errors
3. ✅ **Login URL Updates**: Environment-based login routing
4. ✅ **Admin Dashboard**: Complete with CRUD functionality for leads
5. ✅ **Contact Form**: Fixed styling and branding consistency
6. ✅ **Environment Controls**: Proper dev/prod behavior
7. ✅ **Logo Organization**: Standardized across all hubs
8. ✅ **Accessibility**: Improved contrast and WCAG compliance
9. ✅ **Testing Infrastructure**: Complete test coverage

### Development Focus

- **Current**: All major features implemented and working
- **Short Term**: Continued refinements and performance optimization
- **Long Term**: Additional marketing features and analytics

### Technical Debt

- Monitor admin dashboard performance
- Optimize bundle sizes
- Consider additional marketing features

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

## 🔄 Recent Changes (Last Updated: 2025-01-29)

### Latest Updates (January 29, 2025)

1. **Console Cleanup**:
   - Removed 55+ unnecessary console statements
   - Updated ESLint config to allow console.error/warn
   - Clean production builds with zero warnings

2. **Login URL Updates**:
   - Environment-based login routing
   - Production: app.gnymble.com
   - Development: localhost:3001/login

3. **Code Quality Improvements**:
   - Zero TypeScript and ESLint errors
   - Fixed React Hook dependencies with useCallback
   - Clean codebase with proper error handling

4. **Testing Infrastructure**:
   - Added Playwright for E2E testing
   - Comprehensive hub context tests
   - Complete test coverage (unit + E2E)
   - Proper mocking for environment, storage, and DOM adapters

5. **Documentation Updates**:
   - Updated all documentation to reflect current architecture
   - Removed outdated monorepo references
   - Added current deployment and development instructions
   - Updated testing documentation

## 🎯 Current State Summary (January 2025)

**Status**: ✅ **PRODUCTION READY** - Standalone marketing website with admin dashboard fully functional.

**Latest Achievement**: ✅ **CLEAN CODEBASE** - Zero console warnings, strict TypeScript, comprehensive testing, and environment-based login routing.

**Previous Achievements**:

- ✅ **CONSOLE CLEANUP** - Removed 55+ unnecessary console statements
- ✅ **LOGIN URL UPDATES** - Environment-based login routing
- ✅ **CODE QUALITY** - Zero TypeScript and ESLint errors
- ✅ **TESTING INFRASTRUCTURE** - Complete test coverage with Vitest + Playwright
- ✅ **CONTACT FORM FIXES** - Consistent styling and proper branding
- ✅ **ENVIRONMENT CONTROLS** - Proper dev/prod behavior
- ✅ **LOGO ORGANIZATION** - Standardized across all hubs
- ✅ **ACCESSIBILITY IMPROVEMENTS** - Better contrast and WCAG compliance

### Key Improvements Completed

1. **Console Cleanup**: Removed all unnecessary console statements
2. **Login URL Updates**: Environment-based login routing
3. **Code Quality**: Zero TypeScript and ESLint errors
4. **Admin Dashboard**: Full CRUD operations with dynamic Supabase connections
5. **Contact Form**: Consistent styling and proper hub branding
6. **Environment Controls**: Debug/hub selector hidden in production
7. **Logo Standardization**: Consistent branding across all hubs
8. **Accessibility**: Improved contrast ratios and text visibility
9. **Testing**: Comprehensive unit and E2E test coverage
10. **Documentation**: Updated all docs to reflect current architecture

The SMS Hub Web application is now a clean, production-ready React application with comprehensive testing, proper code quality, and environment-based functionality.