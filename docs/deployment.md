# SMS Hub Web Deployment Guide

## 🎯 Overview

This guide covers deployment of SMS Hub Web marketing platform to production environments. The application is deployed on Vercel with a separate Supabase marketing database.

**Current Status**: ✅ **Production Ready** - SMS-Hub-Web fully deployed and operational

## 📋 Prerequisites

### **Required Accounts**

- **Vercel Account**: For application deployment
- **Supabase Account**: For database management
- **Stripe Account**: For payment processing
- **GitHub Account**: For code repositories

### **Required Tools**

- **Vercel CLI**: `npm install -g vercel`
- **Supabase CLI**: `npm install -g supabase`
- **Git**: For version control

## 🗄️ Database Setup

### **1. Create Supabase Project**

#### **SMS-Hub-Web Database**

```bash
# Create new Supabase project for marketing site
# Project Name: sms-hub-web
# Database ID: hmumtnpnyxuplvqcmnfk (dev), fwlivygerbqzowbzxesw (prod)
```

### **2. Deploy Database Schema**

#### **Marketing Database (sms-hub-web)**

```bash
cd sms-hub-web
npx supabase db push --project-ref hmumtnpnyxuplvqcmnfk  # Dev
npx supabase db push --project-ref fwlivygerbqzowbzxesw  # Prod
```

### **3. Deploy Edge Functions**

#### **SMS-Hub-Web Functions**

```bash
cd sms-hub-web
npx supabase functions deploy submit-contact --project-ref fwlivygerbqzowbzxesw
npx supabase functions deploy stripe-webhook --project-ref fwlivygerbqzowbzxesw
```

## 🚀 Application Deployment

### **Step 1: Deploy SMS-Hub-Web (Marketing)**

#### **1.1 Deploy to Vercel**

```bash
cd sms-hub-web
vercel --prod
```

#### **1.2 Configure Environment Variables**

```bash
# In Vercel Dashboard → Settings → Environment Variables
VITE_SUPABASE_URL=https://fwlivygerbqzowbzxesw.supabase.co
VITE_SUPABASE_ANON_KEY=[prod-anon-key]
VITE_STRIPE_PAYMENT_LINK=[stripe-payment-link]
VITE_WEB_APP_URL=https://gnymble.com
PUBLIC_SITE_URL=https://gnymble.com
VITE_ENABLE_DEBUG=false
VITE_ENABLE_DEV_AUTH=false
VITE_ENABLE_HUB_SWITCHER=false
VITE_ADMIN_ACCESS_CODE=[secure-admin-code]
```

#### **1.3 Configure Domains**

- **Primary**: gnymble.com
- **Secondary**: percytech.com, percymd.com, percytext.com

## 🔧 Configuration

### **1. Supabase Configuration**

#### **Authentication Settings**

- **Email Templates**: Update confirmation email template
- **Redirect URLs**: Set confirmation redirect to sms-hub-app2
- **Site URL**: Ensure it matches your app domain

#### **Row Level Security (RLS)**

- **Disabled**: RLS is disabled for this project
- **Multi-tenancy**: Handled via manual hub_id filtering
- **Security**: Implemented in Edge Functions and services

### **2. Stripe Configuration**

#### **Webhook Endpoints**

- **SMS-Hub-Web**: `https://your-web-app.vercel.app/api/stripe-webhook`

#### **Required Events**

- `checkout.session.completed`
- `customer.created`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### **3. Domain Configuration**

#### **DNS Settings**

- **A Records**: Point domains to Vercel
- **CNAME Records**: Configure subdomains
- **SSL**: Automatic via Vercel

#### **Hub Detection**

- **Automatic**: Based on domain name
- **Fallback**: Default to Gnymble (hub_id: 1)
- **Configuration**: Set in environment variables

## 📊 Monitoring & Analytics

### **1. Application Monitoring**

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Vercel error logs
- **Uptime Monitoring**: External service recommended

### **2. Database Monitoring**

- **Supabase Dashboard**: Built-in monitoring
- **Query Performance**: Monitor slow queries
- **Connection Pooling**: Monitor connection usage

### **3. Marketing Analytics**

- **Lead Tracking**: Monitor contact form submissions
- **Conversion Rates**: Track lead to customer conversion
- **Hub Performance**: Monitor performance by brand

## 🔄 CI/CD Pipeline

### **1. GitHub Actions (Recommended)**

#### **Deploy on Push to Main**

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

### **2. Manual Deployment**

```bash
# Deploy marketing application
cd sms-hub-web && vercel --prod
```

## 🧪 Testing Deployment

### **1. Pre-Deployment Checklist**

- [ ] Database schemas deployed
- [ ] Edge Functions deployed
- [ ] Environment variables configured
- [ ] Domain DNS configured
- [ ] Stripe webhooks configured

### **2. Post-Deployment Testing**

- [ ] Marketing site loads correctly
- [ ] Hub detection works
- [ ] Contact forms submit successfully
- [ ] Sales Dashboard accessible with admin code
- [ ] Hub-specific data filtering works
- [ ] Stripe payment flow works
- [ ] Cross-app redirects work

### **3. Production Testing**

- [ ] End-to-end user flow
- [ ] Payment processing
- [ ] Multi-tenant isolation
- [ ] Performance benchmarks

## 🚨 Troubleshooting

### **Common Issues**

#### **Database Connection Issues**

```bash
# Check Supabase project status
npx supabase status

# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

#### **Edge Function Issues**

```bash
# Check function logs
npx supabase functions logs --project-ref fwlivygerbqzowbzxesw

# Redeploy functions
npx supabase functions deploy [function-name] --project-ref fwlivygerbqzowbzxesw
```

#### **Vercel Deployment Issues**

```bash
# Check deployment logs
vercel logs [deployment-url]

# Redeploy
vercel --prod --force
```

### **Performance Issues**

- **Slow Loading**: Check bundle size and optimize
- **Database Queries**: Monitor query performance
- **Hub Detection**: Verify domain-based detection

## 📈 Scaling Considerations

### **Horizontal Scaling**

- **Vercel**: Automatic scaling based on traffic
- **Supabase**: Managed scaling
- **Edge Functions**: Serverless scaling

### **Database Scaling**

- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: Optimize connection usage
- **Query Optimization**: Monitor and optimize slow queries

### **Marketing Scaling**

- **Lead Volume**: Monitor contact form submissions
- **Hub Performance**: Track performance by brand
- **Conversion Optimization**: A/B test different approaches

## 🔒 Security Considerations

### **Environment Variables**

- **Never commit**: Keep all secrets in environment variables
- **Rotate regularly**: Rotate API keys and secrets
- **Least privilege**: Use minimal required permissions

### **Database Security**

- **RLS**: Consider enabling Row Level Security
- **API Keys**: Use anon key in frontend, service key in Edge Functions
- **Access Control**: Implement proper user permissions

### **Application Security**

- **HTTPS**: All traffic over HTTPS
- **CORS**: Configure proper CORS settings
- **Input Validation**: Validate all user inputs

## 🚀 Recent Updates (October 2025)

### **SMS-Hub-Web Deployment Achievements**

- **Production Ready**: Fully deployed and operational
- **Sales Dashboard**: Integrated with admin access code authentication
- **Hub-Specific Filtering**: All data properly isolated by hub
- **Performance**: 91KB gzipped main bundle
- **Zero Errors**: Clean deployment with no TypeScript/ESLint errors
- **Comprehensive Testing**: 48 E2E tests across 6 browsers

---

**Last Updated**: October 2025  
**Status**: Production Ready - Marketing platform deployment guide complete and tested
