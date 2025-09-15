# SMS Hub Monorepo

Multi-hub SMS B2B SaaS platform with Gnymble, PercyMD, PercyTech, and PercyText.

## Project Structure

```
sms-hub-monorepo/
├── apps/                    # Applications
│   ├── api/                # API application
│   ├── unified/            # Unified dashboard app
│   └── web/                # Marketing website
├── packages/               # Shared packages
│   ├── auth/              # Authentication utilities
│   ├── config/            # Configuration management
│   ├── dev-auth/          # Development authentication
│   ├── hub-logic/         # Hub business logic
│   ├── logger/            # Logging utilities
│   ├── services/          # External services
│   ├── supabase/          # Supabase client
│   ├── types/             # TypeScript type definitions
│   ├── ui/                # Shared UI components
│   └── utils/             # Utility functions
├── config/                # Configuration files
│   ├── eslint.config.js   # ESLint configuration
│   ├── jest.config.js     # Jest test configuration
│   └── playwright.config.ts # Playwright e2e configuration
├── docs/                  # Documentation
│   ├── CLAUDE.md          # Claude AI documentation
│   ├── DATABASE_SYNC.md   # Database synchronization guide
│   └── ...                # Other documentation files
├── scripts/               # Scripts and utilities
│   ├── shell/             # Shell scripts
│   ├── sql/               # SQL scripts
│   └── js/                # JavaScript utilities
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge Functions
│   ├── migrations/        # Database migrations
│   └── config.toml        # Supabase configuration
├── test/                  # Test files
│   ├── e2e/               # End-to-end tests
│   ├── integration/       # Integration tests
│   └── unit/              # Unit tests
├── tsconfig.json          # TypeScript configuration
├── turbo.json             # Turbo build configuration
└── utils/                 # Utility files
    └── exports/           # Export files and assets
```

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev:remote

# Or start specific apps
pnpm dev:web
pnpm dev:unified
```

### Database Management

```bash
# Link to development database
pnpm db:link:dev

# Link to production database
pnpm db:link:prod

# Push migrations
pnpm db:push:dev
pnpm db:push:prod

# Deploy Edge Functions
pnpm functions:deploy:dev
pnpm functions:deploy:prod
```

### Database Synchronization

```bash
# Full sync between dev and prod
pnpm sync:full

# Sync specific components
pnpm sync:migrations
pnpm sync:functions
pnpm sync:superadmin
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific test types
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

## Environment Setup

See `docs/REMOTE_SETUP.md` for detailed environment configuration.

## Documentation

- `docs/CLAUDE.md` - Claude AI documentation
- `docs/DATABASE_SYNC.md` - Database synchronization guide
- `docs/DEPLOYMENT_STATUS.md` - Deployment status and configuration
- `docs/ONBOARDING_FLOW.md` - User onboarding flow documentation

## Scripts

- `scripts/shell/` - Shell scripts for development and deployment
- `scripts/sql/` - SQL scripts for database operations
- `scripts/js/` - JavaScript utilities and tools
