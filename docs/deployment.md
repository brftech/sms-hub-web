# Deployment

**Last Updated**: October 27, 2025 (Evening - Bundle Size Improvements)

## 🚀 Quick Deploy

### Production Deployment (Vercel)

```bash
# Deploy to production
git push origin main
# Vercel auto-deploys from main branch

# Or manual deploy
npm run build
vercel --prod
```

### Environment Variables

#### Production Environment

Set these in Vercel dashboard → Environment Variables (select **Production** only):

```bash
# Supabase (Production Marketing Database)
VITE_SUPABASE_URL=https://fwlivygerbqzowbzxesw.supabase.co
VITE_SUPABASE_ANON_KEY=your_prod_anon_key

# Admin Dashboard
VITE_ADMIN_ACCESS_CODE=your_secure_code

# Cloudflare Turnstile (Spam Protection)
VITE_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key  # Server-side only

# Email (Resend API)
RESEND_API_KEY=your_resend_key
```

#### Preview Environment (Optional)

Set these in Vercel dashboard → Environment Variables (select **Preview** only):

```bash
# Supabase (Dev Marketing Database)
VITE_SUPABASE_URL=https://hmumtnpnyxuplvqcmnfk.supabase.co
VITE_SUPABASE_ANON_KEY=your_dev_anon_key

# Other vars can be same as production or preview-specific
VITE_ADMIN_ACCESS_CODE=your_preview_code
```

**Important**: Preview deployments will use dev database if configured. This allows testing without affecting production data.

## 🌐 Multi-Domain Setup (Production)

### Overview

Deploy **once** to Vercel, then add all 4 domains to the same project:

- **percytech.com** → Hub 0 (Red theme)
- **gnymble.com** → Hub 1 (Orange theme)
- **percymd.com** → Hub 2 (Blue theme)
- **percytext.com** → Hub 3 (Violet theme)

The app automatically detects which hub to show based on the domain.

### Step 1: Deploy to Vercel

```bash
# Connect your repo (first time only)
vercel

# Deploy to production
vercel --prod
```

### Step 2: Add All Domains in Vercel Dashboard

1. Go to your project → **Settings** → **Domains**
2. Add each domain:
   ```
   percytech.com
   www.percytech.com (optional)
   gnymble.com
   www.gnymble.com (optional)
   percymd.com
   www.percymd.com (optional)
   percytext.com
   www.percytext.com (optional)
   ```

### Step 3: Configure DNS (at Cloudflare)

For **each domain**, add these DNS records:

```
Type: CNAME
Name: @ (root)
Target: cname.vercel-dns.com
Proxy: ON (🟠 orange cloud)

Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: ON (🟠 orange cloud)
```

