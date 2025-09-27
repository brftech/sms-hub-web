# SMS Hub Web - Project Overview

## 🎯 Project Summary

SMS Hub Web is a **standalone React application** that provides SMS messaging services with multi-hub support. The application has been migrated from a monorepo structure to a focused, deployable web application.

## 🏗️ Current Architecture

### Technology Stack
- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: styled-components (CSS-in-JS)
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Authentication**: Supabase Auth with magic link flow
- **State Management**: React Query (TanStack Query)
- **Deployment**: Vercel

### Application Structure
```
sms-hub-web/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── config/        # Configuration
│   └── lib/          # Utilities
├── packages/
│   ├── ui/           # Shared UI components
│   ├── hub-logic/    # Hub configuration
│   ├── supabase/     # Supabase client
│   ├── utils/        # Utility functions
│   └── logger/       # Logging utilities
├── supabase/
│   ├── functions/    # Edge Functions
│   └── migrations/   # Database migrations
└── public/           # Static assets
```

## 🌐 Multi-Hub System

### Hub Configuration
- **PercyTech**: Hub ID 0
- **Gnymble**: Hub ID 1 (default)
- **PercyMD**: Hub ID 2
- **PercyText**: Hub ID 3

Each hub has:
- Distinct branding and theming
- Isolated data and users
- Hub-specific features

### Domain Structure
- **Marketing**: www.{hub}.com
- **App**: unified.{hub}.com (planned)

## 🔐 Authentication & Security

### Authentication Methods
1. **Magic Link Authentication**: Enhanced signup flow
2. **Protected Superadmin Access**: 
   - superadmin@percytech.com (protected from deletion)
   - superadmin@gnymble.com (protected from deletion)
3. **Development Mode**: `?superadmin=dev123` URL parameter
4. **B2B/B2C Support**: Comprehensive account creation

### Security Features
- Frontend uses only anon key
- Admin operations via Edge Functions
- Service role key never exposed in frontend
- Protected account deletion prevention

## 🗄️ Database Schema

### Core Tables
- `verifications` - Verification requests
- `user_profiles` - User profile information
- `companies` - Business entity information
- `customers` - Paying entity information
- `memberships` - User-company relationships
- `onboarding_submissions` - Onboarding progress

### Database Projects
- **Development**: `vgpovgpwqkjnpnrjelyg.supabase.co`
- **Production**: `howjinnvvtvaufihwers.supabase.co`

## 🚀 Development Workflow

### Getting Started
```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.development

# Start development server
npm run dev
```

### Key Commands
- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run type-check` - TypeScript type checking
- `npm run lint` - ESLint linting

### Port Assignment
- **Web App**: Port 3000 (marketing and auth gateway)

## 📊 Current Status

### ✅ Completed
- **Migration**: Successfully migrated from monorepo to standalone app
- **Deployment**: Live at www.gnymble.com via Vercel
- **Authentication**: Magic link authentication implemented
- **Database**: Production database configured
- **Edge Functions**: All critical functions deployed

### 🚧 In Progress
- **Domain Configuration**: Additional hub domains pending
- **Testing**: Comprehensive testing implementation
- **Documentation**: Updating documentation for standalone structure

### 📋 Future Considerations
- **Mobile Apps**: React Native implementation
- **Advanced Analytics**: Enhanced reporting
- **Performance Optimization**: Further optimizations

## 🔧 Environment Variables

### Required Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://vgpovgpwqkjnpnrjelyg.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# Development
VITE_DEVELOPMENT_MODE=true
VITE_DEV_AUTH_TOKEN=dev123

# Production (when ready)
RESEND_API_KEY=[your-resend-key]
STRIPE_SECRET_KEY=[your-stripe-key]
```

## 📚 Key Documentation

- `README.md` - Main project documentation
- `docs/PROJECT_OVERVIEW.md` - This overview
- `docs/ONBOARDING_FLOW.md` - User journey documentation
- `docs/EDGE_FUNCTIONS_STATUS.md` - Edge functions status
- `docs/VERCEL_DEPLOYMENT_GUIDE.md` - Deployment guide

## 🎯 Migration Notes

### From Monorepo to Standalone
The project has been successfully migrated from a Turbo monorepo structure to a standalone React application. Key changes:

1. **Structure Simplification**: Removed complex monorepo workspace configuration
2. **Package Consolidation**: Internal packages now use file: references
3. **Build Optimization**: Simplified Vite configuration
4. **Deployment Streamlining**: Single Vercel project deployment

### Preserved Functionality
- All core SMS functionality maintained
- Multi-hub support preserved
- Authentication flow unchanged
- Database schema consistent

## ✅ Production Status

**Status**: ✅ **PRODUCTION READY** - Standalone application successfully deployed and operational.

**Latest Achievement**: Successful migration from monorepo to standalone web application with full functionality preserved.

The SMS Hub Web application is now a focused, deployable React application ready for continued development and scaling.
