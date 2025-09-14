# Vercel Deployment Configuration Guide

## Overview

This guide explains how to properly configure Vercel for deploying the SMS Hub monorepo with separate development, staging, and production environments.

## Environment Variables Configuration

### Required Variables for ALL Environments

Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key  # Only for Edge Functions

# App URLs (will be different per environment)
VITE_WEB_APP_URL=https://your-domain.com
VITE_UNIFIED_APP_URL=https://app.your-domain.com
PUBLIC_SITE_URL=https://your-domain.com
PUBLIC_APP_URL=https://app.your-domain.com

# External Services
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
STRIPE_SECRET_KEY=sk_live_your-stripe-key  # For Edge Functions
RESEND_API_KEY=your-resend-api-key
ZAPIER_SMS_WEBHOOK_URL=your-zapier-webhook
```

### Development Environment Variables

For Preview deployments (branch previews):

```bash
# Environment
VERCEL_ENV=development
ENVIRONMENT=development

# Feature Flags
VITE_SKIP_EMAIL_CONFIRMATION=true
VITE_ENABLE_DEV_AUTH=true
VITE_ENABLE_DEBUG=true
SKIP_EMAIL_CONFIRMATION=true  # For Edge Functions

# Dev Auth Token (generate a secure one)
VITE_DEV_AUTH_TOKEN=your-secure-dev-token
```

### Production Environment Variables

For Production deployment:

```bash
# Environment
VERCEL_ENV=production
ENVIRONMENT=production

# Feature Flags
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=false
VITE_ENABLE_DEBUG=false
SKIP_EMAIL_CONFIRMATION=false

# Security
VITE_REQUIRE_HTTPS=true
VITE_ENABLE_CSRF=true
VITE_ENABLE_RATE_LIMITING=true
```

## Supabase Configuration

### Development Database

For local development and preview branches:

1. Create a development Supabase project
2. Use these credentials in development environment variables
3. Enable email confirmations OFF in Supabase Dashboard → Authentication → Settings

### Production Database

For production deployment:

1. Create a separate production Supabase project
2. Use production credentials in production environment variables
3. Enable email confirmations ON in Supabase Dashboard → Authentication → Settings
4. Configure proper redirect URLs in Authentication → URL Configuration:
   - Site URL: `https://gnymble.com`
   - Redirect URLs:
     - `https://gnymble.com/verify-auth`
     - `https://app.gnymble.com`

## Vercel Project Setup

### 1. Import Repository

1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the monorepo root directory

### 2. Configure Build Settings

In Project Settings → General:

```json
{
  "buildCommand": "pnpm build --filter=@sms-hub/web",
  "outputDirectory": "apps/web/dist",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

For the Unified app (separate project):

```json
{
  "buildCommand": "pnpm build --filter=@sms-hub/unified",
  "outputDirectory": "apps/unified/dist",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

### 3. Configure Domains

#### Web App (Marketing/Auth)
- Production: `gnymble.com`, `www.gnymble.com`
- Staging: `staging.gnymble.com`
- Preview: Auto-generated Vercel URLs

#### Unified App (Dashboard)
- Production: `app.gnymble.com`
- Staging: `app-staging.gnymble.com`
- Preview: Auto-generated Vercel URLs

### 4. Deploy Edge Functions

Supabase Edge Functions need to be deployed separately:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy signup-native
supabase functions deploy complete-signup
supabase functions deploy resend-verification

# Set secrets for Edge Functions
supabase secrets set ENVIRONMENT=production
supabase secrets set PUBLIC_SITE_URL=https://gnymble.com
supabase secrets set PUBLIC_APP_URL=https://app.gnymble.com
supabase secrets set SKIP_EMAIL_CONFIRMATION=false
```

## Deployment Workflow

### Development (Your Workstations)

1. Work on feature branches
2. Push to GitHub
3. Vercel automatically creates preview deployments
4. Test with development database

### Staging (Preview Deployments)

1. Create PR to main branch
2. Vercel creates preview deployment
3. Test with staging environment variables
4. Verify all features work correctly

### Production

1. Merge PR to main branch
2. Vercel automatically deploys to production
3. Uses production database and environment variables
4. Monitor for any issues

## Environment-Specific Behaviors

### Development Mode
- Email confirmation can be skipped (SKIP_EMAIL_CONFIRMATION=true)
- Dev auth enabled (access with ?superadmin=token)
- Debug mode shows additional logging
- Uses localhost URLs for redirects

### Staging Mode
- Email confirmation required
- Dev auth available for testing
- Debug mode enabled
- Uses staging URLs

### Production Mode
- Email confirmation always required
- Dev auth completely disabled
- No debug logging
- Uses production URLs
- HTTPS enforced
- Rate limiting enabled

## Testing the Complete Flow

### Local Development

```bash
# Start local dev servers
pnpm dev

# Test signup flow
1. Go to http://localhost:3000/signup
2. Complete signup form
3. If SKIP_EMAIL_CONFIRMATION=true, redirects immediately
4. Otherwise, check email and click verification link
5. Verify redirect to http://localhost:3001
```

### Production

```bash
# Test production signup
1. Go to https://gnymble.com/signup
2. Complete signup form
3. Check email for verification link
4. Click link to verify email
5. Verify redirect to https://app.gnymble.com
```

## Troubleshooting

### Common Issues

1. **"Multiple GoTrueClient instances detected"**
   - Ensure using singleton pattern in Unified app
   - Check that Supabase client is not recreated

2. **Email confirmation not working**
   - Check PUBLIC_SITE_URL is set correctly
   - Verify redirect URLs in Supabase Dashboard
   - Check email provider (Resend) configuration

3. **Dev auth not working in production**
   - This is intentional - dev auth is disabled in production
   - Check VITE_ENABLE_DEV_AUTH=false in production

4. **Environment variables not loading**
   - Rebuild after changing environment variables
   - Check variable names (VITE_ prefix for client-side)
   - Verify in Vercel dashboard they're set for correct environment

### Monitoring

1. **Vercel Dashboard**
   - Check build logs
   - Monitor function logs
   - Review analytics

2. **Supabase Dashboard**
   - Monitor auth logs
   - Check Edge Function logs
   - Review database queries

3. **Error Tracking**
   - Set up Sentry or similar for production
   - Monitor console errors in development

## Security Checklist

- [ ] Separate databases for dev/prod
- [ ] Different API keys for each environment
- [ ] Dev auth disabled in production
- [ ] HTTPS enforced in production
- [ ] Rate limiting enabled in production
- [ ] Environment variables properly scoped
- [ ] No hardcoded secrets in code
- [ ] Secure dev auth token (not "dev123")
- [ ] CORS properly configured
- [ ] CSP headers configured

## Maintenance

### Updating Environment Variables

1. Change in Vercel Dashboard
2. Trigger redeployment
3. Verify changes took effect

### Database Migrations

```bash
# Create migration
supabase migration new migration_name

# Apply to local
supabase db reset

# Apply to production
supabase db push --project-ref production-ref
```

### Updating Edge Functions

```bash
# Deploy single function
supabase functions deploy function-name

# Deploy all functions
supabase functions deploy --all

# Check function logs
supabase functions logs function-name
```

## Contact & Support

For deployment issues:
- Check Vercel status page
- Review Supabase status page
- Check GitHub Actions if using CI/CD
- Contact team lead for production issues

Remember: Always test in staging before deploying to production!