# SMS Hub Onboarding Flow - Complete Documentation

## 🎯 Overview

This document provides a comprehensive walkthrough of the SMS Hub onboarding process, from initial signup to payment completion and post-payment onboarding. This is essential for understanding the complete user journey and debugging any issues.

## 📋 Onboarding Process Flow

### Phase 1: Pre-Payment (Signup to Payment)

1. **Signup** (`apps/web/src/pages/Signup.tsx`)
2. **Verification** (`apps/web/src/pages/VerifyOtp.tsx`)
3. **Account Details** (`apps/unified/src/pages/user/AccountDetails.tsx`)
4. **Payment** (`apps/unified/src/pages/user/onboarding/steps/PaymentStep.tsx`)
5. **Payment Callback** (`apps/unified/src/pages/user/onboarding/PaymentCallback.tsx`)

### Phase 2: Post-Payment (Onboarding Steps)

1. **Brand Submission**
2. **Privacy Setup**
3. **Campaign Submission**
4. **gPhone Procurement**
5. **Account Setup**
6. **Onboarding Complete**

## 🔄 Detailed Process Walkthrough

### 1. Signup Process

**File**: `apps/web/src/pages/Signup.tsx`

**What happens**:
- User enters email, phone, and selects signup type (company/individual)
- Data is stored in `sessionStorage` as backup
- Calls `submit-verification` Edge Function
- Creates record in `verifications` table
- Sends SMS via Zapier webhook or email via Resend

**Database changes**:
```sql
INSERT INTO verifications (
  id, hub_id, email, mobile_phone, auth_method, 
  verification_code, verification_sent_at, created_at, updated_at
) VALUES (...)
```

**Key functions called**:
- `submit-verification` Edge Function
- Zapier SMS webhook (if SMS selected)
- Resend email service (if email selected)

### 2. Verification Process

**File**: `apps/web/src/pages/VerifyOtp.tsx`

**What happens**:
- User enters verification code
- Calls `verify-code` Edge Function
- Updates `verifications` table with completion timestamp
- Redirects to account details page

**Database changes**:
```sql
UPDATE verifications 
SET verification_completed_at = NOW()
WHERE id = verification_id AND verification_code = entered_code
```

**Key functions called**:
- `verify-code` Edge Function

### 3. Account Details Process

**File**: `apps/unified/src/pages/user/AccountDetails.tsx`

**What happens**:
- User enters company name, first name, last name, password
- Calls `create-account` Edge Function directly
- Creates Supabase Auth user
- Creates user profile, company, customer, and membership records
- Links verification to user profile

**Database changes**:
```sql
-- Creates auth.users record (via Supabase Auth)
-- Creates user_profiles record
-- Creates companies record
-- Creates customers record
-- Creates memberships record
-- Updates verifications with existing_user_id
```

**Key functions called**:
- `create-account` Edge Function

### 4. Payment Process

**File**: `apps/unified/src/pages/user/onboarding/steps/PaymentStep.tsx`

**What happens**:
- Calls `create-checkout-session` Edge Function
- Redirects to Stripe checkout
- User completes payment on Stripe

**Key functions called**:
- `create-checkout-session` Edge Function

### 5. Payment Callback Process

**File**: `apps/unified/src/pages/user/onboarding/PaymentCallback.tsx`

**What happens**:
- Verifies payment status with `verify-payment` Edge Function
- Updates customer record with payment status
- Redirects to onboarding flow

**Database changes**:
```sql
UPDATE customers 
SET payment_status = 'completed', stripe_customer_id = 'cus_...'
WHERE billing_email = customer_email
```

**Key functions called**:
- `verify-payment` Edge Function

## 🗄️ Database Schema Overview

### Core Tables

#### `verifications`
- Stores verification requests and completion status
- Links to user via `existing_user_id` after account creation

#### `user_profiles`
- User profile information
- Links to Supabase Auth via `id`

#### `companies`
- Business entity information
- Created by `created_by_user_id`

#### `customers`
- Paying entity information
- Links to company via `company_id`
- Contains payment status and Stripe information

#### `memberships`
- Links users to companies
- Defines user roles within companies

