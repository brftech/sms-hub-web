# SMS Hub - Port Assignments

## 📋 Current Status (September 2025)

**Architecture**: Clean 2-app production setup
- ✅ **Web App (Port 3000)**: Marketing & authentication gateway
- ✅ **Unified App (Port 3001)**: Main authenticated application
- ❌ **Legacy Apps**: All removed/migrated (ports 3003-3005)

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
  
## 🗑️ Legacy Ports (Removed)

**Migration Status**: ✅ **Complete** - All legacy apps have been consolidated into the Unified app

### Removed Apps
- **API Documentation (Port 3003)**: ❌ Removed - API docs functionality integrated into Unified app
- **Legacy Admin (Port 3004)**: ❌ Migrated - Admin functions moved to Unified app
- **Legacy User (Port 3005)**: ❌ Migrated - User functions moved to Unified app

**Result**: Clean 2-app architecture with all functionality consolidated

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

## 🎯 Port Assignment Strategy

### Production Architecture
```
User → Web App (3000) → Unified App (3001)
```

### Development Architecture
```
Developer → Web App (3000) + Unified App (3001)
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

### ✅ Active Production Apps
| Port | App | Status | Purpose |
|------|-----|--------|---------|
| 3000 | Web | ✅ Active | Marketing & Auth |
| 3001 | Unified | ✅ Active | Main App |

### ❌ Removed/Migrated Apps
| Port | App | Status | Purpose |
|------|-----|--------|---------|
| 3003 | API Docs | ❌ Removed | Legacy Documentation |
| 3004 | Legacy Admin | ❌ Migrated | Legacy Admin |
| 3005 | Legacy User | ❌ Migrated | Legacy User |

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

### Port Consolidation (September 2025)
- **Unified App**: Consolidated admin and user functions with enhanced security
- **Legacy Apps**: ✅ **Migration Complete** - All legacy apps removed/consolidated
- **Port Reduction**: From 6 apps to 2 production apps
- **Enhanced Authentication**: Magic link flow implemented across Web → Unified app flow

### Current Focus (Updated September 2025)
- **Web App (3000)**: Marketing and **magic link authentication** gateway
- **Unified App (3001)**: All authenticated functionality with **global view default** and **superadmin protection**

### Recent Improvements
- **Magic Link Authentication**: Prevents session carryover between Web (3000) and Unified (3001) apps
- **Enhanced Security**: Superadmin protection and proper session isolation
- **Global View Default**: Admin dashboard defaults to global view for better cross-hub management
- **Responsive UI**: Improved mobile experience across all port endpoints

This port assignment strategy provides a clean, maintainable architecture with clear separation of concerns and efficient development workflow.