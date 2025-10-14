# Agent Lessons - Best Practices from Real Development

**Last Updated**: October 14, 2025

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

### 6. **Use snake_case for .md files**

- ✅ `readme.md`, `agent_lessons.md`, `troubleshooting.md`
- ❌ `README.MD`, `Agent-Lessons.md`, `Troubleshooting.MD`
- Consistent, lowercase, readable

### 7. **Centralize hub-specific content**

- ALL hub content goes in `/packages/hub-logic/src/hubs/`
- Each hub gets its own folder with small, focused files
- No hub-specific code in `/src/components/`

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

### 34. **5 docs maximum**

- More docs = outdated docs
- Better: comprehensive docs that stay updated
- Delete/merge aggressively

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

---

These lessons were learned through real development, refactoring, and debugging. They represent hours of work distilled into principles that prevent future problems.
