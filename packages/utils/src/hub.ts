import { HubType, HubConfig, HUB_CONFIGS } from "./types";

export const detectHubFromDomain = (hostname: string): HubType => {
  if (hostname.includes("gnymble")) return "gnymble";
  if (hostname.includes("percymd")) return "percymd";
  if (hostname.includes("percytext")) return "percytext";
  return "percytech"; // Default to percytech
};

export const detectHubFromPath = (pathname: string): HubType | null => {
  if (pathname.startsWith("/gnymble")) return "gnymble";
  if (pathname.startsWith("/percymd")) return "percymd";
  if (pathname.startsWith("/percytext")) return "percytext";
  if (pathname.startsWith("/percytech")) return "percytech";
  return null;
};

// Port-based detection removed - now using domain-based detection only
// All hubs are served from the same port (3000) with different domains

export const getHubUrl = (
  hubType: HubType,
  environment: "development" | "staging" | "production" = "development"
): string => {
  // Return appropriate URLs based on environment and hub
  const baseUrls = {
    development: "http://localhost:3000",
    staging: `https://staging.${hubType}.com`,
    production: `https://www.${hubType}.com`,
  };
  return baseUrls[environment];
};

export const isValidHub = (hub: string): hub is HubType => {
  return Object.keys(HUB_CONFIGS).includes(hub);
};

export const getHubThemeCSS = (hubConfig: HubConfig): string => {
  return `
    :root {
      --hub-primary: ${hubConfig.primaryColor};
      --hub-secondary: ${hubConfig.secondaryColor};
      --hub-accent: ${hubConfig.accentColor};
      --hub-primary-rgb: ${hexToRgb(hubConfig.primaryColor)};
      --hub-secondary-rgb: ${hexToRgb(hubConfig.secondaryColor)};
      --hub-accent-rgb: ${hexToRgb(hubConfig.accentColor)};
    }
  `;
};

export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ].join(", ");
};

export const getHubFeatures = (hubType: HubType): string[] => {
  // Return hub-specific features
  const features = {
    gnymble: ["business-messaging", "lead-capture", "customer-support"],
    percytech: ["technical-support", "api-integration", "webhook-management"],
    percymd: [
      "medical-messaging",
      "hipaa-compliance",
      "appointment-scheduling",
    ],
    percytext: ["text-messaging", "sms-campaigns", "bulk-messaging"],
  };
  return features[hubType] || [];
};

export const hasHubFeature = (hubType: HubType, feature: string): boolean => {
  return getHubFeatures(hubType).includes(feature);
};
