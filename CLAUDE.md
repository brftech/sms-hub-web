# SMS Hub Web Development Context

**Last Updated**: October 3, 2025 at 12:30 PM ET

## 🎯 Project Overview

**SMS Hub Web** is a production-ready multi-tenant marketing website and sales dashboard for the SMS Hub B2B platform. It serves 4 business brands (Gnymble, PercyTech, PercyMD, PercyText) with isolated data, branded experiences, and comprehensive lead management capabilities.

**Current Status**: ✅ **Production Ready** - Marketing platform fully operational with Sales Dashboard and multi-tenant support

## 🏗️ Key Architecture Decisions

### **Multi-Tenant Hub System**

- **Hub 0**: PercyTech (percytech.com) - Red theme, technology focus
- **Hub 1**: Gnymble (gnymble.com) - Orange theme, primary brand (default)
- **Hub 2**: PercyMD (percymd.com) - Red theme, medical focus
- **Hub 3**: PercyText (percytext.com) - Purple theme, messaging focus

### **Database Strategy**

- **Marketing Database**: `fwlivygerbqzowbzxesw` (prod) - Lead capture and marketing data
- **Separate from App2**: Uses different database from customer application
- **Hub Isolation**: All data filtered by `hub_id` for proper tenant separation

### **Package Architecture**

- **Local Packages**: Use `file:` dependencies with `preserveSymlinks: true` in Vite
- **Bundle Optimization**: `@sms-hub/ui/marketing` for optimized marketing components
- **Code Splitting**: Route-based lazy loading for performance

## 🚀 Common Tasks and Workflows

### **Development Setup**

```bash
# Start development server
npm run dev  # Port 3000

# Access applications
# Marketing Site: http://localhost:3000
# Sales Dashboard: http://localhost:3000/admin (dev mode)
```

### **Build and Test**

```bash
# Full build check
npm run build:check  # Type check + lint + build

# Testing
npm run test         # Unit tests
npm run test:e2e     # E2E tests (48 tests, 6 browsers)

# Build analysis
npm run build:analyze
```

### **Database Management**

```bash
# Deploy schema
npx supabase db push --project-ref fwlivygerbqzowbzxesw

# Deploy Edge Functions
npx supabase functions deploy submit-contact --project-ref fwlivygerbqzowbzxesw
npx supabase functions deploy stripe-webhook --project-ref fwlivygerbqzowbzxesw
```

### **Deployment**

```bash
# Deploy to Vercel
vercel --prod

# Check deployment
vercel ls
```

## 🧭 Homepage Content Workflow (New)

- **Single Source of Truth**: Homepage hero copy lives in `packages/hub-logic/src/hubContent.ts` under the active hub (`hero.tagline.line1/line2`).
- **Render Path**: `src/pages/Home.tsx` → `components/home/HubSelector` → `components/home/Gnymble` → `components/home/shared/HeroSection`.
- **Best Practices**:
  - Do not hardcode hero text inside components.
  - Edit hub content, then hard refresh the browser.
  - If dev still shows stale text, run `npm run clean && npm run dev` (clears Vite cache) and refresh.
- **SHAFT Positioning**:
  - The Platform Advantage section highlights SHAFT explicitly.
  - Short SHAFT note appears under the section (brief regulatory context).

### **QA Checklist (Homepage)**

1. Confirm hero headline renders and both tagline lines are visible.
2. Verify problem/solution headings: “BUILT FOR SHAFT-COMPLIANT MESSAGING” and “WHAT OTHERS WON’T DO”.
3. Ensure SHAFT note card is visible beneath the grids (Gnymble hub).
4. Confirm Stats and CTA sections use neutral styling and match hero rhythm.
5. Switch hubs and verify hero pulls the correct hub content.

## 📝 Coding Standards

### **TypeScript/React**

- **Strict Mode**: Zero TypeScript/ESLint errors required
- **Functional Components**: Prefer React functional components with hooks
- **Type Safety**: Full TypeScript coverage, no `any` types
- **Import Organization**: Use optimized imports (`@sms-hub/ui/marketing`)

### **Code Quality**

- **Package Dependencies**: Use `file:` for local packages, `preserveSymlinks: true`
- **Bundle Size**: Target 91KB gzipped main bundle (achieved)
- **Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Performance**: Code splitting, lazy loading, tree shaking

### **Multi-Tenant Development**

- **Hub ID**: Always include `hub_id` in database operations
- **Data Isolation**: Filter all queries by hub
- **UI Theming**: Use hub-specific colors and branding
- **Environment Detection**: Automatic hub detection from domain

## 🔌 API Endpoints and Services

### **Supabase Edge Functions**

- **submit-contact**: Process contact form submissions
- **stripe-webhook**: Handle Stripe payment webhooks

### **External Services**

- **Stripe**: Payment processing and webhooks
- **Supabase**: Database and authentication
- **Vercel**: Hosting and deployment

### **Database Queries**

- **Multi-tenant**: All queries must include `hub_id` filtering
- **Marketing Focus**: Optimized for lead capture and conversion
- **Hub Isolation**: Proper data separation between brands

## 🧪 Testing Approach

### **Test Commands**

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm run test:comprehensive

# Build check
npm run build:check
```

### **Test Coverage**

- **Unit**: Vitest + Testing Library
- **E2E**: Playwright (48 tests, 6 browsers)
- **Visual**: Playwright visual regression
- **Performance**: Lighthouse integration

## 🚀 Build and Deploy

### **Build Process**

```bash
# Development
npm run dev

# Production build
npm run build

# Build with checks
npm run build:check
```

### **Deployment Process**

1. **Database**: Deploy schemas and Edge Functions
2. **Environment**: Configure Vercel environment variables
3. **Deploy**: `vercel --prod`
4. **Test**: Verify all functionality works
5. **Monitor**: Check Vercel and Supabase dashboards

## 🚨 Known Issues and Solutions

- **Local package cache (Vite)**: If content edits don’t appear, run `npm run clean && npm run dev` and hard refresh.
- **Hub mismatch**: Verify `document.body.getAttribute('data-hub')` equals the expected hub.

---

**Last Updated**: October 3, 2025 at 12:30 PM ET  
**Status**: Production Ready - Marketing platform fully operational with Sales Dashboard and multi-tenant support
