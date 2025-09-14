# Environment Variables Guide for Browser vs Node.js

## The Problem

`process.env` is a Node.js-specific global that doesn't exist in browser environments. Using it in code that runs in the browser will cause runtime errors like:
```
Uncaught ReferenceError: process is not defined
```

## The Solution

Always check the environment before accessing environment variables and provide fallbacks for both browser and Node.js environments.

### For Vite-based Applications (apps/web, apps/unified)

In Vite applications, use `import.meta.env`:
```typescript
// ❌ WRONG - Will crash in browser
const apiUrl = process.env.VITE_API_URL;

// ✅ CORRECT - Works in Vite apps
const apiUrl = import.meta.env.VITE_API_URL;
```

### For Shared Packages (packages/*)

Shared packages might run in both browser and Node.js environments, so they need to handle both:

```typescript
// ❌ WRONG - Only works in Node.js
const isDevelopment = process.env.NODE_ENV === 'development';

// ✅ CORRECT - Works in both environments
const isDevelopment = 
  (typeof import.meta !== 'undefined' && import.meta.env?.MODE !== 'production') ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');
```

### Complete Pattern for Universal Packages

Here's the pattern we use in our logger and other shared packages:

```typescript
// For boolean checks (development mode, feature flags)
const isDevelopment = 
  (typeof import.meta !== 'undefined' && import.meta.env?.MODE !== 'production') ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');

// For string values (API URLs, keys, etc.)
const apiUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.API_URL) ||
  'https://default-api-url.com'; // Always provide a fallback

// For configuration objects
const config = {
  level: (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'production') ? 'info' : 'debug',
  enableSentry: (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'production'),
  sentryDsn: 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN) || 
    (typeof process !== 'undefined' && process.env?.SENTRY_DSN),
  environment: 
    (typeof import.meta !== 'undefined' && import.meta.env?.MODE) || 
    (typeof process !== 'undefined' && process.env?.NODE_ENV) || 
    'development',
};
```

## Environment Variable Naming Conventions

### Vite Applications
- Prefix with `VITE_` for client-side variables: `VITE_SUPABASE_URL`
- These are replaced at build time and embedded in the bundle

### Node.js Applications
- Use standard naming: `SUPABASE_URL`, `NODE_ENV`
- These are read at runtime from process.env

### Shared Packages
- Check for both patterns: `VITE_API_URL` and `API_URL`
- Document which environment variables are expected

## Common Mistakes to Avoid

1. **Using process.env in browser code without checks**
   ```typescript
   // ❌ This will crash in the browser
   if (process.env.NODE_ENV === 'development') { }
   ```

2. **Forgetting to check if import.meta exists**
   ```typescript
   // ❌ This will crash in Node.js
   const url = import.meta.env.VITE_API_URL;
   ```

3. **Not providing fallbacks**
   ```typescript
   // ❌ Could be undefined
   const apiUrl = import.meta.env?.VITE_API_URL || process.env?.API_URL;
   
   // ✅ Always has a value
   const apiUrl = import.meta.env?.VITE_API_URL || process.env?.API_URL || 'https://api.example.com';
   ```

## Testing Your Code

1. **Test in development**: `pnpm dev`
2. **Test production build**: `pnpm build && pnpm preview`
3. **Test in Node.js context**: Run any server-side scripts or tests
4. **Check the browser console**: Look for "process is not defined" errors

## Files We've Fixed

These files have been updated to handle environment variables correctly:

1. `/packages/logger/src/logger.ts` - Universal logger configuration
2. `/packages/ui/src/components/error-boundary.tsx` - Development mode detection
3. `/packages/utils/src/logger.ts` - Log level configuration
4. `/packages/supabase/src/singleton.ts` - Already handled correctly
5. `/packages/dev-auth/src/config.ts` - Already handled correctly

## Checklist for New Code

When writing code that uses environment variables:

- [ ] Does this code run in the browser? Use `import.meta.env`
- [ ] Does this code run in Node.js? Use `process.env` 
- [ ] Could it run in both? Use the universal pattern with checks
- [ ] Have I provided sensible fallback values?
- [ ] Have I tested in both environments?
- [ ] Have I documented which environment variables are needed?

## Example: Creating a New Service

```typescript
// packages/new-service/src/config.ts

export interface ServiceConfig {
  apiUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
}

export function getServiceConfig(): ServiceConfig {
  // Handle both Vite and Node.js environments
  const apiUrl = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SERVICE_API_URL) ||
    (typeof process !== 'undefined' && process.env?.SERVICE_API_URL) ||
    'https://api.service.com';

  const apiKey = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SERVICE_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.SERVICE_API_KEY) ||
    '';

  if (!apiKey) {
    console.warn('Service API key not configured');
  }

  return {
    apiUrl,
    apiKey,
    timeout: 30000,
    retryAttempts: 3,
  };
}
```

Remember: Always consider where your code will run and handle environment variables appropriately!