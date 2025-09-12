# Environment Variables Checklist for Supabase

## Required Environment Variables for Edge Functions

Please ensure the following environment variables are set in your Supabase dashboard:
https://supabase.com/dashboard/project/vgpovgpwqkjnpnrjelyg/settings/vault

### SMS/Communication Variables
- [ ] `ZAPIER_SMS_WEBHOOK_URL` - Your Zapier webhook URL for SMS via PercyTech
- [ ] `RESEND_API_KEY` - Resend API key for email notifications

### Stripe Variables
- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret

### Application URLs
- [ ] `PUBLIC_SITE_URL` - Your public website URL (e.g., https://yourdomain.com or http://localhost:3001 for dev)

### Development Variables (Optional)
- [ ] `ENVIRONMENT` - Set to "development" for dev mode features
- [ ] `DEV_AUTH_TOKEN` - Secure token for development authentication bypass

## How to Set Environment Variables

1. Go to: https://supabase.com/dashboard/project/vgpovgpwqkjnpnrjelyg/settings/vault
2. Click "New secret"
3. Add each variable with its value
4. Save changes

## Verify Environment Variables

You can verify these are set by checking the Edge Functions logs after deployment.

## Local Development

For local development, ensure these are in your `.env.local` file:
```
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_DEV_AUTH_TOKEN=your-secure-dev-token
```