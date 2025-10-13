# SMS Hub Web - Marketing Platform

**Last Updated**: October 13, 2025

## 🎯 Project Overview

SMS Hub Web is a production-ready multi-tenant marketing website and sales dashboard for the SMS Hub B2B platform. It serves 4 business brands with isolated data, branded experiences, and comprehensive lead management capabilities.

**Current Status**: ✅ **Production Ready** - Fully operational with Sales Dashboard, lead capture, and multi-tenant support

## 📁 Repository Structure

### **Core Application**

- **`src/`** - React application source code
- **`packages/`** - Internal packages (ui, hub-logic, supabase, utils)
- **`supabase/`** - Database migrations and Edge Functions
- **`test/`** - Unit, E2E, and integration tests
- **`docs/`** - Comprehensive documentation
- **`public/`** - Static assets and favicons

### **Documentation**

- **`docs/`** - Consolidated documentation (see below)
- **`docs/archive/`** - Historical documentation and guides

## 🏢 Multi-Tenant Hub System

### **Supported Brands**

- **Hub 0**: PercyTech (percytech.com) - Red theme, technology focus
- **Hub 1**: Gnymble (gnymble.com) - Orange theme, primary brand (default)
- **Hub 2**: PercyMD (percymd.com) - Red theme, medical focus
- **Hub 3**: PercyText (percytext.com) - Purple theme, messaging focus

### **Hub-Specific Features**

- **Branded UI**: Hub-specific colors, logos, and theming
- **Data Isolation**: All data filtered by `hub_id`
- **Domain Detection**: Automatic hub detection from domain
- **Sales Dashboard**: Hub-filtered leads management

## 🚀 Quick Start

### **1. Clone and Install**

```bash
git clone https://github.com/brftech/sms-hub-web.git
cd sms-hub-web
npm install --legacy-peer-deps
```

### **2. Environment Setup**

