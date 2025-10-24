/**
 * Type definitions for client data
 */

export interface ClientColors {
  // Primary gradient colors
  primaryFrom: string;
  primaryTo: string;
  // Accent colors for icons and highlights
  accentLight: string;
  accentMedium: string;
  accentDark: string;
  // Background gradient
  bgFrom: string;
  bgVia: string;
  bgTo: string;
}

export interface ClientData {
  id: string;
  name: string;
  description: string;
  logo: string;
  icon: React.ReactNode;
  phoneNumber: string;
  address: string;
  hours: string;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  benefits: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  ctaText: string;
  ctaButtonText: string;
  privacyLink: string;
  termsLink: string;
  clientWebsite?: string;
  // Privacy and Terms specific data
  businessType: string;
  industryContext: string;
  shortCode: string;
  // Optional custom colors (defaults to blue/purple if not provided)
  colors?: ClientColors;
}
