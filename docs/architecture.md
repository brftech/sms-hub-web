# Architecture

**Last Updated**: October 14, 2025 (Evening - Post Refactor)

## 🏗️ System Overview

SMS Hub Web is a multi-tenant marketing platform serving 4 business brands (PercyTech, Gnymble, PercyMD, PercyText) with isolated data, branded experiences, and comprehensive lead management.

**Stack**: React 19, TypeScript, Vite, Tailwind CSS, Supabase

### Hub System

- **Hub 0**: PercyTech (percytech.com) - Red theme, technology businesses
- **Hub 1**: Gnymble (gnymble.com) - Orange theme, retail/general (default)
- **Hub 2**: PercyMD (percymd.com) - Red theme, healthcare
- **Hub 3**: PercyText (percytext.com) - Purple theme, messaging focus

All data is isolated by `hub_id`. Domain-based routing determines the active hub.

## 📁 Folder Structure

```
/
├── src/                      # Main application
│   ├── components/           # Shared React components (flat structure)
│   ├── pages/                # Route components
│   ├── services/             # API services (Supabase, contact forms)
│   ├── config/               # Environment configuration
│   └── types/                # TypeScript type definitions
│
├── packages/                 # Internal packages
│   ├── clients/              # Client data and marketing page assets
│   ├── hub-logic/            # Hub configs, metadata, content
│   │   └── src/hubs/         # Hub-specific folders (gnymble, percymd, etc)
│   ├── ui/                   # Shared UI components
│   ├── supabase/             # Supabase client & queries
│   └── utils/                # Shared utilities (nameUtils, validation, etc.)
│
├── supabase/                 # Supabase backend
│   ├── migrations/           # Database schema
│   └── functions/            # Edge Functions (submit-contact, stripe-webhook)
│
├── test/                     # All tests
│   ├── unit/                 # Unit tests (Vitest)
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests (Playwright)
│
└── docs/                     # Documentation (5 files max)
```

### Key Architecture Decisions

**1. Hub Centralization**

- ALL hub-specific content lives in `/packages/hub-logic/src/hubs/`
- Each hub has its own folder with small files: `metadata.ts`, `colors.ts`, `hero.ts`, etc.
- Components use `useHub()` hook + helper functions like `getHubColors()`

**2. Flat Component Structure**

- No deep nesting (no `/home/shared/` folders)
- Components are either shared or deleted
- One level of folders maximum

**3. Package Architecture**

- Local packages use `file:` dependencies
- Vite configured with `preserveSymlinks: true`
- Optimized bundle: `@sms-hub/ui/marketing` exports only marketing components

## 🗄️ Database

### Marketing Database (Separate from App2)

- **Dev**: `hmumtnpnyxuplvqcmnfk.supabase.co`
- **Prod**: `fwlivygerbqzowbzxesw.supabase.co`

### Key Tables

- `leads` - Contact form submissions
- `lead_activities` - Lead interaction history
- `email_lists` / `sms_lists` - Marketing list definitions
- `email_subscribers` / `sms_subscribers` - Subscription tracking

All tables have `hub_id` for multi-tenant isolation.

## 🔐 Security

- Frontend uses **anon key only**
- Admin operations via **Edge Functions** (service role key server-side)
- RLS policies disabled in dev, enabled in production
- No sensitive keys in client code

## 🎨 Styling System

- **Tailwind CSS** for all styling
- Hub-specific colors in `/packages/hub-logic/src/hubs/*/colors.ts`
- Includes hex values + Tailwind class mappings
- Dynamic theming via `getHubColors()` helper

## 🧪 Testing

- **Unit Tests**: Vitest (`npm test`)
- **Type Checking**: TypeScript (`npm run type-check`)
- **E2E Tests**: Playwright (`npm run test:e2e`)
- Setup file: `/test/setup.ts`
