# Environment Variables Checklist for Supabase

## Required Environment Variables for Edge Functions

Please ensure the following environment variables are set in your Supabase dashboard:
https://supabase.com/dashboard/project/vgpovgpwqkjnpnrjelyg/settings/vault

**Note**: All Edge Functions have been updated with enhanced validation and security measures (September 2025). Ensure all environment variables are properly set for the enhanced authentication and account creation flow.

### SMS/Communication Variables
- [ ] `ZAPIER_SMS_WEBHOOK_URL` - Your Zapier webhook URL for SMS via PercyTech
- [ ] `RESEND_API_KEY` - Resend API key for email notifications

### Stripe Variables
- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret

### Application URLs
- [ ] `PUBLIC_SITE_URL` - Your public website URL (e.g., https://yourdomain.com or http://localhost:3000 for dev)

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

For local development, ensure these are in your `.env.development` file:
```
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_DEV_AUTH_TOKEN=your-secure-dev-token
VITE_DEVELOPMENT_MODE=true
```

## Recent Updates (September 2025)

### Enhanced Edge Functions
All Edge Functions have been updated with:
- **Enhanced validation** and error handling
- **Magic link authentication** support
- **B2B/B2C account creation** capabilities
- **Superadmin protection** measures
- **Improved security** and session management

### Environment Variable Usage
- **Magic Link Authentication**: Uses existing Supabase Auth with enhanced flow
- **Protected Accounts**: Built-in protection for superadmin@percytech.com and superadmin@gnymble.com
- **Enhanced Validation**: All Edge Functions now include comprehensive input validation
- **Development Mode**: Enhanced development experience with proper session isolation

All environment variables remain the same, but the underlying functionality has been significantly enhanced for better security and user experience.