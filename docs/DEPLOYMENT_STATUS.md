# Deployment Status & Configuration

## Current Deployment Status (September 14, 2025)

### ✅ Production Deployments

#### Web App (Marketing & Auth)
- **URL**: https://www.gnymble.com (and other hub domains)
- **Vercel Project**: `sms-hub-web`
- **Project ID**: `prj_8LeHN6p9vwbiFqsYviwfUYaKq7ci`
- **Status**: ✅ DEPLOYED & WORKING
- **Recent Fix**: Fixed redirect URL to use `unified.{hub}.com` instead of `app.{hub}.com`

#### Unified App (Main Dashboard)
- **URL**: https://unified.gnymble.com (and other hub subdomains)
- **Vercel Project**: `sms-hub-unified`
- **Project ID**: `prj_hjoU7PtLbR2NL1erZ6gqZPbbbQT6`
- **Status**: ✅ DEPLOYED & WORKING
- **Recent Fix**: Fixed output directory configuration in Vercel dashboard

### 🔧 Vercel Configuration

Both projects use dashboard overrides (no root vercel.json needed):

#### sms-hub-web Settings:
- **Root Directory**: (blank - monorepo root)
- **Build Command**: `pnpm build --filter=@sms-hub/web`
- **Output Directory**: `apps/web/dist`
- **Install Command**: `pnpm install`
- **Framework**: Vite

#### sms-hub-unified Settings:
- **Root Directory**: (blank - monorepo root)
- **Build Command**: `pnpm build --filter=@sms-hub/unified`
- **Output Directory**: `apps/unified/dist`
- **Install Command**: `pnpm install`
- **Framework**: Vite

### 🌐 Domain Configuration

All domains are configured in Vercel:

#### Gnymble
- Marketing: www.gnymble.com → sms-hub-web
- App: unified.gnymble.com → sms-hub-unified

#### PercyTech
- Marketing: www.percytech.com → sms-hub-web
- App: unified.percytech.com → sms-hub-unified

#### PercyMD
- Marketing: www.percymd.com → sms-hub-web (planned)
- App: unified.percymd.com → sms-hub-unified (planned)

#### PercyText
- Marketing: www.percytext.com → sms-hub-web (planned)
- App: unified.percytext.com → sms-hub-unified (planned)

## Deployment Commands

### Using npm scripts (recommended):
```bash
# Deploy both apps
pnpm run deploy

# Deploy individual apps
pnpm run deploy:web
pnpm run deploy:unified

# Force deployment (bypass cache)
pnpm run deploy:force
```

### Using shell scripts directly:
```bash
# Deploy both
./deploy.sh

# Deploy with options
./deploy.sh --web-only
./deploy.sh --unified-only
./deploy.sh --force
```

## Deployment Process

The deployment script (`deploy.sh`):
1. Links to the correct Vercel project from monorepo root
2. Runs `vercel --prod --yes` to deploy
3. Maintains pnpm workspace context
4. Shows success/failure status

## Environment Variables

### Development (.env.local)
```
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

### Production (.env.production)
```
VITE_SUPABASE_URL=https://howjinnvvtvaufihwers.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_UNIFIED_APP_URL=https://unified.gnymble.com
```

## Known Issues & Solutions

### Issue: 404 on unified.gnymble.com
**Solution**: Deploy the unified app - it may not have been deployed after configuration changes

### Issue: Redirect goes to app.gnymble.com instead of unified
**Solution**: Already fixed in Login.tsx to use environmentConfig

### Issue: Authentication fails with "user not found"
**Solution**: Run migration 3 in production database to create superadmin users

### Issue: Vercel deployment fails with pnpm install error
**Solution**: Deploy from monorepo root, not from app directories

## Monitoring

Check deployment status:
```bash
vercel ls
vercel inspect [deployment-url]
vercel alias ls
```

## Next Steps

1. **Complete user migration**: Run migration 3 on production database
2. **Set up remaining domains**: Configure percymd.com and percytext.com
3. **Add monitoring**: Set up error tracking and analytics
4. **Performance optimization**: Enable caching and CDN