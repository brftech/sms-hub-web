# Vercel Environment Variables Configuration

## Production Environment Variables

Copy and paste these into your Vercel project settings:

### Required Variables

```
VITE_SUPABASE_URL=https://howjinnvvtvaufihwers.supabase.co
```

```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd2ppbm52dnR2YXVmaWh3ZXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODYzNDksImV4cCI6MjA3MzI2MjM0OX0.moAI_eCWlrI9s7aLcaxIasL2UuWrEfiutMTUwPpgKOg
```

```
VITE_SKIP_EMAIL_CONFIRMATION=false
```

```
VITE_ENABLE_DEV_AUTH=false
```

### How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. For each variable above:
   - Enter the variable name (e.g., `VITE_SUPABASE_URL`)
   - Paste the value
   - Select "Production" environment
   - Click "Save"

### Optional Variables (Add Later When Ready)

**For Stripe Integration:**
```
STRIPE_PUBLISHABLE_KEY=pk_live_[your-stripe-key]
STRIPE_SECRET_KEY=sk_live_[your-stripe-secret]
STRIPE_WEBHOOK_SECRET=whsec_[your-webhook-secret]
```

**For Email (Resend):**
```
RESEND_API_KEY=[your-resend-api-key]
```

**For SMS (Twilio):**
```
TWILIO_ACCOUNT_SID=[your-twilio-sid]
TWILIO_AUTH_TOKEN=[your-twilio-token]
TWILIO_PHONE_NUMBER=[your-twilio-number]
```

## Staging Environment Variables

If you want to set up a staging environment, use the same values but add these overrides:

```
VITE_ENABLE_DEV_AUTH=true
VITE_DEV_AUTH_TOKEN=[generate-a-secure-token]
```

## Important Notes

- ✅ The `VITE_SUPABASE_ANON_KEY` is safe to expose in frontend code
- ❌ NEVER expose `SUPABASE_SERVICE_ROLE_KEY` in frontend or environment variables accessible to the client
- 🔄 URLs are dynamically determined based on the domain being accessed
- 📧 Email confirmation is required in production (`VITE_SKIP_EMAIL_CONFIRMATION=false`)