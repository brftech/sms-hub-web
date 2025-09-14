# Production Setup Guide - SMS Hub Platform

## Overview

This guide walks through setting up a complete production environment with:
- Separate Supabase project for production
- Vercel deployment configuration
- Environment variable management
- Database migration strategy
- CI/CD pipeline

## 1. Create Production Supabase Project

### Step 1: Create New Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Configure:
   - **Project Name**: `sms-hub-production`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Plan**: Pro plan recommended for production

### Step 2: Configure Authentication

1. Go to **Authentication → Providers**
   - Enable Email provider
   - Disable all other providers for now

2. Go to **Authentication → Email Templates**
   - Update confirmation email template:
   ```html
   <h2>Confirm your email</h2>
   <p>Welcome to {{ .SiteURL }}!</p>
   <p>Click below to confirm your email:</p>
   <a href="{{ .ConfirmationURL }}">Confirm Email</a>
   ```

3. Go to **Authentication → URL Configuration**
   - **Site URL**: `https://gnymble.com`
   - **Redirect URLs**:
     ```
     https://gnymble.com/verify-auth
     https://app.gnymble.com
     https://gnymble.com/auth-callback
     ```

### Step 3: Get Production Credentials

Go to **Settings → API** and save these:
- `Project URL` (your-project.supabase.co)
- `Anon/Public Key` (for frontend)
- `Service Role Key` (for backend - KEEP SECRET!)

## 2. Database Migration Strategy

### Option A: Fresh Schema (Recommended)

Create a migration script to set up production database:

```bash
# In your local development environment
cd /Users/bryan/Dev/sms-hub-monorepo

# Generate migration from current schema
supabase db dump --schema-only > supabase/migrations/production_schema.sql

# Link to production project
supabase link --project-ref YOUR_PRODUCTION_PROJECT_REF

# Push schema to production
supabase db push

# Deploy Edge Functions
supabase functions deploy --all
```

### Option B: Copy Existing Data

If you need to migrate existing data:

```bash
# Export from development (schema + data)
pg_dump postgresql://[DEV_CONNECTION_STRING] > dev_backup.sql

# Import to production
psql postgresql://[PROD_CONNECTION_STRING] < dev_backup.sql
```

## 3. Vercel Project Configuration

### Step 1: Create Vercel Projects

You'll need TWO Vercel projects:

1. **Web App** (Marketing & Auth)
   - Repository: `sms-hub-monorepo`
   - Root Directory: `/`
   - Framework: Vite

2. **Unified App** (Dashboard)
   - Repository: Same (`sms-hub-monorepo`)
   - Root Directory: `/`
   - Framework: Vite

### Step 2: Configure Build Settings

#### For Web App Project:

```json
{
  "buildCommand": "pnpm build --filter=@sms-hub/web",
  "outputDirectory": "apps/web/dist",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev --filter=@sms-hub/web"
}
```

#### For Unified App Project:

```json
{
  "buildCommand": "pnpm build --filter=@sms-hub/unified",
  "outputDirectory": "apps/unified/dist",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev --filter=@sms-hub/unified"
}
```

### Step 3: Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

#### Development Environment Variables (Preview)

```bash
# Supabase Development
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=[your-dev-anon-key]

# URLs
VITE_WEB_APP_URL=https://[preview-url].vercel.app
VITE_UNIFIED_APP_URL=https://[unified-preview-url].vercel.app

# Features
VITE_SKIP_EMAIL_CONFIRMATION=true
VITE_ENABLE_DEV_AUTH=true
VITE_DEV_AUTH_TOKEN=[generate-secure-token]
```

#### Production Environment Variables

```bash
# Supabase Production
VITE_SUPABASE_URL=https://[your-prod-project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-prod-anon-key]

# URLs
VITE_WEB_APP_URL=https://gnymble.com
VITE_UNIFIED_APP_URL=https://app.gnymble.com

# Features (all disabled in production)
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=false
VITE_ENABLE_DEBUG=false

# External Services
STRIPE_PUBLISHABLE_KEY=pk_live_[your-stripe-key]
RESEND_API_KEY=[your-resend-key]
```

## 4. Domain Configuration

### For Web App (gnymble.com)

