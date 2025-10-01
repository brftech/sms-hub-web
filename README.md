# SMS Hub Web App

Standalone marketing and authentication gateway for the SMS Hub platform.

## Overview

This is the public-facing web application for the SMS Hub multi-tenant B2B SMS SaaS platform. It provides:

- Marketing landing pages for multiple hubs (Gnymble, PercyTech, PercyMD, PercyText)
- User authentication (signup/login) with magic link flow
- Hub-specific branding and content
- Contact forms and lead capture
- Integrated admin dashboard for data management

## 📜 History: The Journey to Production

### Phase 1: Monorepo Era (2024)

- **Initial Architecture**: Built as part of a Turbo monorepo with multiple apps (web, unified, admin, user)
- **Complexity Challenge**: Multiple apps with overlapping functionality and complex workspace dependencies
- **Deployment Issues**: Struggled with multi-app Vercel deployments and configuration conflicts
- **Team Learning**: Recognized that architectural complexity was slowing development

### Phase 2: Migration & Consolidation (Late 2024 - Early 2025)

- **Strategic Decision**: Migrated from monorepo to standalone React application
- **Consolidation**: Merged all functionality into single cohesive web app
- **Architecture Cleanup**: Removed legacy apps (unified, admin, user) and consolidated admin dashboard into marketing site
- **Benefits Realized**: Simplified deployment, easier maintenance, focused development
- **Key Insight**: Simpler is better - standalone app proved more maintainable

### Phase 3: Foundation Building (January 2025)

- **January 15-20**: Complete monorepo migration, standalone architecture established
- **January 21-25**: Admin dashboard integration with full CRUD operations
- **January 26-28**: Code quality improvements, console cleanup (55+ statements removed), TypeScript strict mode
- **January 29**: Environment-based login routing, comprehensive testing infrastructure
- **January 30**: UI optimization planning, database migration research, documentation framework

### Phase 4: Optimization & Documentation (September - October 2025)

Major accomplishments:

- **UI Optimization**: Implemented lean import patterns, fixed missing exports in marketing index
- **Bundle Optimization**: Reduced bundle size through strategic component exports
- **Database Migration**: Created comprehensive marketing-focused schema (15+ tables)
- **Documentation Overhaul**: Complete restructure with clear history → present → future narrative
- **Type Safety**: Fixed all TypeScript errors, zero warnings in production build
- **Build Verification**: Successful typecheck, lint, and build with optimized chunks
- **Sales Dashboard**: Rebranded admin dashboard with hub-specific filtering and branded buttons
- **Logger Removal**: Simplified debugging by removing unnecessary logger package (~1,000 lines)

## 🎯 Present Status: October 1, 2025

### Current State: ✅ **PRODUCTION READY & OPTIMIZED**

The SMS Hub Web application is a mature, production-ready React application with comprehensive optimizations and clear strategic direction.

#### Core Features (Production Deployed)

- **Multi-Hub Marketing Site**: 4 distinct business brands (Gnymble, PercyTech, PercyMD, PercyText)
- **Sales Dashboard**: Hub-filtered CRUD operations for leads, statistics, data export with branded UI
- **Contact Forms**: Lead capture with hub-specific branding and Supabase Edge Functions
- **Authentication System**: Environment-based login routing (dev: localhost:3001, prod: app.gnymble.com)
- **Responsive Design**: Mobile-first approach with Tailwind CSS

#### Technical Excellence (Achieved Today)

- **Zero Errors**: TypeScript and ESLint fully compliant
- **Clean Build**: No console warnings, strict mode enabled
- **Optimized Performance**: Lean imports, bundle splitting, lazy loading
  - Main bundle: 302KB → 91KB gzipped
  - Total 27 optimized chunks with route-based code splitting
- **Comprehensive Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Security**: Proper authentication, data isolation, secure API key management

#### Infrastructure (Production Ready)

