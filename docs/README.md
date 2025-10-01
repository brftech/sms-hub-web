# SMS Hub Web - Documentation

## 📚 Documentation Overview

This folder contains comprehensive documentation for the SMS Hub Web application - a standalone React application that provides marketing and lead management services with multi-hub support.

## 📜 What This Project Is

**SMS Hub Web** is a production-ready marketing website with integrated admin dashboard for a multi-tenant B2B SMS SaaS platform. It serves as the public-facing presence for four distinct business brands (Gnymble, PercyTech, PercyMD, PercyText) with isolated data, branding, and customer experiences.

### Project Evolution

- **2024**: Started as complex Turbo monorepo with multiple apps
- **Late 2024 - Early 2025**: Migrated to focused standalone React application
- **January 2025**: Achieved production readiness with comprehensive testing
- **September 2025**: Optimized for performance with clear future roadmap

## 📋 Documentation Structure

### 🎯 Essential Reading

Start with these documents for complete understanding:

#### [CLAUDE.md](./CLAUDE.md) - **START HERE**
Complete development guide with project architecture, historical context, and AI agent instructions.

**Contains:**
- Project overview and core architecture
- Historical context and lessons learned
- Current status and recent accomplishments
- Future roadmap (short/medium/long term)
- Critical implementation details
- Development workflow and database operations
- Security guidelines and best practices
- Testing and quality assurance procedures

**Best for:** Developers, AI agents, technical leads

#### [QUICK_START.md](./QUICK_START.md)
Quick start guide for developers getting started with the project.

**Contains:**
- Prerequisites and initial setup
- Key concepts (hub system, authentication, database)
- Common development tasks
- Testing procedures
- Troubleshooting guide
- Development rules and pro tips
- Current status and roadmap summary

**Best for:** New developers, quick reference

### 🔧 Technical Documentation

#### [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md)
Comprehensive guide for the admin dashboard functionality.

**Contains:**
- Features and capabilities overview
- Access methods and authentication
- CRUD operations for leads management
- Security considerations
- Usage instructions
- Troubleshooting guide

**Best for:** Product managers, administrators, feature developers

#### [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
Complete deployment guide for Vercel platform.

**Contains:**
- Architecture overview
- Deployment commands and setup
- Vercel configuration details
- Domain configuration
- Environment variables for dev/prod
- Common issues and solutions
- File structure and deployment process

**Best for:** DevOps, deployment managers, CI/CD setup

#### [PORT_ASSIGNMENTS.md](./PORT_ASSIGNMENTS.md)
Port configuration and assignment strategy for the application.

**Contains:**
- Current port assignments
- Production and development architecture
- Port management and troubleshooting
- Recent changes and consolidation notes
- External services configuration

**Best for:** Infrastructure, local development setup

#### [ENVIRONMENT_VARIABLES_CHECKLIST.md](./ENVIRONMENT_VARIABLES_CHECKLIST.md)
Checklist for required environment variables.

**Contains:**
- Required variables for Edge Functions
- Local development setup
- Production configuration
- Recent updates to environment handling

**Best for:** Setup, configuration, troubleshooting

#### [DATABASE_MIGRATION.sql](./DATABASE_MIGRATION.sql)
Complete database migration script for marketing-focused schema.

**Contains:**
- Migration from customer management to marketing focus
- 15+ table definitions for email/SMS marketing
- Indexes for performance optimization
- Functions and triggers for automation
- Default data insertion
- Complete schema documentation

**Best for:** Database administrators, schema changes, data migration

## 🎯 Quick Navigation

### For New Developers

1. **Start**: Read [CLAUDE.md](./CLAUDE.md) for complete overview
2. **Setup**: Follow [QUICK_START.md](./QUICK_START.md) for installation
3. **Features**: Review [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) for admin features
4. **Deploy**: Check [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) when ready

### For Deployment

