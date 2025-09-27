// Client type definitions for the Web app
export interface Client {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientConfig {
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    textLogo: string;
    iconLogo: string;
  };
  messaging: {
    tone: "professional" | "casual" | "friendly";
    greeting: string;
    signature: string;
  };
  features: {
    smsEnabled: boolean;
    emailEnabled: boolean;
    phoneEnabled: boolean;
    webEnabled: boolean;
  };
}

export interface ClientAsset {
  id: string;
  clientId: string;
  type: "logo" | "icon" | "image" | "document" | "other";
  filename: string;
  path: string;
  alt?: string;
  description?: string;
  size?: number;
  mimeType?: string;
  createdAt: Date;
}

export interface ClientBranding {
  clientId: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  fonts: {
    heading?: string;
    body?: string;
    mono?: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}
