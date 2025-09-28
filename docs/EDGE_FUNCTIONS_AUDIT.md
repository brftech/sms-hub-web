# SMS Hub Web Edge Functions Audit

## 📋 Complete Function Analysis

### ✅ **ESSENTIAL FUNCTIONS (Keep & Optimize)**

#### 1. **submit-contact** ✅ KEEP
- **Purpose**: Contact form submission handling
- **Status**: ✅ ESSENTIAL - Core marketing functionality
- **Optimization**: ✅ Already well-optimized
- **Features**:
  - Lead creation/update in database
  - Email confirmation via Resend
  - Admin notification emails
  - Activity tracking
  - Duplicate handling

#### 2. **create-checkout-session** ✅ KEEP
- **Purpose**: Stripe checkout session creation
- **Status**: ✅ ESSENTIAL - Payment processing
- **Optimization**: ✅ Already well-optimized
- **Features**:
  - Payment-first flow support
  - Customer creation in Stripe
  - Database customer records
  - Flexible pricing

#### 3. **stripe-webhook** ✅ KEEP
- **Purpose**: Stripe webhook handling
- **Status**: ✅ ESSENTIAL - Payment processing
- **Optimization**: ⚠️ NEEDS UPDATE - Use new auth flow
- **Issues**: Still uses old verification approach
- **Action**: Update to use new Supabase Auth flow

### ⚠️ **FUNCTIONS NEEDING UPDATES**

#### 4. **signup-native** ⚠️ UPDATE
- **Purpose**: User registration
- **Status**: ⚠️ PARTIALLY NEEDED - Update for new auth flow
- **Issues**: Uses old schema, complex business logic
- **Action**: Simplify for marketing site use only

#### 5. **login-native** ✅ KEEP
- **Purpose**: User authentication
- **Status**: ✅ ESSENTIAL - User login
- **Optimization**: ✅ Already optimized
- **Features**: Standard Supabase auth

#### 6. **sms-verification-consent** ✅ KEEP
- **Purpose**: SMS verification with consent
- **Status**: ✅ ESSENTIAL - SMS compliance
- **Optimization**: ✅ Already optimized
- **Features**: Consent tracking, Zapier integration

### ❌ **FUNCTIONS TO REMOVE/DEPRECATE**

#### 7. **authenticate-stripe-customer** ❌ REMOVE
- **Purpose**: Stripe customer authentication
- **Status**: ❌ DEPRECATED - Replaced by new auth flow
- **Reason**: Complex, uses old verification approach

#### 8. **create-account** ❌ REMOVE
- **Purpose**: Account creation
- **Status**: ❌ REDUNDANT - Handled by signup-native
- **Reason**: Duplicate functionality

#### 9. **create-user** ❌ REMOVE
- **Purpose**: User creation
- **Status**: ❌ REDUNDANT - Handled by signup-native
- **Reason**: Duplicate functionality

#### 10. **delete-account** ❌ REMOVE
- **Purpose**: Account deletion
- **Status**: ❌ NOT NEEDED - Marketing site doesn't need account deletion
- **Reason**: Not core marketing functionality

#### 11. **delete-user** ❌ REMOVE
- **Purpose**: User deletion
- **Status**: ❌ NOT NEEDED - Marketing site doesn't need user deletion
- **Reason**: Not core marketing functionality

#### 12. **update-account** ❌ REMOVE
- **Purpose**: Account updates
- **Status**: ❌ NOT NEEDED - Marketing site doesn't need account updates
- **Reason**: Not core marketing functionality

#### 13. **update-user** ❌ REMOVE
- **Purpose**: User updates
- **Status**: ❌ NOT NEEDED - Marketing site doesn't need user updates
- **Reason**: Not core marketing functionality

#### 14. **verify-payment** ❌ REMOVE
- **Purpose**: Payment verification
- **Status**: ❌ REDUNDANT - Handled by stripe-webhook
- **Reason**: Duplicate functionality

#### 15. **sync-stripe-customer** ❌ REMOVE
- **Purpose**: Stripe customer sync
- **Status**: ❌ REDUNDANT - Handled by stripe-webhook
- **Reason**: Duplicate functionality

#### 16. **sync-auth-users** ❌ REMOVE
- **Purpose**: Auth user sync
- **Status**: ❌ NOT NEEDED - Marketing site doesn't need user sync
- **Reason**: Not core marketing functionality

