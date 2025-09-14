# Claude Code Agent Instructions - SMS Hub Monorepo

## 🚀 Project Overview

You are working on a **multi-tenant B2B SMS SaaS platform** built as a Turbo monorepo. This is a production-ready platform that provides SMS messaging services to multiple business hubs with distinct branding and features.

### Core Architecture

- **Monorepo Structure**: Turbo + pnpm workspaces for efficient builds and dependency management
- **Database**: Supabase (PostgreSQL) with (currently fully disabled) Row Level Security (RLS)
- **Authentication**: **Magic link authentication** with enhanced security and session isolation
- **Frontend**: React + Vite + TypeScript with styled-components
- **Backend**: Supabase Edge Functions (primarily) + Nest.js API (in the future for texting)
- **Multi-tenancy**: 4 distinct business hubs with isolated data

## 📁 Project Structure

```
sms-hub-monorepo/
├── apps/
│   ├── web/          # Marketing & landing pages (port 3000)
│   ├── unified/      # Main authenticated app (port 3001)
│   └── api/          # API documentation
├── packages/
│   ├── ui/           # Shared React components
│   ├── types/        # TypeScript type definitions
│   ├── config/       # Shared configurations
│   ├── supabase/     # Supabase client & utilities
│   ├── utils/        # Shared utilities
│   ├── hub-logic/    # Hub-specific business logic
│   ├── services/     # Shared service layer
│   └── dev-auth/     # Development authentication
└── supabase/
    ├── functions/    # Edge Functions
    └── migrations/   # Database migrations
```

## 🏗️ Current Architecture & Status

### Application Flow

1. **Web App (port 3000)**: Public-facing marketing site
   - Landing pages for each hub (Gnymble, PercyMD, PercyText, PercyTech)
   - Lead capture forms with **enhanced B2B/B2C support**
   - **Magic link authentication** gateway (login/signup)
   - **Proper session isolation** when redirecting to Unified app

2. **Unified App (port 3001)**: Main authenticated application
   - Consolidated dashboard for all authenticated users
   - **Fixed role-based access control** (USER, ONBOARDED, ADMIN, SUPERADMIN)
   - **Global view default** for admin dashboard
   - Hub-specific features and branding
   - Admin dashboard with **protected account management** and data cleanup tools
   - **Superadmin protection** (delete buttons disabled for protected accounts)

3. **Enhanced Authentication Flow**:
   ```
   Web App (Magic Link) → Enhanced Supabase Auth → Unified App (Dashboard)
   ```

### Recent Major Updates (September 2025)

#### Latest Enhancements (Current)

- ✅ **Magic Link Authentication**: Fixed signup flow to prevent session carryover issues
- ✅ **Role Management Fix**: Corrected USER role assignment (was incorrectly MEMBER)
- ✅ **Superadmin Protection**: Delete buttons disabled for protected accounts (superadmin@percytech.com, superadmin@gnymble.com)
- ✅ **Global View Default**: Admin dashboard now defaults to global view instead of PercyTech hub
- ✅ **B2B/B2C Enhancement**: Comprehensive account creation support via updated Edge Functions
- ✅ **UI Improvements**: Responsive payment track cards, "Onboarding Submissions" → "Onboarding"
- ✅ **Enhanced Edge Functions**: Updated signup-native and delete-account with comprehensive validation

#### Completed Foundation (Previous)

- ✅ **Schema Alignment**: Fixed all type mismatches between database and TypeScript
- ✅ **Payment Track Cleanup**: Added dashboard tools to clean payment data while preserving superadmin
- ✅ **Database Migration**: Cleaned up company/customer schema redundancy
- ✅ **Type Safety**: Comprehensive TypeScript type checking across all packages
- ✅ **Service Layer**: Updated all services to use correct database schema

## 🔑 Critical Implementation Details

### 1. Multi-Tenancy (ALWAYS Required)

```typescript
// WRONG - Missing hub_id
await supabase.from("contacts").insert({ name: "John" });

// CORRECT - Always include hub_id
await supabase.from("contacts").insert({
  name: "John",
  hub_id: hubConfig.hubNumber, // Required for RLS
});
```

