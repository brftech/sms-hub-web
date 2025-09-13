# SMS Hub Onboarding Flow - Complete Documentation

## 🎯 Overview

This document provides a comprehensive walkthrough of the SMS Hub onboarding process, from initial signup with **magic link authentication** to payment completion and post-payment onboarding. This is essential for understanding the complete user journey and debugging any issues.

**Recent Updates (September 2025)**: Magic link authentication implementation, role management fixes (USER instead of MEMBER), superadmin protection, and enhanced B2B/B2C account creation.

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

### 1. Signup Process (Enhanced B2B/B2C)

**File**: `apps/web/src/pages/Signup.tsx`

**What happens**:
- User enters email, phone, and selects signup type (company/individual) with **enhanced B2B/B2C support**
- Data is stored in `sessionStorage` as backup
- Calls **updated** `submit-verification` Edge Function with comprehensive validation
- Creates record in `verifications` table with proper hub_id mapping
- Sends SMS via Zapier webhook or email via Resend with improved error handling
- **Enhanced validation** ensures data integrity and proper role assignment

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

### 2. Verification Process (Magic Link Authentication)

**File**: `apps/web/src/pages/VerifyOtp.tsx`

**What happens**:
- User enters verification code
- Calls `verify-code` Edge Function with enhanced validation
- Updates `verifications` table with completion timestamp
- **Magic link authentication** initiated instead of direct redirect
- **Prevents session carryover** between different user types
- Redirects to account details page with **proper session isolation**

**Database changes**:
```sql
UPDATE verifications 
SET verification_completed_at = NOW()
WHERE id = verification_id AND verification_code = entered_code
```

**Key functions called**:
- `verify-code` Edge Function

### 3. Account Details Process (Enhanced Creation)

**File**: `apps/unified/src/pages/user/AccountDetails.tsx`

**What happens**:
- User enters company name, first name, last name, password with **enhanced validation**
- Calls **updated** `create-account` Edge Function with comprehensive B2B/B2C support
- Creates Supabase Auth user with **magic link authentication**
- Creates user profile, company, customer, and membership records with **proper role assignment**
- **Fixed role assignment**: USER role (corrected from incorrect MEMBER role)
- Links verification to user profile with enhanced data integrity
- **Comprehensive error handling** and user feedback

