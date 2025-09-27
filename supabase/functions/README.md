# SMS Hub Web - Edge Functions

## Overview

This directory contains the Edge Functions for the SMS Hub Web marketing website. The functions are focused on lead capture and payment processing only.

## Functions

### ✅ Active Functions

#### 1. **submit-contact**
- **Purpose**: Handle contact form submissions from the marketing website
- **Features**: 
  - Lead creation/update in database
  - Email confirmation via Resend
  - Admin notification emails
  - Activity tracking
  - Duplicate handling

#### 2. **stripe-webhook**
- **Purpose**: Handle Stripe webhook events for payment processing
- **Features**:
  - Payment completion handling
  - Customer creation via Supabase Auth
  - Email confirmation flow
  - Database record creation

### 📁 Shared Resources

#### **_shared/cors.ts**
- **Purpose**: Shared CORS headers for all functions
- **Usage**: Imported by all Edge Functions for consistent CORS handling

## Environment Variables / Secrets

All sensitive configuration should be stored as Supabase Edge Function secrets, not in local .env files.

### Setting Secrets for Production

```bash
# Set Stripe configuration
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Set email configuration
npx supabase secrets set RESEND_API_KEY=...

# Set Supabase configuration
npx supabase secrets set SUPABASE_URL=https://your-project.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Setting Secrets for Local Development

```bash
# Set development secrets
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_test_...
npx supabase secrets set RESEND_API_KEY=...
```

## Deployment

### Deploy All Functions
```bash
npx supabase functions deploy
```

### Deploy Individual Functions
```bash
npx supabase functions deploy submit-contact
npx supabase functions deploy stripe-webhook
```

## Architecture

### Payment Flow
1. User clicks direct Stripe payment link (no function needed)
2. User completes payment in Stripe
3. `stripe-webhook` receives payment confirmation
4. Function creates Supabase Auth user
5. User receives email confirmation
6. User completes profile setup

### Lead Capture Flow
1. User submits contact form on marketing website
2. `submit-contact` function processes submission
3. Function creates/updates lead in database
4. Function sends confirmation email to user
5. Function sends notification email to admin

## Notes

- **No customer login**: Customers should log into the customer app (sms-hub-app2), not the marketing website
- **No SMS functionality**: SMS features are handled in the customer app
- **No TCR functions**: TCR integration is handled in the customer app
- **Payment-first approach**: Uses direct Stripe links, not checkout session creation