1. **Architecture**: Review [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
2. **Environment**: Check [ENVIRONMENT_VARIABLES_CHECKLIST.md](./ENVIRONMENT_VARIABLES_CHECKLIST.md)
3. **Database**: Review [DATABASE_MIGRATION.sql](./DATABASE_MIGRATION.sql) for schema
4. **Verify**: Test all environment variables are properly configured

### For Understanding Admin Functionality

1. **Features**: Read [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) for capabilities
2. **Development**: Check [CLAUDE.md](./CLAUDE.md) for implementation details
3. **Testing**: Use [QUICK_START.md](./QUICK_START.md) for testing procedures

### For Database Work

1. **Schema**: Review [DATABASE_MIGRATION.sql](./DATABASE_MIGRATION.sql) for complete schema
2. **Types**: Generate types from database (see [QUICK_START.md](./QUICK_START.md))
3. **Development**: Use [CLAUDE.md](./CLAUDE.md) for database operation guidelines

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + styled-components
- **Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Authentication**: Magic link authentication
- **State Management**: React Query (TanStack Query)
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Deployment**: Vercel
- **Performance**: Optimized bundle splitting and lazy loading

## 🌐 Multi-Hub System

The application supports multiple business hubs with isolated data:

- **PercyTech** (Hub ID: 0) - Red theme, technology focus
- **Gnymble** (Hub ID: 1) - Orange theme, default hub
- **PercyMD** (Hub ID: 2) - Red theme, medical focus
- **PercyText** (Hub ID: 3) - Purple theme, text messaging focus

Each hub has:
- Distinct branding and theming
- Isolated database records (via `hub_id`)
- Hub-specific contact forms
- Separate analytics and tracking
- Independent customer experiences

## 🔐 Authentication & Access

### User Authentication
- **Development**: Login redirects to `localhost:3001/login`
- **Production**: Login redirects to `app.gnymble.com`
- **Method**: Magic link authentication via Supabase Auth

### Admin Access
- **Location**: Available at `/admin` route
- **Development**: Automatic access with debug features
- **Production**: Requires secure access code
- **Features**: Database statistics, CRUD operations, data export

## 💳 Subscription Tiers

The platform offers multiple subscription tiers with varying limits and features:

### Monthly Plans
- **Starter ($79/month)**: 200 SMS/month, 50 contacts, 1 user, 1 phone number, 10/min throughput, 1 segment, basic campaigns
- **Core ($179/month)**: 1,500 SMS/month, 500 contacts, 3 users, 1 phone number, 40/min throughput, 3 segments, basic campaigns
- **Elite ($349/month)**: 8,000 SMS/month, 3,000 contacts, unlimited users, 2 phone numbers, 200/min throughput, 8 segments, AI, Zapier, VIP support
- **Enterprise**: 50,000+ SMS/month, all unlimited features
- **VIP**: Unlimited everything, white-glove service

### Onboarding
- **Get Started Package ($179 one-time)**: Complete setup, compliance consultation, training, first month included

Tier limits are enforced via the `getSubscriptionLimits()` function in `packages/supabase/src/subscription-queries.ts`.

## 📊 Database Schema

Marketing-focused database schema with 15+ tables:

### Core Tables
- `hubs` - Business hub configurations
- `leads` - Lead management with scoring
- `user_profiles` - User account information
- `customers` - Customer records with subscription tracking

### Subscription Management
- `customers.subscription_tier` - Current tier (starter, core, elite, enterprise, vip)
- `customers.subscription_status` - Status (active, trialing, canceled, past_due)
- Tier limits enforced in application code

### Email Marketing
- `email_lists` - Email marketing lists
- `email_subscribers` - Subscribers with engagement tracking
- `email_campaigns` - Campaign performance

### SMS Marketing
- `sms_lists` - SMS marketing lists
- `sms_subscribers` - Subscribers with engagement tracking
- `sms_campaigns` - Campaign performance

### Analytics & Tracking
- `marketing_campaigns` - Cross-channel campaign tracking
- `website_analytics` - Website visit and event tracking
- `conversions` - Conversion tracking
- `lead_activities` - Lead engagement history

### Forms & Verification
- `contact_form_submissions` - Contact form data
- `verifications` - Email/phone verification
- `verification_attempts` - Verification attempt tracking

See [DATABASE_MIGRATION.sql](./DATABASE_MIGRATION.sql) for complete schema.

## 🧪 Testing Strategy

- **Unit Tests**: Vitest with Testing Library for component testing
- **E2E Tests**: Playwright for browser automation and user flows
- **Integration Tests**: Cross-hub functionality and data isolation
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Coverage**: Comprehensive test coverage across all features

## 🔄 Recent Updates

### September 30, 2025 (Current)
- **UI Optimization**: Added lean import options for better bundle splitting
- **Database Migration**: Created marketing-focused schema migration script
- **Import Patterns**: Optimized component imports to reduce bundle size
- **Documentation**: Complete overhaul with history, present, and future sections
- **Roadmap**: Defined clear short/medium/long term goals

### January 2025
- **Consolidation**: Removed outdated monorepo documentation
- **Updates**: All files reflect current standalone app structure
- **Streamlined**: Eliminated redundant and conflicting information
- **Modernized**: Updated to reflect current technology stack and deployment
- **Enhanced**: Added comprehensive testing and code quality documentation

### Migration Context

The project successfully migrated from a Turbo monorepo structure to a standalone React application:

- **Before**: Multiple apps (web, unified, admin, user) with complex workspace configuration
- **After**: Single standalone React app with consolidated functionality
- **Benefits**: Simplified deployment, easier maintenance, focused development
- **Lessons**: Simplicity wins, consolidation beats separation, testing provides confidence

## 📞 Support & Troubleshooting

If you encounter issues or need clarification:

1. **Check Documentation**: Review the relevant documentation file first
2. **Troubleshooting Sections**: Look for troubleshooting guides in each doc
3. **Environment Variables**: Verify all required variables are set correctly
4. **Edge Functions**: Check Supabase Edge Functions logs for backend issues
5. **Type Errors**: Run `npm run type-check` to identify TypeScript issues
6. **Linting**: Run `npm run lint` to catch code quality issues

## 🎯 Current Status

**Production Status**: ✅ **FULLY OPERATIONAL**

The SMS Hub Web application is a mature, production-ready React application with:

- Clean, maintainable codebase (zero errors/warnings)
- Comprehensive testing coverage (unit + E2E)
- Clear historical context and lessons learned
- Well-defined future roadmap with priorities
- Strong multi-tenant architecture
- Production-proven reliability
- Complete documentation suite

## 🚀 Future Roadmap

### Short Term (Q4 2025)
Email marketing integration, SMS campaign management, analytics dashboard, lead scoring, A/B testing

### Medium Term (Q1-Q2 2026)
Advanced segmentation, marketing automation, third-party integrations, custom reports, multi-language support

### Long Term (Q3-Q4 2026)
AI-powered features, predictive analytics, white label solution, native mobile apps, API marketplace

See [CLAUDE.md](./CLAUDE.md) for detailed roadmap with specific features.

## 📖 Documentation Best Practices

When updating documentation:

1. **Keep History**: Document what changed and why
2. **Update All Relevant Docs**: Ensure consistency across files
3. **Version Dates**: Include "Last Updated" dates
4. **Clear Examples**: Provide code examples where helpful
5. **Link Between Docs**: Cross-reference related documentation
6. **Test Instructions**: Verify all commands and instructions work
7. **Explain Decisions**: Document non-obvious architectural choices

## 🎓 Learning Resources

### For Understanding the Codebase
1. Start with [CLAUDE.md](./CLAUDE.md) - Full architectural overview
2. Review [QUICK_START.md](./QUICK_START.md) - Hands-on development guide
3. Explore source code in `src/` directory
4. Check test files for usage examples

### For Contributing
1. Read development rules in [QUICK_START.md](./QUICK_START.md)
2. Follow patterns in existing code
3. Write tests for new features
4. Update documentation for significant changes
5. Run `npm run build:check` before committing

### For Deployment
1. Follow [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
2. Check [ENVIRONMENT_VARIABLES_CHECKLIST.md](./ENVIRONMENT_VARIABLES_CHECKLIST.md)
3. Review [PORT_ASSIGNMENTS.md](./PORT_ASSIGNMENTS.md) for configuration
4. Test thoroughly before production deployment

---

**The SMS Hub Web application is a focused, maintainable React application with comprehensive documentation to support continued development and scaling.**

**Last Updated**: September 30, 2025 | **Status**: Production Ready | **Version**: 0.1.0