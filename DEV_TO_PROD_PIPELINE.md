# Development to Production Pipeline

## Overview

This guide establishes a complete development → staging → production pipeline using:
- **Two Supabase Projects**: Development and Production (both remote)
- **Git Branches**: `develop` (default), `staging`, `main` (production)
- **Vercel Deployments**: Automatic deployments per branch
- **Database Sync**: Keep schemas identical between environments

## 1. Supabase Project Structure

### Current Setup
- **Development Database**: `vgpovgpwqkjnpnrjelyg` (existing)
  - Used by both desktop and laptop
  - Contains test data
  - All development work happens here

### New Production Setup
- **Production Database**: New Supabase project (to be created)
  - Identical schema to development
  - Clean data (no test users)
  - Only production data

## 2. Git Branch Strategy

```
develop (default branch)
  ├── feature/xyz → develop (feature work)
  ├── staging → staging environment (pre-production testing)
  └── main → production (live site)
```

### Branch Purposes

#### `develop` Branch (Default)
- All development work
- Connected to development Supabase
- Auto-deploys to `dev.gnymble.com`
- Email confirmation can be skipped
- Dev auth enabled

#### `staging` Branch
- Pre-production testing
- Connected to production Supabase (but different Vercel env)
- Auto-deploys to `staging.gnymble.com`
- Email confirmation required
- Dev auth enabled (for testing)

#### `main` Branch
- Production only
- Connected to production Supabase
- Auto-deploys to `gnymble.com` and `app.gnymble.com`
- Email confirmation required
- Dev auth disabled

## 3. Create Production Supabase Project

### Step 1: Duplicate Project Structure

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project: `sms-hub-production`
3. Save credentials:
   ```
   Production URL: https://[your-prod-ref].supabase.co
   Production Anon Key: [save this]
   Production Service Role: [save this - keep secret!]
   ```

### Step 2: Copy Schema from Development

```bash
# Export development schema (structure only, no data)
npx supabase db dump --db-url "postgresql://postgres:[DEV_PASSWORD]@db.vgpovgpwqkjnpnrjelyg.supabase.co:5432/postgres" --schema-only > schema.sql

# Import to production
psql "postgresql://postgres:[PROD_PASSWORD]@db.[PROD_REF].supabase.co:5432/postgres" < schema.sql
```

### Step 3: Configure Production Authentication

In Production Supabase Dashboard:

1. **Authentication → Settings**:
   - Enable email confirmations: ON
   - Enable new user signups: ON

2. **Authentication → URL Configuration**:
   ```
   Site URL: https://gnymble.com
   Redirect URLs:
   - https://gnymble.com/verify-auth
   - https://app.gnymble.com
   - https://staging.gnymble.com/verify-auth
   - https://app-staging.gnymble.com
   ```

3. **Authentication → Email Templates**:
   - Customize confirmation email template
   - Ensure links point to production domain

## 4. Vercel Configuration

### Create Three Vercel Projects

#### 1. Web App - Development
- **Name**: `sms-hub-web-dev`
- **Production Branch**: `develop`
- **Domain**: `dev.gnymble.com`

#### 2. Web App - Staging/Production
- **Name**: `sms-hub-web`
- **Production Branch**: `main`
- **Preview Branch**: `staging`
- **Domains**:
  - Production: `gnymble.com`, `www.gnymble.com`
  - Staging: `staging.gnymble.com`

#### 3. Unified App - Development
- **Name**: `sms-hub-unified-dev`
- **Production Branch**: `develop`
- **Domain**: `app-dev.gnymble.com`

#### 4. Unified App - Staging/Production
- **Name**: `sms-hub-unified`
- **Production Branch**: `main`
- **Preview Branch**: `staging`
- **Domains**:
  - Production: `app.gnymble.com`
  - Staging: `app-staging.gnymble.com`

### Environment Variables per Project

#### Development Projects (`sms-hub-web-dev`, `sms-hub-unified-dev`)
```bash
# Development Supabase
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=[dev-anon-key]

# URLs
VITE_WEB_APP_URL=https://dev.gnymble.com
VITE_UNIFIED_APP_URL=https://app-dev.gnymble.com

# Features
VITE_SKIP_EMAIL_CONFIRMATION=true
VITE_ENABLE_DEV_AUTH=true
VITE_DEV_AUTH_TOKEN=dev-token-xyz
```

#### Staging (Preview deployments on main projects)
```bash
# Production Supabase (same database, different features)
VITE_SUPABASE_URL=https://[prod-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[prod-anon-key]

# URLs
VITE_WEB_APP_URL=https://staging.gnymble.com
VITE_UNIFIED_APP_URL=https://app-staging.gnymble.com

# Features (testing enabled)
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=true
VITE_DEV_AUTH_TOKEN=staging-token-xyz
```

