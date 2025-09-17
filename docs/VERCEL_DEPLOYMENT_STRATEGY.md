# Vercel Deployment Strategy

## 🏗️ **Architecture Overview**

The SMS Hub monorepo requires **multiple Vercel projects** to handle:

- **2 Applications**: Web (marketing) + Unified (dashboard)
- **4 Hubs**: Gnymble, PercyTech, PercyMD, PercyText
- **Hub-specific domains** and environment variables

## 📋 **Required Vercel Projects**

### **Web App Projects** (Marketing Sites)

```
1. sms-hub-web-gnymble      → www.gnymble.com
2. sms-hub-web-percytech    → www.percytech.com
3. sms-hub-web-percymd      → www.percymd.com
4. sms-hub-web-percytext    → www.percytext.com
```

### **Unified App Projects** (Dashboards)

```
5. sms-hub-unified-gnymble   → app.gnymble.com
6. sms-hub-unified-percytech → app.percytech.com
7. sms-hub-unified-percymd   → app.percymd.com
8. sms-hub-unified-percytext → app.percytext.com
```

## ⚙️ **Deployment Configuration**

### **For Web App Projects**

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build --filter=@sms-hub/web",
  "outputDirectory": "apps/web/dist",
  "framework": "vite",
  "redirects": [
    {
      "source": "/signup",
      "destination": "/pricing",
      "permanent": false
    }
  ]
}
```

### **For Unified App Projects**

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build --filter=@sms-hub/unified",
  "outputDirectory": "apps/unified/dist",
  "framework": "vite"
}
```

## 🌍 **Environment Variables Per Project**

### **Hub-Specific Variables**

Each Vercel project needs its own environment variables:

```bash
# Gnymble Projects
VITE_HUB_ID=gnymble
VITE_HUB_NUMBER=1
VITE_UNIFIED_APP_URL=https://app.gnymble.com
VITE_WEB_APP_URL=https://www.gnymble.com

# PercyTech Projects
VITE_HUB_ID=percytech
VITE_HUB_NUMBER=0
VITE_UNIFIED_APP_URL=https://app.percytech.com
VITE_WEB_APP_URL=https://www.percytech.com
```

## 🚀 **Deployment Commands**

### **Deploy Specific App+Hub**

```bash
# Deploy web app for Gnymble
vercel --prod --project-name sms-hub-web-gnymble

# Deploy unified app for PercyTech
vercel --prod --project-name sms-hub-unified-percytech
```

### **Deploy All Hubs for One App**

```bash
# Deploy web app to all hubs
for hub in gnymble percytech percymd percytext; do
  vercel --prod --project-name sms-hub-web-$hub
done
```

### **Deploy Everything**

```bash
# Deploy all apps to all hubs
./scripts/deploy-all.sh
```

## 📁 **File Structure Cleanup**

### **Keep**:

- ✅ `/apps/web/vercel.json` - Template for web deployments
- ✅ `/apps/unified/vercel.json` - Template for unified deployments

### **Remove**:

- ❌ `/vercel.json` - Conflicts with app-specific configs
- ❌ `.vercel/` folders - Created automatically, don't commit

### **Current Issues**:

1. **Root vercel.json conflicts** with app-specific configs
2. **Dashboard overrides** fighting with file configs
3. **Same project ID** used for different apps
4. **No hub isolation** in environment variables

## 🎯 **Recommended Next Steps**

1. **Create separate Vercel projects** for each app+hub combination
2. **Remove root vercel.json** (already done)
3. **Configure hub-specific env vars** in each project
4. **Document deployment workflows** for different scenarios
5. **Create deployment scripts** for batch operations

This strategy provides **complete isolation** between hubs while maintaining **shared codebase** benefits.
