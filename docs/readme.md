# SMS Hub Web - Marketing Platform

**Last Updated**: October 14, 2025 (Evening - Post Refactor)  
**Status**: ✅ Production Ready - Live at gnymble.com

## 🎯 What This Is

SMS Hub Web is a multi-tenant marketing website and sales dashboard for SMS Hub B2B platform. It serves 4 business brands with isolated data and branded experiences.

**Hubs**:

- **PercyTech** (percytech.com) - Technology businesses
- **Gnymble** (gnymble.com) - Retail & general businesses (default)
- **PercyMD** (percymd.com) - Healthcare providers
- **PercyText** (percytext.com) - Messaging-focused businesses

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Run tests
npm test

# Type check
npm run type-check

# Build for production
npm run build
```

**Access Points**:

- Marketing site: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## 📁 Project Structure

```
/docs/                    # Documentation (you are here)
/src/                     # Main React application
  /components/            # Shared components (flat structure)
  /pages/                 # Route components
  /services/              # API services
  /config/                # Environment configuration
/packages/                # Internal packages
  /hub-logic/             # Hub configs & content
    /src/hubs/            # Hub-specific folders
  /ui/                    # Shared UI components
  /supabase/              # Database client
  /utils/                 # Shared utilities
/supabase/                # Backend (migrations, Edge Functions)
/test/                    # All tests (unit, integration, e2e)
```

## 🔑 Key Features

- **Multi-tenant architecture** - Complete data isolation by hub
- **Domain-based routing** - Automatic hub detection from domain
- **Hub-aware content** - Dynamic content, colors, SEO per hub
- **Admin dashboard** - Lead management with bulk operations
- **Contact form** - With Cloudflare Turnstile spam protection
- **Email & SMS lists** - Marketing list management
- **Type-safe** - Full TypeScript coverage
- **Tested** - Unit, integration, and E2E tests

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Deployment**: Vercel
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Email**: Resend API
- **Spam Protection**: Cloudflare Turnstile

## 📚 Documentation

- **[architecture.md](./architecture.md)** - System design, folder structure, database
- **[deployment.md](./deployment.md)** - Production deployment guide
- **[troubleshooting.md](./troubleshooting.md)** - Common issues & solutions
- **[claude.md](./claude.md)** - AI agent context & coding guidelines
- **[agent_lessons.md](./agent_lessons.md)** - Best practices from development

## 🌐 Environment Variables

Required for development and production:

```bash
# Supabase (Marketing Database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Admin Dashboard
VITE_ADMIN_ACCESS_CODE=your_access_code

# Spam Protection (Cloudflare Turnstile)
VITE_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# Email (Resend)
RESEND_API_KEY=your_api_key
```

## 🧪 Testing

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests (requires dev server running)
npm run test:e2e

# Type checking
npm run type-check
```

## 📦 Package Management

This repo uses local packages via `file:` dependencies:

- `@sms-hub/clients` - Client data and marketing page assets
- `@sms-hub/hub-logic` - Hub configurations and content
- `@sms-hub/ui` - Shared UI components
- `@sms-hub/supabase` - Database client and queries
- `@sms-hub/utils` - Shared utilities (nameUtils, validation, etc.)

Changes to packages are immediately reflected (symlinked).

## 🔐 Security

- Frontend uses **anon key only**
- Admin operations via **Edge Functions** (service role key server-side)
- All data filtered by `hub_id`
- Cloudflare Turnstile spam protection
- Environment-based feature flags

## 🚀 Deployment

Automatic deployment via Vercel from `main` branch:

```bash
# Push to main
git push origin main

# Vercel auto-deploys to all 4 domains
```

See [deployment.md](./deployment.md) for full guide.

## 📈 Recent Updates

**October 14, 2025** (Latest):

- ✅ **Reusable Form Component Library** - Schema-driven FormBuilder with validation, accessibility, hub-aware rules
- ✅ **Performance Monitoring Dashboard** - Real-time Core Web Vitals, API stats, component render tracking (dev only at `/admin/performance`)
- ✅ **Enhanced Error Boundaries** - Granular isolation levels, recovery actions, hub-aware error messages
- ✅ **Contact Form Migration** - Simplified from 530+ to 250 lines using FormBuilder
- ✅ **Admin Dashboard Navigation** - Added Performance button (dev only)
- ✅ **Fixed Admin Access** - Dev environment now works without passcode (production requires passcode)

**October 14, 2025** (Earlier):

- ✅ Hub-centric content architecture (all hub content in `/packages/hub-logic/src/hubs/`)
- ✅ Flattened component structure (removed unnecessary nesting)
- ✅ Consolidated small folders (`/lib/`, `/styles/`, `/src/test/` merged)
- ✅ Deleted dead code (unused components, empty folders)
- ✅ Documentation streamlined to 5 essential docs + agent lessons
- ✅ Added 40 agent lessons from real development

## 🤝 Contributing

1. Make changes in feature branch
2. Run tests: `npm test && npm run type-check`
3. Update relevant docs if architecture changes
4. Create PR to `main`

## 📞 Support

- Check [troubleshooting.md](./troubleshooting.md) first
- Review [agent_lessons.md](./agent_lessons.md) for patterns
- Check git history for similar issues
- Review Supabase dashboard for database state
- Check Vercel logs for production issues