#### Production (main branch on main projects)
```bash
# Production Supabase
VITE_SUPABASE_URL=https://[prod-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[prod-anon-key]

# URLs
VITE_WEB_APP_URL=https://gnymble.com
VITE_UNIFIED_APP_URL=https://app.gnymble.com

# Features (all testing disabled)
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=false
```

## 5. Database Synchronization Strategy

### Keeping Schemas in Sync

#### Option A: Migration Files (Recommended)
```bash
# When you make schema changes in development:

# 1. Create migration
npx supabase migration new add_new_feature

# 2. Write your SQL changes
edit supabase/migrations/[timestamp]_add_new_feature.sql

# 3. Apply to development
npx supabase db push --db-url "postgresql://...dev..."

# 4. Test in development

# 5. Apply to production (after testing)
npx supabase db push --db-url "postgresql://...prod..."
```

#### Option B: Sync Script
Create `scripts/sync-schema.sh`:

```bash
#!/bin/bash

# Sync schema from dev to prod (structure only)
echo "Syncing schema from development to production..."

# Export dev schema
npx supabase db dump \
  --db-url "$DEV_DATABASE_URL" \
  --schema-only > temp_schema.sql

# Apply to production
psql "$PROD_DATABASE_URL" < temp_schema.sql

echo "Schema sync complete!"
```

### Data Management

**Development Database**:
- Contains test users and sample data
- Can be reset/modified freely
- Used for all development and testing

**Production Database**:
- Only real user data
- Never reset or modified directly
- Changes only through tested migrations

## 6. Deployment Workflow

### Feature Development
```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. Make changes, test locally
# Uses development Supabase

# 3. Push to GitHub
git push origin feature/new-feature

# 4. Create PR to develop
# Vercel creates preview deployment
# Still uses development database

# 5. Merge to develop
# Auto-deploys to dev.gnymble.com
```

### Staging Deployment
```bash
# 1. When ready to test in staging
git checkout staging
git pull origin staging
git merge develop

# 2. Push to staging
git push origin staging

# 3. Vercel deploys to staging.gnymble.com
# Uses production database but with staging features

# 4. Test thoroughly
```

### Production Deployment
```bash
# 1. After staging approval
git checkout main
git pull origin main
git merge staging

# 2. Push to production
git push origin main

# 3. Vercel deploys to gnymble.com
# Uses production database with all features disabled
```

## 7. Edge Functions Deployment

### Development
```bash
# Link to dev project
npx supabase link --project-ref vgpovgpwqkjnpnrjelyg

# Deploy to development
npx supabase functions deploy --all

# Set dev secrets
npx supabase secrets set ENVIRONMENT=development
npx supabase secrets set SKIP_EMAIL_CONFIRMATION=true
```

### Production
```bash
# Link to production project
npx supabase link --project-ref [prod-ref]

# Deploy to production
npx supabase functions deploy --all

# Set production secrets
npx supabase secrets set ENVIRONMENT=production
npx supabase secrets set SKIP_EMAIL_CONFIRMATION=false
npx supabase secrets set PUBLIC_SITE_URL=https://gnymble.com
```

## 8. Environment Detection in Code

The code automatically detects environment based on:

```typescript
// In apps/web/src/config/environment.ts
function detectEnvironment(): Environment {
  const hostname = window.location.hostname;

  if (hostname.includes('dev.')) return 'development';
  if (hostname.includes('staging.')) return 'staging';
  if (hostname.includes('localhost')) return 'development';

  return 'production';
}
```

## 9. Quick Reference

### Domains
| Environment | Web App | Unified App | Database |
|------------|---------|-------------|----------|
| Development | dev.gnymble.com | app-dev.gnymble.com | Dev Supabase |
| Staging | staging.gnymble.com | app-staging.gnymble.com | Prod Supabase |
| Production | gnymble.com | app.gnymble.com | Prod Supabase |

### Features by Environment
| Feature | Development | Staging | Production |
|---------|------------|---------|------------|
| Skip Email Confirmation | ✅ | ❌ | ❌ |
| Dev Auth | ✅ | ✅ | ❌ |
| Debug Mode | ✅ | ✅ | ❌ |
| Analytics | ❌ | ❌ | ✅ |

### Git Branches
- `develop` → Development (default)
- `staging` → Pre-production testing
- `main` → Production

## 10. Monitoring

### Development
- Check Vercel logs for dev deployments
- Monitor dev Supabase dashboard
- Test with various scenarios

### Staging
- Full testing of production features
- Performance testing
- User acceptance testing

### Production
- Monitor Vercel Analytics
- Check Supabase logs
- Set up error tracking (Sentry)
- Monitor user signups

## Next Steps

1. **Create production Supabase project**
2. **Copy schema from development**
3. **Set up Vercel projects**
4. **Configure environment variables**
5. **Set up Git branches**
6. **Test complete pipeline**
7. **Document any customizations**

Remember: Never make direct changes to production. Always go through develop → staging → production pipeline!