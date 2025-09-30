# SMS Hub Web App

Standalone marketing and authentication gateway for the SMS Hub platform.

## Overview

This is the public-facing web application for the SMS Hub multi-tenant B2B SMS SaaS platform. It provides:

- Marketing landing pages for multiple hubs (Gnymble, PercyTech, PercyMD, PercyText)
- User authentication (signup/login) with magic link flow
- Hub-specific branding and content
- Contact forms and lead capture
- Integrated admin dashboard for data management

## 📜 History

### Origins (2024)
- **Initial Architecture**: Built as part of a Turbo monorepo with multiple apps (web, unified, admin, user)
- **Complexity Challenge**: Multiple apps with overlapping functionality and complex workspace dependencies
- **Deployment Issues**: Struggled with multi-app Vercel deployments and configuration conflicts

### Migration (Late 2024 - Early 2025)
- **Consolidation**: Migrated from monorepo to standalone React application
- **Simplification**: Merged all functionality into single cohesive web app
- **Architecture Cleanup**: Removed legacy apps and consolidated admin dashboard into marketing site
- **Benefits Realized**: Simplified deployment, easier maintenance, focused development

### Key Milestones (January 2025)
- ✅ **January 15-20**: Complete monorepo migration, standalone architecture established
- ✅ **January 21-25**: Admin dashboard integration with full CRUD operations
- ✅ **January 26-28**: Code quality improvements, console cleanup, TypeScript strict mode
- ✅ **January 29**: Environment-based login routing, comprehensive testing infrastructure
- ✅ **January 30**: UI optimization, database migration planning, documentation overhaul

## 🎯 Present Status (September 30, 2025)

### Current State: ✅ **PRODUCTION READY**

The SMS Hub Web application is a mature, production-ready React application with:

#### Core Features
- **Multi-Hub Marketing Site**: 4 distinct business brands (Gnymble, PercyTech, PercyMD, PercyText)
- **Admin Dashboard**: Full CRUD operations for leads, database statistics, data export
- **Contact Forms**: Lead capture with hub-specific branding and Supabase Edge Functions
- **Authentication System**: Environment-based login routing (dev/prod)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

#### Technical Excellence
- **Zero Errors**: TypeScript and ESLint fully compliant
- **Clean Code**: No console warnings, strict mode enabled
- **Comprehensive Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Performance**: Optimized bundle splitting and lazy loading
- **Security**: Proper authentication, data isolation, secure API key management

#### Infrastructure
- **Database**: Supabase PostgreSQL with separate dev/prod environments
  - Dev: `hmumtnpnyxuplvqcmnfk` (web-dev)
  - Prod: `fwlivygerbqzowbzxesw` (web-prod)
- **Deployment**: Vercel with automatic deployments
- **CI/CD**: Type checking, linting, testing before deployment
- **Monitoring**: Error tracking, analytics, performance monitoring

### Recent Achievements (September 30, 2025)
- **UI Optimization**: Lean import options for better bundle splitting
- **Database Migration**: Marketing-focused schema with 15 tables
- **Import Patterns**: Optimized component imports, reduced bundle size
- **Documentation**: Complete overhaul with historical context and future roadmap

## 🚀 Future Roadmap

### Short Term (Q4 2025)
- [ ] **Email Marketing Integration**: Connect email campaigns to Resend API
- [ ] **SMS Campaign Management**: Build campaign creation and tracking UI
- [ ] **Analytics Dashboard**: Visualize website analytics and conversion tracking
- [ ] **Lead Scoring**: Implement automated lead scoring based on engagement
- [ ] **A/B Testing**: Test different landing page variants for optimization

### Medium Term (Q1-Q2 2026)
- [ ] **Advanced Segmentation**: Create audience segments for targeted campaigns
- [ ] **Marketing Automation**: Build drip campaigns and automated workflows
- [ ] **Integration Hub**: Connect with third-party marketing tools (Zapier, Make)
- [ ] **Custom Reports**: Build custom reporting and data export features
- [ ] **Multi-Language Support**: Expand to international markets with i18n

### Long Term (Q3-Q4 2026)
- [ ] **AI-Powered Features**: Implement AI for content generation and optimization
- [ ] **Advanced Analytics**: Predictive analytics and customer lifetime value
- [ ] **White Label Solution**: Allow customers to white-label the platform
- [ ] **Mobile Apps**: Native iOS/Android apps for on-the-go management
- [ ] **API Marketplace**: Build ecosystem of integrations and extensions

### Infrastructure Goals
- [ ] **Performance**: Achieve <2s page load times globally
- [ ] **Scalability**: Support 100k+ leads per hub without degradation
- [ ] **Reliability**: 99.9% uptime SLA with automated failover
- [ ] **Security**: SOC 2 compliance, enhanced security measures
- [ ] **Developer Experience**: Improved tooling, faster local development

## Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + styled-components
- **Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **UI Components**: Custom component library in `packages/ui`
- **Deployment**: Vercel
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## Project Structure