**Alternative** (if CNAME at root isn't supported):

```
Type: A
Name: @
Target: 76.76.21.21
Proxy: ON

Type: AAAA
Name: @
Target: 2606:4700:3033::6815:1515
Proxy: ON
```

### Step 4: Enable Cloudflare Turnstile

1. **Turnstile** → Create new site for each domain
2. Add site key to Vercel env vars (VITE_TURNSTILE_SITE_KEY)
3. Ensure **Proxy status** is ON in DNS settings

### How Hub Detection Works

The app automatically detects the hub from the hostname:

```typescript
// detectHubFromHostname() in environment.ts
percytech.com → Hub 0 (PercyTech, red theme)
gnymble.com   → Hub 1 (Gnymble, orange theme)
percymd.com   → Hub 2 (PercyMD, blue theme)
percytext.com → Hub 3 (PercyText, violet theme)
localhost     → Hub 1 (Gnymble, default)
*.vercel.app  → Uses hub switcher (dev/preview)
```

**What Updates Automatically Per Domain**:

- ✅ Favicon (browser tab icon)
- ✅ PWA Manifest (app name, theme color, icons)
- ✅ All colors and branding
- ✅ Hero content and CTAs
- ✅ Page titles and metadata
- ✅ Login button redirect (app.{hub}.com or app2.percytext.com)

No manual configuration needed - just deploy once and add domains!

## 🧪 Preview Deployments

### How to Create Preview Deployment

```bash
# Deploy to preview (not production)
vercel

# This creates a URL like:
# https://sms-hub-{hash}.vercel.app
```

### Preview Environment Behavior

- **Hub Switcher**: Visible (test all hubs)
- **Admin Button**: Visible (test admin dashboard)
- **Database**: Uses dev database if configured
- **Favicon/Manifest**: Dynamic (changes with hub switcher)
- **localStorage**: Override allowed (for testing)

### Production vs Preview

| Feature       | Production            | Preview                 |
| ------------- | --------------------- | ----------------------- |
| Hub Detection | Domain-based (locked) | Hub switcher (flexible) |
| Database      | Production            | Dev (if configured)     |
| Floating UI   | Hidden                | Visible                 |
| localStorage  | Ignored               | Respected               |

## 📦 Build Process

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Run tests
npm test

# Build for production
npm run build
```

Build output goes to `/dist/`.

**Bundle Performance** (as of Oct 27, 2025):

- Main bundle: 377KB (103KB gzipped)
- 66% reduction from original 1.1MB through lazy loading and chunk splitting
- Vendor chunks: react (55KB), supabase (128KB), ui-framework (477KB), icons (20KB)
- All auth pages and admin features load on-demand

## 🔄 Supabase Setup

### Database Migrations

```bash
# Link to production database
npx supabase db link --project-ref fwlivygerbqzowbzxesw

# Check migration status
npx supabase db status

# Push migrations
npx supabase db push
```

### Edge Functions

```bash
# Deploy all functions
npx supabase functions deploy

# Deploy specific function
npx supabase functions deploy submit-contact
npx supabase functions deploy stripe-webhook
```

## ⚙️ Feature Flags

Use `import.meta.env.DEV` for dev-only features:

```typescript
{import.meta.env.DEV && (
  <DebugComponent />
)}
```

Currently active flags:

- Signup buttons (hidden in production)
- Debug components
- Admin button visibility

## 🔍 Vercel Configuration

Project settings in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## ✅ Pre-Deploy Checklist

- [ ] All tests passing (`npm test`)
- [ ] Type check passing (`npm run type-check`)
- [ ] Environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] Domain DNS configured
- [ ] Feature flags reviewed

## 🐛 Troubleshooting Deployment

**Build fails**

- Check `npm run build` locally first
- Verify all environment variables are set
- Check Vercel build logs

**Database connection issues**

- Verify `VITE_SUPABASE_URL` is correct
- Check anon key is for production database
- Confirm RLS policies are configured

**Domain not working**

- Check DNS propagation (can take 24-48 hours)
- Verify domain added in Vercel project settings
- Confirm Cloudflare proxy is enabled

## 🔧 Post-Deployment Cleanup (Optional)

### 1. Remove Unused Environment Variables

The following environment variable can be safely **deleted** from Vercel:

- **`VITE_WEB_APP_URL`** - No longer used; login buttons now use dynamic hub detection

This variable was previously used for login redirects but has been replaced by `detectHubFromHostname()` and `getHubDomain()` logic in `checkout.ts`.

**To remove**:

1. Go to Vercel → Project Settings → Environment Variables
2. Find `VITE_WEB_APP_URL`
3. Click three-dot menu → Delete
4. Redeploy to apply changes

### 2. Add Analytics & Monitoring (When Ready)

Consider adding these services when you're ready to monitor production:

**Analytics**:

- [PostHog](https://posthog.com) - Product analytics (open source)
- [Plausible](https://plausible.io) - Privacy-focused analytics
- [Google Analytics 4](https://analytics.google.com) - Traditional option

**Error Tracking**:

- [Sentry](https://sentry.io) - Error monitoring & performance tracking
- [LogRocket](https://logrocket.com) - Session replay + error tracking

**Implementation tip**: Use environment variables to enable/disable in production vs preview:

```typescript
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });
}
```
