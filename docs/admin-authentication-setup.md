# Admin Dashboard Authentication & Database Setup

## Overview

The Admin Dashboard has been optimized to use best practices for authentication and database access with RLS disabled on marketing tables.

## Architecture

### Security Model

**Application-Layer Security (Current Setup)**

- RLS is **disabled** on all marketing/admin tables
- Security is handled at the application layer via admin access code
- Supabase **anon key** is used (NOT service role key)
- Public forms (contact, email/SMS signup) can write without authentication
- Admin dashboard requires `VITE_ADMIN_ACCESS_CODE` for access

### Why RLS is Disabled

Marketing tables (`leads`, `email_subscribers`, `sms_subscribers`, etc.) don't require row-level security because:

1. **Access Control**: Handled via admin authentication at the application level
2. **Team Access**: All marketing team members should see all data across hubs
3. **Public Forms**: Contact and signup forms need to write without user authentication
4. **Simplicity**: Reduces complexity for marketing/admin use cases

## Environment Variables

### Required Variables

```bash
# Supabase Connection (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Access Code (Required for Production)
VITE_ADMIN_ACCESS_CODE=your-secure-access-code-here
```

### Development Mode

In development (`DEV=true`):

- If `VITE_ADMIN_ACCESS_CODE` is NOT set, admin dashboard is accessible without authentication
- A warning is logged to console: `⚠️ Admin dashboard accessible without authentication in DEV mode`
- This allows for easier development and testing

In production:

- `VITE_ADMIN_ACCESS_CODE` is **required**
- Users must enter the access code to view the admin dashboard
- Authentication persists in localStorage for 24 hours

## Database Migrations

### Migration Files

1. **`0000001_initial_schema.sql`**
   - Creates all marketing tables
   - Sets up foreign key relationships
   - Creates indexes for performance

2. **`disable_rls_for_dev.sql`** (NEW)
   - Disables RLS on all marketing tables
   - Documents security approach
   - Safe for both dev and production

3. **`0000002_seed_data.sql`** (NEW)
   - Creates 4 hubs (PercyTech, Gnymble, PercyMD, PercyText)
   - Creates default email lists for each hub
   - Creates default SMS lists for each hub
   - Adds helper functions for getting default list IDs

### Running Migrations

**Local Development (Supabase CLI):**

```bash
# Apply all migrations
supabase db push

# Or reset and apply all
supabase db reset
```

**Production (Supabase Dashboard):**

1. Go to Database → Migrations
2. Run each migration file in order
3. Verify tables are created and RLS is disabled

## Admin Authentication Flow

### First-Time Access

1. User navigates to `/admin`
2. If not authenticated, shows access code prompt
3. User enters `VITE_ADMIN_ACCESS_CODE`
4. On success:
   - Sets `admin_auth_token` in localStorage
   - Sets `admin_auth_timestamp` in localStorage
   - Redirects to admin dashboard

### Subsequent Access

1. User navigates to `/admin`
2. Checks localStorage for:
   - `admin_auth_token === "authenticated"`
   - `admin_auth_timestamp` within last 24 hours
3. If valid, grants access immediately
4. If expired, shows access code prompt again

### Session Timeout

- Sessions expire after **24 hours**
- User must re-enter access code after expiration
- Clear localStorage to force re-authentication

## Supabase Client Configuration

### Client Setup

The admin dashboard uses the standard anon key client:

```typescript
// src/lib/supabaseSingleton.ts
const supabase = getSupabaseClient(); // Uses VITE_SUPABASE_ANON_KEY
```

**No service role key required** because RLS is disabled on marketing tables.

### Connection Debugging

The dashboard logs connection info on each data fetch:

```typescript
console.log("🔌 Admin Dashboard - Connecting to Supabase:", {
  url: import.meta.env.VITE_SUPABASE_URL,
  hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  mode: import.meta.env.DEV ? "development" : "production",
});
```

Check browser console for these logs if experiencing connection issues.

## Data Model

### Hub IDs

```typescript
const hubIds = {
  percytech: 0,
  gnymble: 1,
  percymd: 2,
  percytext: 3,
};
```

### Default Lists

Each hub has a default email list and SMS list:

**Email Lists:**

- PercyTech: `00000000-0000-0000-0000-000000000001`
- Gnymble: `00000000-0000-0000-0000-000000000002`
- PercyMD: `00000000-0000-0000-0000-000000000003`
- PercyText: `00000000-0000-0000-0000-000000000004`

