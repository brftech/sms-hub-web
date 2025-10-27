# Architecture

**Last Updated**: October 27, 2025 (Evening - Bundle Optimization & Client System)

## 🏗️ System Overview

SMS Hub Web is a multi-tenant marketing platform serving 4 business brands (PercyTech, Gnymble, PercyMD, PercyText) with isolated data, branded experiences, and comprehensive lead management.

**Stack**: React 19, TypeScript, Vite, Tailwind CSS, Supabase

### Hub System

- **Hub 0**: PercyTech (percytech.com) - Red theme, technology businesses
- **Hub 1**: Gnymble (gnymble.com) - Orange theme, retail/general (default)
- **Hub 2**: PercyMD (percymd.com) - Blue theme, healthcare
- **Hub 3**: PercyText (percytext.com) - Violet theme, messaging focus

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
│   │   └── src/              # Client-specific folders (brownwatercigar, donsbt)
│   │       ├── {clientId}/   # Each client folder contains:
│   │       │   ├── index.tsx # Client data (contact, hours, features, etc.)
│   │       │   └── logo.png  # Client logo
│   │       ├── index.ts      # Exports all client data
│   │       └── types.ts      # TypeScript types
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

**1. Client Marketing Pages**

- Client data centralized in `/packages/clients/src/`
- Each client has own folder: `/clients/src/{clientId}/`
- Contains: `index.tsx` (data), `logo.png` (branding)
- Easily replicable pattern for onboarding new clients
- Accessed via `/clients/{clientId}` route (e.g., `/clients/brownwatercigar`)
- Client data includes: contact info, hours, features, benefits, SMS number, colors

**2. Hub Centralization**

- ALL hub-specific content lives in `/packages/hub-logic/src/hubs/`
- Each hub has its own folder with small files: `metadata.ts`, `colors.ts`, `hero.ts`, etc.
- Components use `useHub()` hook + helper functions like `getHubColors()`

**3. Flat Component Structure**

- No deep nesting (no `/home/shared/` folders)
- Components are either shared or deleted
- One level of folders maximum

**4. Package Architecture & Bundle Optimization**

- Local packages use `file:` dependencies
- Vite configured with `preserveSymlinks: true` and proper aliases for all packages
- **Bundle optimization** (66% reduction):
  - Main bundle: 377KB (103KB gzipped) - down from 1.1MB
  - Lazy loading for all auth pages and admin features
  - Manual vendor chunk splitting (react, supabase, ui-framework, icons)
  - Separate chunks cache independently for better performance
- Optimized exports: `@sms-hub/ui/marketing` exports only marketing components

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
- All hub-specific CSS consolidated in `shared-design-system.css` using `[data-hub="..."]` selectors

## 🎨 Favicon & PWA Manifest System

**Dynamic Favicon Switching**:

- HubContext automatically updates favicons when hub changes
- Production: Each domain shows its branded icon (percytech.com → red, gnymble.com → orange, etc.)
- Preview/Dev: Favicon updates when using hub switcher
- Icons: `/public/percytech-icon-logo.svg`, `/public/gnymble-icon-logo.svg`, etc.

**Hub-Specific PWA Manifests**:

- Each hub has its own manifest: `/public/manifest-{hubname}.json`
- Dynamically loaded based on current hub
- Includes hub-specific name, theme color, and icon references
- Enables proper "Add to Home Screen" branding per domain

**Implementation**:

- `HubContext.tsx` manages both favicon and manifest via `DOMAdapter`
- Uses `getHubIconPath()` from `@sms-hub/hub-logic`
- All icons face the same direction (no CSS transforms)

## ⚡ Performance & Build

**Bundle Optimization**:

- Main bundle: 377KB (103KB gzipped)
- Vendor chunks: react (55KB), supabase (128KB), ui-framework (477KB), icons (20KB)
- Lazy loaded: All auth pages, client pages, admin features
- Result: 66% faster initial page load

**Vite Configuration** (`vite.config.ts`):

- Manual chunk splitting for optimal caching
- Proper aliases for all `@sms-hub/*` packages (critical for avoiding stale cache)
- CSS code splitting enabled
- Optimized dependencies pre-bundling

## 🧪 Testing

- **Unit Tests**: Vitest (`npm test`)
- **Type Checking**: TypeScript (`npm run type-check`)
- **E2E Tests**: Playwright (`npm run test:e2e`)
- Setup file: `/test/setup.ts`
