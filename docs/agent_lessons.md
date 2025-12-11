# Agent Lessons - Best Practices from Real Development

**Last Updated**: December 11, 2025 (Documentation Structure Update)

This document contains hard-won lessons from real development work. These principles apply to this repo AND future projects.

---

## 🎯 General Principles

### 1. **Always run commands from the project root**

- Never assume you're in a subdirectory
- Always `cd` to root first: `cd /path/to/project && npm run command`
- Shell state persists between commands in the same session

### 2. **Read before you write**

- Always read a file before editing it to understand its current state
- Files may have changed since your last interaction
- Use `read_file` liberally - it's cheap and prevents errors

### 3. **Test after every change**

- Run `npm run type-check` after TypeScript changes
- Run `npm test` for functionality changes
- Small, incremental testing catches issues early

### 4. **Delete is as important as create**

- Dead code is worse than no code
- Unused components, folders, and files should be removed
- If it's not imported anywhere, delete it

### 5. **Flat is better than nested**

- Avoid deep folder hierarchies
- `/src/components/home/shared/` is worse than `/src/components/`
- Only create folders when there are 5+ related files

---

## 📁 File & Folder Organization

### 6. **Use appropriate casing for .md files**

- Root documentation: `README.md`, `CLAUDE.md` (uppercase, standard convention)
- Docs folder: `agent_lessons.md`, `troubleshooting.md` (lowercase, snake_case)
- Consistent naming helps with discoverability

### 7. **Centralize hub-specific content**

- ALL hub content goes in `/packages/hub-logic/src/hubs/`
- Each hub gets its own folder with small, focused files
- No hub-specific code in `/src/components/`
- Includes: colors, content, demo messages, SEO, etc.

### 8. **One file per folder is a red flag**

- `/src/lib/` with only `supabaseSingleton.ts` → move to `/src/services/`
- `/src/styles/` with only `accessibility.css` → merge into parent
- Empty folders should be deleted immediately

### 9. **Archive folders are death traps**

- If you don't look at it, you don't need it
- Archive = "too scared to delete"
- Delete archives, use git history if needed

### 10. **Imports reveal the truth**

- `grep` for imports to find if code is actually used
- No imports = dead code = delete it
- Update all imports after moving files

---

## 🏗️ Architecture Patterns

### 11. **Hub IDs are sacred**

- PercyTech = 0, Gnymble = 1, PercyMD = 2, PercyText = 3
- These are in the database schema and metadata
- Always check metadata files for the source of truth

### 12. **Consolidate duplicate setup files**

- `/src/test/setup.ts` AND `/test/setup.ts` = bad
- One setup file per test runner, at root level
- Check `vitest.config.ts` for which file is actually used

### 13. **Generic > Specific for layouts**

- Don't create `GnymbleLayout.tsx` and `PercyMDLayout.tsx`
- Create `HomeLayout.tsx` with `variant` prop
- Use props to handle differences, not separate files

### 14. **Keep pages thin, components thick**

- Pages should just assemble components
- Logic belongs in hooks, services, or utility functions
- Pages are routes, not business logic containers

### 15. **Helper functions > Switch statements in components**

- Don't put switch statements in components
- Create `getHubColors()`, `getHubSEO()` helpers
- Components call helpers, helpers contain logic

---

## 🔧 TypeScript & Types

### 16. **Check types after moving files**

- Moving a file breaks imports everywhere
- Always run `npm run type-check` after moves
- Use grep to find all files that import the moved file

### 17. **Centralize type definitions**

- Marketing types → `/src/types/marketing-types.ts`
- Shared types → `/packages/*/src/types.ts`
- Don't scatter interfaces across random files

### 18. **Export types where they're defined**

- If you define `HubColors` interface, export it
- Export types alongside the implementation
- Re-export from `index.ts` for convenience

---

## 🎨 Styling & CSS

### 19. **Merge small CSS files**

- `/src/styles/accessibility.css` (63 lines) → merge into `index.css`
- One-off CSS files should be inline
- Only separate CSS when it's reused in multiple places

### 20. **Hub colors in one place**

- All color config → `/packages/hub-logic/src/hubs/*/colors.ts`
- Includes hex values AND Tailwind class mappings
- Single source of truth for colors

---

## 🧪 Testing

### 21. **Don't test Vite's behavior**

- Tests that try to mock `import.meta.env` will fail
- Vite sets these at build time, they're immutable
- Test your logic, not the framework

### 22. **Vitest setup at project root**

- Setup file: `/test/setup.ts` (not `/src/test/`)
- Test files can be anywhere: `/test/unit/`, `/test/integration/`
- E2E tests separate: `/test/e2e/`

---

## 🚀 Deployment & Environment

### 23. **Feature flags for production**

- Use `import.meta.env.DEV` for dev-only features
- Production-ready but not production-enabled
- Easy to flip without code changes

