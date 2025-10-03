# SMS Hub Web Troubleshooting Guide

## 🎯 Overview

This guide covers common issues, solutions, and debugging techniques for SMS Hub Web marketing platform. Use this guide to quickly resolve issues and understand system behavior.

**Current Status**: ✅ **Production Ready** - SMS-Hub-Web with zero TypeScript/ESLint errors and comprehensive testing

## 🚨 Common Issues

### **🔐 Authentication Issues**

#### **Issue: "User not found" error during login**

**Symptoms**: User receives "User not found" error when trying to log in

**Quick Fix**:

```bash
# 1. Check user exists in auth.users
SELECT * FROM auth.users WHERE email = 'user@example.com';

# 2. Check user profile exists
SELECT * FROM user_profiles WHERE email = 'user@example.com';

# 3. Check Stripe webhook logs
npx supabase functions logs stripe-webhook --project-ref fwlivygerbqzowbzxesw
```

**Root Causes**:

- User profile not created in database
- Email confirmation not completed
- Stripe webhook failed to create user

**Manual Fix**:

```bash
# Create user profile if missing
INSERT INTO user_profiles (id, email, first_name, last_name, hub_id)
VALUES (gen_random_uuid(), 'user@example.com', 'John', 'Doe', 1);
```

#### **Issue: Email confirmation not working**

**Symptoms**: User doesn't receive confirmation email or link doesn't work

**Quick Fix**:

```bash
# 1. Check Supabase Auth settings
# Go to Supabase Dashboard → Authentication → Settings

# 2. Verify email template
# Check Authentication → Email Templates

# 3. Check redirect URLs
# Verify Site URL and Redirect URLs are correct
```

**Root Causes**:

- Email template not configured
- Redirect URL not set correctly
- SMTP settings incorrect

**Solutions**:

- Update email template in Supabase Dashboard
- Set correct redirect URLs
- Verify SMTP configuration

### **🗄️ Database Issues**

#### **Issue: "Relation does not exist" error**

**Symptoms**: Database queries fail with relation not found

**Quick Fix**:

```bash
# 1. Check if migrations are applied
npx supabase db push --project-ref fwlivygerbqzowbzxesw

# 2. Verify table exists
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'leads';

# 3. Check migration status
npx supabase migration list --project-ref fwlivygerbqzowbzxesw
```

**Root Causes**:

- Database migrations not applied
- Wrong database connection
- Table name typo

**Solutions**:

- Apply missing migrations
- Verify database connection
- Check table names

#### **Issue: Hub data not filtering correctly**

**Symptoms**: Data from wrong hub showing in Sales Dashboard

**Quick Fix**:

```bash
# 1. Check hub_id in queries
SELECT hub_id, COUNT(*) FROM leads GROUP BY hub_id;

# 2. Verify hub detection
console.log('Detected hub:', detectHub());

# 3. Check database queries
# Ensure all queries include hub_id filter
```

**Root Causes**:

- Missing hub_id in database queries
- Incorrect hub detection logic
- Data not properly isolated

**Solutions**:

- Add hub_id filter to all queries
- Fix hub detection logic
- Verify data isolation

### **🚀 Deployment Issues**

#### **Issue: Vercel deployment fails**

**Symptoms**: Build fails or deployment doesn't complete

**Quick Fix**:

```bash
# 1. Check build locally
npm run build:check

# 2. Check Vercel logs
vercel logs [deployment-url]

# 3. Verify environment variables
vercel env ls
```

**Root Causes**:

- TypeScript/ESLint errors
- Missing environment variables
- Build configuration issues

**Solutions**:

- Fix TypeScript/ESLint errors
- Set missing environment variables
- Check Vercel configuration

#### **Issue: Sales Dashboard not accessible**

**Symptoms**: Admin dashboard returns 404 or access denied

**Quick Fix**:

```bash
# 1. Check admin access code
echo $VITE_ADMIN_ACCESS_CODE

# 2. Verify environment variables
# Check Vercel Dashboard → Settings → Environment Variables

# 3. Test admin access
# Visit /admin with correct access code
```

**Root Causes**:

- Missing or incorrect admin access code
- Environment variables not set
- Route not properly configured

**Solutions**:

- Set correct admin access code
- Verify environment variables
- Check route configuration

### **📱 Performance Issues**

#### **Issue: Slow page loading**

**Symptoms**: Pages take too long to load

**Quick Fix**:

```bash
# 1. Check bundle size
npm run build:analyze

# 2. Monitor Core Web Vitals
# Use browser dev tools → Lighthouse

# 3. Check database queries
# Monitor query performance in Supabase Dashboard
```

**Root Causes**:

- Large bundle size
- Slow database queries
- Unoptimized images
- Missing caching

**Solutions**:

- Optimize bundle size
- Add database indexes
- Optimize images
- Implement caching

#### **Issue: Contact form not submitting**

**Symptoms**: Form submission fails or hangs

**Quick Fix**:

```bash
# 1. Check Edge Function logs
npx supabase functions logs submit-contact --project-ref fwlivygerbqzowbzxesw

# 2. Verify form validation
# Check client-side validation

# 3. Test Edge Function directly
# Use Supabase Dashboard → Edge Functions
```

**Root Causes**:

