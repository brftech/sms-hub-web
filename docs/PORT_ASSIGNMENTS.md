# Port Assignments for SMS Hub Monorepo

## Current Port Configuration (Unified Architecture)

The SMS Hub monorepo has been consolidated from 6 apps to 3 apps. Here are the current port assignments:

### **Active App Ports:**

- **Web App** (`apps/web`): **Port 3000** - Marketing site & authentication gateway
- **Unified App** (`apps/unified`): **Port 3001** - Main authenticated dashboard for all user types
- **API Documentation** (`apps/api`): **No fixed port** - Basic Vite app for API docs

### **Architecture Overview:**

```
Port 3000 (Web App)          Port 3001 (Unified App)
┌─────────────────────────┐   ┌─────────────────────────┐
│  Marketing Site         │   │  Authenticated Platform │
│  ├── Landing Pages     │   │  ├── User Dashboard     │
│  ├── Contact Forms     │   │  ├── Admin Dashboard    │
│  ├── Login/Signup      │   │  ├── Superadmin Panel  │
│  └── Hub Branding      │   │  ├── SMS Campaigns     │
│                         │   │  ├── Contact Mgmt      │
│  Authentication Gateway│──▶│  ├── Analytics         │
│  (Redirects to 3001)   │   │  └── Settings          │
└─────────────────────────┘   └─────────────────────────┘
```

## **Authentication Flow:**

1. **Port 3000** (Web App) - User login/signup
2. **Authentication** - Supabase with PostgreSQL credentials  
3. **Redirect** - Successful auth redirects to Port 3001
4. **Port 3001** (Unified App) - All authenticated functionality

## **Removed/Consolidated Apps:**

The following apps have been **consolidated into the unified app**:

- ❌ **User App** (`apps/user` - was Port 3001) → Now part of unified app
- ❌ **Admin App** (`apps/admin` - was Port 3002) → Now part of unified app  
- ❌ **Demo App** (`apps/demo` - was Port 3003) → Removed
- ❌ **Docs App** (`apps/docs` - was Port 3004) → Replaced with api app
- ❌ **Texting App** (`apps/texting` - was Port 3005) → Backend moved to Edge Functions

## **Development Access:**

### Primary Development URLs:
```bash
Web App:      http://localhost:3000
Unified App:  http://localhost:3001
```

### Development Commands:
```bash
# Start both main apps
pnpm dev

# Start specific app only
pnpm dev --filter=@sms-hub/web     # Port 3000
pnpm dev --filter=@sms-hub/unified # Port 3001
pnpm dev --filter=@sms-hub/api     # Random available port
```

## **User Flow Examples:**

### New User Signup:
1. Visit `localhost:3000` (web app)
2. Click "Sign Up" → Fill form → Submit
3. Authentication success → Redirect to `localhost:3001/dashboard`
4. Land in unified app with user role dashboard

### Admin Login:
1. Visit `localhost:3000/login` (web app)  
2. Enter admin credentials → Authenticate
3. Redirect to `localhost:3001/admin` (unified app)
4. Admin dashboard with elevated permissions

### Superadmin Access:
- **Real Auth**: superadmin@sms-hub.com / SuperAdmin123!
- **Dev Mode**: Add `?superadmin=dev123` to any URL
- **Access**: Full cross-hub superadmin dashboard in unified app

## **Benefits of Current Port Structure:**

### ✅ **Simplified Development**
- Only 2 main ports to remember (3000, 3001)
- Clear separation: marketing vs. authenticated functionality
- No port conflicts or confusion

### ✅ **Better User Experience**  
- Single sign-on across platform
- No app switching for different roles
- Consistent session management

### ✅ **Easier Deployment**
- 2 main apps instead of 6
- Simplified routing and load balancing
- Reduced infrastructure complexity

### ✅ **Maintenance Benefits**
- Single authenticated codebase
- Unified dependency management
- Simplified testing and debugging

## **Session Management:**

### Cross-App Authentication:
- **Storage**: Supabase localStorage
- **Persistence**: Automatic across localhost:3000 ↔ localhost:3001  
- **Detection**: Web app checks auth status and redirects appropriately
- **Logout**: Clears session and redirects back to web app

### Development Testing:
```bash
# Test authentication flow:
1. Start both apps: pnpm dev
2. Visit localhost:3000
3. Sign up/login
4. Verify redirect to localhost:3001
5. Check role-based dashboard rendering
```

## **Production Deployment:**

### Domain Structure:
```
Web App:     https://gnymble.com (Port 3000 equivalent)
Unified App: https://app.gnymble.com (Port 3001 equivalent)
```

### Environment Considerations:
- Both apps share same Supabase backend
- Session persistence works across subdomains
- Authentication gateway pattern scales to production

---

**Last Updated**: September 10, 2025 - Reflects current unified architecture with consolidated apps and simplified port structure.