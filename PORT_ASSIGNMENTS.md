# Port Assignments for SMS Hub Monorepo

## Updated Port Configuration

To avoid port conflicts and ensure smooth development experience, the following ports have been assigned:

### **App Ports:**

- **Web App** (`apps/web`): **Port 3000** - Main web application
- **User App** (`apps/user`): **Port 3001** - User portal
- **Admin App** (`apps/admin`): **Port 3002** - Admin dashboard
- **Demo App** (`apps/demo`): **Port 3003** - Demo showcase
- **Docs App** (`apps/docs`): **Port 3004** - Documentation
- **Texting App** (`apps/texting`): **Port 3005** - SMS backend API

### **Previous Conflicts Resolved:**

- ✅ **All port conflicts resolved** - Each app now has a unique port
- ✅ **Ports reordered** to match your preferred configuration

### **How to Access:**

```bash
# Development URLs
Web App:     http://localhost:3000
User App:    http://localhost:3001
Admin App:   http://localhost:3002
Demo App:    http://localhost:3003
Docs App:    http://localhost:3004
Texting API: http://localhost:3005
```

### **Running Multiple Apps:**

You can now run multiple apps simultaneously without port conflicts:

```bash
# Terminal 1 - Web App
cd apps/web && npm run dev

# Terminal 2 - User App
cd apps/user && npm run dev

# Terminal 3 - Admin App
cd apps/admin && npm run dev

# Terminal 4 - Demo App
cd apps/demo && npm run dev

# Terminal 5 - Docs App
cd apps/docs && npm run dev

# Terminal 6 - Texting API
cd apps/texting && npm run start:dev
```

### **Package.json Scripts:**

Each app has its own dev script that will use the configured port:

- `npm run dev` - Starts development server on assigned port
- `npm run build` - Builds for production
- `npm run preview` - Previews production build

---

_Last updated: December 29, 2024_