### 24. **Environment detection is complex**

- Check Vite mode first: `import.meta.env.PROD`
- Fallback to hostname detection
- Document the precedence order

---

## 🔄 Refactoring

### 25. **Inline tiny wrappers**

- 13-line `HubSelector` that just wraps `HomeLayout`? Inline it
- Wrappers should add value, not indirection
- Less abstraction is often clearer

### 26. **Move in small steps**

- Move one folder at a time
- Test after each move
- Commit working states (even if not perfect)

### 27. **Question every folder**

- "Why is this in a separate folder?"
- "What would break if I flattened this?"
- "Does the structure match how we actually use it?"

---

## 📦 Package Management

### 28. **Local packages need preserveSymlinks**

- `preserveSymlinks: true` in `vite.config.ts`
- Required for `file:` dependencies
- Prevents resolution issues

### 29. **Package exports matter**

- Export from `/index.ts` for public API
- Don't require deep imports: `@pkg/src/utils/helper`
- Good: `@pkg/helper`, Bad: `@pkg/src/utils/helper`

---

## 🐛 Debugging

### 30. **Grep is your friend**

- Finding unused code: `grep -r "ComponentName"`
- Finding imports: `grep "from.*fileName"`
- Finding all occurrences: `grep -r "pattern" path/`

### 31. **404s in dev = missing files**

- Dev server looks for old paths after refactoring
- Restart dev server after moving files
- Check browser console for 404s

---

## 💡 Communication

### 32. **When users say "it's not working," read the code**

- Don't guess, read the actual file
- Check what's actually happening vs. what's expected
- Code is the source of truth

### 33. **If user corrects you, they're right**

- "That's wrong" → accept it immediately
- Check the source they're referencing
- Update your understanding, apologize, fix it

---

## 📝 Documentation

### 34. **Root docs + focused /docs folder**

- Root: `README.md` (project overview), `CLAUDE.md` (AI agent context)
- `/docs/`: Focused technical docs (architecture, deployment, troubleshooting, lessons)
- Keep docs focused and actionable
- Delete/merge aggressively to prevent outdated information

### 35. **Docs should be actionable**

- "How to deploy" not "Deployment considerations"
- Commands that work, not conceptual explanations
- Copy-paste ready

---

## 🎯 Decision Making

### 36. **Always explain the "why"**

- Not just "I'm moving this file"
- But "This file only has one user, so it should be closer to it"
- Helps users understand and agree

### 37. **Ask before deleting user-created files**

- Generated files? Delete freely
- User-written code? Confirm first
- When in doubt, ask

### 38. **Propose options when unclear**

- "We could do A, B, or C. I recommend A because..."
- Give the user agency
- Explain trade-offs

---

## 🔒 Memory

### 39. **This naming convention applies everywhere**

- All .md files: lowercase, snake_case
- This is the standard for this developer
- Apply to all future work

### 40. **Hub centralization pattern is proven**

- Content in `/packages/hub-logic/src/hubs/`
- Each hub in its own folder
- Small files (colors, seo, metadata, content)
- This pattern works, reuse it

### 41. **Consolidate hub-specific CSS into one file**

- ❌ Separate `gnymble.css`, `percytech.css`, `percymd.css`, `percytext.css` = duplication errors
- ✅ All hub styles in `shared-design-system.css` with `[data-hub="..."]` selectors
- Prevents color mismatches (like PercyMD showing red instead of blue)
- Single source of truth prevents copy-paste errors

### 42. **CSS variables should match hub colors.ts**

- Duplicate color definitions lead to bugs
- When `--primary` doesn't match `hubColors.primary`, things break
- Always validate CSS against the source of truth in `/hubs/[hub]/colors.ts`
- Use `getHubColors()` to ensure consistency

### 43. **Vite cache issues require dev server restart**

- Clearing `node_modules/.vite` fixes module resolution errors
- But dev server must be restarted to pick up the cleared cache
- Just `rm -rf node_modules/.vite` isn't enough - you need to restart
- Watch for "does not provide an export named..." errors

### 44. **Make floating UI elements context-aware**

- Admin button should show Home icon when on admin page
- Icons should reflect current state and destination
- Use `useLocation()` to determine current page
- Dynamic icons improve UX and reduce cognitive load

### 45. **Hub switcher should be globally accessible**

