# Shared Layout Components

This directory contains unified layout components for the SMS Hub monorepo, designed to provide consistent UI patterns across admin, user, and future applications.

## Architecture Overview

The shared layout system is built on the principle of **composition over configuration**, allowing each app to customize its behavior while maintaining visual consistency.

### Core Components

#### 1. DashboardLayout
The main layout wrapper that provides the complete dashboard structure.

```tsx
import { DashboardLayout } from '@sms-hub/ui';

<DashboardLayout
  config={layoutConfig}
  navigationItems={navigationItems}
  userProfile={userProfile}
  onLogout={handleLogout}
/>
```

#### 2. ProtectedRoute
Unified authentication wrapper with payment and onboarding checks.

```tsx
import { ProtectedRoute, useAuth } from '@sms-hub/ui';

const authState = useAuth({
  checkSession: async () => {...},
  getUserProfile: async (userId) => {...}
});

<ProtectedRoute authState={authState} config={protectedRouteConfig}>
  <YourProtectedContent />
</ProtectedRoute>
```

#### 3. AppSidebar & AppHeader
Individual layout components that can be used separately if needed.

### Configuration Types

```typescript
interface DashboardLayoutConfig {
  sidebar: {
    showHubSwitcher?: boolean;
    settingsItem?: NavigationItem;
    adminPortalLink?: {
      show: boolean;
      href: string;
      label?: string;
    };
  };
  header: {
    title: string;
    titleIcon?: LucideIcon;
    showSearch?: boolean;
    searchPlaceholder?: string;
    showNotifications?: boolean;
    showGlobalViewToggle?: boolean;
    isGlobalView?: boolean;
    onGlobalViewChange?: (isGlobal: boolean) => void;
  };
  mainClassName?: string;
}
```

### Hooks

#### useAuth
Manages authentication state with support for dev mode override.

```tsx
const authState = useAuth({
  checkSession: async () => {...},
  getUserProfile: async (userId) => {...},
  onAuthStateChange: (callback) => {...},
  devAuthOverride: { isEnabled: false }
});
```

#### useNavigationCounts
Fetches and manages navigation item counts with auto-refresh.

```tsx
const { counts, isRefreshing, refreshCounts } = useNavigationCounts({
  fetchCounts: async (hubId, isGlobalView) => {...},
  hubId: 1,
  isGlobalView: false,
  refreshInterval: 60000 // 1 minute
});
```

## Migration Guide

### For Admin App

1. Replace current `Layout.tsx` with shared components:

```tsx
// apps/admin/src/components/Layout.tsx
import { DashboardLayout, useAuth, useNavigationCounts } from '@sms-hub/ui';
import { useGlobalView } from '../contexts/GlobalViewContext';

export function Layout() {
  const { isGlobalView, setIsGlobalView } = useGlobalView();
  
  const layoutConfig: DashboardLayoutConfig = {
    sidebar: {
      showHubSwitcher: true,
      settingsItem: { name: 'Settings', href: '/settings', icon: Settings }
    },
    header: {
      title: 'Admin Portal',
      titleIcon: Shield,
      showGlobalViewToggle: true,
      isGlobalView,
      onGlobalViewChange: setIsGlobalView,
    }
  };

  return <DashboardLayout config={layoutConfig} {...props} />;
}
```

2. Update routing to use shared ProtectedRoute if needed.

### For User App

1. Replace `Layout.tsx` and `ProtectedRoute.tsx`:

```tsx
// apps/user/src/App.tsx
import { ProtectedRoute, DashboardLayout, useAuth } from '@sms-hub/ui';

function App() {
  const authState = useAuth({
    checkSession: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session ? { session, user: session.user } : null;
    },
    // ... other config
  });

  return (
    <ProtectedRoute authState={authState}>
      <DashboardLayout config={layoutConfig}>
        <Routes>
          {/* Your routes */}
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

## Features

### Unified Benefits
- **Consistent UI/UX**: Same layout patterns across all apps
- **Reduced Code Duplication**: Single source of truth for layouts
- **Easier Maintenance**: Update once, apply everywhere
- **Type Safety**: Full TypeScript support with exported types
- **Flexible Configuration**: Apps can customize while maintaining consistency

### App-Specific Customization
- **Admin App**: Global view toggle, navigation counts, admin-specific branding
- **User App**: Onboarding progress, payment status checks, user profile display
- **Future Apps**: Easy to extend with new configuration options

## Best Practices

1. **Keep app-specific logic in the apps**: The shared components should be generic
2. **Use composition**: Pass children and custom components rather than adding flags
3. **Maintain type safety**: Always export and use TypeScript interfaces
4. **Document changes**: Update this README when adding new features

## Examples

See the `examples/` directory for complete implementation examples:
- `AdminLayoutExample.tsx`: Full admin app implementation
- `UserLayoutExample.tsx`: Full user app implementation

## Testing

Run tests for the layout components:

```bash
pnpm test --filter=@sms-hub/ui
```

## Contributing

When adding new features to the layout components:
1. Consider if it's truly shared or app-specific
2. Add TypeScript types to `types.ts`
3. Update examples if behavior changes
4. Add unit tests for new functionality
5. Update this documentation