#### `onboarding_submissions`
- Tracks post-payment onboarding progress
- Contains current step and completion status

## 🔧 Edge Functions

### `submit-verification`
- Creates verification record
- Sends SMS via Zapier or email via Resend
- **Location**: `supabase/functions/submit-verification/index.ts`

### `verify-code`
- Verifies OTP code
- Updates verification completion timestamp
- **Location**: `supabase/functions/verify-code/index.ts`

### `create-account`
- Creates Supabase Auth user
- Creates all related database records
- Links verification to user
- **Location**: `supabase/functions/create-account/index.ts`

### `create-checkout-session`
- Creates Stripe checkout session
- **Location**: `supabase/functions/create-checkout-session/index.ts`

### `verify-payment`
- Verifies Stripe payment status
- Updates customer payment information
- **Location**: `supabase/functions/verify-payment/index.ts`

## 🐛 Common Issues & Debugging

### Issue: "Dev auth configuration error"
**Cause**: Missing `VITE_DEV_AUTH_TOKEN` environment variable
**Solution**: Add to `.env.local` or use real authentication

### Issue: "Failed to create user profile"
**Cause**: Schema mismatch in `create-account` Edge Function
**Solution**: Check that all required fields are provided and match database schema

### Issue: "Verification not showing up"
**Cause**: Hub ID mismatch between signup and verification pages
**Solution**: Ensure consistent hub ID mapping across all components

### Issue: "SMS not received"
**Cause**: Zapier webhook payload format mismatch
**Solution**: Check `submit-verification` function payload format

### Issue: "Payment verification failed"
**Cause**: Stripe session not found or payment not completed
**Solution**: Check Stripe dashboard and verify session ID

## 🔍 Debugging Tools

### Dashboard Cleanup Tools
- **Location**: Admin dashboard → Data Cleanup section
- **Preview Cleanup**: Shows what would be deleted
- **Execute Cleanup**: Deletes all payment track data except superadmin

### Database Queries
```sql
-- Check verification status
SELECT * FROM verifications WHERE email = 'user@example.com';

-- Check user profile
SELECT * FROM user_profiles WHERE email = 'user@example.com';

-- Check company record
SELECT * FROM companies WHERE created_by_user_id = 'user-uuid';

-- Check customer record
SELECT * FROM customers WHERE user_id = 'user-uuid';

-- Check payment status
SELECT payment_status, stripe_customer_id FROM customers WHERE user_id = 'user-uuid';
```

### Logs
- **Supabase Edge Functions**: Check function logs in Supabase dashboard
- **Stripe**: Check payment logs in Stripe dashboard
- **Zapier**: Check webhook logs in Zapier dashboard

## 📊 Data Flow Summary

```
User Signup → Verification → Account Creation → Payment → Onboarding
     ↓              ↓              ↓              ↓           ↓
verifications → user_profiles → companies → customers → onboarding_submissions
     ↓              ↓              ↓              ↓           ↓
   SMS/Email    Auth User     Company Data   Payment Data  Progress Tracking
```

## 🎯 Success Criteria

### Pre-Payment Success
- ✅ Verification record created
- ✅ SMS/email sent successfully
- ✅ Verification code verified
- ✅ User profile created
- ✅ Company record created
- ✅ Customer record created
- ✅ Membership record created
- ✅ Verification linked to user

### Payment Success
- ✅ Stripe checkout session created
- ✅ Payment completed successfully
- ✅ Customer payment status updated
- ✅ Stripe customer ID stored

### Post-Payment Success
- ✅ Onboarding submission created
- ✅ User can access onboarding steps
- ✅ Progress tracked correctly

## 🔄 Maintenance & Updates

### Schema Changes
1. Update database schema via migrations
2. Regenerate TypeScript types: `supabase gen types typescript`
3. Update service layer to match new schema
4. Update UI components to use new types
5. Test complete onboarding flow

### Edge Function Updates
1. Update function code
2. Deploy: `supabase functions deploy <function-name>`
3. Test with real data
4. Update documentation

### Environment Variables
- Ensure all required variables are set
- Test in both development and production
- Document any new variables needed

This documentation should help any developer understand the complete onboarding flow and debug any issues that arise.
