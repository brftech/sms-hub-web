# SMS Hub Documentation

This directory contains comprehensive documentation for the SMS Hub monorepo project.

## 📚 Documentation Index

### Core Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview, tech stack, and database schema
- **[ARCHITECTURE_STATUS.md](./ARCHITECTURE_STATUS.md)** - Current architecture state and consolidation status
- **[AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)** - Security architecture and authentication flows

### Reference Documents

- **[PORT_ASSIGNMENTS.md](./PORT_ASSIGNMENTS.md)** - Port assignments for all applications
- **[CIGAR_LANDING_PAGE.md](./CIGAR_LANDING_PAGE.md)** - Landing page implementation details

### Historical Documents

- **[2025-01-authentication-fixes.md](./2025-01-authentication-fixes.md)** - Authentication system fixes and updates
- **[2025-01-layout-comparison.md](./2025-01-layout-comparison.md)** - Comparison of legacy vs unified app layouts

## 🚀 Quick Start

1. Start with [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for an overview
2. Review [ARCHITECTURE_STATUS.md](./ARCHITECTURE_STATUS.md) for current state
3. Check [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) for security guidelines

## 🔐 Key Security Notes

- Frontend apps use ONLY the anon key
- Service role key is restricted to Edge Functions and backend API
- All admin operations must go through Edge Functions
- RLS is currently disabled - manual hub_id filtering required

## 📝 Documentation Standards

- Use Markdown for all documentation
- Include diagrams where helpful (Mermaid supported)
- Keep documents up-to-date with code changes
- Date historical documents for context

## 🔄 Recent Updates (2025-09-11)

- Added AUTHENTICATION_ARCHITECTURE.md for security guidelines
- Updated all documents to reflect current architecture
- Clarified frontend/backend security separation
- Updated superadmin credentials to use @gnymble.com