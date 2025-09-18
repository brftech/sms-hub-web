# SMS Hub Monorepo

Multi-hub SMS B2B SaaS platform with **Gnymble**, **PercyMD**, **PercyTech**, and **PercyText**.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development (remote database)
pnpm dev:remote

# Access applications
# Web App (Marketing):     http://localhost:3000
# Unified App (Dashboard): http://localhost:3001
```

## 📁 Project Structure

```
apps/
├── web/        # Marketing website + signup
└── unified/    # Main authenticated dashboard

packages/       # Shared monorepo packages
├── ui/         # Component library
├── auth/       # Authentication utilities
├── types/      # TypeScript definitions
├── supabase/   # Database client
└── ...         # 6 more shared packages

supabase/
├── functions/  # Edge Functions (API)
├── migrations/ # Database schema
└── config.toml # Database configuration
```

## 🛠️ Essential Commands

### Development

```bash
pnpm dev:web      # Marketing site only
pnpm dev:unified  # Dashboard only
pnpm dev:remote   # Both apps (remote DB)
```

### Quality Checks

```bash
pnpm type-check   # TypeScript validation
pnpm lint         # Code linting
pnpm build        # Build all packages
pnpm test         # Run all tests
```

### Database

```bash
pnpm db:link:dev    # Link to development DB
pnpm db:push:dev    # Push schema changes
pnpm functions:deploy:dev  # Deploy Edge Functions
```

### Deployment

```bash
pnpm deploy:web      # Deploy marketing site
pnpm deploy:unified  # Deploy dashboard
pnpm deploy:all      # Deploy both (Turbo)
```

## 🎯 Key Features

- **🏢 Multi-Hub Architecture**: 4 branded hubs (Gnymble, PercyTech, PercyMD, PercyText)
- **🔐 Magic Link Authentication**: Secure, passwordless login
- **💳 Stripe Integration**: Payment-first signup flow
- **📱 SMS Platform**: Complete business messaging solution
- **⚡ Modern Stack**: React, TypeScript, Supabase, Vite, PNPM
- **🚀 Optimized Builds**: Turbo monorepo with intelligent caching

## 🌐 Environment Access

### Development

- **Web**: http://localhost:3000
- **Dashboard**: http://localhost:3001
- **Superadmin**: http://localhost:3001/?superadmin=dev123

### Production

- **Gnymble**: www.gnymble.com → app.gnymble.com
- **PercyTech**: www.percytech.com → app.percytech.com
- **PercyMD**: www.percymd.com → app.percymd.com
- **PercyText**: www.percytext.com → app.percytext.com

## 📚 Documentation

**For New Developers:**

- `docs/CURRENT_STATUS_SEPTEMBER_2025.md` - **START HERE** - Latest status
- `docs/QUICK_START.md` - Detailed setup guide
- `docs/ARCHITECTURE_STATUS.md` - System architecture

**For Development:**

- `docs/VERCEL_DEPLOYMENT_GUIDE.md` - Deployment instructions
- `docs/ENVIRONMENT_VARIABLES_CHECKLIST.md` - Environment setup
- `docs/ONBOARDING_FLOW.md` - User journey documentation

## ⚙️ Tech Stack

- **Frontend**: React 19, TypeScript, Styled Components
- **Build**: Vite, Turbo (monorepo), PNPM
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments**: Stripe
- **Deployment**: Vercel
- **Testing**: Jest, Playwright, Testing Library

## 🔧 Monorepo Benefits

- **Shared Components**: Consistent UI across all hubs
- **Type Safety**: End-to-end TypeScript with path mapping
- **Fast Builds**: Turbo caching and parallel execution
- **Quality Gates**: Automated linting, testing, and type checking
- **Easy Development**: Single command starts entire stack

## 📈 Current Status

- ✅ **Production Ready**: All apps deployed and functional
- ✅ **Type Safe**: 100% TypeScript coverage
- ✅ **Quality Assured**: ESLint + Prettier + comprehensive testing
- ✅ **Performance Optimized**: Turbo caching, code splitting
- ✅ **Security First**: Magic link auth, role-based access
- ✅ **Payment Ready**: Stripe integration with webhook handling

---

**Need Help?** Check `docs/` for comprehensive guides or run `pnpm dev:remote` to get started!
