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
npx supabase secrets set ZAPIER_SMS_WEBHOOK_URL=...
```

### Setting Secrets for Local Development

For local development, create a `.env.local` file in the `supabase` directory:

```bash
# supabase/.env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_DEFAULT_PRICE_ID=price_...
RESEND_API_KEY=...
ZAPIER_SMS_WEBHOOK_URL=...
```

### Active Edge Functions

#### Authentication & User Management

1. **signup-native** - Creates user account with Supabase native auth
   - Used in: User signup flow (Web app)
   - Creates auth user, user profile, company, and customer records
   - Requires: No additional secrets (uses service role)

2. **login-native** - Authenticates users with Supabase native auth
   - Used in: User login flow (Web app)
   - Returns session and determines redirect path
   - Requires: No additional secrets (uses service role)

3. **validate-invitation** - Validates user invitation tokens
   - Used in: Invited user signup flow
   - Requires: No additional secrets (uses service role)

4. **sms-verification-consent** - Handles post-payment SMS verification
   - Used in: Post-payment SMS consent and verification
   - Actions: "send" to send SMS, "verify" to verify code
   - Requires: `ZAPIER_SMS_WEBHOOK_URL`

#### Payment Processing

5. **create-checkout-session** - Creates Stripe checkout sessions
   - Used in: Payment flow after signup
   - Creates or updates customer records
   - Requires: `STRIPE_SECRET_KEY`, `STRIPE_DEFAULT_PRICE_ID`

6. **stripe-webhook** - Handles Stripe webhook events
   - Used in: Payment processing callbacks
   - Updates customer payment status and triggers onboarding
   - Requires: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

7. **verify-payment** - Verifies payment completion
   - Used in: Payment verification flow
   - Requires: `STRIPE_SECRET_KEY`

#### Other Functions

8. **submit-contact** - Handles contact form submissions
   - Used in: Web app contact forms
   - Sends email notifications
   - Requires: `RESEND_API_KEY`

9. **check-superadmin** - Verifies superadmin access
   - Used in: Admin authentication
   - Requires: No additional secrets (uses service role)

10. **superadmin-auth** - Handles superadmin authentication
    - Used in: Superadmin login flow
    - Requires: No additional secrets (uses service role)

11. **tcr-register-campaign** - Registers campaigns with TCR
    - Used in: Campaign registration flow
    - Requires: TCR API credentials

12. **tcr-webhook** - Handles TCR webhook callbacks
    - Used in: TCR registration callbacks
    - Requires: TCR webhook secret

### Accessing Secrets in Edge Functions

```typescript
// In your Edge Function
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const resendKey = Deno.env.get("RESEND_API_KEY");
const zapierUrl = Deno.env.get("ZAPIER_SMS_WEBHOOK_URL");
```

### Authentication Flow

1. **New User Signup**:
   - `signup-native` → Creates account with email/password
   - `create-checkout-session` → Initiates payment
   - `stripe-webhook` → Confirms payment
   - `sms-verification-consent` → Post-payment SMS verification

2. **Existing User Login**:
   - `login-native` → Authenticates and returns session
   - Redirects based on user status (needs payment, SMS verification, or dashboard)

3. **Invited User**:
   - `validate-invitation` → Validates invitation token
   - `signup-native` → Creates account linked to existing company

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
- RLS is disabled in this project - manual hub_id filtering is required