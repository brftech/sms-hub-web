# Claude Code Agent Instructions - SMS Hub Web

## 🚀 Project Overview

You are working on **SMS Hub Web**, a standalone React application that serves as a marketing website with admin dashboard functionality. This is a production-ready platform with multi-hub support for different business brands.

### Core Architecture

- **Standalone React App**: Marketing website with contact forms, pricing, and admin dashboard
- **Database**: Supabase (PostgreSQL) with web-dev and web-prod environments
- **Authentication**: Admin access via access codes and 24-hour tokens
- **Frontend**: React 19 + Vite + TypeScript with Tailwind CSS
- **Backend**: Supabase Edge Functions for contact form handling
- **Multi-tenancy**: 4 distinct business hubs with isolated branding and data

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

2. **Admin Dashboard Flow**:
   ```
   Marketing Site → Admin Access Code → Admin Dashboard → Database Management
   ```

### Recent Major Updates (December 2024)

#### Latest Enhancements (Current)

- ✅ **Admin Dashboard**: Full CRUD functionality for leads management
- ✅ **Dynamic Supabase Connection**: web-dev in dev, web-prod in production
- ✅ **Contact Form Fixes**: Consistent styling and proper branding
- ✅ **Environment Controls**: Debug and hub selector hidden in production
- ✅ **Landing Page Cleanup**: Removed unused Landing and CigarLanding pages
- ✅ **Logo Organization**: Consolidated and standardized all hub logos
- ✅ **Accessibility Fixes**: Improved contrast ratios and WCAG compliance

#### Completed Foundation (Previous)

- ✅ **Standalone Architecture**: Migrated from monorepo to focused web app
- ✅ **Hub System**: Multi-brand support with isolated data and branding
- ✅ **Admin Authentication**: Secure access code system with token expiration
- ✅ **Database Integration**: Dynamic connection to appropriate Supabase project
- ✅ **Type Safety**: Comprehensive TypeScript coverage

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

## 🛠️ Development Workflow

### Port Assignments

- **Web App**: 3000 (marketing, contact forms, admin dashboard)

### Starting the Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

### Database Operations

```bash
# Generate TypeScript types from database
npx supabase gen types typescript --project-id vgpovgpwqkjnpnrjelyg > packages/supabase/src/types/database.ts

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
vercel --yes

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

### Current Status (December 2024)

1. ✅ **Admin Dashboard**: Complete with CRUD functionality for leads
2. ✅ **Contact Form**: Fixed styling and branding consistency
3. ✅ **Environment Controls**: Proper dev/prod behavior
4. ✅ **Logo Organization**: Standardized across all hubs
5. ✅ **Accessibility**: Improved contrast and WCAG compliance
6. ✅ **Landing Pages**: Cleaned up unused components

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
3. Test contact form functionality
4. Verify admin dashboard access
5. Check responsive design
6. Verify hub-specific branding

### Admin Dashboard Testing

- **Access**: Use access code in production
- **Development**: Automatic access in dev mode
- **CRUD Operations**: Test create, read, update, delete for leads
- **Data Isolation**: Verify hub-specific data separation

## 📚 Important Resources

### Key Files

- `/packages/supabase/src/types/database.ts` - Database schema
- `/packages/hub-logic/src/index.ts` - Hub configurations
- `/src/App.tsx` - Main routing
- `/src/pages/AdminDashboard.tsx` - Admin dashboard
- `/src/pages/Contact.tsx` - Contact form
- `/.env.local` - Environment variables

### Documentation

- `docs/ADMIN_DASHBOARD.md` - Admin dashboard documentation
- `docs/README.md` - Documentation overview
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

## 🎯 Architecture Principles

1. **Separation of Concerns**: Marketing vs Admin functionality
2. **Code Reusability**: Shared packages for common functionality
3. **Type Safety**: Full TypeScript coverage with strict mode
4. **Performance**: Optimized builds and lazy loading
5. **Security**: Proper authentication and data isolation
6. **Maintainability**: Clear structure, consistent patterns
7. **Scalability**: Modular architecture, efficient data queries

## 💡 Pro Tips

1. **Use TodoWrite tool**: Track complex tasks systematically
2. **Batch tool calls**: Run multiple operations in parallel
3. **Check existing patterns**: Look at similar code before implementing
4. **Test edge cases**: Empty states, errors, loading states
5. **Consider mobile**: All interfaces must be responsive
6. **Document decisions**: Add comments for non-obvious choices

## 🔄 Recent Changes (Last Updated: 2024-12-29)

### Latest Updates (December 29, 2024)

1. **Admin Dashboard CRUD**:

   - Full Create, Read, Update, Delete functionality for leads
   - Dynamic Supabase connection (web-dev/web-prod)
   - 24-hour authentication tokens
   - Hub-specific data isolation

2. **Contact Form Improvements**:

   - Fixed message field background (white instead of black)
   - Improved "Why We're Different" section visibility
   - Consistent styling across all form elements
   - Proper hub branding on submit button

3. **Environment Controls**:

   - Debug panel and hub switcher hidden in production
   - Proper development vs production behavior
   - Admin button with secure access code system

4. **Code Quality**:

   - Fixed all TypeScript and ESLint errors
   - Removed unused imports and components
   - Clean build process with no warnings

5. **Testing Infrastructure**:

   - Added Playwright for E2E testing
   - Comprehensive hub context tests
   - Complete test coverage (unit + E2E)
   - Proper mocking for environment, storage, and DOM adapters

6. **Documentation Updates**:
   - Updated all documentation to reflect current architecture
   - Removed outdated monorepo references
   - Added current deployment and development instructions
   - Updated testing documentation

## 🎯 Current State Summary (December 2024)

**Status**: ✅ **PRODUCTION READY** - Standalone marketing website with admin dashboard fully functional.

**Latest Achievement**: ✅ **COMPREHENSIVE TESTING SUITE** - Complete test coverage with Vitest (unit) + Playwright (E2E) + comprehensive hub context tests.

**Previous Achievements**:

- ✅ **CONTACT FORM FIXES** - Consistent styling and proper branding
- ✅ **ENVIRONMENT CONTROLS** - Proper dev/prod behavior
- ✅ **LOGO ORGANIZATION** - Standardized across all hubs
- ✅ **ACCESSIBILITY IMPROVEMENTS** - Better contrast and WCAG compliance

### Key Improvements Completed

1. **Admin Dashboard**: Full CRUD operations with dynamic Supabase connections
2. **Contact Form**: Consistent styling and proper hub branding
3. **Environment Controls**: Debug/hub selector hidden in production
4. **Logo Standardization**: Consistent branding across all hubs
5. **Accessibility**: Improved contrast ratios and text visibility
6. **Code Quality**: Zero TypeScript/ESLint errors
7. **Documentation**: Updated to reflect current architecture

The SMS Hub Web platform has successfully evolved into a robust, maintainable marketing website with comprehensive admin functionality, proper security measures, and excellent user experience. The foundation is solid for continued development and scaling.

Remember: You're working on a **production system**. Every change should maintain or improve stability, performance, and user experience. When in doubt, analyze thoroughly before making changes.