```bash
# Create .env.local
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### **3. Start Development**

```bash
npm run dev
```

### **4. Access Applications**

- **Marketing Site**: http://localhost:3000
- **Sales Dashboard**: http://localhost:3000/admin (dev mode)
- **Hub Switching**: Use floating hub switcher (dev mode)

## 🗄️ Database Architecture

### **Marketing Database**

- **Project**: `hmumtnpnyxuplvqcmnfk` (dev) / `fwlivygerbqzowbzxesw` (prod)
- **Purpose**: Lead capture, email marketing, contact forms
- **Key Tables**: `leads`, `email_lists`, `contact_form_submissions`, `verifications`

### **Database Schema**

- **Multi-tenant**: All tables include `hub_id` for tenant isolation
- **Marketing Focus**: Optimized for lead capture and conversion
- **Clean Slate**: Designed for new databases (no existing data)
- **Hub Isolation**: Proper data separation between brands

## 🏗️ Architecture

### **Technology Stack**

| Technology       | Purpose      | Version |
| ---------------- | ------------ | ------- |
| **React**        | UI Framework | 19.1.1  |
| **Vite**         | Build Tool   | 7.1.7   |
| **TypeScript**   | Type Safety  | 5.9.2   |
| **Tailwind CSS** | Styling      | 3.4.17  |
| **Supabase**     | Backend      | 2.57.4  |
| **Playwright**   | E2E Testing  | 1.55.1  |

### **Package Architecture**

- **`@sms-hub/ui/marketing`** - Optimized UI components for marketing
- **`@sms-hub/hub-logic`** - Hub configurations and branding
- **`@sms-hub/supabase`** - Database client and queries
- **`@sms-hub/utils`** - Shared utilities and validation

### **Key Design Principles**

- **Separation of Concerns**: Marketing vs Customer applications
- **Multi-Tenant**: Hub-based data isolation
- **Performance**: Optimized bundles and code splitting
- **Maintainability**: Type safety and comprehensive testing

## ✨ Key Features

### **Sales Dashboard**

- **Hub-Filtered Data**: All operations include `hub_id` filtering
- **Lead Management**: CRUD operations for leads and contacts
- **Branded UI**: Hub-specific colors and theming
- **Admin Access**: Secure access with admin codes

### **Contact Forms**

- **Lead Capture**: Hub-specific contact form submissions
- **Validation**: Comprehensive form validation
- **Integration**: Supabase Edge Functions for processing
- **Analytics**: Lead tracking and conversion metrics

### **Subscription Tiers**

| Tier       | Price  | SMS/Month | Contacts | Users | Phone #s | Throughput | Segments |
| ---------- | ------ | --------- | -------- | ----- | -------- | ---------- | -------- |
| Starter    | $79    | 200       | 50       | 1     | 1        | 10/min     | 1        |
| Core       | $179   | 1,500     | 500      | 3     | 1        | 40/min     | 3        |
| Elite      | $349   | 8,000     | 3,000    | ∞     | 2        | 200/min    | 8        |
| Enterprise | Custom | 50,000+   | ∞        | ∞     | ∞        | ∞          | ∞        |
| VIP        | Custom | ∞         | ∞        | ∞     | ∞        | ∞          | ∞        |

### **Authentication Flow**

- **Payment-First**: Stripe → Email confirmation → Profile setup
- **Magic Link**: Email-based authentication
- **Cross-App**: Redirects to sms-hub-app2 for customer management
- **Dev Mode**: Local development with simplified auth

## 🧭 Homepage Content Architecture

### **Content Source of Truth**

- **Location**: All homepage hero copy is defined in `packages/hub-logic/src/hubContent.ts` under the active hub (e.g., `gnymble` → `hero.tagline.line1/line2`).
- **Render Path**: `src/pages/Home.tsx` → `components/home/HubSelector` → hub component (e.g., `Gnymble.tsx`) → `shared/HeroSection.tsx`.
- **Best Practice**: Always edit hub content centrally, never override text in components.
- **SHAFT Emphasis**: The Platform Advantage explicitly features SHAFT (Sex, Hate, Alcohol, Firearms, Tobacco) support. This is our primary value proposition for small businesses in regulated industries.

### **Edit Workflow (Hero Copy)**

1. Edit `packages/hub-logic/src/hubContent.ts` for the active hub.
2. Save; if changes don't show, run `npm run clean && npm run dev` and hard refresh (Cmd+Shift+R).
3. Verify both tagline lines render under the hero headline.
4. Run E2E tests to verify: `cd config && npx playwright test test/e2e/web/home.spec.ts`

## 🗺️ Centralized Routing

All application routes are centralized in `src/utils/routes.ts` for consistency and maintainability.

### **Route Management**

```typescript
// Import centralized routes
import { HOME_PATH, CONTACT_PATH, PRICING_PATH, ADMIN_PATH } from "@/utils/routes";

// Use in components
<Link to={CONTACT_PATH}>Contact</Link>
<button onClick={() => navigate(PRICING_PATH)}>Pricing</button>
```

### **Benefits**

- **Type Safety**: Compile-time checking for all routes
- **Refactor Safe**: Change paths in one place
- **Consistency**: Same paths across navigation, links, and redirects
- **Maintainability**: Easy to add/modify routes

## 📚 Documentation

### **🚀 Getting Started**

- **[CLAUDE.md](CLAUDE.md)** - Development context and quick reference
- **[Architecture Guide](docs/architecture.md)** - Technical architecture and design decisions
- **[Deployment Guide](docs/deployment.md)** - Production deployment instructions

### **🔧 Development & Operations**

- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions
- **[Performance Guide](docs/performance.md)** - Optimization strategies
- **[SMS-Hub-App2 Integration](docs/sms-hub-app2-integration.md)** - Customer app integration

### **📱 App-Specific Documentation**

- **`docs/archive/`** - Historical documentation and guides

## 🎯 Current Status

### **✅ Production Ready**

- **Zero Errors**: Clean codebase with zero TypeScript/ESLint errors
- **Performance**: 91KB gzipped main bundle (70% reduction from 302KB)
- **Testing**: 48 E2E tests across 6 browsers
- **Multi-Tenant**: Proper hub isolation and data filtering
- **Documentation**: Comprehensive documentation suite

## 🚀 Development

### **Development Commands**

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run type-check       # TypeScript check
npm run lint             # Lint code
npm run build:check      # Full build check
npm run clean            # Clean Vite cache and rebuild

# Testing
npm run test             # Unit tests (watch mode)
npm run test:run         # Unit tests (single run)
npm run test:e2e         # E2E tests (all browsers)

# Playwright E2E Testing
cd config && npx playwright test                    # Run all E2E tests
cd config && npx playwright test --ui              # Run with UI
cd config && npx playwright show-report            # View HTML report
cd config && npx playwright test test/e2e/web/     # Run web tests only

# Building
npm run build            # Production build
npm run preview          # Preview build
npm run build:analyze    # Analyze bundle size
```

