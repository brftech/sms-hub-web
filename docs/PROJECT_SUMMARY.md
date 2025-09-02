# SMS Hub Monorepo - Comprehensive Project Documentation

## Project Overview

SMS Hub Monorepo is a multi-tenant B2B SaaS platform for SMS/text messaging services, built as a Turbo-powered monorepo using pnpm workspaces. The platform supports multiple branded "hubs" (PercyTech, Gnymble, PercyMD, PercyText) with shared infrastructure but distinct branding and features.

## Architecture

### Monorepo Structure
```
sms-hub-monorepo/
├── apps/
│   ├── web/          # Vite React - Marketing & lead capture (port 3000)
│   ├── user/         # Vite React - User dashboard & auth (port 3001)
│   ├── admin/        # Vite React - Admin panel (port 3002)
│   ├── demo/         # Vite React - Demo environment (port 3003)
│   ├── docs/         # Vite React - Documentation (port 3004)
│   └── texting/      # Nest.js - SMS API backend (port 3005)
├── packages/
│   ├── ui/           # Shared React components (shadcn/ui based)
│   ├── types/        # TypeScript types & database types
│   ├── config/       # Shared ESLint, TypeScript configs
│   ├── supabase/     # Supabase client & queries
│   ├── utils/        # Shared utilities
│   ├── hub-logic/    # Hub configuration & business logic
│   └── sms-auth/     # SMS authentication components/services
├── supabase/
│   ├── migrations/   # Database schema migrations
│   └── functions/    # Edge Functions (serverless)
```

### Technology Stack
- **Frontend**: React 19.1.0, Vite 5.4.19, TypeScript 5.9.2
- **Styling**: Tailwind CSS 3.4.11, styled-components 6.1.13 (CSS-in-JS)
- **Backend**: Nest.js 10.0.0, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SMS OTP
- **State Management**: React Query (TanStack Query 5.56.2)
- **Build System**: Turbo, pnpm workspaces
- **UI Components**: shadcn/ui components, Radix UI primitives

## Database Schema

### Core Tables
```sql
-- Hubs (multi-tenant organizations)
hubs (
  id: bigint PRIMARY KEY,
  name: text NOT NULL,
  status: hub_status DEFAULT 'active',
  settings: jsonb
)

-- Users (authentication via Supabase Auth)
users (
  id: uuid PRIMARY KEY REFERENCES auth.users,
  email: text,
  phone: text,
  role: user_role DEFAULT 'user',
  metadata: jsonb
)

-- Companies (businesses using the platform)
companies (
  id: bigint PRIMARY KEY,
  hub_id: bigint REFERENCES hubs NOT NULL,
  name: text NOT NULL,
  status: company_status DEFAULT 'active'
)

-- Messages (SMS messages)
messages (
  id: bigint PRIMARY KEY,
  hub_id: bigint REFERENCES hubs NOT NULL,
  company_id: bigint REFERENCES companies,
  user_id: uuid REFERENCES users,
  message_text: text NOT NULL,
  status: message_status DEFAULT 'pending'
)

-- Leads (marketing/sales leads)
leads (
  id: uuid PRIMARY KEY,
  hub_id: bigint REFERENCES hubs NOT NULL,
  email: text NOT NULL,
  first_name: text,
  last_name: text,
  company_name: text,
  phone: text,
  status: lead_status DEFAULT 'new'
)
```

### Key Relationships
- Each hub has multiple companies
- Each company belongs to one hub
- Messages are scoped to hub and company
- Leads are tracked per hub
- Users can have different roles across hubs

## Hub Configuration

Each hub has distinct branding and configuration:

```typescript
// Hub Types
type HubType = 'percytech' | 'gnymble' | 'percymd' | 'percytext';

// Example Hub Config (Gnymble)
{
  id: 2,
  name: "Gnymble",
  type: "gnymble",
  primaryColor: "#CC5500",
  secondaryColor: "#FF8C42",
  tagline: "Business texting for the regulated and refined",
  industry: "Hospitality & Gaming",
  features: ["sms", "compliance", "analytics"]
}
```

## Applications Details

### 1. Web App (`apps/web`)
- **Purpose**: Marketing website and lead capture
- **Framework**: Vite + React + TypeScript
- **Key Features**:
  - Multi-hub support with dynamic branding
  - Contact form with Supabase Edge Function integration
  - Interactive phone demo component
  - Hub selector for switching between brands
  - Responsive design with Tailwind CSS

