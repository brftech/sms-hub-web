# SMS Hub Web - Documentation

## 📚 Documentation Overview

This folder contains comprehensive documentation for the SMS Hub Web application - a standalone React application that provides SMS messaging services with multi-hub support.

## 📋 Documentation Structure

### Core Documentation

#### 🎯 [CLAUDE.md](./CLAUDE.md)

**Start here** - Complete development guide with project architecture and current status.

- Project summary and technology stack
- Multi-hub system configuration
- Authentication and security features
- Database schema overview
- Development workflow
- Testing strategy (unit + E2E)
- AI code agent instructions

#### 🚀 [QUICK_START.md](./QUICK_START.md)

Quick start guide for developers getting started with the project.

- Prerequisites and setup
- Key concepts and hub system
- Common tasks and commands
- Troubleshooting guide
- Development rules and best practices

### Technical Documentation

#### 🌐 [PORT_ASSIGNMENTS.md](./PORT_ASSIGNMENTS.md)

Port configuration and assignment strategy for the application.

- Current port assignments
- Production and development architecture
- Port management and troubleshooting
- Recent changes and consolidation

#### 🚀 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

Complete deployment guide for Vercel platform.

- Architecture overview
- Deployment commands and setup
- Vercel configuration
- Domain configuration
- Environment variables
- Common issues and solutions

#### 📊 [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md)

Comprehensive guide for the admin dashboard functionality.

- Features and capabilities
- Access methods and authentication
- CRUD operations for leads
- Security considerations
- Troubleshooting guide

#### 🔐 [ENVIRONMENT_VARIABLES_CHECKLIST.md](./ENVIRONMENT_VARIABLES_CHECKLIST.md)

Checklist for required environment variables.

- Required variables for Edge Functions
- Local development setup
- Production configuration

## 🎯 Quick Navigation

### For New Developers

1. Start with [CLAUDE.md](./CLAUDE.md) for complete overview
2. Follow [QUICK_START.md](./QUICK_START.md) for setup
3. Review [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) for admin features

### For Deployment

1. Review [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
2. Check [ENVIRONMENT_VARIABLES_CHECKLIST.md](./ENVIRONMENT_VARIABLES_CHECKLIST.md)
3. Verify environment variables are properly configured

### For Understanding Admin Functionality

1. Review [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) for admin features
2. Check [CLAUDE.md](./CLAUDE.md) for complete development overview

## 🔄 Recent Updates

### Documentation Optimization (Current)

- **Consolidated**: Removed outdated monorepo documentation
- **Updated**: All files reflect current standalone app structure
- **Streamlined**: Eliminated redundant and conflicting information
- **Modernized**: Updated to reflect current technology stack and deployment
- **Enhanced**: Added comprehensive testing and code quality documentation

### Migration Context

The project has been successfully migrated from a Turbo monorepo structure to a standalone React application. All documentation has been updated to reflect this change:

- **Before**: Multiple apps (web, unified, admin, user) with complex workspace configuration
- **After**: Single standalone React app with consolidated functionality
- **Benefits**: Simplified deployment, easier maintenance, focused development

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + styled-components
- **Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Authentication**: Magic link authentication
- **State Management**: React Query (TanStack Query)
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Deployment**: Vercel

## 🌐 Multi-Hub System

The application supports multiple business hubs:

- **PercyTech**: Hub ID 0
- **Gnymble**: Hub ID 1 (default)
- **PercyMD**: Hub ID 2
- **PercyText**: Hub ID 3

Each hub has distinct branding, theming, and isolated data.

## 🔐 Authentication & Login

- **Development**: Login button redirects to `localhost:3001/login`
- **Production**: Login button redirects to `app.gnymble.com`
- **Admin Access**: Available at `/admin` route with password protection

## 📊 Database Schema

The application uses a marketing-focused database schema with 15 tables:

- **Core Tables**: `hubs`, `leads`, `email_subscribers`, `sms_subscribers`
- **Campaigns**: `email_campaigns`, `sms_campaigns`, `marketing_campaigns`
- **Analytics**: `website_analytics`, `conversions`, `lead_activities`
- **User Management**: `user_profiles`, `verifications`, `verification_attempts`
- **Forms**: `contact_form_submissions`

## 🧪 Testing Strategy

- **Unit Tests**: Vitest with Testing Library
- **E2E Tests**: Playwright for browser automation
- **Integration Tests**: Cross-hub functionality testing
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 📞 Support

If you encounter issues or need clarification:

1. Check the relevant documentation file first
2. Review the troubleshooting sections
3. Verify environment variables and configuration
4. Check Edge Functions logs for backend issues

## 🎯 Status

**Current Status**: ✅ **PRODUCTION READY** - Standalone application successfully deployed and operational.

The SMS Hub Web application is a focused, maintainable React application with comprehensive documentation to support continued development and scaling.