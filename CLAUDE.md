# Claude Code Agent Instructions - SMS Hub Monorepo

## Quick Start for New Claude Agents

You are working on a multi-tenant B2B SMS SaaS platform built as a Turbo monorepo. Here's what you need to know:

### Project Structure
- **Monorepo**: Uses Turbo + pnpm workspaces
- **Apps**: web (marketing), user (auth/dashboard), admin, demo, docs, texting (Nest.js API)
- **Packages**: ui, types, config, supabase, utils, hub-logic, sms-auth
- **Database**: Supabase (PostgreSQL) with Edge Functions

### Critical Context
1. **Multi-tenancy**: 4 hubs (PercyTech, Gnymble, PercyMD, PercyText) - ALWAYS include hub_id
2. **Styling**: Use styled-components ONLY - no CSS file imports
3. **Auth**: SMS OTP via Supabase Auth, components in @sms-hub/sms-auth package
4. **Types**: Import from @sms-hub/types, not local definitions
5. **Environment**: Vite apps use import.meta.env, not process.env

### Current State
- Web app: Vite-based marketing site with lead capture (port 3000)
- User app: Authentication and dashboard (port 3001)
- Database: Live on Supabase with migrations applied
- Edge Functions: Deployed (submit-contact, send-sms-verification, verify-sms, chat-webhook)
- SMS Auth: Extracted to separate package for reusability

### Common Tasks

#### Running the Project
```bash
pnpm install          # Install all dependencies
pnpm dev             # Start all apps
pnpm dev --filter=@sms-hub/web  # Start specific app
```

#### Making Changes
1. **Adding Components**: Create in packages/ui using styled-components
2. **Database Changes**: Add migration in supabase/migrations
3. **New Features**: Consider hub-specific requirements
4. **API Endpoints**: Add to apps/texting (Nest.js)

#### Debugging Issues
- **"process not defined"**: Use import.meta.env for Vite apps
- **"hub_id constraint"**: Ensure hub_id is passed in all database operations
- **CSS import errors**: Convert to styled-components
- **Type errors**: Generate types with `npm run db:types`

### Key Files to Review
1. `/PROJECT_SUMMARY.md` - Comprehensive project documentation
2. `/packages/types/src/database.types.ts` - Database schema types
3. `/packages/hub-logic/src/index.ts` - Hub configuration
4. `/.env.local` - Environment variables (create from .env.example)

### Hub IDs Reference
- PercyTech: 1
- Gnymble: 2
- PercyMD: 3
- PercyText: 4

### Testing Credentials
- Supabase URL: https://vgpovgpwqkjnpnrjelyg.supabase.co
- Check .env.local for keys

### Important Patterns
```typescript
// Always pass hub_id
await contactService.submitContact(formData, hubConfig.id);

// Use factory for Supabase client in Vite apps
import { createSupabaseClient } from '@sms-hub/supabase';
const supabase = createSupabaseClient(url, key);

// Import shared types
import { Database, HubType } from '@sms-hub/types';

// Use styled-components
import styled from 'styled-components';
const Button = styled.button`
  background: var(--hub-primary);
`;
```

### Recent Architecture Decisions
1. Migrated from Next.js to Vite for web app
2. Extracted SMS auth to dedicated package
3. Moved auth flows from web to user app
4. Implemented CSS-in-JS to fix build issues
5. Deployed Edge Functions for serverless operations

### What NOT to Do
- Don't create new CSS files
- Don't use process.env in browser code
- Don't forget hub_id in database operations
- Don't import types locally if they exist in packages
- Don't put auth logic in the web app

### Getting Help
- Check PROJECT_SUMMARY.md for detailed information
- Database schema is in packages/types/src/database.types.ts
- Edge Functions are in /supabase/functions/
- Component examples in packages/ui/src/

Remember: This is a production-ready B2B SaaS platform. Always consider multi-tenancy, type safety, and maintainability in your implementations.