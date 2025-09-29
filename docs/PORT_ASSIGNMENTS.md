# SMS Hub Web - Port Assignments

## 📋 Current Status

**Architecture**: Standalone React application

- ✅ **Web App (Port 3000)**: Marketing website with admin dashboard
- ❌ **Legacy Apps**: All removed/migrated (ports 3001-3005)

## 🚀 Production Ports

### Web App (Port 3000)

- **Purpose**: Marketing website with admin dashboard
- **URL**: http://localhost:3000
- **Features**:
  - Hub-specific landing pages
  - Contact forms with lead capture
  - Pricing pages with Stripe integration
  - Admin dashboard with CRUD operations
  - Hub-specific branding and theming
  - Floating debug panel (development only)
  - Floating hub switcher (development only)
  - Floating admin button with access code authentication
  - Comprehensive testing setup (Vitest + Playwright)

## 🗑️ Legacy Ports (Removed)

**Migration Status**: ✅ **Complete** - All legacy apps have been consolidated into the standalone web app

### Removed Apps

- **Unified App (Port 3001)**: ❌ Migrated - Consolidated into web app
- **API Documentation (Port 3003)**: ❌ Removed - API docs functionality integrated into web app
- **Legacy Admin (Port 3004)**: ❌ Migrated - Admin functions moved to web app
- **Legacy User (Port 3005)**: ❌ Migrated - User functions moved to web app

**Result**: Clean standalone architecture with all functionality consolidated

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
# Start development server
npm run dev

# Start with specific port
npm run dev -- --port 3000  # Web app
```

### Port Configuration

- **Web App**: Configured in `vite.config.ts`

## 🎯 Port Assignment Strategy

### Production Architecture

```
User → Web App (3000)
```

### Development Architecture

```
Developer → Web App (3000)
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

| Port | App | Status    | Purpose                      |
| ---- | --- | --------- | ---------------------------- |
| 3000 | Web | ✅ Active | Marketing & Auth & Dashboard |

### ❌ Removed/Migrated Apps

| Port | App          | Status      | Purpose               |
| ---- | ------------ | ----------- | --------------------- |
| 3001 | Unified      | ❌ Migrated | Consolidated into Web |
| 3003 | API Docs     | ❌ Removed  | Legacy Documentation  |
| 3004 | Legacy Admin | ❌ Migrated | Legacy Admin          |
| 3005 | Legacy User  | ❌ Migrated | Legacy User           |

## 🎯 Best Practices

### Port Usage

1. **Always use production ports** for main development
2. **Test on production ports** before deployment
3. **Document port changes** in commits
4. **Use environment variables** for port configuration

### Development Workflow

1. Start with `npm run dev` (uses production port)
2. Test authentication flow
3. Verify all features work on correct port
4. Deploy with same port configuration

## 🔄 Recent Changes

### Port Consolidation

- **Standalone App**: Consolidated all functionality into single web application
- **Legacy Apps**: ✅ **Migration Complete** - All legacy apps removed/consolidated
- **Port Reduction**: From multiple apps to 1 production app
- **Enhanced Authentication**: Magic link flow implemented

### Current Focus

- **Web App (3000)**: Marketing, authentication gateway, and dashboard functionality

### Recent Improvements

- **Magic Link Authentication**: Prevents session carryover issues
- **Enhanced Security**: Superadmin protection and proper session isolation
- **Consolidated Dashboard**: All user types access same application with role-based features
- **Responsive UI**: Improved mobile experience across all features

This port assignment strategy provides a clean, maintainable architecture with clear separation of concerns and efficient development workflow.