- Edge Function error
- Form validation failure
- Network issues
- Database connection problems

**Solutions**:

- Fix Edge Function errors
- Update form validation
- Check network connectivity
- Verify database connection

### **🎨 UI/UX Issues**

#### **Issue: Hub theming not working**

**Symptoms**: Wrong colors or branding showing

**Quick Fix**:

```bash
# 1. Check hub detection
console.log('Current hub:', detectHub());

# 2. Verify theme loading
# Check if correct CSS file is loaded

# 3. Test hub switching
# Use floating hub switcher (dev mode)
```

**Root Causes**:

- Incorrect hub detection
- Missing theme CSS
- Hub switching not working

**Solutions**:

- Fix hub detection logic
- Load correct theme CSS
- Implement hub switching

#### **Issue: Responsive design broken**

**Symptoms**: Layout issues on mobile or tablet

**Quick Fix**:

```bash
# 1. Check Tailwind CSS classes
# Verify responsive classes are correct

# 2. Test on different screen sizes
# Use browser dev tools

# 3. Check CSS conflicts
# Look for conflicting styles
```

**Root Causes**:

- Incorrect Tailwind classes
- CSS conflicts
- Missing responsive design

**Solutions**:

- Fix Tailwind classes
- Resolve CSS conflicts
- Implement responsive design

## 🔧 Debugging Tools

### **1. Browser Dev Tools**

#### **Console Debugging**

```javascript
// Enable debug mode
localStorage.setItem("debug", "true");

// Check hub detection
console.log("Hub:", detectHub());

// Monitor performance
console.time("Page Load");
// ... page load code
console.timeEnd("Page Load");
```

#### **Network Tab**

- Check API requests
- Monitor response times
- Verify headers
- Check for failed requests

#### **Performance Tab**

- Monitor Core Web Vitals
- Check bundle size
- Analyze render performance
- Identify bottlenecks

### **2. Supabase Debugging**

#### **Database Queries**

```sql
-- Check table structure
\d leads

-- Monitor query performance
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM leads WHERE hub_id = 1;

-- Check data integrity
SELECT hub_id, COUNT(*) FROM leads GROUP BY hub_id;
```

#### **Edge Function Logs**

```bash
# Check function logs
npx supabase functions logs submit-contact --project-ref fwlivygerbqzowbzxesw

# Monitor real-time logs
npx supabase functions logs stripe-webhook --project-ref fwlivygerbqzowbzxesw --follow
```

### **3. Vercel Debugging**

#### **Deployment Logs**

```bash
# Check deployment logs
vercel logs [deployment-url]

# Check build logs
vercel logs [deployment-url] --build

# Monitor function logs
vercel logs [deployment-url] --functions
```

#### **Environment Variables**

```bash
# List environment variables
vercel env ls

# Check specific variable
vercel env pull .env.local
```

## 🚨 Error Codes

### **Common Error Codes**

| Code | Error        | Cause             | Solution                 |
| ---- | ------------ | ----------------- | ------------------------ |
| 400  | Bad Request  | Invalid form data | Check form validation    |
| 401  | Unauthorized | Missing auth      | Check authentication     |
| 403  | Forbidden    | No permission     | Check user permissions   |
| 404  | Not Found    | Missing resource  | Check URL/route          |
| 500  | Server Error | Backend issue     | Check Edge Function logs |

### **Database Error Codes**

| Code  | Error                 | Cause                  | Solution                 |
| ----- | --------------------- | ---------------------- | ------------------------ |
| 23505 | Unique violation      | Duplicate data         | Check unique constraints |
| 23503 | Foreign key violation | Invalid reference      | Check foreign keys       |
| 23502 | Not null violation    | Missing required field | Check required fields    |
| 42P01 | Undefined table       | Table not found        | Check migrations         |

## 📊 Monitoring

### **1. Performance Monitoring**

#### **Core Web Vitals**

- **LCP**: Largest Contentful Paint < 2.5s
- **FID**: First Input Delay < 100ms
- **CLS**: Cumulative Layout Shift < 0.1

#### **Custom Metrics**

- Page load time
- Contact form submission time
- Hub detection time
- Database query time

### **2. Error Monitoring**

#### **Frontend Errors**

- JavaScript errors
- Unhandled promise rejections
- Network request failures
- Form validation errors

#### **Backend Errors**

- Edge Function errors
- Database connection errors
- Authentication failures
- Webhook failures

### **3. User Experience Monitoring**

#### **Conversion Tracking**

- Contact form submissions
- Lead conversion rates
- Hub-specific performance
- User journey analysis

## 🚀 Recent Updates (October 2025)

### **Troubleshooting Improvements**

- **Zero Errors**: Clean codebase with zero TypeScript/ESLint errors
- **Comprehensive Testing**: 48 E2E tests across 6 browsers
- **Performance Monitoring**: 91KB gzipped main bundle
- **Error Handling**: Improved error messages and debugging
- **Documentation**: Clear troubleshooting guides

### **Key Debugging Features**

- **Debug Mode**: Enhanced debugging capabilities
- **Error Tracking**: Comprehensive error monitoring
- **Performance Metrics**: Real-time performance tracking
- **Hub Detection**: Improved hub detection and switching

---

**Last Updated**: October 2025  
**Status**: Troubleshooting guide complete and production ready
