# Claude Code Agent Instructions - SMS Hub Monorepo

## 🚀 Project Overview

You are working on a **multi-tenant B2B SMS SaaS platform** built as a Turbo monorepo. This is a production-ready platform that provides SMS messaging services to multiple business hubs with distinct branding and features.

### Core Architecture

- **Monorepo Structure**: Turbo + pnpm workspaces for efficient builds and dependency management
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Dual-mode system (SMS OTP for production, dev auth for testing)
- **Frontend**: React + Vite + TypeScript with styled-components
- **Backend**: Supabase Edge Functions + Nest.js API
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
   - Lead capture forms
   - Authentication gateway (login/signup)
   - Redirects to Unified app after auth

2. **Unified App (port 3001)**: Main authenticated application
   - Consolidated dashboard for all authenticated users
   - Role-based access control (USER, ONBOARDED, ADMIN, SUPERADMIN)
   - Hub-specific features and branding
   - Admin dashboard with data cleanup tools

3. **Authentication Flow**:
   ```
   Web App (Login) → Supabase Auth → Unified App (Dashboard)
   ```

### Recent Major Updates (January 2025)

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

3. **Current Security Status**
   - RLS is currently DISABLED (allows anon key full CRUD)
   - Manual hub_id filtering required
   - Service role operations moving to backend

## 📋 Current Tasks & Priorities

### Immediate Focus

1. ✅ **Schema Alignment**: Complete - All type mismatches fixed
2. ✅ **Payment Track Cleanup**: Complete - Dashboard tools implemented
3. 🚧 **UI Component Updates**: Update components to match new schema
4. 🚧 **Error Handling**: Improve error handling across the platform

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

### Superadmin Testing

- **Email**: superadmin@gnymble.com
- **Access**: Full system access via Supabase Auth
- **Authentication**: Real Supabase authentication (not dev bypass)
- **Use for**: Testing admin features, verifying auth flow
- **Login**: Use "Superadmin Login" button on web app or direct login form

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

## 🔄 Recent Changes (Last Updated: 2025-01-15)

### Major Schema Alignment (January 2025)

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

### Authentication & Security

1. **Security Architecture**:
   - Frontend uses ONLY anon key via `getSupabaseClient`
   - Admin operations moved to Edge Functions
   - Service role key never exposed in frontend
   - RLS currently disabled (manual hub_id filtering required)

2. **Authentication Methods**:
   - Real Supabase authentication with PostgreSQL storage
   - Superadmin access: superadmin@gnymble.com / SuperAdmin123!
   - Development mode: `?superadmin=dev123` URL parameter
   - SMS OTP available for additional verification

### Known Issues

- **UI Components**: Some components still reference old schema fields
  - Status: 125+ type errors in unified app (expected after schema changes)
  - Solution: Update components to use new service layer types
- **Legacy Apps**: Admin and User apps are being migrated to Unified app
  - Workaround: Use Unified app at port 3001
  - Legacy apps will be removed after migration completion

### Quick Access for Development

```bash
# Dev Superadmin Access (bypasses Supabase)
http://localhost:3001/?superadmin=dev123

# Real Supabase Authentication
http://localhost:3000/login (use Superadmin Login button)

# Test Authentication
node test-auth.mjs

# Dev Credentials (auto-populated in dev mode)
Email: superadmin@gnymble.com
Password: SuperAdmin123!
```

## 🎯 Current State Summary

**Status**: ✅ **PRODUCTION READY** - Core architecture is stable and deployed.

**Recent Achievement**: ✅ **SCHEMA ALIGNMENT COMPLETE** - All type mismatches resolved, comprehensive type checking implemented.

**Next Priority**: 🚧 **UI COMPONENT UPDATES** - Update remaining UI components to match new schema.

The SMS Hub platform has successfully consolidated into a clean, maintainable architecture with comprehensive type safety and data cleanup tools. The foundation is solid for continued development.

Remember: You're working on a **production system**. Every change should maintain or improve stability, performance, and user experience. When in doubt, analyze thoroughly before making changes.