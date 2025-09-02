# Schema Sync with gnymble-website

## Overview

This document outlines the changes made to sync your current database schema with the gnymble-website expectations, specifically to fix the contact-submit functionality.

## Changes Made

### 1. Database Migration

**File:** `supabase/migrations/20241229000004_gnymble_website_schema_sync.sql`

**Added Fields to `leads` table:**

- `first_name` VARCHAR(100) - First name of the lead contact
- `last_name` VARCHAR(100) - Last name of the lead contact
- `phone` VARCHAR(20) - Phone number (alias for lead_phone_number)
- `status` VARCHAR(50) DEFAULT 'new' - Lead status (new, contacted, qualified, converted, lost)
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() - Last update timestamp
- `lead_score` INTEGER DEFAULT 0 - Lead scoring value (0-100)
- `priority` VARCHAR(20) - Priority level (low, medium, high, urgent)
- `source_type` VARCHAR(100) - Type of lead source for categorization
- `user_agent` TEXT - User agent string from lead submission

**Added Fields to `lead_activities` table:**

- `description` TEXT - Human-readable description of the lead activity

**Performance Improvements:**

- Added indexes for all new fields
- Created trigger to automatically update `updated_at` timestamp
- Added comprehensive column comments for documentation

### 2. Edge Function Updates

**File:** `supabase/functions/submit-contact/index.ts`

**Fixed Issues:**

- Added `hub_id` field to `lead_activities` insert
- Edge Function now correctly uses the new field names
- Schema compatibility issues resolved

### 3. Updated Types

**File:** `packages/types/src/database-updated.ts`

**New Type Definitions:**

- Updated `leads` table types to include all new fields
- Updated `lead_activities` table types to include description field
- Maintains backward compatibility with existing fields

## Schema Compatibility

### Before (Your Current Schema)

```sql
leads: {
  id, hub_id, email, name, lead_phone_number, company_name,
  platform_interest, source, message, ip_address, interaction_count,
  last_interaction_at, created_at
}
```

### After (gnymble-website Compatible)

```sql
leads: {
  id, hub_id, email, name, first_name, last_name, lead_phone_number,
  phone, company_name, platform_interest, source, message, status,
  ip_address, interaction_count, last_interaction_at, created_at,
  updated_at, lead_score, priority, source_type, user_agent
}
```

## Next Steps

### 1. Apply the Migration

```bash
# Navigate to your Supabase project
cd supabase

# Apply the migration
supabase db push
```

### 2. Update Environment Variables

Create `.env.local` in `apps/web/` with your remote Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Test Contact Form

- Start the web app: `cd apps/web && npm run dev`
- Navigate to the contact form
- Submit a test contact
- Check Supabase logs for any remaining errors

### 4. Update Types (Optional)

If you want to use the updated types immediately:

- Replace `packages/types/src/database-generated.ts` with `database-updated.ts`
- Or regenerate types from your updated database schema

## Benefits of This Sync

1. **Full Compatibility** - Contact form now works with gnymble-website code
2. **Enhanced Lead Management** - Additional fields for better lead tracking
3. **Performance** - Proper indexing and triggers for efficient operations
4. **Maintainability** - Clear field documentation and consistent naming
5. **Future-Proof** - Schema now supports advanced lead management features

## Verification

After applying the migration, verify the changes:

```sql
-- Check new fields exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('first_name', 'last_name', 'phone', 'status', 'updated_at');

-- Check lead_activities description field
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'lead_activities'
AND column_name = 'description';
```

## Troubleshooting

If you encounter issues:

1. Check Supabase Edge Function logs for detailed error messages
2. Verify all new fields were created successfully
3. Ensure environment variables are set correctly
4. Check that the Edge Function has the latest code with `hub_id` field

## Support

For any issues or questions about this schema sync, refer to:

- Migration file: `20241229000004_gnymble_website_schema_sync.sql`
- Updated Edge Function: `submit-contact/index.ts`
- Updated types: `database-updated.ts`