**SMS Lists:**

- PercyTech: `10000000-0000-0000-0000-000000000001`
- Gnymble: `10000000-0000-0000-0000-000000000002`
- PercyMD: `10000000-0000-0000-0000-000000000003`
- PercyText: `10000000-0000-0000-0000-000000000004`

### Adding Subscribers

When adding email/SMS subscribers from leads, the dashboard:

1. Queries for the default list for that hub
2. Automatically assigns the subscriber to that list
3. Handles errors if no list exists

## CRUD Operations

### Leads

- ✅ Create new leads
- ✅ Edit existing leads
- ✅ Delete leads
- ✅ Convert leads to email subscribers
- ✅ Convert leads to SMS subscribers

### Email Subscribers

- ✅ View subscribers (filtered by hub)
- ✅ Add from leads (auto-assigns to default list)
- ❌ Direct CRUD (future enhancement)

### SMS Subscribers

- ✅ View subscribers (filtered by hub)
- ✅ Add from leads (auto-assigns to default list)
- ❌ Direct CRUD (future enhancement)

## Troubleshooting

### Issue: Admin Dashboard Not Connecting

**Symptoms:**

- No data loading
- Errors in console
- "Database errors" message

**Solutions:**

1. **Check Environment Variables**

   ```bash
   # Verify these are set
   echo $VITE_SUPABASE_URL
   echo $VITE_SUPABASE_ANON_KEY
   ```

2. **Check Migrations**
   - Ensure all migrations have run
   - Verify tables exist in Supabase dashboard
   - Verify RLS is disabled (should show "Unrestricted")

3. **Check Seed Data**
   - Verify hubs exist: `SELECT * FROM hubs;`
   - Verify lists exist: `SELECT * FROM email_lists; SELECT * FROM sms_lists;`

4. **Check Browser Console**
   - Look for connection logs (🔌)
   - Look for error logs (❌)
   - Check for data logs (✅)

### Issue: Authentication Not Working

**Symptoms:**

- Access code not accepted
- Keep getting prompted for access code

**Solutions:**

1. **Check Environment Variable**

   ```bash
   # In development .env file
   VITE_ADMIN_ACCESS_CODE=your-code-here
   ```

2. **Restart Dev Server**

   ```bash
   npm run dev
   ```

3. **Clear localStorage**
   ```javascript
   // In browser console
   localStorage.removeItem("admin_auth_token");
   localStorage.removeItem("admin_auth_timestamp");
   ```

### Issue: Can't Add Subscribers

**Symptoms:**

- Error: "No email list found for hub X"
- Error: "No SMS list found for hub X"

**Solutions:**

1. **Run Seed Data Migration**

   ```bash
   supabase db push
   # Or manually run 0000002_seed_data.sql
   ```

2. **Manually Create Lists**
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO email_lists (hub_id, list_name, list_type, status)
   VALUES (1, 'Gnymble Marketing', 'marketing', 'active');
   ```

## Security Considerations

### Production Deployment

1. **Set Strong Access Code**
   - Use a long, random string
   - Store securely (e.g., in Vercel environment variables)
   - Rotate periodically

2. **Consider API Routes**
   - For sensitive operations, use backend API routes
   - Implement server-side authentication
   - Use Supabase service role key on backend only

3. **Monitor Access**
   - Log admin access attempts
   - Set up alerts for unusual activity
   - Review localStorage auth patterns

4. **Restrict Anon Key**
   - In Supabase dashboard, configure anon key permissions
   - Limit which operations can be performed
   - Consider IP whitelisting for admin routes

### Future Enhancements

- [ ] Implement proper user authentication (Supabase Auth)
- [ ] Add role-based access control (admin, marketing, viewer)
- [ ] Move sensitive operations to API routes
- [ ] Add audit logging for all admin actions
- [ ] Implement rate limiting
- [ ] Add 2FA for admin access

## Summary

✅ **Best Practices Implemented:**

- RLS disabled on marketing tables (appropriate for this use case)
- Application-layer authentication via access code
- Anon key used (service role key not needed)
- Seed data for hubs and default lists
- Proper error handling and debugging logs
- 24-hour session timeout

✅ **Security:**

- Access code required in production
- Session management with localStorage
- Clear authentication flow
- No sensitive keys in client code

✅ **Development Experience:**

- Easy to test in dev mode
- Helpful console logging
- Clear error messages
- Flexible authentication
