# SMS Hub Web Architecture Guide

**Last Updated**: October 13, 2025

## 🎯 Overview

SMS Hub Web is a production-ready multi-tenant marketing website and sales dashboard built with React 19, Vite, TypeScript, and Supabase. It serves 4 business brands with isolated data, branded experiences, and comprehensive lead management capabilities.

**Current Status**: ✅ **Production Ready** - Marketing platform fully operational with Sales Dashboard and multi-tenant support

## 🏗️ System Architecture

### **High-Level Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   sms-hub-web   │    │  sms-hub-app2   │    │     texting     │
│   (Marketing)   │    │   (Customer)    │    │   (SMS Core)    │
│   Port: 3000    │    │   Port: 3001    │    │   Package       │
│   [hub].com     │    │ app2.[hub].com  │    │   Shared        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Supabase     │
                    │   (Backend)     │
                    │ 2 Databases     │
                    └─────────────────┘
```

### **Key Design Principles**

- **Separation of Concerns**: Marketing vs Customer applications
- **Multi-Tenant**: Hub-based data isolation
- **Performance**: Optimized bundles and code splitting
- **Maintainability**: Type safety and comprehensive testing

### **Multi-Tenant Hub System**

- **Hub 0**: PercyTech (percytech.com) - Red theme, technology focus
- **Hub 1**: Gnymble (gnymble.com) - Orange theme, primary brand (default)
- **Hub 2**: PercyMD (percymd.com) - Red theme, medical focus
- **Hub 3**: PercyText (percytext.com) - Purple theme, messaging focus

## 🗄️ Database Architecture

### **Marketing Database Strategy**

The platform uses a separate Supabase database for marketing operations:

#### **SMS-Hub-Web Database** (Marketing)

- **Purpose**: Lead capture, email marketing, contact forms
- **Dev**: `hmumtnpnyxuplvqcmnfk.supabase.co`
- **Prod**: `fwlivygerbqzowbzxesw.supabase.co`
- **Key Tables**: `leads`, `email_lists`, `contact_form_submissions`, `verifications`

### **Database Schema Design**

- **Multi-tenant**: All tables include `hub_id` for tenant isolation
- **Marketing Focus**: Optimized for lead capture and conversion
- **Clean Slate**: Schemas designed for new databases (no existing data)
- **Hub Isolation**: Proper data separation between brands

## 🔐 Authentication Architecture

### **Payment-First Authentication Flow**

1. **Payment**: User clicks "Get Started" → Stripe checkout
2. **Webhook**: `stripe-webhook` creates Supabase Auth user + lead records
3. **Email Confirmation**: User receives email confirmation link
4. **Cross-App Redirect**: User redirected to sms-hub-app2 for profile setup
5. **Customer Management**: Full functionality in customer app

### **Security Features**

- **Frontend Security**: Uses only anon key, never exposes service role key
- **Admin Operations**: Moved to Edge Functions for security
- **Hub Isolation**: All data filtered by `hub_id`
- **Cross-App Security**: Secure redirects between applications

## 📦 Package Architecture

### **Core Packages**

- **`@sms-hub/ui/marketing`** - Optimized UI components for marketing
- **`@sms-hub/hub-logic`** - Hub configurations and branding
- **`@sms-hub/supabase`** - Database client and queries
- **`@sms-hub/utils`** - Shared utilities and validation

### **Package Dependencies**

```
sms-hub-web
├── @sms-hub/ui/marketing    # Optimized marketing bundle
├── @sms-hub/hub-logic       # Hub configurations
├── @sms-hub/supabase        # Database client
└── @sms-hub/utils           # Shared utilities
```

## 🚀 Technology Stack

### **Frontend Stack**

| Technology       | Purpose          | Version |
| ---------------- | ---------------- | ------- |
| **React**        | UI Framework     | 19.1.1  |
| **Vite**         | Build Tool       | 7.1.7   |
| **TypeScript**   | Type Safety      | 5.9.2   |
| **Tailwind CSS** | Styling          | 3.4.17  |
| **React Query**  | State Management | 5.56.2  |
| **Playwright**   | E2E Testing      | 1.55.1  |

### **Backend Stack**

| Service      | Purpose         | Database ID         |
| ------------ | --------------- | ------------------- |
| **Supabase** | Database + Auth | Marketing database  |
| **Stripe**   | Payments        | Webhook integration |
| **Vercel**   | Hosting         | Edge functions      |

### **Deployment Stack**

- **Hosting**: Vercel (marketing application)
- **Database**: Supabase (managed PostgreSQL)
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Supabase Dashboard

## 🔄 Data Flow

### **Marketing Flow (sms-hub-web)**

1. User visits marketing site
2. Hub detection based on domain
3. Lead capture via contact forms
4. Data stored in marketing database with hub-specific filtering
5. Sales Dashboard provides hub-filtered CRUD operations
6. Lead conversion to customer (via sms-hub-app2)

### **Cross-App Integration Flow**

1. User completes Stripe payment on marketing site
2. Webhook creates user + lead records in marketing database
3. User redirected to sms-hub-app2 for profile setup
4. Customer management and SMS functionality in app2
5. Both apps maintain hub consistency

## 🎯 Design Principles

### **Separation of Concerns**

- **Marketing vs Customer**: Separate applications and databases
- **Package Isolation**: Core functionality in separate packages
- **Multi-tenant**: Clean tenant isolation via hub_id

### **Scalability**

- **Horizontal Scaling**: Each app can scale independently
- **Database Separation**: Marketing and customer data isolated
- **Package Reusability**: Shared packages across applications

### **Security**

- **Least Privilege**: Frontend uses only anon key
- **Edge Functions**: Admin operations in secure serverless functions
- **Data Isolation**: Multi-tenant data separation

### **Maintainability**

- **Type Safety**: 100% TypeScript coverage
- **Documentation**: Comprehensive documentation
- **Testing**: Unit and E2E test coverage
- **Code Organization**: Clear package and module structure

## 🔧 Development Workflow

### **Local Development**

```bash
# Start marketing application
cd sms-hub-web && npm run dev    # Port 3000