- **Database**: Supabase PostgreSQL with separate dev/prod environments
  - Dev: `hmumtnpnyxuplvqcmnfk` (web-dev)
  - Prod: `fwlivygerbqzowbzxesw` (web-prod)
  - Schema: 15+ marketing-focused tables (see supabase/migrations/)
- **Deployment**: Vercel with automatic deployments
- **CI/CD**: Type checking, linting, testing before deployment
- **Monitoring**: Error tracking, analytics, performance monitoring

### Recent Achievements (September - October 2025)

**Sales Dashboard Enhancement**:

- ✅ Rebranded Admin Dashboard to "Sales Dashboard"
- ✅ Added hub-specific filtering for all data (leads, subscribers, campaigns)
- ✅ Branded "Add Lead" button with hub-specific colors
- ✅ Improved layout with intuitive button placement
- ✅ Minimized debug float by default for cleaner UI

**Code Simplification**:

- ✅ Removed @sms-hub/logger package (~1,000 lines eliminated)
- ✅ Replaced with simple console.log/error for marketing site
- ✅ Reduced bundle size and simplified codebase
- ✅ Maintained clean build with zero errors

**E2E Testing Overhaul**:

- ✅ Completely rebuilt Playwright test suite from scratch
- ✅ Removed outdated monorepo-era signup/login tests
- ✅ Created 48 working tests across 6 browser configurations
- ✅ Organized tests by feature: web/, admin/, integration/
- ✅ Fixed all selector issues to match actual component structure
- ✅ Added comprehensive test documentation and best practices

**Build Quality**:

- ✅ Fixed missing exports in `packages/ui/src/index-marketing.ts`
- ✅ Added HubSwitcher, Badge, and Sidebar components to marketing exports
- ✅ Corrected type exports (HubType instead of Hub)
- ✅ Successful production build with all optimizations

**Database & Architecture**:

- ✅ Implemented marketing-focused database schema
- ✅ Defined 15+ tables for email/SMS marketing, analytics, and tracking
- ✅ Migrated from customer management to marketing focus
- ✅ Synchronized TypeScript types with database schema

## 🚀 Future Roadmap: Strategic Direction

### Short Term (Q4 2025) - Foundation Enhancement

**Email Marketing Integration**

- [ ] Connect email campaigns to Resend API
- [ ] Build email list management UI
- [ ] Implement campaign creation workflow
- [ ] Track open rates and click-through metrics

**SMS Campaign Management**

- [ ] Build SMS campaign creation UI
- [ ] Integrate with existing SMS infrastructure
- [ ] Implement scheduling and automation
- [ ] Track delivery and engagement metrics

**Analytics & Insights**

- [ ] Visualize website analytics dashboard
- [ ] Implement conversion tracking
- [ ] Build lead scoring system based on engagement
- [ ] Create performance reports

**Optimization & Testing**

- [ ] A/B testing framework for landing pages
- [ ] Performance monitoring dashboard
- [ ] User feedback collection system

### Medium Term (Q1-Q2 2026) - Advanced Features

**Marketing Automation**

- [ ] Advanced audience segmentation
- [ ] Drip campaign builder
- [ ] Automated workflow engine
- [ ] Behavioral triggers and actions

**Integrations & Extensibility**

- [ ] Integration hub with Zapier, Make
- [ ] Webhook system for external tools
- [ ] Custom API endpoints
- [ ] Third-party app marketplace

**Enterprise Features**

- [ ] Custom reporting and data export
- [ ] Team collaboration tools
- [ ] Role-based access control (beyond admin)
- [ ] Multi-language support (i18n)
- [ ] White label customization options

### Long Term (Q3-Q4 2026) - Innovation & Scale

**AI-Powered Capabilities**

- [ ] AI content generation for emails/SMS
- [ ] Predictive lead scoring
- [ ] Automated campaign optimization
- [ ] Intelligent send-time optimization
- [ ] Sentiment analysis and insights

**Platform Evolution**

