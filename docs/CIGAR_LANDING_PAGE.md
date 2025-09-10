# Cigar Landing Page

## Overview

A new landing page specifically designed for the cigar industry has been created at `apps/web/src/pages/CigarLanding.tsx`. This page features:

- **Industry-specific messaging** tailored for premium cigar retailers and tobacco companies
- **PCA (Premium Cigar Association) branding** with partnership badge
- **Compliance-focused content** highlighting TCR registration and tobacco industry expertise
- **Cigar-themed phone demo** showing realistic SMS conversations for cigar businesses
- **Orange/black gradient design** matching the brand aesthetic from the provided image

## Access Methods

### 1. Subdomain Access (Primary)
- **URL**: `cigar.gnymble.com`
- **Behavior**: Automatically displays the cigar landing page regardless of the path

### 2. Direct Route Access
- **URL**: `gnymble.com/cigar` (or any domain + `/cigar`)
- **Behavior**: Shows the cigar landing page via standard routing

## Content Features

### Hero Section
- Gnymble logo
- "Compliant SMS Cigar Texting" headline
- "We do it well. Others don't do it all." tagline
- Interactive phone demo with cigar industry messages
- Call-to-action: "Text 'PCA' to 757-XXX-XXXX"

### Customer Testimonial
- Quote from Anstead's Tobacco Company about record turnout
- Positioned prominently to build credibility

### Features Section
- **TCR Compliant**: Full 10DLC registration for tobacco messaging
- **Premium Support**: Dedicated account management
- **Industry Expertise**: Specialization in regulated industries

### Contact Form
- Pre-filled with cigar industry context
- Form submissions are tagged as "CIGAR INDUSTRY INQUIRY"

## Technical Implementation

### Current Architecture Integration
- Integrated with unified SMS Hub architecture
- Uses shared UI components from `packages/ui`
- Leverages styled-components (CSS-in-JS) - no CSS file imports
- Consistent with web app authentication gateway pattern

### Reusable Components
- Uses `StaticPhoneDemo` component from `packages/ui/src/components/StaticPhoneDemo.tsx`
- Shared across landing pages for consistency and reusability
- Supports customizable messages and time display

### Routing Logic
- Subdomain detection implemented in `apps/web/src/App.tsx`
- Checks for `cigar.` subdomain or `cigar.gnymble.com` hostname
- Route: `/cigar` available on any domain
- Falls back to standard routing for other domains

### Assets
- Uses `cigar.png` asset from UI package
- Maintains consistency with shared design system
- Styled with styled-components following project standards

## Development Testing

To test locally:

1. **Direct route**: Navigate to `localhost:3000/cigar`
2. **Subdomain simulation**: Modify your hosts file to point `cigar.localhost` to `127.0.0.1`

## Deployment Notes

- Page is built and ready for production deployment
- Subdomain routing will work automatically with proper DNS configuration
- Form submissions integrate with existing contact service infrastructure
- SEO optimized with relevant keywords for cigar industry

## Architecture Compliance

This implementation follows current SMS Hub project standards:
- ✅ Uses styled-components (CSS-in-JS) - no CSS file imports
- ✅ Reusable components extracted to shared `packages/ui`
- ✅ Phone numbers include +1 country code format
- ✅ Integrates with unified authentication architecture
- ✅ Leverages shared Supabase backend
- ✅ Consistent with monorepo structure and conventions
