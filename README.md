# SMS Hub Web App

Standalone marketing and authentication gateway for the SMS Hub platform.

## Overview

This is the public-facing web application for the SMS Hub multi-tenant B2B SMS SaaS platform. It provides:

- Marketing landing pages for multiple hubs (Gnymble, PercyTech, PercyMD, PercyText)
- User authentication (signup/login) with magic link flow
- Hub-specific branding and content
- Contact forms and lead capture
- Integrated admin dashboard for data management

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

- **Gnymble** (Hub ID: 1) - Primary hub
- **PercyTech** (Hub ID: 0) - Technology focus
- **PercyMD** (Hub ID: 2) - Medical focus
- **PercyText** (Hub ID: 3) - Text messaging focus

Hub detection is automatic based on the domain and environment configuration.

## Authentication & Login

- **Development**: Login button redirects to `localhost:3001/login`
- **Production**: Login button redirects to `app.gnymble.com`
- **Admin Access**: Available at `/admin` route with password protection

## Database Schema

The application uses a marketing-focused database schema with 15 tables:

- **Core Tables**: `hubs`, `leads`, `email_subscribers`, `sms_subscribers`
- **Campaigns**: `email_campaigns`, `sms_campaigns`, `marketing_campaigns`
- **Analytics**: `website_analytics`, `conversions`, `lead_activities`
- **User Management**: `user_profiles`, `verifications`, `verification_attempts`
- **Forms**: `contact_form_submissions`

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

## License

Private - All rights reserved