#### 17. **validate-invitation** ❌ REMOVE
- **Purpose**: Invitation validation
- **Status**: ❌ NOT NEEDED - Marketing site doesn't use invitations
- **Reason**: Not core marketing functionality

#### 18. **resend-verification** ❌ REMOVE
- **Purpose**: Resend verification emails
- **Status**: ❌ REDUNDANT - Supabase handles this natively
- **Reason**: Supabase Auth handles verification

#### 19. **send-user-notification** ❌ REMOVE
- **Purpose**: Send notifications
- **Status**: ❌ REDUNDANT - submit-contact handles email sending
- **Reason**: Duplicate functionality

### 🔧 **ADMIN/TESTING FUNCTIONS**

#### 20. **superadmin-auth** ❌ REMOVE
- **Purpose**: Super admin authentication
- **Status**: ❌ NOT NEEDED - Marketing site doesn't need super admin
- **Reason**: Not core marketing functionality

#### 21. **reset-superadmin-password** ❌ REMOVE
- **Purpose**: Reset super admin password
- **Status**: ❌ NOT NEEDED - Marketing site doesn't need super admin
- **Reason**: Not core marketing functionality

#### 22. **test-permissions** ❌ REMOVE
- **Purpose**: Test permissions
- **Status**: ❌ NOT NEEDED - Testing function
- **Reason**: Not production functionality

#### 23. **test-rpc** ❌ REMOVE
- **Purpose**: Test RPC calls
- **Status**: ❌ NOT NEEDED - Testing function
- **Reason**: Not production functionality

### 📊 **INTEGRATION FUNCTIONS**

#### 24. **tcr-register-campaign** ✅ KEEP
- **Purpose**: TCR campaign registration
- **Status**: ✅ ESSENTIAL - SMS compliance
- **Optimization**: ✅ Already optimized
- **Features**: TCR integration for SMS campaigns

#### 25. **tcr-webhook** ✅ KEEP
- **Purpose**: TCR webhook handling
- **Status**: ✅ ESSENTIAL - TCR integration
- **Optimization**: ✅ Already optimized
- **Features**: TCR status updates

## 📊 **SUMMARY**

### **Functions to KEEP (8 functions)**
1. ✅ `submit-contact` - Core lead capture
2. ✅ `create-checkout-session` - Payment processing
3. ✅ `stripe-webhook` - Payment webhooks (needs update)
4. ✅ `signup-native` - User registration (needs update)
5. ✅ `login-native` - User authentication
6. ✅ `sms-verification-consent` - SMS compliance
7. ✅ `tcr-register-campaign` - SMS compliance
8. ✅ `tcr-webhook` - TCR integration

### **Functions to REMOVE (17 functions)**
- All admin functions (superadmin, test functions)
- All CRUD functions (create/update/delete account/user)
- All redundant functions (verify-payment, sync functions)
- All non-marketing functions (invitations, notifications)

### **Functions to UPDATE (2 functions)**
1. ⚠️ `stripe-webhook` - Update to use new auth flow
2. ⚠️ `signup-native` - Simplify for marketing use

## 🚀 **OPTIMIZATION RECOMMENDATIONS**

### **1. Consolidate CORS Headers**
- Use shared `_shared/cors.ts` consistently
- Remove duplicate CORS definitions

### **2. Standardize Error Handling**
- Create shared error response utilities
- Consistent error message formats

### **3. Update Stripe Webhook**
- Remove old verification logic
- Use new Supabase Auth flow
- Simplify customer creation

### **4. Simplify Signup Flow**
- Remove complex business logic
- Focus on marketing site needs only
- Use new auth flow

### **5. Add Missing Functions**
- Consider adding email list management
- Consider adding lead scoring
- Consider adding analytics tracking

## 🎯 **FINAL FUNCTION SET (8 functions)**

```
sms-hub-web/supabase/functions/
├── _shared/
│   └── cors.ts ✅
├── submit-contact/ ✅
├── create-checkout-session/ ✅
├── stripe-webhook/ ⚠️ (update needed)
├── signup-native/ ⚠️ (simplify needed)
├── login-native/ ✅
├── sms-verification-consent/ ✅
├── tcr-register-campaign/ ✅
└── tcr-webhook/ ✅
```

This gives us a clean, focused set of functions for the marketing website while removing all the unnecessary complexity from the customer app.
