# Vercel Deployment Guide

## Current Deployment Instructions

### 🏗️ Architecture

- **2 Applications**: Web (marketing) + Unified (dashboard)
- **PNPM Monorepo** with shared packages
- **Separate Vercel projects** for each app
- **Hub-specific branding** determined by domain

### 📋 Current Vercel Projects

```
sms-hub-web      → www.gnymble.com (primary)
sms-hub-unified  → app.gnymble.com (primary)
```

### 🚀 Deployment Process

**From monorepo root:**

```bash
# Deploy web app
vercel link --project=sms-hub-web
vercel --prod --yes

# Deploy unified app
vercel link --project=sms-hub-unified
vercel --prod --yes
```

**Using deployment scripts:**

```bash
pnpm deploy:web     # Deploy web app
pnpm deploy:unified # Deploy unified app
pnpm deploy:all     # Deploy both apps
```

### ⚙️ Vercel Configuration

**Dashboard Settings (Critical):**

- **Root Directory**: `apps/web` or `apps/unified`
- **Build Command**: Clear (uses vercel.json)
- **Install Command**: Clear (uses vercel.json)
- **Output Directory**: Clear (uses vercel.json)

**vercel.json in each app:**

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build --filter @sms-hub/web",
  "outputDirectory": "dist",
  "framework": null
}
```

## Environment Variables

### Required for All Projects

```bash
VITE_SUPABASE_URL=https://howjinnvvtvaufihwers.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd2ppbm52dnR2YXVmaWh3ZXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODYzNDksImV4cCI6MjA3MzI2MjM0OX0.moAI_eCWlrI9s7aLcaxIasL2UuWrEfiutMTUwPpgKOg
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=false
```

### Stripe Integration (Optional)

```bash
VITE_STRIPE_PRICE_CORE=price_1RoV8cQ373yWAVVaejkX4Pxp
STRIPE_PUBLISHABLE_KEY=pk_live_[your-key]
STRIPE_SECRET_KEY=sk_live_[your-secret]
STRIPE_WEBHOOK_SECRET=whsec_[your-webhook]
```

### Where to Add Variables

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Select "Production" environment for each variable
3. Hub detection is automatic based on domain

## Decision-Making Process

### ✅ What Works Now

- **Single project per app** with multiple domains
- **Dashboard Root Directory** setting for monorepo context
- **No .vercel directories** in apps (removed per expert advice)
- **No cd commands** in deploy scripts (deploy from root)
- **Hub detection** via domain-based routing

### ❌ What We Tried (Didn't Work)

- **Root-level vercel.json** (conflicted with app configs)
- **CD commands in deploy scripts** (broke lockfile resolution)
- **App-level .vercel directories** (caused project conflicts)
- **Dashboard build overrides** (ignored vercel.json configs)

### 🎯 Key Lessons Learned

1. **Vercel Expert Advice**: Never use .vercel inside apps/, avoid CLI deployment from subfolders
2. **Monorepo Context**: Root Directory setting uploads entire repo but builds from app folder
3. **Dashboard vs Config**: Clear all dashboard overrides to use vercel.json
4. **PNPM Workspace**: Install command must run from root where pnpm-lock.yaml exists

### 🔄 Future Expansion

When ready to deploy multiple hubs:

```bash
# Create additional projects
sms-hub-web-percytech    → www.percytech.com
sms-hub-unified-percytech → app.percytech.com
```

### 📁 File Structure

```
/
├── apps/
│   ├── web/vercel.json          ✅ Keep
│   └── unified/vercel.json      ✅ Keep
├── scripts/shell/deploy.sh      ✅ Simplified (no cd commands)
└── vercel.json                  ❌ Removed (conflicted)
```

## Troubleshooting

**"Path does not exist" errors:**

- Clear dashboard Root Directory, reset to correct app path
- Remove any .vercel folders from apps/

**"npm install" errors with workspace dependencies:**

- Clear dashboard Install Command override
- Ensure vercel.json uses pnpm install --frozen-lockfile

**Build command not found:**

- Clear dashboard Build Command override
- Verify vercel.json buildCommand syntax

**Wrong project deployment:**

- Use `vercel link --project=correct-project-name` before deploy
- Check .vercel/project.json in root for correct project ID
