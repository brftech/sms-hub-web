# Claude Context - SMS Hub Web

**Last Updated**: October 14, 2025 (Evening - Post Refactor)

This file provides AI coding agents with essential context for working on SMS Hub Web. Read this first before making changes.

## 🎯 Project Identity

**SMS Hub Web** is a production-ready multi-tenant marketing platform serving 4 business brands with isolated data and branded experiences. Currently live at gnymble.com.

**Key Facts**:

- Built with React 19, TypeScript, Vite, Tailwind CSS, Supabase
- Multi-tenant: 4 hubs (PercyTech, Gnymble, PercyMD, PercyText)
- Domain-based routing (hub detection from URL)
- Separate marketing database from customer app (sms-hub-app2)
- Production deployment on Vercel

## 🏗️ Architecture Principles

### 1. Hub Centralization

**ALL hub-specific content lives in `/packages/hub-logic/src/hubs/`**

```
/packages/hub-logic/src/hubs/
  /gnymble/          # Hub 1 (orange, retail)
    metadata.ts      # ID, name, domain, description
    colors.ts        # Hex values + Tailwind classes
    hero.ts          # Homepage hero content
    cta.ts           # Call-to-action content
    faq.ts           # FAQ page content
    about.ts         # About page content
    pricing.ts       # Pricing page content
    seo.ts           # SEO metadata + footer
    businessTypes.ts # Typing animation business types
    index.ts         # Re-exports all
  /percytech/        # Hub 0 (red, technology)
  /percymd/          # Hub 2 (red, healthcare)
  /percytext/        # Hub 3 (purple, messaging)
```

**Hub IDs** (sacred, do not change):

- PercyTech = 0
- Gnymble = 1
- PercyMD = 2
- PercyText = 3

### 2. Flat Structure > Deep Nesting

- Components are flat in `/src/components/`
- No `/home/shared/` or `/ui/` subfolders
- Only create folders when 5+ related files exist

### 3. Generic > Specific

- Don't create `GnymbleLayout.tsx` and `PercyMDLayout.tsx`
- Create `HomeLayout.tsx` with `variant` prop
- Use `useHub()` hook + helper functions like `getHubColors()`

### 4. Delete Dead Code

- If not imported anywhere (`grep -r "ComponentName"`), delete it
- Empty folders should be removed immediately
- Archive folders = delete them, use git history

## 🧭 Navigation Guide

### Finding Code

**Hub-specific content?**
→ `/packages/hub-logic/src/hubs/{hubType}/`

**UI components?**
→ `/src/components/` (flat structure)
→ OR `/packages/ui/src/components/` (shared across apps)

**Database queries?**
→ `/packages/supabase/src/queries.ts`

**Business logic?**
→ `/src/services/` (contactService, etc.)

**Type definitions?**
→ `/packages/hub-logic/src/types.ts` (hub types)
→ `/src/types/marketing-types.ts` (marketing types)

**Tests?**
→ `/test/unit/` - Unit tests (Vitest)
→ `/test/integration/` - Integration tests
→ `/test/e2e/` - E2E tests (Playwright)

### Common Tasks

**Adding new hub content:**

1. Edit `/packages/hub-logic/src/hubs/{hubType}/{section}.ts`
2. No other files need updating (auto-imported)

**Creating new page:**

1. Add to `/src/pages/NewPage.tsx`
2. Update route in `/src/App.tsx`
3. Add to `/src/utils/routes.ts` if reused

**Modifying component:**

1. Check if it's in `/src/components/` (app-specific)
2. OR `/packages/ui/src/` (shared with app2)
3. Update imports if moving files

**Database changes:**

1. Create migration in `/supabase/migrations/`
2. Test locally: `npx supabase db reset`
3. Push to prod: `npx supabase db push`

## 🔧 Development Workflow

### Always Do This

1. **Run commands from project root**: `cd /path/to/project && npm run command`
2. **Read before writing**: Always `read_file` before editing
3. **Test after changes**: `npm run type-check && npm test`
4. **Check imports after moving files**: `grep -r "old/path" src/`

### Never Do This

1. **Create deep folder hierarchies** (max 1 level of nesting)
2. **Put hub content in `/src/components/`** (goes in `/packages/hub-logic/src/hubs/`)
3. **Hardcode hub data** (use `useHub()` hook + helpers)
4. **Create one-off wrapper components** (inline the logic)
5. **Keep unused code** (delete it, git remembers)

## 🎨 Styling System

**Tailwind CSS** for all styling.

**Hub colors are centralized:**