### 2. Hub IDs Reference

- **PercyTech**: 0
- **Gnymble**: 1
- **PercyMD**: 2
- **PercyText**: 3

### 3. Styling Rules (STRICT)

```typescript
// ❌ NEVER do this
import "./styles.css";
import styles from "./Component.module.css";

// ✅ ALWAYS use styled-components
import styled from "styled-components";
const Button = styled.button`
  background: var(--hub-primary);
  padding: 12px 24px;
`;
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
// In Unified app - use singleton
import { getSupabaseClient } from "../lib/supabaseSingleton";
const supabase = getSupabaseClient();

// In packages - use factory
import { createSupabaseClient } from "@sms-hub/supabase";
const supabase = createSupabaseClient(url, key);
```

## 🛠️ Development Workflow

### Port Assignments

- **Web App**: 3000 (marketing, auth gateway, client pages)
- **Unified App**: 3001 (main authenticated application)
- **API**: 3002 (Nest.js backend server)

### Starting the Development Environment

```bash
# Install dependencies
pnpm install

# Start all apps
pnpm dev

# Start specific apps
pnpm dev --filter=@sms-hub/web --filter=@sms-hub/unified

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Build for production
pnpm build
```

### Database Operations

```bash
# Generate TypeScript types from database
supabase gen types typescript --project-id vgpovgpwqkjnpnrjelyg > packages/types/src/database-comprehensive.ts

# Run migrations
supabase db push

# Create new migration
supabase migration new <migration_name>
```

### Testing Authentication

1. **Development Mode**: Use dev auth toggle in Web app
   - Pre-configured test users available
   - No SMS required

2. **Production Mode**: Real SMS OTP flow
   - Requires valid phone number
   - SMS sent via Supabase Edge Functions

## 🐛 Common Issues & Solutions

### "Multiple GoTrueClient instances detected"

**Solution**: Use the singleton pattern in Unified app

```typescript
import { getSupabaseClient } from "../lib/supabaseSingleton";
```

### "Magic link authentication failed"

**Solution**: Clear browser storage, ensure proper session isolation, avoid mixing auth methods

### "Role assignment incorrect (MEMBER instead of USER)"

**Solution**: **FIXED** - Edge Functions now properly assign USER role in membership creation

### "Superadmin account deletion blocked"

**Solution**: **WORKING AS INTENDED** - Protection prevents deletion of superadmin@percytech.com and superadmin@gnymble.com

### "Process is not defined" Error

**Solution**: Use `import.meta.env` in Vite apps, not `process.env`

### Type Errors After Schema Changes

**Solution**: Run `pnpm type-check` to identify mismatches, then update service files

### "Foreign key constraint" Database Errors

**Solution**: Ensure proper order of operations and all required fields

### CSS Import Errors

**Solution**: Convert to styled-components - NO CSS files allowed

## 🔐 Security Guidelines

### Frontend Security (CRITICAL)

1. **NEVER expose service role key in frontend**

   ```typescript
   // ❌ WRONG - Security breach!
   const supabase = createClient(url, SERVICE_ROLE_KEY);

   // ✅ CORRECT - Use anon key only
   const supabase = createClient(url, ANON_KEY);
   ```

2. **Admin operations must use backend**
   - User management → Edge Functions
   - Role updates → Edge Functions
   - Cross-hub queries → Edge Functions

3. **Enhanced Security Status** (September 2025)
   - **Magic link authentication** prevents session carryover issues
   - **Protected superadmin accounts** cannot be deleted via dashboard
   - **Enhanced session isolation** between different user types
   - **Comprehensive Edge Function validation** for all operations
   - RLS is currently DISABLED (allows anon key full CRUD)
   - Manual hub_id filtering required
   - Service role operations moved to backend

## 📋 Current Tasks & Priorities

### Current Status (September 2025)