- [ ] Native iOS/Android mobile apps
- [ ] Advanced predictive analytics
- [ ] Customer lifetime value modeling
- [ ] Full white label solution
- [ ] API marketplace and ecosystem
- [ ] Partner program and integrations

### Infrastructure Goals (Ongoing)

**Performance**

- [ ] Achieve <2s page load times globally
- [ ] Implement edge caching strategies
- [ ] Optimize database query performance
- [ ] Progressive Web App (PWA) capabilities

**Scalability**

- [ ] Support 100k+ leads per hub
- [ ] Horizontal database scaling
- [ ] Load balancing and failover
- [ ] Multi-region deployment

**Security & Compliance**

- [ ] SOC 2 compliance certification
- [ ] GDPR compliance tools
- [ ] Enhanced security measures
- [ ] Regular security audits
- [ ] Penetration testing

**Developer Experience**

- [ ] Improved local development setup
- [ ] Better debugging tools
- [ ] Enhanced documentation
- [ ] Automated testing expansion
- [ ] CI/CD pipeline optimization

## Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + styled-components
- **Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **UI Components**: Custom component library in `packages/ui`
- **Deployment**: Vercel
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Performance**: Optimized bundle splitting and lazy loading

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
│   │   ├── index.ts          # Full UI library
│   │   ├── index-marketing.ts # Marketing-optimized
│   │   └── index-lean.ts      # Minimal imports
│   ├── hub-logic/    # Hub-specific business logic
│   ├── supabase/     # Supabase client and queries
│   └── utils/        # Utility functions
├── supabase/         # Backend configuration
│   ├── migrations/   # Database schema
│   └── functions/    # Edge functions
├── test/             # Test files
│   ├── unit/        # Unit tests
│   ├── e2e/         # E2E tests
│   └── integration/ # Integration tests
├── docs/            # Comprehensive documentation
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

- **Core Tables**: `hubs`, `leads`, `user_profiles`
- **Email Marketing**: `email_lists`, `email_subscribers`, `email_campaigns`
- **SMS Marketing**: `sms_lists`, `sms_subscribers`, `sms_campaigns`
- **Analytics**: `marketing_campaigns`, `website_analytics`, `conversions`, `lead_activities`
- **Forms & Verification**: `contact_form_submissions`, `verifications`, `verification_attempts`

See `supabase/migrations/0000001_initial_schema.sql` for complete schema definition.

## Deployment

The app is configured for deployment on Vercel:

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod
```

## Features

- **Multi-Hub Support**: Automatic hub detection and switching with isolated data
- **Sales Dashboard**: Hub-filtered CRUD operations at `/admin` with branded UI elements
- **Authentication**: Magic link flow with Supabase Auth
- **Contact Forms**: Lead capture with hub-specific branding
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Testing**: 48 E2E tests across 6 browsers + comprehensive unit test coverage
- **Code Quality**: Strict TypeScript, ESLint, and Prettier configuration
- **Performance**: Optimized bundle splitting and lazy loading (91KB gzipped main bundle)
- **Simple Debugging**: Console-based logging for lean codebase

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
- **[README.md](./docs/README.md)**: Documentation overview and structure
- **[ADMIN_DASHBOARD.md](./docs/ADMIN_DASHBOARD.md)**: Sales Dashboard documentation
- **[VERCEL_DEPLOYMENT_GUIDE.md](./docs/VERCEL_DEPLOYMENT_GUIDE.md)**: Deployment instructions
- **[PORT_ASSIGNMENTS.md](./docs/PORT_ASSIGNMENTS.md)**: Port configuration
- **[ENVIRONMENT_VARIABLES_CHECKLIST.md](./docs/ENVIRONMENT_VARIABLES_CHECKLIST.md)**: Environment setup

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

**Status**: ✅ Production Ready & Optimized | **Version**: 0.1.0 | **Last Updated**: October 1, 2025

**Latest Achievements**: Sales Dashboard enhancement with hub-specific filtering, logger package removal for simplified codebase, and comprehensive documentation updates.
