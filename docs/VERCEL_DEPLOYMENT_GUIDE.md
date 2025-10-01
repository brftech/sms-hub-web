# SMS Hub Web Deployment Guide

## 🏗️ Architecture Overview

- **1 Application**: Standalone React web app
- **NPM Package Management** with internal packages
- **Single Vercel project** for the web app
- **Hub-specific branding** determined by domain
- **Comprehensive Testing**: Vitest (unit) + Playwright (E2E)
- **Sales Dashboard**: Integrated at `/admin` route with hub-filtered data
- **Environment-Based Login**: Production redirects to app.gnymble.com

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
# Deploy preview
vercel

# Deploy to production
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
    "deploy": "vercel --prod --yes",
    "deploy:preview": "vercel"
  }
}
```

Then use:

```bash
npm run deploy
npm run deploy:preview
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

### Production Environment Variables

```bash
# Production Environment Configuration
NODE_ENV=production
VERCEL_ENV=production

# Supabase Configuration (Production Database)
VITE_SUPABASE_URL=https://fwlivygerbqzowbzxesw.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# App URLs (Production)
VITE_WEB_APP_URL=https://www.gnymble.com

# Public URLs for Edge Functions
PUBLIC_SITE_URL=https://www.gnymble.com

# Feature Flags
VITE_ENABLE_DEBUG=false
VITE_ENABLE_DEV_AUTH=false
VITE_ENABLE_HUB_SWITCHER=false

# Admin Access Code
VITE_ADMIN_ACCESS_CODE=your-secure-admin-code

# Stripe Payment Links
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/production-link
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

### Issue: Console warnings in production

**Solution**: All console statements have been cleaned up - only console.error and console.warn are allowed

### Issue: Login button redirects to wrong URL

**Solution**: Login URLs are now environment-based - production redirects to app.gnymble.com, dev to localhost:3001

## 📁 File Structure

```
/
├── src/                    # Application source code
├── packages/              # Internal packages
├── supabase/             # Backend configuration
├── test/                 # Test files
├── public/               # Static assets
├── .vercel/              # Vercel configuration (auto-generated)
├── vercel.json           # Vercel deployment config
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
└── .prettierrc           # Prettier configuration
```

## 🔄 Deployment Process

The deployment process:

1. **MUST be run from project root** (`/Users/bryan/Dev/sms-hub-web`)
2. Uses `vercel --prod --yes` to deploy from root directory
3. Maintains npm workspace context automatically
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
4. **NPM Workspace**: Install command must run from root where package-lock.json exists
5. **Code Quality**: Clean codebase with zero console warnings and strict TypeScript

## ✅ What Works Now

- **Single project per app** with multiple domains
- **Dashboard Root Directory** setting for monorepo context
- **No .vercel directories** in apps (removed per expert advice)
- **No cd commands** in deploy scripts (deploy from root)
- **Hub detection** via domain-based routing
- **Environment-based login routing**
- **Clean codebase** with comprehensive testing

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
sms-hub-web-percymd      → www.percymd.com
sms-hub-web-percytext    → www.percytext.com
```

## Next Steps

1. **Complete user migration**: Run migration 3 on production database
2. **Set up remaining domains**: Configure percymd.com and percytext.com
3. **Add monitoring**: Set up error tracking and analytics
4. **Performance optimization**: Enable caching and CDN
5. **Code quality**: Maintain zero console warnings and strict TypeScript