1. ✅ **Magic Link Authentication**: Complete - Prevents session carryover
2. ✅ **Role Management**: Complete - Fixed USER role assignment
3. ✅ **Superadmin Protection**: Complete - Protected accounts cannot be deleted
4. ✅ **B2B/B2C Enhancement**: Complete - Comprehensive account creation
5. ✅ **Global View Default**: Complete - Admin dashboard improved
6. ✅ **UI Improvements**: Complete - Responsive design and better UX
7. ✅ **Enhanced Edge Functions**: Complete - Comprehensive validation
8. ✅ **Schema Alignment**: Complete - All type mismatches fixed
9. ✅ **Payment Track Cleanup**: Complete - Dashboard tools with protection

### Development Focus

- **Current**: All major authentication and security improvements completed
- **Short Term**: Continued refinements and testing improvements
- **Long Term**: Mobile apps and advanced analytics

### Technical Debt

- Remove legacy user/admin apps after full migration
- Consolidate duplicate components
- Standardize API response formats
- Implement proper logging system

## 🚦 Testing & Quality Assurance

### Before Committing Code

1. Run type checking: `pnpm type-check`
2. Run linting: `pnpm lint`
3. Test authentication flow
4. Verify multi-tenant isolation
5. Check responsive design

### Superadmin Testing (Enhanced Protection)

- **Protected Accounts**:
  - superadmin@percytech.com (protected from deletion)
  - superadmin@gnymble.com (protected from deletion)
- **Access**: Full system access via **magic link authentication**
- **Authentication**: Real Supabase authentication with enhanced security
- **Protection**: Delete buttons disabled for these accounts
- **Global View**: Admin dashboard defaults to global view
- **Use for**: Testing admin features, verifying enhanced auth flow
- **Development Access**: Use `?superadmin=dev123` for testing

## 📚 Important Resources

### Key Files

- `/packages/types/src/database-comprehensive.ts` - Database schema
- `/packages/hub-logic/src/index.ts` - Hub configurations
- `/apps/unified/src/App.tsx` - Main routing
- `/apps/web/src/pages/Login.tsx` - Authentication entry
- `/.env.local` - Environment variables (create from .env.example)

### Documentation

- `docs/PROJECT_SUMMARY.md` - Detailed project documentation
- `docs/ARCHITECTURE_STATUS.md` - Current architecture status
- `docs/ONBOARDING_FLOW.md` - Complete onboarding process documentation
- `supabase/migrations/` - Database schema evolution
- `packages/ui/src/` - Component library examples

## ⚠️ Critical Rules - NEVER Break These

1. **NEVER** create CSS files - use styled-components only
2. **NEVER** forget hub_id in database operations
3. **NEVER** use process.env in browser code
4. **NEVER** put auth logic in the Web app
5. **NEVER** import types locally if they exist in packages
6. **NEVER** modify database without migrations
7. **NEVER** expose API keys in client code
8. **ALWAYS** handle errors gracefully
9. **ALWAYS** maintain type safety
10. **ALWAYS** consider multi-tenant data isolation

## 🎯 Architecture Principles

1. **Separation of Concerns**: Web (marketing) vs Unified (app)
2. **Code Reusability**: Shared packages for common functionality
3. **Type Safety**: Full TypeScript coverage with strict mode
4. **Performance**: Lazy loading, code splitting, optimized bundles
5. **Security**: RLS policies, auth checks, input validation
6. **Maintainability**: Clear structure, consistent patterns
7. **Scalability**: Modular architecture, efficient data queries

## 💡 Pro Tips

1. **Use TodoWrite tool**: Track complex tasks systematically
2. **Batch tool calls**: Run multiple operations in parallel
3. **Check existing patterns**: Look at similar code before implementing
4. **Test edge cases**: Empty states, errors, loading states
5. **Consider mobile**: All interfaces must be responsive
6. **Document decisions**: Add comments for non-obvious choices

## 🔄 Recent Changes (Last Updated: 2025-09-14)

### Latest Fixes (September 14, 2025) - TODAY

1. **Superadmin Access & Navigation Fixes**:
   - **Fixed `hasAnyRole` function**: Correctly passes `user.role` string instead of full user object
   - **Added route permissions**: `/user-view` route now properly configured for access control
   - **Fixed admin/user navigation**:
     - Admin → User: Click arrow button in bottom left of admin sidebar
     - User → Admin: Click Shield icon in user sidebar (admin/superadmin only)
   - **Terminology consistency**: Changed "Super Admin" to "Superadmin" throughout