```typescript
// packages/hub-logic/src/hubs/gnymble/colors.ts
export const gnymbleColors = {
  primary: "#ff6b35", // Hex values
  secondary: "#f7931e",
  tailwind: {
    // Tailwind classes
    text: "text-orange-500",
    bg: "bg-orange-500",
    // ... etc
  },
};
```

**In components:**

```typescript
import { useHub } from "@sms-hub/ui/marketing";
import { getHubColors } from "@sms-hub/hub-logic";

const MyComponent = () => {
  const { currentHub } = useHub();
  const colors = getHubColors(currentHub);

  return <div className={colors.tailwind.bg}>Content</div>;
};
```

## 🗄️ Database Strategy

**Marketing Database** (separate from app2):

- Dev: `hmumtnpnyxuplvqcmnfk.supabase.co`
- Prod: `fwlivygerbqzowbzxesw.supabase.co`

**Multi-tenant**: All tables have `hub_id` column for data isolation.

**Key Tables**:

- `leads` - Contact form submissions
- `lead_activities` - Interaction history
- `email_lists` / `sms_lists` - Marketing lists
- `email_subscribers` / `sms_subscribers` - Subscriptions

**Security**:

- Frontend uses **anon key only**
- Admin operations via **Edge Functions** (service role key server-side)
- RLS disabled in dev, enabled in production

## 🧪 Testing Philosophy

**What to test:**

- Business logic (helpers, services)
- Component behavior (not styling)
- Database queries
- Edge Functions

**What NOT to test:**

- Vite/framework behavior (`import.meta.env` mocking)
- External libraries
- Styling/CSS

**Test commands:**

```bash
npm test                 # Unit tests
npm run test:coverage    # With coverage
npm run test:e2e         # E2E tests (Playwright)
npm run type-check       # TypeScript
```

## 🚀 Deployment

**Automatic via Vercel** from `main` branch.

**Environment variables** (set in Vercel):

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_ACCESS_CODE`
- `VITE_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`

**Domains** (all point to same Vercel project):

- percytech.com → Hub 0
- gnymble.com → Hub 1
- percymd.com → Hub 2
- percytext.com → Hub 3

## 📝 Code Style

**TypeScript**: Strict mode, no `any` types.

**Naming**:

- Components: `PascalCase`
- Files: `camelCase.tsx` or `PascalCase.tsx` for components
- Markdown: `lowercase_snake_case.md`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

**Imports**:

```typescript
// Package imports (aliased)
import { useHub } from "@sms-hub/ui/marketing";
import { getHubColors } from "@sms-hub/hub-logic";

// Relative imports (local)
import { ContactForm } from "@/components/ContactForm";
```

## 🔍 Debugging Tips

**TypeScript errors:**

```bash
npm run type-check
```

**Find unused code:**

```bash
grep -r "ComponentName" src/
```

**Check imports:**

```bash
grep -r "from.*fileName" src/
```

**Database issues:**

```typescript
// In browser console
const { data, error } = await supabase.from("leads").select("*").limit(1);
console.log(data, error);
```

**Hub detection:**

```typescript
// Check current hub in browser console
console.log(window.location.hostname);
```

## 🎯 Quick Reference

**Hub hook:**

```typescript
const { currentHub, setHub } = useHub();
```

**Helper functions:**

```typescript
getHubMetadata(hubType); // Returns metadata object
getHubColors(hubType); // Returns colors object
getHubHeroContent(hubType); // Returns hero content
getHubSEO(hubType); // Returns SEO + footer
getHubBusinessTypes(hubType); // Returns business types array
```

**Supabase client:**

```typescript
import { getSupabaseClient } from "@/services/supabaseSingleton";
const supabase = getSupabaseClient();
```

## 📚 Additional Resources

- **[architecture.md](./architecture.md)** - Deep dive into system design
- **[deployment.md](./deployment.md)** - Production deployment guide
- **[troubleshooting.md](./troubleshooting.md)** - Common issues
- **[agent_lessons.md](./agent_lessons.md)** - 40 lessons from real development

## ⚡ Pro Tips for AI Agents

1. **Read `agent_lessons.md`** for 40 hard-won lessons
2. **Use grep liberally** to find code before asking
3. **Test incrementally** - don't make 10 changes then test
4. **Question every folder** - flat is better than nested
5. **Hub content ONLY in hub-logic** - no exceptions
6. **Delete > Comment out** - git remembers everything
7. **Inline tiny wrappers** - less abstraction is clearer
8. **Move files in small steps** - test after each move
9. **Check imports after moves** - TypeScript will tell you
10. **When user corrects you, they're right** - update your understanding immediately

---

**Remember**: This is a production app serving real customers. Write clean, tested, maintainable code. When in doubt, ask before making breaking changes.
