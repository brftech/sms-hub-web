# Supabase Edge Functions Configuration

## Environment Variables / Secrets

All sensitive configuration should be stored as Supabase Edge Function secrets, not in local .env files.

### Setting Secrets for Production

```bash
# Set Stripe configuration
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
npx supabase secrets set STRIPE_DEFAULT_PRICE_ID=price_...

# Set other API keys as needed
npx supabase secrets set RESEND_API_KEY=...
npx supabase secrets set ZAPIER_WEBHOOK_URL=...
```

### Setting Secrets for Local Development

For local development, create a `.env.local` file in the `supabase` directory:

```bash
# supabase/.env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_DEFAULT_PRICE_ID=price_...
RESEND_API_KEY=...
ZAPIER_WEBHOOK_URL=...
```

### Active Edge Functions

1. **create-temp-signup** - Creates temporary signup with verification code
   - Used in: User signup flow
   - Requires: `RESEND_API_KEY`, `ZAPIER_WEBHOOK_URL`

2. **verify-code** - Verifies SMS/email codes and creates user account
   - Used in: Verification flow
   - Uses Supabase service role (automatically available)

3. **create-account** - Creates final user account after verification
   - Used in: Account creation flow
   - Uses Supabase service role (automatically available)

4. **submit-contact** - Handles contact form submissions
   - Used in: Web app contact forms
   - Requires: `RESEND_API_KEY`

5. **create-checkout-session** - Creates Stripe checkout sessions
   - Used in: Payment flow
   - Requires: `STRIPE_SECRET_KEY`, `STRIPE_DEFAULT_PRICE_ID`

6. **stripe-webhook** - Handles Stripe webhook events
   - Used in: Payment processing
   - Requires: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### Accessing Secrets in Edge Functions

```typescript
// In your Edge Function
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const resendKey = Deno.env.get("RESEND_API_KEY");
```

### Best Practices

1. **Never commit secrets** to version control
2. **Use test keys** for local development
3. **Set production secrets** directly in Supabase Dashboard or CLI
4. **Document required secrets** for each Edge Function
5. **Use different secrets** for different environments (dev/staging/prod)

### Verifying Secrets

Check which secrets are set:

```bash
npx supabase secrets list
```

### Security Notes

- Supabase automatically provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions
- All other secrets must be explicitly set
- Secrets are encrypted at rest and in transit
- Only Edge Functions can access these secrets, not client-side code