2. **User Sidebar UX Improvements**:
   - **Fixed horizontal scrollbar**: Added `overflow-x-hidden` and adjusted padding
   - **Icons-only design**: Removed all text from sidebar (64px width)
   - **Added tooltips**: All navigation icons show descriptive tooltips on hover
   - **Optimized spacing**: Reduced padding from `px-4 py-3` to `p-2`
   - **Admin section visibility**: Properly shows for admin/superadmin users

3. **Web App Cleanup**:
   - **Removed unused files**: `SuperadminLogin.tsx`, `Layout.tsx`, `DevAuthToggle.tsx`
   - **Component consolidation**: Merged `VerifyOtp.tsx` and `VerifyCode.tsx` into unified `VerifyAuth.tsx`
   - **Environment variables**: Replaced hard-coded URLs with proper env vars
   - **Added `VITE_UNIFIED_APP_URL`** to environment configuration

4. **Comprehensive TypeScript Error Resolution**:
   - **Fixed 131 TypeScript errors** across the entire monorepo
   - **Database schema alignment**: Updated all field references to match current schema
   - **Type safety improvements**: Fixed type mismatches between components and services
   - **Removed unused code**: Cleaned up unused imports, variables, and functions
   - **Service layer updates**: All services now use correct database types

2. **Build & Compilation Success**:
   - ✅ **Type check passes**: All packages compile without TypeScript errors
   - ✅ **Lint passes**: All code follows project standards (only `any` warnings remain)
   - ✅ **Build succeeds**: Both web and unified apps build successfully
   - **Hub-switcher fix**: Resolved component errors and missing imports

3. **Key Field Migrations Fixed**:
   - `country_of_registration` → `country`
   - `address_street` → `address`
   - `state_region` → `state`
   - `postal_code` → `zip`
   - Removed deprecated fields: `size`, `account_onboarding_step`, `industry` (now `industry_vertical`)
   - Moved `billing_email` to customers table

### Previous Enhancements (September 2025)

1. **Magic Link Authentication & Security**:
   - **Fixed signup flow** to use magic link authentication instead of direct redirect
   - **Prevents superadmin session carryover** issues between different user types
   - **Enhanced session isolation** for improved security
   - **Proper authentication state management** throughout the platform

2. **Role Management Fixes**:
   - **Corrected USER role assignment** (was incorrectly MEMBER role)
   - **Fixed role hierarchy**: USER → ONBOARDED → ADMIN → SUPERADMIN
   - **Enhanced role-based access control** across all components

3. **Superadmin Protection & Security**:
   - **Delete buttons disabled** for protected accounts (superadmin@percytech.com, superadmin@gnymble.com)
   - **Enhanced security measures** for admin account management
   - **Prevents accidental deletion** of critical system accounts

4. **Admin Dashboard Improvements**:
   - **Global view set as default** instead of PercyTech hub specific view
   - **Better cross-hub data visibility** for administrators
   - **UI label updates**: "Onboarding Submissions" → "Onboarding"
   - **Responsive payment track cards** for better mobile experience

5. **Enhanced B2B/B2C Account Creation**:
   - **Comprehensive account creation support** via updated Edge Functions
   - **Complete data creation flow** with proper validation
   - **Enhanced error handling** and user feedback
   - **Supports both business and individual customer scenarios**

6. **Edge Functions Updates**:
   - **Enhanced signup-native function** with comprehensive validation
   - **Updated delete-account function** with superadmin protection
   - **Improved error handling** and security measures
   - **Better logging and debugging capabilities**

### Major Schema Alignment (September 2025) - Completed Foundation

1. **Database Schema Cleanup**:
   - Separated `companies` (business entities) from `customers` (paying entities)
   - Moved `billing_email`, `payment_status`, `payment_type` to `customers` table
   - Removed redundant fields from `companies` table
   - Added proper foreign key relationships

2. **Type System Overhaul**:
   - Updated all TypeScript types to match current database schema
   - Fixed 125+ type errors across the codebase
   - Service layer now uses correct database types
   - Comprehensive type checking implemented

