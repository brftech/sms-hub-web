# SMS Hub Web - Documentation

## 📚 Documentation Overview

This folder contains comprehensive documentation for the SMS Hub Web application - a standalone React application that provides SMS messaging services with multi-hub support.

## 📋 Documentation Structure

### Core Documentation

#### 🎯 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
**Start here** - High-level overview of the project architecture, features, and current status.
- Project summary and technology stack
- Multi-hub system configuration
- Authentication and security features
- Database schema overview
- Development workflow
- Migration notes from monorepo to standalone

#### 📖 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
Comprehensive project documentation covering all aspects of the application.
- Detailed architecture explanation
- Core features and functionality
- User journey and authentication flow
- Database schema relationships
- Edge functions documentation
- Recent achievements and status

#### 🚀 [QUICK_START.md](./QUICK_START.md)
Quick start guide for developers getting started with the project.
- Prerequisites and setup
- Key concepts and hub system
- Common tasks and commands
- Troubleshooting guide
- Development rules and best practices

### Technical Documentation

#### 🔧 [CLAUDE.md](./CLAUDE.md)
Detailed instructions for Claude AI code agents working on this project.
- Project architecture and structure
- Current application flow
- Critical implementation details
- Development workflow
- Security guidelines
- Common issues and solutions

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

### Migration Context
The project has been successfully migrated from a Turbo monorepo structure to a standalone React application. All documentation has been updated to reflect this change:

- **Before**: Multiple apps (web, unified, admin, user) with complex workspace configuration
- **After**: Single standalone React app with consolidated functionality
- **Benefits**: Simplified deployment, easier maintenance, focused development

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: styled-components (CSS-in-JS)
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Authentication**: Magic link authentication
- **State Management**: React Query (TanStack Query)
- **Deployment**: Vercel

## 🌐 Multi-Hub System

The application supports multiple business hubs:
- **PercyTech**: Hub ID 0
- **Gnymble**: Hub ID 1 (default)
- **PercyMD**: Hub ID 2
- **PercyText**: Hub ID 3

Each hub has distinct branding, theming, and isolated data.

## 📞 Support

If you encounter issues or need clarification:

1. Check the relevant documentation file first
2. Review the troubleshooting sections
3. Verify environment variables and configuration
4. Check Edge Functions logs for backend issues

## 🎯 Status

**Current Status**: ✅ **PRODUCTION READY** - Standalone application successfully deployed and operational.

The SMS Hub Web application is a focused, maintainable React application with comprehensive documentation to support continued development and scaling.
