# Production Setup Checklist

## ✅ Quick Setup Steps

### 1. Create Production Supabase Project
- [ ] Go to [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Create new project named `sms-hub-production`
- [ ] Save credentials:
  - [ ] Project Reference ID
  - [ ] Database Password
  - [ ] Anon Key
  - [ ] Service Role Key

### 2. Duplicate Database
- [ ] Run the duplication script:
  ```bash
  ./scripts/duplicate-database.sh 'DevPassword' 'prod-ref-id' 'ProdPassword'
  ```
- [ ] Choose option 1 (schema only) for production

### 3. Configure Production Supabase
- [ ] Go to Authentication → URL Configuration
  - [ ] Site URL: `https://gnymble.com`
  - [ ] Add redirect URLs:
    - `https://gnymble.com/verify-auth`
    - `https://app.gnymble.com`
    - `https://staging.gnymble.com/verify-auth`
    - `https://app-staging.gnymble.com`
- [ ] Enable email confirmations

### 4. Set Up Git Branches
- [ ] Create staging branch: `git checkout -b staging`
- [ ] Push staging: `git push origin staging`
- [ ] Set develop as default branch on GitHub

### 5. Configure Vercel Projects

#### Create Web App Projects:
- [ ] **Development Web App**
  - Name: `sms-hub-web-dev`
  - Branch: `develop`
  - Domain: `dev.gnymble.com`

- [ ] **Production Web App**
  - Name: `sms-hub-web`
  - Branch: `main`
  - Domain: `gnymble.com`
  - Preview Branch: `staging` → `staging.gnymble.com`

#### Create Unified App Projects:
- [ ] **Development Unified App**
  - Name: `sms-hub-unified-dev`
  - Branch: `develop`
  - Domain: `app-dev.gnymble.com`

- [ ] **Production Unified App**
  - Name: `sms-hub-unified`
  - Branch: `main`
  - Domain: `app.gnymble.com`
  - Preview Branch: `staging` → `app-staging.gnymble.com`

### 6. Set Environment Variables in Vercel

#### Development Projects:
```bash
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=[dev-anon-key]
VITE_WEB_APP_URL=https://dev.gnymble.com
VITE_UNIFIED_APP_URL=https://app-dev.gnymble.com
VITE_SKIP_EMAIL_CONFIRMATION=true
VITE_ENABLE_DEV_AUTH=true
VITE_DEV_AUTH_TOKEN=[generate-token]
```

#### Staging (Preview on Production Projects):
```bash
VITE_SUPABASE_URL=https://[prod-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[prod-anon-key]
VITE_WEB_APP_URL=https://staging.gnymble.com
VITE_UNIFIED_APP_URL=https://app-staging.gnymble.com
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=true
VITE_DEV_AUTH_TOKEN=[staging-token]
```

#### Production:
```bash
VITE_SUPABASE_URL=https://[prod-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[prod-anon-key]
VITE_WEB_APP_URL=https://gnymble.com
VITE_UNIFIED_APP_URL=https://app.gnymble.com
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=false
```

### 7. Deploy Edge Functions

#### To Development:
```bash
npx supabase link --project-ref vgpovgpwqkjnpnrjelyg
npx supabase functions deploy --all
npx supabase secrets set ENVIRONMENT=development
npx supabase secrets set SKIP_EMAIL_CONFIRMATION=true
```

#### To Production:
```bash
npx supabase link --project-ref [prod-ref]
npx supabase functions deploy --all
npx supabase secrets set ENVIRONMENT=production
npx supabase secrets set SKIP_EMAIL_CONFIRMATION=false
npx supabase secrets set PUBLIC_SITE_URL=https://gnymble.com
```

### 8. Configure DNS

#### For dev.gnymble.com:
```
CNAME: dev → cname.vercel-dns.com
```

#### For staging.gnymble.com:
```
CNAME: staging → cname.vercel-dns.com
```

#### For gnymble.com:
```
A: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

#### For app.gnymble.com:
```
CNAME: app → cname.vercel-dns.com
```

#### For app-dev.gnymble.com:
```
CNAME: app-dev → cname.vercel-dns.com
```

#### For app-staging.gnymble.com:
```
CNAME: app-staging → cname.vercel-dns.com
```

### 9. Test Everything

#### Development Testing:
- [ ] Visit dev.gnymble.com
- [ ] Test signup (email confirmation skipped)
- [ ] Test dev auth with token
- [ ] Verify redirects to app-dev.gnymble.com

#### Staging Testing:
- [ ] Push to staging branch
- [ ] Visit staging.gnymble.com
- [ ] Test signup (email confirmation required)
- [ ] Test dev auth still works
- [ ] Verify redirects to app-staging.gnymble.com

#### Production Testing:
- [ ] Push to main branch
- [ ] Visit gnymble.com
- [ ] Test signup (email confirmation required)
- [ ] Verify dev auth is disabled
- [ ] Verify redirects to app.gnymble.com

### 10. Monitoring Setup
- [ ] Enable Vercel Analytics
- [ ] Set up Supabase alerts
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring

## 🎯 Success Criteria

- ✅ Three environments working (dev, staging, prod)
- ✅ Database separation (dev vs prod)
- ✅ Proper branch strategy
- ✅ Email confirmation works in production
- ✅ Dev auth disabled in production
- ✅ All domains configured
- ✅ Edge Functions deployed
- ✅ Complete signup flow works

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase function logs
3. Verify environment variables
4. Test with browser dev tools open
5. Check DNS propagation

## 🚀 You're Ready!

Once all checkboxes are complete, your development to production pipeline is fully operational!