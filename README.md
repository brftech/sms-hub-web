# SMS Hub Web - Marketing Platform

**Last Updated**: October 3, 2025 at 12:30 PM ET

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

### **🔄 Recent Achievements (October 2025)**

- **Sales Dashboard**: Rebranded with hub-specific filtering and branded UI
- **Code Simplification**: Removed @sms-hub/logger package (~1,000 lines eliminated)
- **Bundle Optimization**: 91KB gzipped main bundle with strategic code splitting
- **E2E Testing**: Complete Playwright overhaul with 48 tests
- **Documentation**: Comprehensive updates with clear structure

## 🚀 Development

### **Development Commands**

```bash
# Development
npm run dev              # Start dev server (port 3000)
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

1. Follow development rules in [CLAUDE.md](CLAUDE.md)
2. Run `npm run build:check` before committing
3. Write tests for new features
4. Update documentation for significant changes
5. Ensure zero TypeScript/ESLint errors

---

**Last Updated**: October 3, 2025 at 12:30 PM ET  
**Status**: Production Ready - Marketing platform fully operational with Sales Dashboard and multi-tenant support
