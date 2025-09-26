// Client data and configurations for the Web app
import { Client, ClientAsset } from "../types";

// Example client data (replace with actual data from your CMS/API)
export const CLIENTS: Client[] = [
  {
    id: "gnymble",
    name: "Gnymble",
    slug: "gnymble",
    description: "Premium cigar and lifestyle brand",
    website: "https://gnymble.com",
    logo: "/clients/gnymble/assets/gnymble-text-logo.svg",
    primaryColor: "#8B4513",
    secondaryColor: "#D2691E",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "percytech",
    name: "PercyTech",
    slug: "percytech",
    description: "Technology solutions and consulting",
    website: "https://percytech.com",
    logo: "/clients/percytech/assets/percytech-text-logo.svg",
    primaryColor: "#2563EB",
    secondaryColor: "#3B82F6",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "percymd",
    name: "PercyMD",
    slug: "percymd",
    description: "Medical practice management",
    website: "https://percymd.com",
    logo: "/clients/percymd/assets/percymd-text-logo.svg",
    primaryColor: "#059669",
    secondaryColor: "#10B981",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "percytext",
    name: "PercyText",
    slug: "percytext",
    description: "SMS marketing and communication platform",
    website: "https://percytext.com",
    logo: "/clients/percytext/assets/percytext-text-logo.svg",
    primaryColor: "#7C3AED",
    secondaryColor: "#8B5CF6",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "donsbt",
    name: "Don's Burlingame",
    slug: "donsbt",
    description: "Premium cigar and lifestyle establishment",
    website: "https://donsburlingame.com",
    logo: "/clients/donsbt/assets/dons-logo.png",
    primaryColor: "#FF8C00",
    secondaryColor: "#FFA500",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "michaels",
    name: "Michaels",
    slug: "michaels",
    description: "Premium cigar and tobacco establishment",
    website: "https://michaelscigars.com",
    logo: "/clients/michaels/assets/michaels-logo.png",
    primaryColor: "#8B4513",
    secondaryColor: "#DAA520",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Example client assets (replace with actual asset data)
export const CLIENT_ASSETS: Record<string, ClientAsset[]> = {
  gnymble: [
    {
      id: "gnymble-logo-text",
      clientId: "gnymble",
      type: "logo",
      filename: "gnymble-text-logo.svg",
      path: "gnymble-text-logo.svg",
      alt: "Gnymble Text Logo",
      description: "Main text logo for Gnymble brand",
      mimeType: "image/svg+xml",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "gnymble-logo-icon",
      clientId: "gnymble",
      type: "icon",
      filename: "gnymble-icon-logo.svg",
      path: "gnymble-icon-logo.svg",
      alt: "Gnymble Icon Logo",
      description: "Icon version of Gnymble logo",
      mimeType: "image/svg+xml",
      createdAt: new Date("2024-01-01"),
    },
  ],
  percytech: [
    {
      id: "percytech-logo-text",
      clientId: "percytech",
      type: "logo",
      filename: "percytech-text-logo.svg",
      path: "percytech-text-logo.svg",
      alt: "PercyTech Text Logo",
      description: "Main text logo for PercyTech brand",
      mimeType: "image/svg+xml",
      createdAt: new Date("2024-01-01"),
    },
  ],
  donsbt: [
    {
      id: "dons-logo-main",
      clientId: "donsbt",
      type: "logo",
      filename: "dons-logo.png",
      path: "dons-logo.png",
      alt: "Don's Burlingame Logo",
      description: "Main logo for Don's Burlingame establishment",
      mimeType: "image/png",
      createdAt: new Date("2024-01-01"),
    },
  ],
  michaels: [
    {
      id: "michaels-logo-main",
      clientId: "michaels",
      type: "logo",
      filename: "michaels-logo.png",
      path: "michaels-logo.png",
      alt: "Michaels Logo",
      description:
        "Main logo for Michaels cigar establishment with crossed cigars and tobacco leaves",
      mimeType: "image/png",
      createdAt: new Date("2024-01-01"),
    },
  ],
  // Add more client assets as needed
};

// Helper functions for client data
export const getClientAssets = (clientId: string): ClientAsset[] => {
  return CLIENT_ASSETS[clientId] || [];
};

export const getClientAsset = (
  clientId: string,
  assetId: string
): ClientAsset | undefined => {
  const assets = getClientAssets(clientId);
  return assets.find((asset) => asset.id === assetId);
};