```
sms-hub-web/
├── src/                # Application source code
│   ├── pages/         # Page components
│   ├── components/    # Reusable components
│   ├── services/      # Service layer
│   └── config/        # Configuration
├── packages/          # Internal packages
│   ├── ui/           # Shared UI components
│   ├── hub-logic/    # Hub-specific business logic
│   ├── supabase/     # Supabase client and queries
│   ├── utils/        # Utility functions
│   └── logger/       # Logging utilities
├── supabase/         # Backend configuration
│   ├── migrations/   # Database schema
│   └── functions/    # Edge functions
├── test/             # Test files
│   ├── unit/        # Unit tests
│   ├── e2e/         # E2E tests
│   └── integration/ # Integration tests
└── public/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account
- Playwright browsers (installed automatically)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Install Playwright browsers
npx playwright install --with-deps

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run unit tests
npm run test

# Run E2E tests
npx playwright test

# Run linting
npm run lint

# Build for production
npm run build

# Full build check (type + lint + build)
npm run build:check
```

### Environment Variables

Create a `.env.local` file with:

```bash
# Development Environment Configuration
NODE_ENV=development
VERCEL_ENV=development

# Supabase Configuration (Development Database)
VITE_SUPABASE_URL=https://hmumtnpnyxuplvqcmnfk.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# App URLs (Local Development)
VITE_WEB_APP_URL=http://localhost:3000

# Public URLs for Edge Functions
PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_DEV_AUTH=true
VITE_ENABLE_HUB_SWITCHER=true

# Dev Authentication Token
VITE_DEV_AUTH_TOKEN=your-dev-auth-token

# Stripe Payment Links
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_28E5kF2Ag5jW9va1Ks3ZK0c
```

## Hub System

The app supports multiple business hubs with distinct branding:

- **Gnymble** (Hub ID: 1) - Primary hub, orange theme
- **PercyTech** (Hub ID: 0) - Technology focus, red theme
- **PercyMD** (Hub ID: 2) - Medical focus, red theme
- **PercyText** (Hub ID: 3) - Text messaging focus, purple theme

Hub detection is automatic based on the domain and environment configuration.

## Authentication & Login

- **Development**: Login button redirects to `localhost:3001/login`
- **Production**: Login button redirects to `app.gnymble.com`
- **Admin Access**: Available at `/admin` route with password protection

## Database Schema

The application uses a marketing-focused database schema with 15+ tables:

- **Core Tables**: `hubs`, `leads`, `email_subscribers`, `sms_subscribers`
- **Lists**: `email_lists`, `sms_lists`
- **Campaigns**: `email_campaigns`, `sms_campaigns`, `marketing_campaigns`
- **Analytics**: `website_analytics`, `conversions`, `lead_activities`
- **User Management**: `user_profiles`, `verifications`, `verification_attempts`
- **Forms**: `contact_form_submissions`

See `docs/DATABASE_MIGRATION.sql` for complete schema details.

## Deployment

The app is configured for deployment on Vercel:

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod
```

## Features

- **Multi-Hub Support**: Automatic hub detection and switching
- **Admin Dashboard**: Integrated at `/admin` route with CRUD operations
- **Authentication**: Magic link flow with Supabase Auth
- **Contact Forms**: Lead capture with hub-specific branding
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Testing**: Comprehensive unit and E2E test coverage
- **Code Quality**: Strict TypeScript, ESLint, and Prettier configuration
- **Performance**: Optimized bundle splitting and lazy loading

## Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # TypeScript check
npm run lint             # Lint code
npm run lint:check       # Strict lint check
npm run format           # Format code with Prettier

# Testing
npm run test             # Run unit tests
npm run test:watch       # Watch mode
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # E2E tests with UI

# Building
npm run build            # Production build
npm run build:check      # Full build check
npm run build:analyze    # Bundle analysis
npm run preview          # Preview build

# Maintenance
npm run clean            # Clean build artifacts
npm run clean:all        # Clean everything
npm run setup            # Full development setup
```

## Documentation

Complete documentation is available in the `/docs` folder:

- **[CLAUDE.md](./docs/CLAUDE.md)**: AI agent instructions and development guide
- **[QUICK_START.md](./docs/QUICK_START.md)**: Quick start guide for developers
- **[ADMIN_DASHBOARD.md](./docs/ADMIN_DASHBOARD.md)**: Admin dashboard documentation
- **[VERCEL_DEPLOYMENT_GUIDE.md](./docs/VERCEL_DEPLOYMENT_GUIDE.md)**: Deployment instructions
- **[PORT_ASSIGNMENTS.md](./docs/PORT_ASSIGNMENTS.md)**: Port configuration
- **[ENVIRONMENT_VARIABLES_CHECKLIST.md](./docs/ENVIRONMENT_VARIABLES_CHECKLIST.md)**: Environment setup
- **[DATABASE_MIGRATION.sql](./docs/DATABASE_MIGRATION.sql)**: Database migration script

## Contributing

This is a private project. For team members:

1. Follow the development rules in `docs/QUICK_START.md`
2. Always run `npm run build:check` before committing
3. Write tests for new features
4. Update documentation for significant changes
5. Follow TypeScript strict mode and ESLint rules

## License

Private - All rights reserved

---

**Status**: ✅ Production Ready | **Version**: 0.1.0 | **Last Updated**: September 30, 2025