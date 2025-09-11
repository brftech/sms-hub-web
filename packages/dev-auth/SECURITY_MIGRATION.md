# Dev Authentication Security Migration Guide

## Overview

We've updated the dev authentication system to use secure, environment-based tokens instead of hardcoded values. This change improves security and prevents accidental exposure of dev credentials.

## Changes Made

1. **Removed hardcoded "dev123" token**
   - Previously: Dev auth used a hardcoded token "dev123"
   - Now: Uses a secure token from environment variables

2. **Removed localStorage persistence**
   - Previously: Dev auth persisted in localStorage
   - Now: Auth only lasts for the current page session

3. **Added configuration validation**
   - Validates token strength (minimum 16 characters)
   - Prevents use of weak tokens like "dev123"

## Migration Steps

### 1. Update Your .env.local

Add a secure dev authentication token to your `.env.local` file:

```bash
# Generate a secure random token
openssl rand -base64 32

# Add to .env.local
VITE_DEV_AUTH_TOKEN=your-generated-token-here
```

### 2. Update Your Dev Auth URLs

Replace any bookmarks or scripts that use the old token:

```bash
# Old way (INSECURE - DO NOT USE)
http://localhost:3001/?superadmin=dev123

# New way (use your actual token)
http://localhost:3001/?superadmin=your-generated-token-here
```

### 3. Update Any Automation Scripts

If you have scripts that activate dev auth, update them to use the environment token:

```javascript
// Old way
url.searchParams.set('superadmin', 'dev123');

// New way
const token = process.env.VITE_DEV_AUTH_TOKEN;
url.searchParams.set('superadmin', token);
```

## Security Best Practices

1. **Never commit tokens to version control**
   - Keep `.env.local` in `.gitignore`
   - Use different tokens for each developer

2. **Use strong tokens**
   - Minimum 16 characters
   - Use cryptographically random values
   - Rotate tokens regularly

3. **Development only**
   - Dev auth is automatically disabled in production
   - Never expose dev tokens in production environments

4. **No persistence**
   - Dev auth no longer persists across page refreshes
   - Must re-authenticate each session for security

## Troubleshooting

### "Dev auth configuration error" in console

This means your token is not configured properly. Check:
1. `VITE_DEV_AUTH_TOKEN` is set in `.env.local`
2. Token is at least 16 characters
3. Token is not "dev123" or other weak value

### Dev auth not activating

1. Ensure you're in development mode (`npm run dev`)
2. Check the token in URL matches your env variable
3. Look for validation errors in console

### Lost your token

Simply generate a new one:
```bash
openssl rand -base64 32
```

Then update your `.env.local` file.

## Questions?

If you have any questions about this migration, please reach out to the development team.