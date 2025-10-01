# SMS Hub Web

Production-ready marketing website and sales dashboard for multi-tenant B2B SMS platform.

## 🚀 Quick Start

```bash
# Install and start
npm install --legacy-peer-deps
npm run dev

# Full development setup
npm run setup
```

**Access Points:**
- **Web App**: http://localhost:3000
- **Sales Dashboard**: http://localhost:3000/admin (dev mode)
- **Documentation**: See [/docs](./docs/) folder

## 🎯 What This Is

Multi-tenant marketing website serving 4 business brands with isolated data and branded experiences:

- **PercyTech** (Hub 0) - Red theme, technology focus  
- **Gnymble** (Hub 1) - Orange theme, primary brand
- **PercyMD** (Hub 2) - Blue theme, medical focus
- **PercyText** (Hub 3) - Purple theme, messaging focus

## ✨ Key Features

- **Sales Dashboard**: Hub-filtered leads management with branded UI
- **Contact Forms**: Lead capture with hub-specific branding
- **Subscription Tiers**: Starter ($79), Core ($179), Elite ($349), Enterprise, VIP
- **Authentication**: Magic link flow (dev: localhost:3001, prod: app.[hub].com)
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Testing**: 48 E2E tests + comprehensive unit coverage

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + styled-components
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Testing**: Vitest + Playwright + Testing Library
- **Deployment**: Vercel
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 📁 Project Structure

```
sms-hub-web/
├── src/                # Application source
├── packages/           # Internal packages (ui, hub-logic, supabase, utils)
├── supabase/          # Database migrations and Edge Functions
├── test/              # Unit, E2E, and integration tests
├── docs/              # Comprehensive documentation
└── public/            # Static assets
```

## 🚀 Development

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # TypeScript check
npm run lint             # Lint code
npm run build:check      # Full build check

# Testing
npm run test             # Unit tests
npm run test:e2e         # E2E tests
npx playwright test      # Playwright tests

# Building
npm run build            # Production build
npm run preview          # Preview build
```

## 🔧 Environment Setup

Create `.env.local`:

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

## 💳 Subscription Tiers

| Tier | Price | SMS/Month | Contacts | Users | Phone #s | Throughput | Segments |
|------|-------|-----------|----------|-------|----------|------------|----------|
| Starter | $79 | 200 | 50 | 1 | 1 | 10/min | 1 |
| Core | $179 | 1,500 | 500 | 3 | 1 | 40/min | 3 |
| Elite | $349 | 8,000 | 3,000 | ∞ | 2 | 200/min | 8 |
| Enterprise | Custom | 50,000+ | ∞ | ∞ | ∞ | ∞ | ∞ |
| VIP | Custom | ∞ | ∞ | ∞ | ∞ | ∞ | ∞ |

**Onboarding**: $179 one-time setup fee (includes first month)

## 🗄 Database

Marketing-focused schema with 15+ tables:
- **Core**: `hubs`, `leads`, `customers`, `user_profiles`
- **Marketing**: `email_lists`, `sms_lists`, `email_campaigns`, `sms_campaigns`
- **Analytics**: `website_analytics`, `conversions`, `lead_activities`
- **Subscriptions**: `customers.subscription_tier`, `customers.subscription_status`

## 📚 Documentation

Complete documentation in [/docs](./docs/):

- **[QUICK_START.md](./docs/QUICK_START.md)** - Developer setup and common tasks
- **[CLAUDE.md](./docs/CLAUDE.md)** - AI agent instructions and architecture
- **[ADMIN_DASHBOARD.md](./docs/ADMIN_DASHBOARD.md)** - Sales Dashboard features
- **[VERCEL_DEPLOYMENT_GUIDE.md](./docs/VERCEL_DEPLOYMENT_GUIDE.md)** - Deployment
- **[ENVIRONMENT_VARIABLES_CHECKLIST.md](./docs/ENVIRONMENT_VARIABLES_CHECKLIST.md)** - Environment setup

## 🚀 Deployment

```bash
# Deploy to Vercel
vercel --prod
```

**Production URLs:**
- Gnymble: www.gnymble.com
- PercyTech: www.percytech.com
- PercyMD: www.percymd.com (planned)
- PercyText: www.percytext.com (planned)

## 🎯 Current Status

**✅ Production Ready** - Mature, optimized React application with:
- Zero TypeScript/ESLint errors
- 91KB gzipped main bundle
- 48 E2E tests across 6 browsers
- Hub-specific data isolation
- Comprehensive documentation

## 🔄 Recent Updates

- **Sales Dashboard**: Hub-filtered leads management with branded UI
- **Logger Removal**: Simplified codebase (~1,000 lines eliminated)
- **E2E Testing**: Complete test suite rebuild with 48 working tests
- **Bundle Optimization**: Lean imports and strategic code splitting
- **Documentation**: Comprehensive overhaul with clear structure

## 🤝 Contributing

1. Follow development rules in [QUICK_START.md](./docs/QUICK_START.md)
2. Run `npm run build:check` before committing
3. Write tests for new features
4. Update documentation for significant changes

---

**Status**: ✅ Production Ready | **Version**: 0.1.0 | **Last Updated**: October 1, 2025