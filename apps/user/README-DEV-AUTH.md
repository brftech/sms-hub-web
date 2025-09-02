# Dev Superadmin Authentication

This document describes the development-only superadmin authentication bypass for the user app.

## Overview

The dev superadmin mode allows developers to bypass normal authentication in development environments to quickly access and test various pages without going through the full authentication flow.

## Features

- **Development Only**: Only works when the app is running in development mode
- **Visual Indicator**: Shows a red banner at the top when dev mode is active
- **Mock User Profile**: Creates a mock user profile with all required fields
- **Session Persistence**: Maintains dev session across page refreshes
- **Easy Exit**: Click "Exit Dev Mode" button to return to normal auth

## How to Enable

### Method 1: Toggle Button (Recommended)

1. Go to the login or signup page
2. Look for the **"Dev Superadmin"** button in the bottom-right corner
3. Click it to activate dev mode and bypass authentication

The button only appears in development environment.

### Method 2: Query Parameter

Add `?superadmin=dev123` to any URL in the user app:

```
http://localhost:3001/?superadmin=dev123
http://localhost:3001/campaigns?superadmin=dev123
```

### Method 3: Environment Variable

Set the environment variable in your `.env.local`:

```bash
VITE_DEV_SUPERADMIN=true
```

Then access any protected route normally.

### Method 4: Custom User ID

You can specify a custom dev user ID:

```
http://localhost:3001/?superadmin=dev123&devuser=custom-user-id
```

## Mock User Profile

The dev superadmin mode creates a mock user profile with:

- Email: `superadmin@dev.local`
- Phone: `+15551234567`
- Name: `Dev Superadmin`
- Company: `Development Testing`
- Hub ID: `1` (PercyTech by default)
- Payment Status: `completed`
- Onboarding: `completed`

## Security

- **Only works in development**: The feature checks `userEnvironment.isDevelopment()`
- **No database access**: Uses mock data, doesn't touch real user records
- **Session-based**: Uses sessionStorage, cleared on browser close
- **Visual warning**: Red banner makes it obvious when in dev mode

## Implementation Details

### Files Added/Modified

1. **`src/hooks/useDevAuth.ts`**: Core dev auth logic
2. **`src/components/DevAdminBanner.tsx`**: Visual indicator component
3. **`src/components/ProtectedRoute.tsx`**: Modified to check dev auth
4. **`src/components/Layout.tsx`**: Shows dev banner and uses mock profile

### How It Works

1. `useDevAuth` hook checks for superadmin mode activation
2. If activated, creates mock user data and stores in sessionStorage
3. `ProtectedRoute` checks dev auth before normal auth
4. Layout components use mock profile when in dev mode
5. Dev banner shows current state and allows exit

## Usage Examples

### Quick Access to Dashboard
```bash
# Start the dev server
pnpm dev --filter=@sms-hub/user

# Open in browser with superadmin
open http://localhost:3001/?superadmin=dev123
```

### Testing Different Hubs
```javascript
// Modify the mock profile in useDevAuth.ts
const devUserProfile = {
  // ...
  hub_id: 2, // Change to test different hubs
  // ...
}
```

### Debugging Auth Issues
```javascript
// The dev mode bypasses auth, so you can:
// 1. Access pages that require auth
// 2. Test UI with different user states
// 3. Debug routing and protected routes
```

## Troubleshooting

### Dev Mode Not Activating

1. Check you're in development (localhost, port 3001)
2. Verify query parameter is exactly `?superadmin=dev123`
3. Check browser console for "Dev superadmin mode active" log

### Session Persisting After Exit

Clear sessionStorage manually:
```javascript
sessionStorage.clear()
window.location.reload()
```

### Banner Not Showing

1. Check DevAdminBanner is imported in Layout
2. Verify useDevAuth hook is returning correct state
3. Check for CSS conflicts with z-index

## Best Practices

1. **Don't commit .env.local**: Keep VITE_DEV_SUPERADMIN out of version control
2. **Use for testing only**: Not a replacement for proper auth testing
3. **Test real auth flow**: Periodically test the actual SMS OTP flow
4. **Clear sessions**: Exit dev mode when testing real auth

## Future Enhancements

Potential improvements for dev auth:

1. Multiple mock user profiles
2. Hub switching in dev mode
3. Mock subscription states
4. Simulated auth errors
5. Dev-only admin panel