### **Environment Variables**

```bash
# Supabase (Development)
VITE_SUPABASE_URL=https://hmumtnpnyxuplvqcmnfk.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# App URLs
VITE_WEB_APP_URL=http://localhost:3000
PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_DEV_AUTH=true
VITE_ENABLE_HUB_SWITCHER=true

# Stripe
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_28E5kF2Ag5jW9va1Ks3ZK0c
```

## 🚀 Deployment

### **Production URLs**

- **Gnymble**: gnymble.com
- **PercyTech**: percytech.com
- **PercyMD**: percymd.com
- **PercyText**: percytext.com

### **Deployment Process**

```bash
# Deploy to Vercel
vercel --prod

# Check deployment
vercel ls
```

## 🆘 Quick Help

### **Common Tasks**

- **Start Development**: See [Quick Start](#-quick-start) above
- **Deploy to Production**: See [Deployment Guide](docs/deployment.md)
- **Fix Issues**: Check [Troubleshooting Guide](docs/troubleshooting.md)
- **Optimize Performance**: See [Performance Guide](docs/performance.md)

### **Need More Help?**

- **Development Context**: [CLAUDE.md](CLAUDE.md) - Complete development reference
- **Architecture Questions**: [Architecture Guide](docs/architecture.md)
- **Customer App Integration**: [SMS-Hub-App2 Integration](docs/sms-hub-app2-integration.md)
- **Historical Docs**: Check `docs/archive/` folder

## 🚨 Important Notes

- **Multi-Tenant**: All operations must include `hub_id` for proper data isolation
- **Database Separation**: Uses separate marketing database from customer app
- **Bundle Optimization**: Use `@sms-hub/ui/marketing` for optimized imports
- **Code Quality**: Zero TypeScript/ESLint errors required
- **Testing**: Comprehensive E2E test coverage required

## 🤝 Contributing

### **Development Workflow**

1. Follow development rules in [CLAUDE.md](CLAUDE.md)
2. Use centralized routes from `src/utils/routes.ts`
3. Edit hub content in `packages/hub-logic/src/hubContent.ts`
4. Run `npm run build:check` before committing
5. Write tests for new features
6. Update documentation for significant changes
7. Ensure zero TypeScript/ESLint errors

### **Git Hooks (Husky)**

Git hooks are automatically installed via `npm run prepare` and enforce code quality:

- **Pre-commit**: Runs `lint-staged` to format and lint staged files
- **Pre-push**: Runs `npm run type-check && npm run test:run` for safety checks

To bypass hooks (not recommended):

```bash
git commit --no-verify  # Skip pre-commit
git push --no-verify    # Skip pre-push
```

### **Testing Workflow**

```bash
# Unit tests (fast, run before push)
npm run test:run

# E2E tests (comprehensive, run before major changes)
cd config && npx playwright test

# Watch test results
cd config && npx playwright test --ui
```

### **Homepage Content Workflow**

1. Edit copy in `packages/hub-logic/src/hubContent.ts`
2. If changes don't appear, run `npm run clean && npm run dev` and hard refresh
3. Validate both hero tagline lines render in browser
4. Run E2E test: `cd config && npx playwright test test/e2e/web/home.spec.ts`

---

**Last Updated**: October 13, 2025  
**Status**: Production Ready - Marketing platform fully operational with Sales Dashboard and multi-tenant support
