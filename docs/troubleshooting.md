# Troubleshooting

**Last Updated**: October 14, 2025

## 🔧 Common Issues

### Build & Development

**Issue: "Cannot find module @sms-hub/..."**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Ensure preserveSymlinks is in vite.config.ts
```

**Issue: TypeScript errors after moving files**

```bash
# Run type check to find all errors
npm run type-check

# Search for old imports
grep -r "old/path/to/file" src/
```

**Issue: Dev server shows 404 for hub files**

After refactoring, restart the dev server:

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Database & Supabase

**Issue: "Invalid API key" or connection refused**

Check environment variables:

```bash
# View current env vars (dev)
cat .env.local

# Verify Supabase URL and anon key match
# Dev: hmumtnpnyxuplvqcmnfk
# Prod: fwlivygerbqzowbzxesw
```

**Issue: Admin dashboard not loading leads**

1. Check database connection in browser console
2. Verify `hub_id` filtering is correct
3. Check RLS policies (should be disabled in dev)

**Issue: Contact form not submitting**

1. Check Edge Function is deployed: `npx supabase functions list`
2. Verify Turnstile keys are set
3. Check browser console for CORS errors

### Testing

**Issue: Tests fail with "import.meta.env" errors**

These tests are trying to mock Vite behavior - remove them. Vite env vars are immutable at build time.

**Issue: "setupFiles not found"**

Verify `vitest.config.ts` points to correct path:

```typescript
setupFiles: ["./test/setup.ts"]; // Not src/test/setup.ts
```

**Issue: Tests pass locally but fail in CI**

1. Check Node version matches (see `.nvmrc` or `package.json`)
2. Verify all test dependencies are in `package.json`
3. Check for environment-specific code

### Hub & Content

**Issue: Wrong hub content showing**

Check:

1. Domain detection: browser should show correct domain
2. HubProvider: ensure pages are wrapped with `HubProvider`
3. Import path: use `@sms-hub/ui/marketing` not `@sms-hub/ui`

**Issue: Hub colors not applying**

1. Verify `colors.ts` exists in `/packages/hub-logic/src/hubs/{hubType}/`
2. Check `getHubColors()` helper in `hub-logic/src/index.ts`
3. Ensure component uses `useHub()` hook

**Issue: Typing animation shows wrong business types**

Each hub needs `businessTypes.ts`:

```typescript
// packages/hub-logic/src/hubs/gnymble/businessTypes.ts
export const gnymbleBusinessTypes = [
  "Retail Stores",
  "Restaurants",
  // ...
];
```

### Admin Dashboard

**Issue: "Add to Email/SMS List" not working**

1. Check network tab for failed requests
2. Verify Edge Function has service role key
3. Check lead already exists in list (duplicate prevention)

**Issue: Leads not sorted by recent activity**

Verify query sorts by `last_interaction_at DESC`, not `created_at`.

**Issue: Bulk operations not working**

1. Check selected leads in state
2. Verify checkbox selection updates `selectedLeads`
3. Check console for errors

## 🔍 Debugging Tips

**Check what's actually imported**

```bash
# Find all imports of a file
grep -r "from.*fileName" src/

# Find unused files (no imports)
grep -r "ComponentName" src/
```

**Find hub-specific code that should be centralized**

```bash
# Search for hardcoded hub references
grep -r "gnymble\|percytech\|percymd\|percytext" src/components/

# Should only find in hub-logic package
```

**Verify database connection**

```typescript
// In browser console on admin page
const { data, error } = await supabase.from("leads").select("*").limit(1);
console.log(data, error);
```

## 📞 Still Stuck?

1. Check git history: `git log --oneline -- path/to/file`
2. Search closed issues/PRs for similar problems
3. Review `/docs/agent_lessons.md` for common patterns
4. Check Supabase dashboard for database state
5. Review Vercel logs for production issues

## 🚨 Emergency Fixes

**Production is down**

```bash
# Rollback to last working commit
git revert HEAD
git push origin main
```

**Database corruption**

```bash
# Restore from Supabase backup
# Go to Supabase Dashboard → Settings → Backups
# Select restore point
```

**Edge Function failing**

```bash
# Redeploy functions
npx supabase functions deploy submit-contact
npx supabase functions deploy stripe-webhook
```