3. **Payment Track Cleanup Tools**:
   - Added dashboard cleanup functionality
   - Preview mode shows what would be deleted
   - Execute mode deletes all payment track data except superadmin
   - Preserves hub records and superadmin data

4. **Service Layer Updates**:
   - Updated `companiesService.ts` to use correct schema
   - Updated `customersService.ts` to use correct schema
   - Updated `phoneNumbersService.ts` to use correct schema
   - All services now align with database schema

### Authentication & Security (Enhanced)

1. **Enhanced Security Architecture**:
   - Frontend uses ONLY anon key via `getSupabaseClient`
   - **Magic link authentication** prevents session carryover issues
   - Admin operations moved to Edge Functions with enhanced validation
   - Service role key never exposed in frontend
   - **Protected superadmin accounts** with deletion prevention
   - RLS currently disabled (manual hub_id filtering required)

2. **Enhanced Authentication Methods**:
   - **Real Supabase authentication** with PostgreSQL storage and magic link flow
   - **Protected Superadmin Access**:
     - superadmin@percytech.com (protected from deletion)
     - superadmin@gnymble.com (protected from deletion)
   - **Development mode**: `?superadmin=dev123` URL parameter with proper isolation
   - **SMS OTP** available for additional two-factor verification
   - **Enhanced session management** prevents authentication issues

### Current Status & Known Issues

#### ✅ Completed (All major issues resolved)

- **Authentication & Security**: Magic link flow implemented, session carryover fixed
- **Role Management**: USER role correctly assigned, hierarchy fixed
- **Superadmin Protection**: Account deletion prevention implemented
- **Global View**: Admin dashboard defaults to global view
- **UI Improvements**: Responsive design and better user experience
- **Edge Functions**: Enhanced validation and error handling
- **Schema Alignment**: Complete type safety with 125+ type errors resolved
- **Payment Track Cleanup**: Dashboard tools with superadmin protection

#### 📝 Minor Items

- **Legacy Apps**: Admin and User apps being migrated to Unified app
  - Workaround: Use Unified app at port 3001 (production ready)
  - Legacy apps will be removed after complete migration verification

### Quick Access for Development (Updated)

```bash
# Development Superadmin Access (bypasses authentication)
http://localhost:3001/?superadmin=dev123

# Protected Superadmin Accounts (magic link authentication)
# superadmin@percytech.com (protected from deletion)
# superadmin@gnymble.com (protected from deletion)

# Real Supabase Authentication
http://localhost:3000/login (use Superadmin Login button)

# Test Authentication
node test-auth.mjs

# Dev Credentials (auto-populated in dev mode)
Email: superadmin@gnymble.com
Password: SuperAdmin123!
```

## 🎯 Current State Summary (September 2025)

**Status**: ✅ **PRODUCTION READY** - Fully type-safe codebase with zero compilation errors and enhanced security.

**Latest Achievement**: ✅ **COMPLETE TYPE SAFETY** - Fixed all 131 TypeScript errors, achieved clean builds across all packages.

**Previous Achievements**: 
- ✅ **AUTHENTICATION & SECURITY ENHANCED** - Magic link authentication, role management, superadmin protection
- ✅ **SCHEMA ALIGNMENT COMPLETE** - Database schema fully synchronized with TypeScript types

### Key Improvements Completed

1. **Magic Link Authentication**: Prevents session carryover, enhanced security
2. **Role Management**: Fixed USER role assignment (was MEMBER)
3. **Superadmin Protection**: Protected accounts cannot be deleted
4. **Global View Default**: Better admin dashboard experience
5. **B2B/B2C Enhancement**: Comprehensive account creation
6. **UI Improvements**: Responsive design and better UX
7. **Enhanced Edge Functions**: Comprehensive validation and security

The SMS Hub platform has successfully evolved into a robust, secure, and maintainable architecture with comprehensive type safety, enhanced authentication flow, protected account management, and improved user experience. The foundation is solid for continued development with enterprise-grade security measures.

Remember: You're working on a **production system**. Every change should maintain or improve stability, performance, and user experience. When in doubt, analyze thoroughly before making changes.
