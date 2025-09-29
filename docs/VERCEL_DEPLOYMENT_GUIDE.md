# SMS Hub Web Deployment Guide

## 🏗️ Architecture Overview

- **1 Application**: Standalone React web app
- **NPM Package Management** with internal packages
- **Single Vercel project** for the web app
- **Hub-specific branding** determined by domain
- **Comprehensive Testing**: Vitest (unit) + Playwright (E2E)
- **Admin Dashboard**: Integrated at `/admin` route

## 📋 Current Vercel Project

| Project       | Domain          | Purpose                     |
| ------------- | --------------- | --------------------------- |
| `sms-hub-web` | www.gnymble.com | Marketing, Auth & Dashboard |

## ⚠️ CRITICAL DEPLOYMENT RULES

**ALWAYS FOLLOW THESE RULES TO PREVENT ISSUES:**

1. **ALWAYS** run `vercel` from project root directory
2. **NEVER** run deployment from subdirectories - this creates conflicts
3. **NEVER** use `--cwd` flag with vercel commands
4. **ALWAYS** use the deployment scripts provided
5. **LINK project once** - run `vercel link --project=<project-name> --yes` in project root
6. **NEVER** create multiple `.vercel` directories

## 🚀 Deployment Commands

### Simple deployment (recommended):

```bash
# Deploy from project root
vercel --prod --yes
```

### One-time setup (run once):

```bash
# Link project to Vercel project
vercel link --project=sms-hub-web --yes
```

### Optional: Create simple npm scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "deploy": "vercel --prod --yes"
  }
}
```

Then use:

```bash
npm run deploy
```

## ⚙️ Vercel Configuration

### Dashboard Settings (Critical)

The project should have these settings in Vercel Dashboard:

- **Root Directory**: `.` (project root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework**: Vite

### vercel.json File

The project has a single `vercel.json`:

**vercel.json:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "installCommand": "npm install",
  "redirects": [
    {
      "source": "/signup",
      "destination": "/pricing",
      "permanent": false
    }
  ],
  "rewrites": [
    {
      "source": "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🌐 Domain Configuration

All domains are configured in Vercel:

### Gnymble

- Website: www.gnymble.com → sms-hub-web

### PercyTech

- Website: www.percytech.com → sms-hub-web

### PercyMD (planned)

- Website: www.percymd.com → sms-hub-web

### PercyText (planned)

- Website: www.percytext.com → sms-hub-web

## 🔧 Environment Variables

### Required for All Projects

```bash
VITE_SUPABASE_URL=https://howjinnvvtvaufihwers.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd2ppbm52dnR2YXVmaWh3ZXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODYzNDksImV4cCI6MjA3MzI2MjM0OX0.moAI_eCWlrI9s7aLcaxIasL2UuWrEfiutMTUwPpgKOg
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=false
```

### Stripe Integration (Optional)

```bash
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/9B67sM60Tg3S62RbCBefC0k
VITE_STRIPE_PAYMENT_LINK_STARTER=https://buy.stripe.com/starter
VITE_STRIPE_PAYMENT_LINK_CORE=https://buy.stripe.com/core
VITE_STRIPE_PAYMENT_LINK_ELITE=https://buy.stripe.com/elite
```

### Where to Add Variables

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Select "Production" environment for each variable
3. Hub detection is automatic based on domain

## 🚨 Common Issues & Solutions

### Issue: Vercel creates new projects instead of deploying to existing ones

**Solution**: Always run `vercel --prod --yes` from project root. Never use `--cwd` flag or cd into subdirectories

### Issue: Root .vercel directory locks to one project

**Problem**: The root `.vercel/project.json` hard-codes a single project ID, making it impossible to deploy to different projects from the same root directory.

**Solution**: Remove the root `.vercel` directory entirely. Use individual deployment scripts that handle project linking properly.

### Issue: Path errors like "apps/web/apps/web" not found

**Solution**: The Vercel project root directory should be set to project root in Vercel dashboard

### Issue: Vercel deployment fails with npm install error

**Solution**: Deploy from project root, not from subdirectories

### Issue: 404 on admin dashboard

**Solution**: Admin dashboard is now part of the main app at `/admin` route

### Issue: Redirect goes to wrong URL

**Solution**: All redirects now point to internal routes within the same app

### Issue: Authentication fails with "user not found"

**Solution**: Run migration 3 in production database to create superadmin users

## 📁 File Structure

```
/
├── apps/
│   ├── web/vercel.json          ✅ Keep
│   └── unified/vercel.json      ✅ Keep
├── scripts/
│   ├── shell/deploy.sh          ✅ Main deployment script
│   ├── deploy-web.sh            ✅ Individual web deployment
│   └── deploy-unified.sh        ✅ Individual unified deployment
├── .vercel/                     ❌ REMOVED (locks to one project)
└── vercel.json                  ❌ Removed (conflicted)
```

## 🔄 Deployment Process

The deployment script (`scripts/shell/deploy.sh`):

1. **MUST be run from monorepo root** (`/Users/bryan/Dev/sms-hub-monorepo`)
2. Uses `vercel --prod --yes` to deploy from root directory
3. Maintains pnpm workspace context automatically
4. Shows success/failure status with colored output
5. **CRITICAL**: Never run `vercel` from individual app directories - always from root

## 📊 Monitoring

Check deployment status:

```bash
vercel ls
vercel inspect [deployment-url]
vercel alias ls
```

## 🎯 Key Lessons Learned

1. **Vercel Expert Advice**: Never use .vercel inside apps/, avoid CLI deployment from subfolders
2. **Monorepo Context**: Root Directory setting uploads entire repo but builds from app folder
3. **Dashboard vs Config**: Clear all dashboard overrides to use vercel.json
4. **PNPM Workspace**: Install command must run from root where pnpm-lock.yaml exists

## ✅ What Works Now

- **Single project per app** with multiple domains
- **Dashboard Root Directory** setting for monorepo context
- **No .vercel directories** in apps (removed per expert advice)
- **No cd commands** in deploy scripts (deploy from root)
- **Hub detection** via domain-based routing

## ❌ What We Tried (Didn't Work)

- **Root-level vercel.json** (conflicted with app configs)
- **CD commands in deploy scripts** (broke lockfile resolution)
- **App-level .vercel directories** (caused project conflicts)
- **Dashboard build overrides** (ignored vercel.json configs)

## 🔮 Future Expansion

When ready to deploy multiple hubs:

```bash
# Create additional projects
sms-hub-web-percytech    → www.percytech.com
sms-hub-unified-percytech → unified.percytech.com
```

## Next Steps

1. **Complete user migration**: Run migration 3 on production database
2. **Set up remaining domains**: Configure percymd.com and percytext.com
3. **Add monitoring**: Set up error tracking and analytics
4. **Performance optimization**: Enable caching and CDN
