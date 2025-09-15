# Remote Supabase Setup Guide

This project has been configured to use remote-only Supabase connections. No local Docker is required.

## Database Configuration

- **Development**: `vgpovgpwqkjnpnrjelyg.supabase.co` (sms-hub-monorepo project)
- **Production**: `howjinnvvtvaufihwers.supabase.co` (percytech project)

## Environment Variables

Create `.env.local` for development with these variables:

```bash
# Development Environment - Remote Supabase
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=your_dev_anon_key_here
VITE_UNIFIED_APP_URL=http://localhost:3001
VITE_WEB_APP_URL=http://localhost:3000
VITE_API_URL=http://localhost:3002

# Stripe Configuration (Development)
VITE_STRIPE_PUBLISHABLE_KEY=your_dev_stripe_publishable_key
VITE_STRIPE_PRICE_STARTER=price_dev_starter
VITE_STRIPE_PRICE_PROFESSIONAL=price_dev_professional
VITE_STRIPE_PRICE_ENTERPRISE=price_dev_enterprise

# Email Configuration
VITE_RESEND_API_KEY=your_resend_api_key
VITE_EMAIL_FROM=noreply@gnymble.com

# Development Features
VITE_DEBUG_MODE=true
VITE_DEV_AUTH=true
```

Create `.env.production` for production with these variables:

```bash
# Production Environment - Remote Supabase
VITE_SUPABASE_URL=https://howjinnvvtvaufihwers.supabase.co
VITE_SUPABASE_ANON_KEY=your_prod_anon_key_here
VITE_UNIFIED_APP_URL=https://unified.gnymble.com
VITE_WEB_APP_URL=https://www.gnymble.com
VITE_API_URL=https://api.gnymble.com

# Stripe Configuration (Production)
VITE_STRIPE_PUBLISHABLE_KEY=your_prod_stripe_publishable_key
VITE_STRIPE_PRICE_STARTER=price_prod_starter
VITE_STRIPE_PRICE_PROFESSIONAL=price_prod_professional
VITE_STRIPE_PRICE_ENTERPRISE=price_prod_enterprise

# Email Configuration
VITE_RESEND_API_KEY=your_prod_resend_api_key
VITE_EMAIL_FROM=noreply@gnymble.com

# Production Features
VITE_DEBUG_MODE=false
VITE_DEV_AUTH=false
```

## Quick Start

1. Create your environment files using the templates above
2. Link to development database: `npm run db:link:dev`
3. Run migrations: `npm run db:push:dev`
4. Start development: `npm run dev:remote`

## Available Scripts

- `npm run dev:remote` - Start development with remote Supabase
- `npm run db:link:dev` - Link to development database
- `npm run db:link:prod` - Link to production database
- `npm run db:push:dev` - Push migrations to development
- `npm run db:push:prod` - Push migrations to production
- `npm run functions:deploy:dev` - Deploy Edge Functions to development
- `npm run functions:deploy:prod` - Deploy Edge Functions to production
