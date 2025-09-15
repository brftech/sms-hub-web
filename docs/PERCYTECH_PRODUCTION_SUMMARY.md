# PercyTech Production Setup Summary

## ✅ Completed Setup

### 1. Database Migration
- **Production Database**: PercyTech (ID: `howjinnvvtvaufihwers`)
- **Password**: `Ali1dog2@@##`
- **Schema**: Successfully migrated from development
- **Tables Created**: All core tables (companies, user_profiles, memberships, etc.)

### 2. Edge Functions Deployed
- ✅ `signup-native` - Handles user registration with hub-specific redirects
- ✅ `complete-signup` - Creates business records after email confirmation
- ✅ `resend-verification` - Resends verification emails

### 3. Environment Variables Set
- `ENVIRONMENT=production`
- `SKIP_EMAIL_CONFIRMATION=false`
- `VERCEL_ENV=production`

### 4. Hub-Specific Domain Configuration

The system now supports hub-specific domains with automatic detection and redirection:

| Hub | Production Web | Production Unified |
|-----|---------------|-------------------|
| **Gnymble** | www.gnymble.com | unified.gnymble.com |
| **PercyTech** | www.percytech.com | unified.percytech.com |
| **PercyMD** | www.percymd.com | unified.percymd.com |
| **PercyText** | www.percytext.com | unified.percytext.com |

### 5. Authentication Flow Updates

The signup and authentication flow now:
- Detects which hub based on `hub_id`
- Redirects to the appropriate domain after email confirmation
- Supports different domains for each hub
- Automatically routes users to their hub's unified app

## 📋 Next Steps

### 1. Supabase Dashboard Configuration

Go to [PercyTech Supabase Dashboard](https://supabase.com/dashboard/project/howjinnvvtvaufihwers):

1. **Get Anon Key**:
   - Settings → API → `anon/public` key
   - Copy this key for Vercel configuration

2. **Configure Authentication**:
   - Authentication → URL Configuration
   - Set **Site URL**: `https://www.gnymble.com`
   - Add **Redirect URLs**:
     ```
     https://www.gnymble.com/verify-auth
     https://www.percytech.com/verify-auth
     https://www.percymd.com/verify-auth
     https://www.percytext.com/verify-auth
     https://unified.gnymble.com
     https://unified.percytech.com
     https://unified.percymd.com
     https://unified.percytext.com
     ```

### 2. Vercel Configuration

1. **Create/Configure Projects**:
   - Web App: `sms-hub-web`
   - Unified App: `sms-hub-unified`

2. **Add Environment Variables**:
   ```bash
   VITE_SUPABASE_URL=https://howjinnvvtvaufihwers.supabase.co
   VITE_SUPABASE_ANON_KEY=[Copy from Supabase Dashboard]
   VITE_SKIP_EMAIL_CONFIRMATION=false
   VITE_ENABLE_DEV_AUTH=false
   ```

3. **Configure Domains**:
   - Add all hub domains to respective projects
   - Vercel will auto-provision SSL certificates

### 3. DNS Configuration

For each hub domain, configure:

```
# Example for Gnymble
A     @               76.76.21.21
CNAME www             cname.vercel-dns.com
CNAME unified         cname.vercel-dns.com
CNAME unified-staging cname.vercel-dns.com
CNAME staging         cname.vercel-dns.com
```

### 4. Create Superadmin User (Optional)

If you want to create a superadmin user for testing:

1. Sign up normally through the web interface
2. Use Supabase SQL Editor to update the user's role:
   ```sql
   UPDATE user_profiles
   SET role = 'SUPERADMIN'
   WHERE email = 'your-email@example.com';
   ```

## 🧪 Testing Checklist

- [ ] Deploy to Vercel (`git push origin main`)
- [ ] Test signup on www.gnymble.com
- [ ] Verify email confirmation works
- [ ] Check redirect to unified.gnymble.com
- [ ] Test other hub domains once DNS is configured
- [ ] Verify data is saved to production database

## 🔍 Monitoring

- **Edge Functions**: [View Logs](https://supabase.com/dashboard/project/howjinnvvtvaufihwers/functions)
- **Database**: [SQL Editor](https://supabase.com/dashboard/project/howjinnvvtvaufihwers/sql)
- **Authentication**: [Auth Logs](https://supabase.com/dashboard/project/howjinnvvtvaufihwers/auth/users)

## ⚠️ Important Notes

1. **Database Password**: Keep the password `Ali1dog2@@##` secure
2. **Anon Key**: Required for frontend - get from Supabase Dashboard
3. **Service Key**: Never expose in frontend code
4. **DNS Propagation**: Can take up to 48 hours
5. **SSL Certificates**: Vercel handles automatically

## 🎉 Status

Your PercyTech production environment is **READY** for deployment!

The database schema is set up, Edge Functions are deployed, and the system is configured to handle hub-specific domains. Once you:
1. Get the anon key from Supabase
2. Configure Vercel with environment variables
3. Set up DNS for your domains

You'll have a fully functional multi-hub production system!