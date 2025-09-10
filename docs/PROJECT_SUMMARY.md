# SMS Hub Monorepo - Comprehensive Project Documentation

## Project Overview

SMS Hub Monorepo is a multi-tenant B2B SaaS platform for SMS/text messaging services, built as a Turbo-powered monorepo using pnpm workspaces. The platform supports multiple branded "hubs" (PercyTech, Gnymble, PercyMD, PercyText) with shared infrastructure but distinct branding and features.

## Architecture

### Monorepo Structure
```
sms-hub-monorepo/
├── apps/
│   ├── web/          # Vite React - Marketing site & authentication gateway (port 3000)
│   ├── unified/      # Vite React - Main authenticated dashboard for all user types (port 3001)
│   └── api/          # Vite React - API documentation (basic Vite app)
├── packages/
│   ├── ui/           # Shared React components (styled-components)
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
- **Styling**: styled-components 6.1.13 (CSS-in-JS) - NO CSS file imports
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Authentication**: Supabase Auth with SMS OTP + real PostgreSQL credentials
- **State Management**: React Query (TanStack Query 5.56.2)
- **Build System**: Turbo, pnpm workspaces
- **UI Components**: styled-components based components

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

### 1. Web App (`apps/web`) - Port 3000
- **Purpose**: Marketing website and authentication gateway (login/signup)
- **Framework**: Vite + React + TypeScript
- **Key Features**:
  - Multi-hub support with dynamic branding
  - Contact form with Supabase Edge Function integration
  - Interactive phone demo component
  - Hub selector for switching between brands
  - Authentication forms (login/signup) that redirect to unified app
  - Responsive design with styled-components

### 2. Unified App (`apps/unified`) - Port 3001
- **Purpose**: Main authenticated dashboard for ALL user types (user, admin, superadmin)
- **Framework**: Vite + React + TypeScript
- **Key Features**:
  - Consolidated dashboard for all user roles
  - SMS OTP authentication flow
  - Multi-step onboarding process
  - Company management
  - Message monitoring and analytics
  - Admin panels (integrated, not separate app)
  - Superadmin functionality
  - Role-based access control

### 3. API App (`apps/api`)
- **Purpose**: API documentation
- **Framework**: Basic Vite app
- **Status**: Simple documentation site

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

1. User visits Web app (port 3000) for login/signup
2. Authentication handled via Supabase with credentials stored in PostgreSQL
3. Successful authentication redirects to Unified app (port 3001)
4. Session persists via Supabase localStorage across apps
5. Unified app handles all authenticated user functionality
6. Role-based access control (user, admin, superadmin)

### Authentication Methods
- **Real Auth**: Supabase with PostgreSQL credentials
- **Superadmin**: superadmin@sms-hub.com / SuperAdmin123!
- **Dev/Mock Auth**: Add ?superadmin=dev123 to URL (no persistence)
- **SMS OTP**: Available for additional verification

## Deployment Architecture

### Current State
- Database: Supabase hosted PostgreSQL with real credential authentication
- Edge Functions: Deployed to Supabase
- Frontend apps: Ready for Vercel/Netlify deployment
- Unified architecture: Single authenticated app handles all user types
- Session management: Supabase localStorage persistence across apps

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

1. **App Consolidation**: Merged user, admin, texting apps into single unified app
2. **Authentication Redesign**: Web app became gateway, unified app handles all authenticated functionality
3. **CSS-in-JS Migration**: Moved from CSS modules to styled-components (NO CSS file imports)
4. **Role-Based Dashboard**: Single unified dashboard with role-based views
5. **Simplified Architecture**: Reduced from 6 apps to 3 apps (web, unified, api)
6. **Superadmin System**: Cross-app authentication with persistent sessions

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