- Don't limit hub switcher to homepage only
- Render in `AppFloatingComponents` for global availability
- Users should be able to switch hubs from any page
- Maintain current page when switching hubs (don't redirect to home)

### 46. **localStorage should not override domain-based hub detection in production**

- In production, domain-based hub detection is the source of truth
- localStorage override should only work in dev/preview (for hub switcher testing)
- Check hostname to determine if on production domain vs preview
- Before: percytech.com → checks localStorage → shows Gnymble ❌
- After: percytech.com → ignores localStorage → shows PercyTech ✅

### 47. **Dynamic favicon and PWA manifest switching**

- Favicons and manifests should be hub-specific, not hardcoded
- Use `DOMAdapter` pattern to abstract DOM operations for testability
- Create hub-specific manifest files: `manifest-{hubname}.json`
- HubContext should update both favicon and manifest on hub change
- Each production domain gets proper branding in browser tabs and "Add to Home Screen"

### 48. **SVG transforms can break icon consistency**

- Inline CSS transforms like `style="transform: scaleX(-1);"` flip icons
- All hub icons should face the same direction for visual consistency
- Generate hub icons from a single template, changing colors only
- Avoid CSS transforms in icon SVGs - use proper SVG transformations if needed
- Check the actual SVG source code, not just visual appearance

### 49. **Preview/staging URLs need explicit detection**

- Vercel preview URLs use pattern: `{project}-{hash}.vercel.app`
- `import.meta.env.MODE` is "production" in Vercel builds (even previews!)
- Check hostname for `.vercel.app` to detect preview environments
- Floating UI elements (hub switcher, admin button) should show on preview
- Preview environment should use dev database, not production

### 50. **PWA manifests are environment-specific**

- Each hub needs its own manifest with hub-specific branding
- Generic `manifest.json` causes confusion - delete it
- Use hub-specific manifests: `manifest-percytech.json`, `manifest-gnymble.json`, etc.
- Each manifest should include: name, short_name, theme_color, icons
- Theme colors in manifests should match hub brand colors exactly

### 51. **External links should be hub-aware**

- Login/signup buttons should redirect to hub-specific external apps
- Use `detectHubFromHostname()` to determine current hub
- Use `getHubDomain()` from hub-logic for proper domain names
- Handle special cases (e.g., PercyText uses `app2` subdomain instead of `app`)
- Create helper functions like `getLoginUrl()` for reusability
- Example: percytech.com → app.percytech.com, percytext.com → app2.percytext.com

### 52. **NEVER use dynamic Tailwind class construction**

- ❌ `className={\`text-${hubMetadata.color}-500\`}` - Tailwind JIT CANNOT compile this
- ❌ `className={\`bg-${hubColors.primary}\`}` - Will not work, even with safelist
- ❌ Any template literal with Tailwind class names - Always fails
- ✅ `className={hubColors.tailwind.text}` - Pre-defined classes from hub-logic
- ✅ `style={{ color: hubColors.primary }}` - Inline styles for dynamic values
- ✅ `style={{ backgroundColor: \`${hubColors.primary}0D\` }}` - Inline with opacity
- All hub-specific colors are in `tailwind.config.ts` safelist, but only for static usage
- If you need dynamic values, use inline styles, not dynamic class names

### 53. **Hub-specific demo messages**

- Interactive components should show hub-appropriate content
- Don't hardcode Gnymble examples in shared components
- Create `demoMessages.ts` for each hub in `hub-logic`
- Use `getHubDemoMessages(currentHub)` to fetch hub-specific scenarios
- Demo content should reflect each hub's vertical (healthcare, retail, fitness, etc.)

### 54. **Vite config aliases are CRITICAL for local packages**

- Missing `@sms-hub/clients` or `@sms-hub/utils` aliases in `vite.config.ts` causes stale cache issues
- Symptoms: Changes to package files don't reflect in app, even after dev server restart
- Without proper alias, Vite may cache old data from `node_modules` or other locations
- **Always verify ALL local packages have aliases** in `vite.config.ts` `resolve.alias`
- Also add to `optimizeDeps.include` array for proper pre-bundling
- Example: Added missing aliases, cleared cache, restarted server → changes finally appeared

### 55. **Bundle optimization through lazy loading and chunk splitting**

- **Lazy loading**: Use `React.lazy()` for pages not needed on initial load (auth pages, admin, etc.)
- **Manual chunk splitting**: Group vendor code in `vite.config.ts` `manualChunks`
- Split by vendor: `react-vendor`, `supabase-vendor`, `ui-framework`, `icons`
- Each vendor chunk caches independently - updates to app don't invalidate React cache
- Wrap lazy components in `<Suspense>` with fallback loader
- Result: 66% bundle size reduction (1.1MB → 377KB), 66% faster initial load
- Don't over-split - too many chunks hurts HTTP/2 performance

### 56. **Client marketing page pattern**

- Client data centralized in `/packages/clients/src/{clientId}/`
- Each client folder: `index.tsx` (data + config), `logo.png` (branding)
- Register client in `/packages/clients/src/index.ts` (import, add to object, export)
- URL automatically becomes `/clients/{clientId}`
- Privacy/Terms pages automatically work via templates
- Easy to replicate: copy folder, update data, register in index
- All client data in one place - contact info, hours, features, benefits, SMS number, colors

---

These lessons were learned through real development, refactoring, and debugging. They represent hours of work distilled into principles that prevent future problems.
