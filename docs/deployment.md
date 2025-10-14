# Deployment

**Last Updated**: October 14, 2025 (Evening - Post Refactor)

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

### Environment Variables (Required)

Set these in Vercel dashboard for each domain:

```bash
# Supabase (Marketing Database)
VITE_SUPABASE_URL=https://fwlivygerbqzowbzxesw.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Admin Dashboard
VITE_ADMIN_ACCESS_CODE=your_secure_code

# Cloudflare Turnstile (Spam Protection)
VITE_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key  # Server-side only

# Email (Resend API)
RESEND_API_KEY=your_resend_key
```

## 🌐 Domain Setup

Each hub has its own domain pointing to Vercel:

- **percytech.com** → Vercel (Hub 0)
- **gnymble.com** → Vercel (Hub 1)
- **percymd.com** → Vercel (Hub 2)
- **percytext.com** → Vercel (Hub 3)

Domain detection is automatic in the app - no manual configuration needed.

### Cloudflare Configuration

1. DNS points to Vercel
2. Turnstile enabled for spam protection
3. Proxy status: Proxied (orange cloud)

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
