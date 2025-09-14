# Vercel Hub Domain Configuration

## Overview

Each hub has its own production domain for branding purposes. This document explains how to configure Vercel to deploy each hub to its respective domain.

## Hub Domain Mapping

| Hub | Hub ID | Production Web | Production Unified | Staging Web | Staging Unified |
|-----|--------|---------------|-------------------|-------------|-----------------|
| **Gnymble** | 1 | www.gnymble.com | unified.gnymble.com | staging.gnymble.com | unified-staging.gnymble.com |
| **PercyTech** | 0 | www.percytech.com | unified.percytech.com | staging.percytech.com | unified-staging.percytech.com |
| **PercyMD** | 2 | www.percymd.com | unified.percymd.com | staging.percymd.com | unified-staging.percymd.com |
| **PercyText** | 3 | www.percytext.com | unified.percytext.com | staging.percytext.com | unified-staging.percytext.com |

## Vercel Project Setup

### Recommended: Single Project with Multiple Domains

1. **Web App Project** (`sms-hub-web`)
   - Primary domain: www.gnymble.com
   - Additional domains:
     - www.percytech.com
     - www.percymd.com
     - www.percytext.com
   - Staging domains (preview branch):
     - staging.gnymble.com
     - staging.percytech.com
     - staging.percymd.com
     - staging.percytext.com

2. **Unified App Project** (`sms-hub-unified`)
   - Primary domain: unified.gnymble.com
   - Additional domains:
     - unified.percytech.com
     - unified.percymd.com
     - unified.percytext.com
   - Staging domains (preview branch):
     - unified-staging.gnymble.com
     - unified-staging.percytech.com
     - unified-staging.percymd.com
     - unified-staging.percytext.com

## Environment Variables for Vercel

### Production Environment Variables

```bash
# Database Configuration
VITE_SUPABASE_URL=https://howjinnvvtvaufihwers.supabase.co
VITE_SUPABASE_ANON_KEY=[Get from PercyTech Supabase Dashboard]

# Hub Detection (automatically determined from domain)
# The app will detect the hub based on the domain it's accessed from

# Feature Flags
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=false
```

### Staging Environment Variables

```bash
# Same database as production
VITE_SUPABASE_URL=https://howjinnvvtvaufihwers.supabase.co
VITE_SUPABASE_ANON_KEY=[Same as production]

# Feature Flags
VITE_SKIP_EMAIL_CONFIRMATION=false
VITE_ENABLE_DEV_AUTH=true
VITE_DEV_AUTH_TOKEN=[Generate secure token]
```

### Development Environment Variables

```bash
# Development database
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=[Get from dev Supabase Dashboard]

# Feature Flags
VITE_SKIP_EMAIL_CONFIRMATION=true
VITE_ENABLE_DEV_AUTH=true
VITE_DEV_AUTH_TOKEN=dev123
```

## DNS Configuration

For each hub domain, configure your DNS provider:

### Example: Gnymble

```
# Root domain
A     @                   76.76.21.21
CNAME www                 cname.vercel-dns.com

# Unified subdomain
CNAME unified             cname.vercel-dns.com
CNAME unified-staging     cname.vercel-dns.com

# Staging subdomain
CNAME staging             cname.vercel-dns.com
```

### Example: PercyTech

```
# Root domain
A     @                   76.76.21.21
CNAME www                 cname.vercel-dns.com

# Unified subdomain
CNAME unified             cname.vercel-dns.com
CNAME unified-staging     cname.vercel-dns.com

# Staging subdomain
CNAME staging             cname.vercel-dns.com
```

## Hub Detection in Application

The application automatically detects which hub is being accessed based on the domain:

```typescript
// The app will detect the hub from the hostname
// www.gnymble.com → Gnymble hub (hub_id: 1)
// www.percytech.com → PercyTech hub (hub_id: 0)
// www.percymd.com → PercyMD hub (hub_id: 2)
// www.percytext.com → PercyText hub (hub_id: 3)
```

## Supabase Authentication Configuration

In the PercyTech Supabase Dashboard:

1. Go to **Authentication → URL Configuration**
2. Set **Site URL**: `https://www.gnymble.com` (primary)
3. Add **Redirect URLs** for all hubs:
   ```
   # Web app verify URLs
   https://www.gnymble.com/verify-auth
   https://www.percytech.com/verify-auth
   https://www.percymd.com/verify-auth
   https://www.percytext.com/verify-auth

   # Unified app URLs
   https://unified.gnymble.com
   https://unified.percytech.com
   https://unified.percymd.com
   https://unified.percytext.com

   # Staging URLs
   https://staging.gnymble.com/verify-auth
   https://staging.percytech.com/verify-auth
   https://staging.percymd.com/verify-auth
   https://staging.percytext.com/verify-auth

   # Staging unified URLs
   https://unified-staging.gnymble.com
   https://unified-staging.percytech.com
   https://unified-staging.percymd.com
   https://unified-staging.percytext.com
   ```

## Testing the Setup

1. **Deploy to Vercel**
   ```bash
   git push origin main
   ```

2. **Test each hub domain**
   - Visit www.gnymble.com → Should show Gnymble branding
   - Visit www.percytech.com → Should show PercyTech branding
   - Visit www.percymd.com → Should show PercyMD branding
   - Visit www.percytext.com → Should show PercyText branding

3. **Test signup flow**
   - Sign up on each domain
   - Verify email redirects to correct domain
   - After authentication, verify redirect goes to correct unified subdomain

## Edge Function Configuration

The Edge Functions automatically detect the hub based on the `hub_id` parameter and redirect to the appropriate domain:

- Hub ID 0 (PercyTech) → www.percytech.com → unified.percytech.com
- Hub ID 1 (Gnymble) → www.gnymble.com → unified.gnymble.com
- Hub ID 2 (PercyMD) → www.percymd.com → unified.percymd.com
- Hub ID 3 (PercyText) → www.percytext.com → unified.percytext.com

## Important Notes

1. **SSL Certificates**: Vercel automatically provisions SSL certificates for all domains
2. **Domain Verification**: You'll need to verify domain ownership in Vercel
3. **Propagation Time**: DNS changes can take up to 48 hours to propagate
4. **Testing**: Always test on staging domains before production deployment
5. **Analytics**: Each domain can have separate analytics tracking if needed

## Deployment Checklist

- [ ] Configure DNS for all hub domains
- [ ] Add all domains to Vercel projects
- [ ] Set environment variables in Vercel
- [ ] Configure Supabase Authentication redirect URLs
- [ ] Deploy Edge Functions to production
- [ ] Test signup flow on each hub
- [ ] Verify redirects to unified subdomains
- [ ] Test staging environment
- [ ] Monitor for SSL certificate provisioning

## Support

For issues with:
- **Domain configuration**: Check Vercel dashboard → Project → Domains
- **SSL certificates**: Vercel Support
- **DNS propagation**: Use `dig` or `nslookup` to verify DNS records
- **Authentication**: Check Supabase Dashboard → Authentication logs