**Database changes**:
```sql
-- Creates auth.users record (via Supabase Auth with magic link)
-- Creates user_profiles record with proper validation
-- Creates companies record (B2B) or enhanced customer record (B2C)
-- Creates customers record with proper payment tracking setup
-- Creates memberships record with corrected USER role (not MEMBER)
-- Updates verifications with existing_user_id and completion status
-- Enhanced foreign key relationships and data integrity
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

### `create-account` (Enhanced)
- Creates Supabase Auth user with **magic link authentication**
- Creates all related database records with **comprehensive B2B/B2C support**
- Links verification to user with enhanced validation
- **Fixed role assignment**: USER role (corrected from MEMBER)
- **Enhanced error handling** and validation
- **Superadmin protection** measures
- **Location**: `supabase/functions/create-account/index.ts`

### `create-checkout-session`
- Creates Stripe checkout session
- **Location**: `supabase/functions/create-checkout-session/index.ts`

### `verify-payment` (Enhanced)
- Verifies Stripe payment status with enhanced validation
- Updates customer payment information with proper data integrity
- **Improved error handling** and status tracking
- **Enhanced logging** for better debugging
- **Location**: `supabase/functions/verify-payment/index.ts`

## 🐛 Common Issues & Debugging (Updated)

### Issue: "Magic link authentication failed"
**Cause**: Session carryover from previous user or invalid magic link
**Solution**: Clear browser storage and ensure proper magic link flow, check for session isolation

### Issue: "Role assignment incorrect (MEMBER instead of USER)"
**Cause**: Legacy role assignment in Edge Functions
**Solution**: **FIXED** - Edge Functions now properly assign USER role in membership creation

### Issue: "Dev auth configuration error"
**Cause**: Missing `VITE_DEV_AUTH_TOKEN` environment variable
**Solution**: Add to `.env.local` or use real magic link authentication

### Issue: "Failed to create user profile"
**Cause**: Schema mismatch in `create-account` Edge Function or validation failure
**Solution**: Check that all required fields are provided, match database schema, and review enhanced validation logic

### Issue: "Verification not showing up"
**Cause**: Hub ID mismatch between signup and verification pages
**Solution**: Ensure consistent hub ID mapping across all components and check enhanced validation

### Issue: "SMS not received"
**Cause**: Zapier webhook payload format mismatch or service issues
**Solution**: Check `submit-verification` function payload format and Zapier webhook logs

### Issue: "Payment verification failed"
**Cause**: Stripe session not found, payment not completed, or validation error
**Solution**: Check Stripe dashboard, verify session ID, and review enhanced payment validation logic

### Issue: "Superadmin account protection triggered"
**Cause**: Attempt to delete protected superadmin accounts
**Solution**: **WORKING AS INTENDED** - Protection prevents deletion of superadmin@percytech.com and superadmin@gnymble.com

### Issue: "B2B/B2C account creation failure"
**Cause**: Enhanced validation requirements not met
**Solution**: Review Edge Function logs for specific validation errors and ensure all required fields are provided

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

## 🎯 Success Criteria (Enhanced)

### Pre-Payment Success
- ✅ Verification record created with proper hub_id
- ✅ SMS/email sent successfully with enhanced error handling
- ✅ Verification code verified with magic link flow
- ✅ **Magic link authentication** completed without session carryover
- ✅ User profile created with proper validation
- ✅ Company record created (B2B) or enhanced customer setup (B2C)
- ✅ Customer record created with proper payment tracking
- ✅ **Membership record created with correct USER role** (not MEMBER)
- ✅ Verification linked to user with enhanced data integrity
- ✅ **Proper session isolation** maintained throughout process

### Payment Success
- ✅ Stripe checkout session created with enhanced validation
- ✅ Payment completed successfully with improved tracking
- ✅ Customer payment status updated with proper data integrity
- ✅ Stripe customer ID stored with enhanced security
- ✅ **Payment validation** with comprehensive error handling

### Post-Payment Success
- ✅ Onboarding submission created with proper role-based access
- ✅ User can access onboarding steps based on **correct USER role**
- ✅ Progress tracked correctly with enhanced UI ("Onboarding" instead of "Onboarding Submissions")
- ✅ **Global view default** for admin users
- ✅ **Protected accounts** cannot be accidentally deleted

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

## 🔄 Recent Enhancements Summary (September 2025)

### Authentication Flow Improvements
1. **Magic Link Authentication**: Prevents session carryover and ensures proper isolation
2. **Enhanced B2B/B2C Support**: Comprehensive account creation for different business models
3. **Role Management Fix**: Corrected USER role assignment (was incorrectly MEMBER)
4. **Superadmin Protection**: Protected accounts cannot be deleted via dashboard
5. **Global View Default**: Admin dashboard defaults to global view instead of specific hub

### Technical Improvements
1. **Enhanced Edge Functions**: Comprehensive validation and error handling
2. **Improved UI**: Responsive design and better labeling
3. **Better Error Handling**: More informative error messages and logging
4. **Data Integrity**: Enhanced validation throughout the creation process

### Security Enhancements
1. **Session Isolation**: Prevents authentication issues between different user types
2. **Account Protection**: Critical system accounts protected from deletion
3. **Enhanced Validation**: Comprehensive input validation and sanitization
4. **Improved Logging**: Better tracking and debugging capabilities

This documentation should help any developer understand the complete enhanced onboarding flow and debug any issues that arise. The recent improvements provide a more robust, secure, and user-friendly experience while maintaining backward compatibility.