### 2. User App (`apps/user`)
- **Purpose**: User authentication and dashboard
- **Framework**: Vite + React + TypeScript
- **Key Features**:
  - SMS OTP authentication flow
  - Multi-step onboarding process
  - User dashboard with messaging features
  - Company management
  - Integration with SMS auth package

### 3. Admin App (`apps/admin`)
- **Purpose**: Administrative interface
- **Status**: Placeholder implementation
- **Planned Features**:
  - User management
  - Company administration
  - Message monitoring
  - Analytics dashboard

### 4. Texting App (`apps/texting`)
- **Purpose**: Backend API for SMS operations
- **Framework**: Nest.js
- **Key Features**:
  - RESTful API endpoints
  - SMS sending/receiving logic
  - Integration with SMS providers
  - Message queue management
  - Webhook handling

## Shared Packages

### 1. UI Package (`packages/ui`)
- shadcn/ui components (Button, Card, Dialog, etc.)
- CSS-in-JS with styled-components
- Hub-aware theming via CSS custom properties
- Exports 40+ reusable components

### 2. Types Package (`packages/types`)
- Database types generated from Supabase
- Shared TypeScript interfaces
- Hub configuration types
- API response types

### 3. Supabase Package (`packages/supabase`)
- Centralized Supabase client
- React Query hooks for data fetching
- Database queries and mutations
- Environment-aware client creation

### 4. SMS Auth Package (`packages/sms-auth`)
- SMS authentication modal components
- OTP verification flow
- Phone number formatting utilities
- Extracted from web app for reusability

## Supabase Edge Functions

Located in `/supabase/functions/`:

1. **submit-contact**: Handles contact form submissions
   - Creates/updates leads
   - Sends confirmation emails via Resend
   - Tracks lead activities
   - Includes hub_id for multi-tenancy

2. **send-sms-verification**: Initiates SMS OTP flow
3. **verify-sms**: Validates SMS OTP codes
4. **chat-webhook**: Handles incoming chat messages

## Development Workflow

### Environment Setup
```bash
# Clone repository
git clone https://github.com/brftech/sms-hub-monorepo.git

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add Supabase URL and keys

# Run all apps in development
pnpm dev

# Run specific app
pnpm dev --filter=@sms-hub/web
```

### Key Commands
- `pnpm dev` - Start all development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Run ESLint across monorepo
- `pnpm type-check` - TypeScript validation
- `turbo run build` - Parallel builds with caching

## Authentication Flow

1. User enters phone number
2. System sends OTP via Supabase Auth
3. User enters 6-digit code
4. Verification creates/updates user record
5. Session persists via Supabase Auth
6. Role-based access control per hub

## Deployment Architecture

### Current State
- Database: Supabase hosted PostgreSQL
- Edge Functions: Deployed to Supabase
- Frontend apps: Ready for Vercel/Netlify deployment
- Backend API: Ready for containerization

### Environment Variables
```
# Vite Apps
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]

# Nest.js Backend
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

## Recent Major Changes

1. **Web App Migration**: Converted from Next.js to Vite for consistency
2. **SMS Auth Extraction**: Created dedicated package for SMS authentication
3. **CSS-in-JS Migration**: Moved from CSS modules to styled-components
4. **Edge Functions Deployment**: All functions deployed and operational
5. **Multi-tenant Support**: Full hub-based data isolation

## Known Issues & Solutions

1. **Supabase Client in Browser**: Fixed by creating factory function for Vite env vars
2. **Hub ID Constraints**: Resolved by passing hub_id through all operations
3. **CSS Import Conflicts**: Solved by migrating to CSS-in-JS
4. **RLS Recursion**: Disabled RLS policies temporarily

## Future Roadmap

### High Priority
- Complete admin dashboard implementation
- Add comprehensive test coverage
- Implement CI/CD with GitHub Actions
- Create detailed API documentation

### Low Priority
- Storybook for component development
- Comprehensive README files
- Performance optimization
- Internationalization support

## Critical Implementation Notes

1. **Multi-tenancy**: Always include hub_id in queries and mutations
2. **Authentication**: SMS auth is separated into its own package
3. **Styling**: Use styled-components, not CSS files
4. **Type Safety**: Import types from @sms-hub/types
5. **Database**: All tables use RLS (currently disabled)
6. **Edge Functions**: Must be deployed via Supabase CLI

## Contact & Repository

- **Repository**: https://github.com/brftech/sms-hub-monorepo
- **Primary Developer**: Bryan (bryan@percytech.com)
- **Supabase Project**: vgpovgpwqkjnpnrjelyg

This monorepo represents a complete B2B SaaS platform ready for production deployment with multi-tenant support, SMS capabilities, and a modern tech stack.