# SMS Hub - Port Assignments

## 🚀 Production Ports

### Web App (Port 3000)
- **Purpose**: Marketing site and authentication gateway
- **URL**: http://localhost:3000
- **Features**:
  - Hub-specific landing pages
  - Lead capture forms
  - Login/signup forms
  - Authentication gateway
  - Redirects to Unified app after auth

### Unified App (Port 3001)
- **Purpose**: Main authenticated application
- **URL**: http://localhost:3001
- **Features**:
  - User dashboard
  - Admin dashboard
  - Superadmin dashboard
  - SMS campaign management
  - Contact management
  - Account settings
  - Data cleanup tools

### API Server (Port 3002)
- **Purpose**: Nest.js backend API
- **URL**: http://localhost:3002
- **Status**: In development
- **Features**:
  - REST API endpoints
  - Business logic
  - External integrations

## 🔧 Development Ports

### API Documentation (Port 3003)
- **Purpose**: API documentation site
- **URL**: http://localhost:3003
- **Features**:
  - API endpoint documentation
  - Request/response examples
  - Authentication guides

## 📛 Legacy Ports (Being Migrated)

### Legacy Admin (Port 3004)
- **Purpose**: Legacy admin dashboard
- **Status**: Being migrated to Unified app
- **Migration**: Admin functions moved to Unified app

### Legacy User (Port 3005)
- **Purpose**: Legacy user dashboard
- **Status**: Being migrated to Unified app
- **Migration**: User functions moved to Unified app

## 🌐 External Services

### Supabase
- **Database**: PostgreSQL
- **Auth**: Supabase Auth
- **Edge Functions**: Deno runtime
- **URL**: https://vgpovgpwqkjnpnrjelyg.supabase.co

### Stripe
- **Purpose**: Payment processing
- **Webhooks**: Handled by Edge Functions
- **Dashboard**: https://dashboard.stripe.com

### Zapier
- **Purpose**: SMS delivery
- **Webhooks**: SMS sending via Zapier
- **Dashboard**: https://zapier.com

## 🔄 Port Usage in Development

### Starting Development
```bash
# Start all production apps
pnpm dev

# Start specific apps
pnpm dev --filter=@sms-hub/web
pnpm dev --filter=@sms-hub/unified

# Start with specific ports
pnpm dev --port 3000  # Web app
pnpm dev --port 3001  # Unified app
```

### Port Configuration
- **Web App**: Configured in `apps/web/vite.config.ts`
- **Unified App**: Configured in `apps/unified/vite.config.ts`
- **API Server**: Configured in `apps/api/vite.config.ts`

## 🎯 Port Assignment Strategy

### Production Architecture
```
User → Web App (3000) → Unified App (3001) → API Server (3002)
```

### Development Architecture
```
Developer → Web App (3000) + Unified App (3001) + API Server (3002)
```

## 🔧 Port Management

### Port Conflicts
If ports are in use:
1. Check what's running: `lsof -i :3000`
2. Kill process: `kill -9 <PID>`
3. Or change port in vite.config.ts

### Port Forwarding
For external access:
- Use ngrok or similar tool
- Configure in Supabase for webhooks
- Update environment variables

## 📊 Port Status Summary

| Port | App | Status | Purpose |
|------|-----|--------|---------|
| 3000 | Web | ✅ Active | Marketing & Auth |
| 3001 | Unified | ✅ Active | Main App |
| 3002 | API | 🚧 Development | Backend API |
| 3003 | API Docs | ✅ Active | Documentation |
| 3004 | Legacy Admin | 📛 Migrating | Legacy Admin |
| 3005 | Legacy User | 📛 Migrating | Legacy User |

## 🎯 Best Practices

### Port Usage
1. **Always use production ports** for main development
2. **Test on production ports** before deployment
3. **Document port changes** in commits
4. **Use environment variables** for port configuration

### Development Workflow
1. Start with `pnpm dev` (uses production ports)
2. Test authentication flow between apps
3. Verify all features work on correct ports
4. Deploy with same port configuration

## 🔄 Recent Changes

### Port Consolidation (January 2025)
- **Unified App**: Consolidated admin and user functions
- **Legacy Apps**: Being migrated to Unified app
- **Port Reduction**: From 6 apps to 3 production apps

### Current Focus
- **Web App (3000)**: Marketing and authentication
- **Unified App (3001)**: All authenticated functionality
- **API Server (3002)**: Backend services

This port assignment strategy provides a clean, maintainable architecture with clear separation of concerns and efficient development workflow.