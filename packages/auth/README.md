# @sms-hub/auth

Centralized authentication utilities for the SMS Hub platform, providing consistent authentication patterns, role-based access control, and user management across all applications.

## Features

- **Universal Authentication Hook**: Flexible `useAuth` hook that works with any Supabase instance
- **Role-Based Access Control**: Comprehensive role utilities with hierarchy support
- **Protected Routes**: Configurable route protection with multiple authorization strategies
- **User Utilities**: Helper functions for user display, profile management, and more
- **TypeScript Support**: Full type safety for all authentication operations
- **Context Provider**: Ready-to-use AuthProvider for React applications

## Installation

```bash
pnpm add @sms-hub/auth
```

## Basic Usage

### 1. Set up the AuthProvider

```tsx
import { AuthProvider } from '@sms-hub/auth';
import { getSupabaseClient } from '../lib/supabase';

function App() {
  const supabase = getSupabaseClient();
  
  return (
    <AuthProvider 
      supabase={supabase}
      config={{
        redirectUrl: '/dashboard',
        debug: true
      }}
    >
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 2. Use the auth hook

```tsx
import { useAuthContext } from '@sms-hub/auth';

function UserProfile() {
  const { user, loading, signOut } = useAuthContext();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return (
    <div>
      <h1>Welcome, {getUserDisplayName(user)}!</h1>
      <p>Role: {formatUserRole(user.role)}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 3. Protect routes

```tsx
import { ProtectedRoute } from '@sms-hub/auth';
import { useAuthContext } from '@sms-hub/auth';

function AdminRoute() {
  const { user, loading } = useAuthContext();
  
  return (
    <ProtectedRoute
      user={user}
      loading={loading}
      minimumRole="ADMIN"
      redirectTo="/dashboard"
    >
      <AdminPanel />
    </ProtectedRoute>
  );
}
```

## Role Management

The package provides comprehensive role utilities:

```typescript
import { 
  hasRole, 
  hasAnyRole, 
  hasMinimumRole,
  isAdmin,
  isSuperAdmin,
  getRoleDisplayName 
} from '@sms-hub/auth';

// Check specific role
if (hasRole(user.role, 'ADMIN')) {
  // User is an admin
}

// Check multiple roles
if (hasAnyRole(user.role, ['ADMIN', 'SUPERADMIN'])) {
  // User has admin access
}

// Check role hierarchy
if (hasMinimumRole(user.role, 'ONBOARDED')) {
  // User is at least onboarded
}

// Convenience functions
if (isAdmin(user.role)) {
  // User is admin or superadmin
}
```

## User Utilities

Helper functions for working with user data:

```typescript
import { 
  getUserDisplayName,
  getInitials,
  formatPhoneNumber,
  isProfileComplete 
} from '@sms-hub/auth';

// Get display name with fallbacks
const name = getUserDisplayName(user); // "John Doe" or email or "Guest User"

// Get initials for avatars
const initials = getInitials(user.first_name, user.last_name); // "JD"

// Format phone numbers
const phone = formatPhoneNumber(user.mobile_phone_number); // "(555) 123-4567"

// Check profile completeness
if (isProfileComplete(user)) {
  // All required fields are filled
}
```

## Advanced Usage

### Custom auth hook usage

```typescript
import { useAuth } from '@sms-hub/auth';
import { supabase } from '../lib/supabase';

function CustomAuthComponent() {
  const auth = useAuth({
    supabase,
    config: {
      persistSession: true,
      autoRefreshToken: true,
      debug: true
    },
    onAuthStateChange: (event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_IN') {
        // Handle sign in
      }
    }
  });
  
  return <div>{/* Your component */}</div>;
}
```

### Route permissions configuration

```typescript
import { ProtectedRoute, RoutePermission } from '@sms-hub/auth';

const routePermissions: RoutePermission[] = [
  { path: '/admin', roles: ['ADMIN', 'SUPERADMIN'] },
  { path: '/dashboard', roles: ['USER', 'ONBOARDED', 'ADMIN', 'SUPERADMIN'] },
  { path: '/texting', roles: ['ONBOARDED', 'ADMIN', 'SUPERADMIN'] }
];

function App() {
  const { user, loading } = useAuthContext();
  
  return (
    <ProtectedRoute
      user={user}
      loading={loading}
      routePermissions={routePermissions}
      loginUrl="http://localhost:3000/login"
      loadingComponent={<CustomLoader />}
      unauthorizedComponent={<AccessDenied />}
      debug={true}
    >
      <Routes>
        {/* Your routes */}
      </Routes>
    </ProtectedRoute>
  );
}
```

## TypeScript Types

```typescript
interface AuthUser extends UserProfile {
  memberships?: Membership[];
}

interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: Error | null;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

type UserRole = "USER" | "ONBOARDED" | "ADMIN" | "SUPERADMIN";
```

## Role Hierarchy

The package implements a role hierarchy system:

1. **USER**: Basic authenticated user
2. **ONBOARDED**: Verified user with completed onboarding
3. **ADMIN**: Administrator with company management access
4. **SUPERADMIN**: Full platform access across all hubs

## Migration Guide

To migrate from app-specific auth to @sms-hub/auth:

1. Replace local useAuth hooks:
   ```typescript
   // Before
   import { useAuth } from '../hooks/useAuth';
   
   // After
   import { useAuthContext } from '@sms-hub/auth';
   ```

2. Update role utilities imports:
   ```typescript
   // Before
   import { hasRole, canAccessRoute } from '../utils/roleUtils';
   
   // After
   import { hasRole, canAccessRoute } from '@sms-hub/auth';
   ```

3. Update ProtectedRoute usage:
   ```typescript
   // Before
   <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
   
   // After
   <ProtectedRoute user={user} loading={loading} requiredRoles={['ADMIN']}>
   ```

## Best Practices

1. **Always use the AuthProvider** at the root of your app
2. **Handle loading states** properly in your components
3. **Use role hierarchy** functions instead of direct string comparisons
4. **Implement proper error boundaries** around protected routes
5. **Enable debug mode** during development for detailed logging
6. **Test authentication flows** thoroughly, including edge cases

## Contributing

When adding new features to the auth package:

1. Maintain backward compatibility
2. Add comprehensive TypeScript types
3. Include tests for new utilities
4. Update this README with examples
5. Consider impact on existing applications