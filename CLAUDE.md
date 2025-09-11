# Claude Code Agent Instructions - SMS Hub Monorepo

## 🚀 Project Overview

You are working on a **multi-tenant B2B SMS SaaS platform** built as a Turbo monorepo. This is a production-ready platform that provides SMS messaging services to multiple business hubs with distinct branding and features.

### Core Architecture
- **Monorepo Structure**: Turbo + pnpm workspaces for efficient builds and dependency management
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Authentication**: Dual-mode system (SMS OTP for production, dev auth for testing)
- **Frontend**: React + Vite + TypeScript with styled-components
- **Backend**: Nest.js API + Supabase Edge Functions
- **Multi-tenancy**: 4 distinct business hubs with isolated data

## 📁 Project Structure

```
sms-hub-monorepo/
├── apps/
│   ├── web/          # Marketing & landing pages (port 3000)
│   ├── unified/      # Main authenticated app (port 3001)
│   ├── admin/        # Legacy admin dashboard (being migrated)
│   ├── user/         # Legacy user app (being migrated)
│   ├── texting/      # Nest.js API server
│   ├── demo/         # Demo application
│   └── docs/         # Documentation site
├── packages/
│   ├── ui/           # Shared React components
│   ├── types/        # TypeScript type definitions
│   ├── config/       # Shared configurations
│   ├── supabase/     # Supabase client & utilities
│   ├── utils/        # Shared utilities
│   ├── hub-logic/    # Hub-specific business logic
│   ├── services/     # Shared service layer
│   └── sms-auth/     # SMS authentication package
└── supabase/
    ├── functions/    # Edge Functions
    └── migrations/   # Database migrations
```

## 🏗️ Current Architecture & Status

### Application Flow
1. **Web App (port 3000)**: Public-facing marketing site
   - Landing pages for each hub (Gnymble, PercyMD)
   - Lead capture forms
   - Authentication gateway (login/signup)
   - Redirects to Unified app after auth

2. **Unified App (port 3001)**: Main authenticated application
   - Consolidated dashboard for all authenticated users
   - Role-based access control (USER, ONBOARDED, ADMIN, SUPERADMIN)
   - Hub-specific features and branding
   - Clear-auth utility page for development

3. **Authentication Flow**:
   ```
   Web App (Login) → Supabase Auth → Unified App (Dashboard)
   ```

### Recent Consolidation Efforts
- ✅ Migrated from Next.js to Vite for better performance
- ✅ Consolidated user/admin apps into Unified app
- ✅ Extracted reusable components to packages
- ✅ Implemented singleton pattern for Supabase client
- ✅ Created shared services package
- ✅ Fixed authentication persistence issues

## 🔑 Critical Implementation Details

### 1. Multi-Tenancy (ALWAYS Required)
```typescript
// WRONG - Missing hub_id
await supabase.from('contacts').insert({ name: 'John' })

// CORRECT - Always include hub_id
await supabase.from('contacts').insert({ 
  name: 'John',
  hub_id: hubConfig.id  // Required for RLS
})
```

### 2. Hub IDs Reference
- **PercyTech**: 1
- **Gnymble**: 2
- **PercyMD**: 3
- **PercyText**: 4

### 3. Styling Rules (STRICT)
```typescript
// ❌ NEVER do this
import './styles.css'
import styles from './Component.module.css'

// ✅ ALWAYS use styled-components
import styled from 'styled-components'
const Button = styled.button`
  background: var(--hub-primary);
  padding: 12px 24px;
`
```

### 4. Environment Variables
```typescript
// ❌ WRONG in Vite apps
process.env.VITE_SUPABASE_URL

// ✅ CORRECT in Vite apps
import.meta.env.VITE_SUPABASE_URL
```

### 5. Supabase Client Usage
```typescript
// In Unified app - use singleton
import { getSupabaseClient } from '../lib/supabaseSingleton'
const supabase = getSupabaseClient()

// In packages - use factory
import { createSupabaseClient } from '@sms-hub/supabase'
const supabase = createSupabaseClient(url, key)
```

## 🛠️ Development Workflow

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
npm run db:types

# Run migrations locally
npx supabase migration up

# Create new migration
npx supabase migration new <migration_name>
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
import { getSupabaseClient } from '../lib/supabaseSingleton'
```

### "Process is not defined" Error
**Solution**: Use `import.meta.env` in Vite apps, not `process.env`

### "Foreign key constraint" Database Errors
**Solution**: Ensure proper order of operations and all required fields

### Blank "Loading..." Page
**Solution**: Check authentication state and route configuration

### CSS Import Errors
**Solution**: Convert to styled-components - NO CSS files allowed

## 📋 Current Tasks & Priorities

### Immediate Focus
1. Complete migration from legacy apps to Unified app
2. Implement remaining admin features in Unified app
3. Optimize bundle size and performance
4. Add comprehensive error handling

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
- Email: bryan@gnymble.com
- Access: Full system access
- Use for testing admin features

## 📚 Important Resources

### Key Files
- `/packages/types/src/database.types.ts` - Database schema
- `/packages/hub-logic/src/index.ts` - Hub configurations
- `/apps/unified/src/App.tsx` - Main routing
- `/apps/web/src/pages/Login.tsx` - Authentication entry
- `/.env.local` - Environment variables (create from .env.example)

### Documentation
- `PROJECT_SUMMARY.md` - Detailed project documentation
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

## 🔄 Recent Changes (Last Updated: 2025-01-11)

1. **Fixed ESM/CommonJS Issues**: Converted all require() to proper ESM imports in admin pages
2. **Authentication Improvements**: 
   - Dev bypass with `?superadmin=dev123` persists in localStorage
   - Email/password is now default login method (was SMS)
   - Added password visibility toggle on login page
   - Auto-populates superadmin credentials in dev mode
3. **UI/UX Updates**:
   - Changed "Contact" button to "Login" in navigation
   - Standardized button styling (Superadmin, Sign Up, Login)
   - Made login method toggle always visible
4. **GlobalViewProvider Fix**: Wrapped App with required context provider
5. **Environment Standardization**: All apps now use `.env.local` consistently

### Known Issues
- **Superadmin Password Login**: User exists in database but lacks Supabase Auth user
  - Workaround: Use dev bypass `?superadmin=dev123`
  - Fix requires creating auth user in Supabase dashboard

### Quick Access for Development
```bash
# Dev Superadmin Access (persists in localStorage)
http://localhost:3001/?superadmin=dev123

# Test Authentication
node test-auth.mjs

# Dev Credentials (auto-populated in dev mode)
Email: superadmin@sms-hub.com
Password: SuperAdmin123!
```

Remember: You're working on a **production system**. Every change should maintain or improve stability, performance, and user experience. When in doubt, analyze thoroughly before making changes.