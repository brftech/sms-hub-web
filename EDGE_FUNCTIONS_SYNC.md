# Edge Functions Synchronization Guide

## Current Status

### Production (PercyTech - `howjinnvvtvaufihwers`)

✅ **Deployed Functions** (as of 2025-09-14):
1. `signup-native` - User registration with hub-specific redirects
2. `complete-signup` - Creates business records after email confirmation
3. `resend-verification` - Resends verification emails
4. `login-native` - Native login handler
5. `create-account` - Account creation endpoint
6. `delete-account` - Account deletion with superadmin protection
7. `update-account` - Account updates
8. `verify-payment` - Payment verification
9. `check-superadmin` - Superadmin status check
10. `validate-invitation` - Invitation validation

### Development (sms-hub-monorepo - `vgpovgpwqkjnpnrjelyg`)

**Additional Functions** (not yet in production):
- `create-checkout-session` - Stripe checkout
- `stripe-webhook` - Stripe webhook handler
- `tcr-register-campaign` - TCR campaign registration
- `tcr-webhook` - TCR webhook handler
- `superadmin-auth` - Superadmin authentication
- `create-superadmin` - Create superadmin user
- `sync-auth-users` - Sync auth users
- `sms-verification-consent` - SMS verification
- `test-permissions` - Permission testing
- `test-rpc` - RPC testing
- `submit-contact` - Contact form submission
- `send-user-notification` - User notifications
- `create-user` - User creation
- `delete-user` - User deletion
- `update-user` - User updates

## Deployment Commands

### Deploy All Critical Functions to Production

```bash
# Switch to production
npx supabase link --project-ref howjinnvvtvaufihwers --password 'Ali1dog2@@##'

# Deploy critical auth functions
npx supabase functions deploy signup-native complete-signup resend-verification login-native

# Deploy account management functions
npx supabase functions deploy create-account update-account delete-account

# Deploy admin functions
npx supabase functions deploy check-superadmin validate-invitation verify-payment

# Deploy payment functions (when ready)
npx supabase functions deploy create-checkout-session stripe-webhook

# Deploy SMS/TCR functions (when ready)
npx supabase functions deploy sms-verification-consent tcr-register-campaign tcr-webhook
```

### Deploy to Development

```bash
# Switch to development
npx supabase link --project-ref vgpovgpwqkjnpnrjelyg --password 'Ali1dog2@@##'

# Deploy all functions
npx supabase functions deploy --all
```

## Environment Variables

### Production Secrets (Set)
```bash
ENVIRONMENT=production
SKIP_EMAIL_CONFIRMATION=false
VERCEL_ENV=production
SUPABASE_URL=[Auto-set]
SUPABASE_ANON_KEY=[Auto-set]
SUPABASE_SERVICE_ROLE_KEY=[Auto-set]
SUPABASE_DB_URL=[Auto-set]
```

### Additional Secrets Needed (When Ready)
```bash
# Stripe Integration
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# SMS/Twilio Integration
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Email Integration
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@gnymble.com

# TCR Integration
TCR_API_KEY=...
TCR_WEBHOOK_SECRET=...

# Zapier Integration
ZAPIER_SMS_WEBHOOK_URL=...
```

## Sync Process

### When to Sync

1. **After Major Updates**: When Edge Functions are updated with bug fixes or new features
2. **Before Production Deployment**: Always sync development to production before major releases
3. **After Schema Changes**: When database schema changes affect Edge Functions

### How to Sync

1. **Test in Development First**
   ```bash
   # Switch to dev
   npx supabase link --project-ref vgpovgpwqkjnpnrjelyg --password 'Ali1dog2@@##'

   # Test the function
   npx supabase functions serve [function-name]
   ```

2. **Deploy to Production**
   ```bash
   # Switch to production
   npx supabase link --project-ref howjinnvvtvaufihwers --password 'Ali1dog2@@##'

   # Deploy specific function
   npx supabase functions deploy [function-name]

   # Or deploy multiple
   npx supabase functions deploy func1 func2 func3
   ```

3. **Verify Deployment**
   ```bash
   # List deployed functions
   npx supabase functions list

   # Check function logs
   npx supabase functions logs [function-name]
   ```

## Function Categories

### 🔐 Authentication & User Management
- `signup-native` ✅
- `login-native` ✅
- `complete-signup` ✅
- `resend-verification` ✅
- `create-user`
- `update-user`
- `delete-user`

### 💼 Account Management
- `create-account` ✅
- `update-account` ✅
- `delete-account` ✅
- `validate-invitation` ✅

### 👑 Admin Functions
- `check-superadmin` ✅
- `superadmin-auth`
- `create-superadmin`
- `sync-auth-users`
- `test-permissions`

### 💳 Payment Processing
- `verify-payment` ✅
- `create-checkout-session`
- `stripe-webhook`

### 📱 SMS & Communications
- `sms-verification-consent`
- `send-user-notification`
- `submit-contact`

### 📡 TCR & Compliance
- `tcr-register-campaign`
- `tcr-webhook`

### 🧪 Testing & Development
- `test-rpc`
- `test-permissions`

## Monitoring & Debugging

### View Function Logs
```bash
# Real-time logs
npx supabase functions logs [function-name] --tail

# Last 100 logs
npx supabase functions logs [function-name] --limit 100
```

### Dashboard Links
- **Production**: https://supabase.com/dashboard/project/howjinnvvtvaufihwers/functions
- **Development**: https://supabase.com/dashboard/project/vgpovgpwqkjnpnrjelyg/functions

## Best Practices

1. **Always Test in Development First**
   - Never deploy untested code to production
   - Use `npx supabase functions serve` for local testing

2. **Version Control**
   - Commit Edge Function changes to Git
   - Tag releases when deploying to production

3. **Environment Variables**
   - Never hardcode secrets in functions
   - Use `Deno.env.get()` for environment variables

4. **Error Handling**
   - Always include try-catch blocks
   - Return meaningful error messages

5. **CORS Configuration**
   - Use the shared CORS utility (`_shared/cors.ts`)
   - Configure allowed origins properly

## Rollback Process

If a function deployment causes issues:

1. **Immediate Rollback**
   ```bash
   # Deploy previous version from Git
   git checkout [previous-commit]
   npx supabase functions deploy [function-name]
   ```

2. **Check Logs**
   ```bash
   npx supabase functions logs [function-name] --limit 50
   ```

3. **Monitor Dashboard**
   - Check error rates in Supabase Dashboard
   - Monitor user reports

## Notes

- ✅ = Deployed to production
- Functions without ✅ are only in development
- Always maintain parity between critical functions
- Non-critical functions can remain dev-only until needed