# Access applications
# Marketing Site: http://localhost:3000
# Sales Dashboard: http://localhost:3000/admin (dev mode)
```

### **Package Development**

```bash
# Build shared packages
cd packages/ui && npm run build
cd packages/hub-logic && npm run build
```

### **Database Management**

```bash
# Deploy schemas
cd sms-hub-web && npx supabase db push --project-ref fwlivygerbqzowbzxesw

# Deploy Edge Functions
npx supabase functions deploy submit-contact --project-ref fwlivygerbqzowbzxesw
npx supabase functions deploy stripe-webhook --project-ref fwlivygerbqzowbzxesw
```

## 📊 Performance Considerations

### **Frontend Optimization**

- **Code Splitting**: Lazy loading for better performance
- **Bundle Optimization**: Terser minification and tree shaking
- **CDN**: Vercel Edge Network for global distribution
- **Caching**: Aggressive caching for static assets

### **Backend Optimization**

- **Edge Functions**: Serverless functions for better performance
- **Database Indexing**: Proper indexes for query optimization
- **Connection Pooling**: Supabase handles connection management
- **Caching**: React Query for client-side caching

### **Bundle Optimization**

- **Target**: 91KB gzipped main bundle (achieved)
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Strategic imports to eliminate unused code
- **Import Optimization**: Use `@sms-hub/ui/marketing` for better performance

## 🚨 Important Notes

- **Multi-tenant Architecture**: All operations must include `hub_id`
- **Database Separation**: Web and App2 use different databases
- **Package Dependencies**: Maintain proper package versioning
- **Security**: Never expose service role keys in frontend
- **Bundle Optimization**: Use optimized imports (`@sms-hub/ui/marketing`) for better performance
- **Code Quality**: Zero TypeScript/ESLint errors across all applications

## 🚀 Recent Updates (October 2025)

### **SMS-Hub-Web Achievements**

- **Sales Dashboard**: Rebranded with hub-specific filtering and branded UI
- **Code Simplification**: Removed @sms-hub/logger package (~1,000 lines eliminated)
- **Performance**: 91KB gzipped main bundle (down from 302KB)
- **Testing**: Complete E2E test overhaul (48 tests, 6 browsers)
- **Documentation**: Comprehensive updates with clear structure

## 🗺️ Centralized Routing Architecture

### **Route Management System**

All application routes are centralized in `src/utils/routes.ts` to ensure consistency and type safety across the application.

**File Location**: `src/utils/routes.ts`

```typescript
export const HOME_PATH = "/";
export const CONTACT_PATH = "/contact";
export const PRICING_PATH = "/pricing";
export const ADMIN_PATH = "/admin";
// ... all other routes
```

### **Benefits of Centralization**

- **Type Safety**: Compile-time checking for all route references
- **Refactor Safety**: Change paths in one place, affects entire codebase
- **Consistency**: Same paths across navigation, links, buttons, and redirects
- **Maintainability**: Easy to add, modify, or deprecate routes
- **Documentation**: Single source of truth for all application paths

### **Implementation Details**

**Components Using Routes:**

- `src/App.tsx` - Route definitions
- `src/components/Navigation.tsx` - Navigation links
- `src/components/Footer.tsx` - Footer links
- All page components - Programmatic navigation

**Usage Pattern:**

```typescript
import { CONTACT_PATH, PRICING_PATH } from "@/utils/routes";

// In React Router
<Route path={CONTACT_PATH} element={<Contact />} />

// In navigation
<Link to={PRICING_PATH}>Pricing</Link>

// In programmatic navigation
navigate(CONTACT_PATH);
```

## 🔧 Vite Configuration Enhancements

### **Package Aliases**

Vite is configured with direct source aliases to ensure fresh content during development:

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@sms-hub/hub-logic': path.resolve(__dirname, './packages/hub-logic/src'),
    '@sms-hub/supabase': path.resolve(__dirname, './packages/supabase/src'),
    // ... other aliases
  }
}
```

**Benefits:**

- Bypasses package build cache
- Ensures latest content from `hubContent.ts`
- Eliminates HMR cache issues
- Direct source resolution in development

### **Cache Management**

```bash
# Clean Vite cache when content doesn't update
npm run clean  # Removes .vite cache and dist
npm run dev    # Fresh development build
```

---

**Last Updated**: October 13, 2025  
**Status**: Production Ready - Marketing platform architecture implemented, optimized, and deployed