1. In Vercel Dashboard → Domains
2. Add domain: `gnymble.com`
3. Add domain: `www.gnymble.com`
4. Configure DNS:
   ```
   A Record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```

### For Unified App (app.gnymble.com)

1. In Vercel Dashboard → Domains
2. Add domain: `app.gnymble.com`
3. Configure DNS:
   ```
   CNAME: app → cname.vercel-dns.com
   ```

## 5. Supabase Edge Functions Configuration

### Set Production Secrets

```bash
# Link to production
supabase link --project-ref [PRODUCTION_PROJECT_REF]

# Set secrets
supabase secrets set ENVIRONMENT=production
supabase secrets set PUBLIC_SITE_URL=https://gnymble.com
supabase secrets set PUBLIC_APP_URL=https://app.gnymble.com
supabase secrets set SKIP_EMAIL_CONFIRMATION=false
supabase secrets set VERCEL_ENV=production

# For external services
supabase secrets set STRIPE_SECRET_KEY=sk_live_[your-key]
supabase secrets set RESEND_API_KEY=[your-key]
supabase secrets set ZAPIER_SMS_WEBHOOK_URL=[your-webhook]
```

### Deploy Functions

```bash
# Deploy all functions
supabase functions deploy signup-native
supabase functions deploy complete-signup
supabase functions deploy resend-verification

# Verify deployment
supabase functions list
```

## 6. Testing Checklist

### Development Testing

- [ ] Local signup flow works with dev database
- [ ] Email confirmation can be skipped
- [ ] Dev auth works with token
- [ ] Preview deployments work

### Production Testing

- [ ] Signup creates auth user
- [ ] Email confirmation sent
- [ ] Email link redirects correctly
- [ ] Business records created
- [ ] User can log in after signup
- [ ] No dev features accessible

## 7. Monitoring & Maintenance

### Vercel Monitoring

- **Build Logs**: Check for build errors
- **Function Logs**: Monitor API routes
- **Analytics**: Track performance
- **Alerts**: Set up for failures

### Supabase Monitoring

- **Auth Logs**: Monitor signups
- **Database Logs**: Check queries
- **Edge Function Logs**: Monitor functions
- **Usage**: Track API calls

### Error Tracking

Consider setting up:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for infrastructure monitoring

## 8. Deployment Workflow

### Development Workflow

```bash
# Work on feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally with dev database

# Push to GitHub
git push origin feature/new-feature

# Vercel creates preview deployment automatically
# Test preview with dev database
```

### Production Deployment

```bash
# Merge to main
git checkout main
git merge feature/new-feature
git push origin main

# Vercel deploys to production automatically
# Uses production database and environment
```

## 9. Rollback Strategy

### Quick Rollback

1. Go to Vercel Dashboard
2. Navigate to Deployments
3. Find last working deployment
4. Click "..." → "Promote to Production"

### Database Rollback

```bash
# Create backup before any migration
supabase db dump > backup-$(date +%Y%m%d).sql

# Rollback if needed
psql [CONNECTION_STRING] < backup-20240101.sql
```

## 10. Security Checklist

- [ ] Production uses separate Supabase project
- [ ] Service role key only in backend/Edge Functions
- [ ] Dev auth disabled in production
- [ ] HTTPS enforced everywhere
- [ ] Environment variables properly scoped
- [ ] Database backups configured
- [ ] RLS policies reviewed (when enabled)
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] CSP headers set

## Common Issues & Solutions

### "Environment variable not found"
- Rebuild after adding variables
- Check variable names (VITE_ prefix)
- Verify scope (Preview/Production)

### "Database connection failed"
- Check Supabase project status
- Verify connection pooling settings
- Check SSL requirements

### "Email not sending"
- Verify Resend/SMTP configuration
- Check Supabase email settings
- Review Edge Function logs

## Support Contacts

- **Vercel Support**: support.vercel.com
- **Supabase Support**: supabase.com/support
- **Team Lead**: [Your contact]

## Next Steps

1. Create production Supabase project
2. Set up Vercel projects
3. Configure environment variables
4. Test complete signup flow
5. Monitor for 24 hours
6. Document any issues

Remember: Always test in preview before deploying to production!