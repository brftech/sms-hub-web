# SMS Hub Web App

Standalone marketing and authentication gateway for the SMS Hub platform.

## Overview

This is the public-facing web application for the SMS Hub multi-tenant B2B SMS SaaS platform. It provides:

- Marketing landing pages for multiple hubs (Gnymble, PercyTech, PercyMD, PercyText)
- User authentication (signup/login) with magic link flow
- Hub-specific branding and content
- Contact forms and lead capture

## Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Testing**: Vitest + Testing Library
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **UI Components**: Custom component library in `packages/ui`
- **Deployment**: Vercel

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
└── public/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

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

# Run tests
npm run test

# Run linting
npm run lint

# Build for production
npm run build
```

### Environment Variables

Create a `.env.local` file with:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
# VITE_UNIFIED_APP_URL removed - admin dashboard is now part of this app
```

## Hub System

The app supports multiple business hubs with distinct branding:

- **Gnymble** (Hub ID: 1)
- **PercyTech** (Hub ID: 0)
- **PercyMD** (Hub ID: 2)
- **PercyText** (Hub ID: 3)

Hub detection is automatic based on the domain.

## Deployment

The app is configured for deployment on Vercel:

```bash
# Deploy to production
vercel --prod
```

## Related Repositories

- Admin dashboard is now integrated into this app at `/admin`

## License

Private - All rights reserved
