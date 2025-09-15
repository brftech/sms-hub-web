# Database Sync Process

This document outlines the process for keeping the development and production Supabase databases in sync.

## 🗄️ Database Configuration

- **Development**: `vgpovgpwqkjnpnrjelyg.supabase.co` (sms-hub-monorepo)
- **Production**: `howjinnvvtvaufihwers.supabase.co` (percytech)

## 🚀 Quick Commands

```bash
# Interactive sync menu
npm run sync

# Sync specific components
npm run sync:migrations    # Sync database migrations only
npm run sync:functions     # Sync Edge Functions only
npm run sync:superadmin    # Create superadmin in production
npm run sync:verify        # Verify sync status
npm run sync:full          # Full sync (everything)

# Individual operations
npm run db:link:dev        # Link to development database
npm run db:link:prod       # Link to production database
npm run db:push:dev        # Push migrations to development
npm run db:push:prod       # Push migrations to production
npm run functions:deploy:dev   # Deploy functions to development
npm run functions:deploy:prod  # Deploy functions to production
```

## 📋 Sync Process Overview

### 1. Database Migrations

- **Purpose**: Keep schema changes synchronized
- **Process**:
  1. Create migration files in `supabase/migrations/`
  2. Run `npm run sync:migrations` to apply to both databases
  3. Verify changes in both Supabase dashboards

### 2. Edge Functions

- **Purpose**: Keep serverless functions synchronized
- **Process**:
  1. Update function code in `supabase/functions/`
  2. Run `npm run sync:functions` to deploy to both environments
  3. Test functions in both environments

### 3. Superadmin Setup

- **Purpose**: Ensure production has proper admin access
- **Process**:
  1. Create superadmin auth user in Supabase Dashboard
  2. Run `npm run sync:superadmin` to create profile and company
  3. Verify admin access works

## 🔧 Manual Steps Required

### Creating Superadmin in Production

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/howjinnvvtvaufihwers/auth/users
2. **Click "Add user"**
3. **Enter details**:
   - Email: `superadmin@percytech.com`
   - Password: `SuperAdmin123!`
   - Auto Confirm: ✅ (checked)
4. **Click "Create user"**
5. **Run sync**: `npm run sync:superadmin`

## 📊 Verification Steps

### Check Migration Status

```bash
# Check development
npm run db:link:dev
npx supabase migration list

# Check production
npm run db:link:prod
npx supabase migration list
```

### Check Edge Functions

```bash
# List functions in development
npx supabase functions list --project-ref vgpovgpwqkjnpnrjelyg

# List functions in production
npx supabase functions list --project-ref howjinnvvtvaufihwers
```

### Check Superadmin Access

1. Go to production app: https://unified.gnymble.com
2. Login with: `superadmin@percytech.com` / `SuperAdmin123!`
3. Verify admin dashboard access

## 🚨 Troubleshooting

### CLI Connection Issues

If you get connection refused errors:

1. Check network restrictions in Supabase Dashboard
2. Ensure you're using the correct project references
3. Try running with `--debug` flag for more details

### Migration Failures

If migrations fail:

1. Check the error message in the output
2. Verify the migration SQL syntax
3. Check for conflicting data in the target database
4. Run migrations one at a time if needed

### Function Deployment Issues

If functions fail to deploy:

1. Check function syntax and imports
2. Verify all dependencies are available
3. Check function logs in Supabase Dashboard
4. Deploy functions individually to isolate issues

## 📝 Best Practices

### Before Making Changes

1. Always test changes in development first
2. Create backup of production data if needed
3. Document any breaking changes

### During Sync Process

1. Run sync during low-traffic periods
2. Monitor both databases during sync
3. Test critical functionality after sync

### After Sync

1. Verify all changes applied correctly
2. Test authentication flows
3. Check Edge Function logs
4. Update documentation if needed

## 🔄 Regular Maintenance

### Daily

- Check function logs for errors
- Monitor authentication success rates

### Weekly

- Run full sync to ensure consistency
- Review and clean up test data

### Monthly

- Review migration history
- Update Edge Functions if needed
- Check database performance metrics

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase Dashboard logs
3. Check function logs in both environments
4. Verify network connectivity and permissions

## 🎯 Success Criteria

A successful sync means:

- ✅ All migrations applied to both databases
- ✅ All Edge Functions deployed to both environments
- ✅ Superadmin can access production dashboard
- ✅ Authentication flows work in both environments
- ✅ No errors in function logs
- ✅ Schema is identical between dev and prod
