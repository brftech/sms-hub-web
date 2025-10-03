# SMS Hub Web Development Context

**Last Updated**: October 3, 2025 at 12:30 PM ET

## 🎯 Project Overview

**SMS Hub Web** is a production-ready multi-tenant marketing website and sales dashboard for the SMS Hub B2B platform. It serves 4 business brands (Gnymble, PercyTech, PercyMD, PercyText) with isolated data, branded experiences, and comprehensive lead management capabilities.

**Current Status**: ✅ **Production Ready** - Marketing platform fully operational with Sales Dashboard and multi-tenant support

## 🏗️ Key Architecture Decisions

### **Multi-Tenant Hub System**

- **Hub 0**: PercyTech (percytech.com) - Red theme, technology focus
- **Hub 1**: Gnymble (gnymble.com) - Orange theme, primary brand (default)
- **Hub 2**: PercyMD (percymd.com) - Red theme, medical focus
- **Hub 3**: PercyText (percytext.com) - Purple theme, messaging focus

### **Database Strategy**

- **Marketing Database**: `fwlivygerbqzowbzxesw` (prod) - Lead capture and marketing data
- **Separate from App2**: Uses different database from customer application
- **Hub Isolation**: All data filtered by `hub_id` for proper tenant separation

### **Package Architecture**

- **Local Packages**: Use `file:` dependencies with `preserveSymlinks: true` in Vite
- **Bundle Optimization**: `@sms-hub/ui/marketing` for optimized marketing components
- **Code Splitting**: Route-based lazy loading for performance

## 🚀 Common Tasks and Workflows

### **Development Setup**

```bash
# Start development server
npm run dev  # Port 3000

# Access applications
# Marketing Site: http://localhost:3000
# Sales Dashboard: http://localhost:3000/admin (dev mode)
```

### **Build and Test**

```bash
# Full build check
npm run build:check  # Type check + lint + build

# Testing
npm run test         # Unit tests
npm run test:e2e     # E2E tests (48 tests, 6 browsers)

# Build analysis
npm run build:analyze
```

### **Database Management**

```bash
# Deploy schema
npx supabase db push --project-ref fwlivygerbqzowbzxesw

# Deploy Edge Functions
npx supabase functions deploy submit-contact --project-ref fwlivygerbqzowbzxesw
npx supabase functions deploy stripe-webhook --project-ref fwlivygerbqzowbzxesw
```

### **Deployment**

```bash
# Deploy to Vercel
vercel --prod

# Check deployment
vercel ls
```

## 📝 Coding Standards

### **TypeScript/React**

- **Strict Mode**: Zero TypeScript/ESLint errors required
- **Functional Components**: Prefer React functional components with hooks
- **Type Safety**: Full TypeScript coverage, no `any` types
- **Import Organization**: Use optimized imports (`@sms-hub/ui/marketing`)

### **Code Quality**

- **Package Dependencies**: Use `file:` for local packages, `preserveSymlinks: true`
- **Bundle Size**: Target 91KB gzipped main bundle (achieved)
- **Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Performance**: Code splitting, lazy loading, tree shaking

### **Multi-Tenant Development**

- **Hub ID**: Always include `hub_id` in database operations
- **Data Isolation**: Filter all queries by hub
- **UI Theming**: Use hub-specific colors and branding
- **Environment Detection**: Automatic hub detection from domain

## 🔌 API Endpoints and Services

### **Supabase Edge Functions**

- **submit-contact**: Process contact form submissions
- **stripe-webhook**: Handle Stripe payment webhooks

### **External Services**

- **Stripe**: Payment processing and webhooks
- **Supabase**: Database and authentication
- **Vercel**: Hosting and deployment

### **Database Queries**

- **Multi-tenant**: All queries must include `hub_id` filtering
- **Marketing Focus**: Optimized for lead capture and conversion
- **Hub Isolation**: Proper data separation between brands

## 🧪 Testing Approach

### **Test Commands**

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm run test:comprehensive

# Build check
npm run build:check
```

### **Test Coverage**

- **Unit**: Vitest + Testing Library
- **E2E**: Playwright (48 tests, 6 browsers)
- **Visual**: Playwright visual regression
- **Performance**: Lighthouse integration

## 🚀 Build and Deploy

### **Build Process**

```bash
# Development
npm run dev

# Production build
npm run build

# Build with checks
npm run build:check
```

### **Deployment Process**

1. **Database**: Deploy schemas and Edge Functions
2. **Environment**: Configure Vercel environment variables
3. **Deploy**: `vercel --prod`
4. **Test**: Verify all functionality works
5. **Monitor**: Check Vercel and Supabase dashboards

## 🚨 Known Issues and Solutions

### **Common Issues**

- **Vite Build**: Use `preserveSymlinks: true` for local packages
- **Database**: Always include `hub_id` in queries
- **Hub Detection**: Check domain-based hub detection
- **Performance**: Monitor bundle size with `npm run build:analyze`

### **Debugging**

- **Edge Functions**: `npx supabase functions logs [function-name]`
- **Database**: Check Supabase dashboard for query performance
- **Vercel**: `vercel logs [deployment-url]`

## 📚 Learning Log

### **Recent Insights (October 2025)**

- **Bundle Optimization**: Achieved 91KB gzipped main bundle (70% reduction)
- **Logger Removal**: Eliminated @sms-hub/logger package (~1,000 lines)
- **E2E Testing**: Complete Playwright overhaul with 48 tests
- **Zero Errors**: Clean codebase with zero TypeScript/ESLint errors
- **Multi-tenant**: Proper hub isolation and data filtering

### **Key Learnings**

- **Local Packages**: Work perfectly with Vite `preserveSymlinks: true`
- **Bundle Splitting**: Route-based code splitting is highly effective
- **Performance**: Tree shaking and optimized imports make huge difference
- **Testing**: Comprehensive E2E tests catch integration issues
- **Documentation**: Clear structure and examples are essential

## 🔄 Integration with SMS-Hub-App2

### **Authentication Flow**

- **Payment-First**: Stripe → Email confirmation → Profile setup
- **Cross-App Redirect**: Marketing site redirects to app2 for customer management
- **Magic Link**: Email-based authentication between apps
- **Hub Consistency**: Same hub detection across both applications

### **Data Flow**

- **Lead Capture**: Marketing site captures leads in marketing database
- **Customer Conversion**: Leads convert to customers in app2 database
- **Hub Isolation**: Both apps maintain proper `hub_id` filtering
- **Brand Consistency**: Shared hub logic and theming

### **Development Workflow**

- **Shared Packages**: Both apps use same local package structure
- **Independent Deployment**: Each app deploys separately to Vercel
- **Database Separation**: Marketing vs Customer data isolation
- **Testing**: Separate test suites for each application

---

**Last Updated**: October 3, 2025 at 12:30 PM ET  
**Status**: Production Ready - Marketing platform fully operational with Sales Dashboard and multi-tenant support
