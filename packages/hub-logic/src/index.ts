/**
 * Hub Logic - Centralized Content & Metadata
 *
 * This package contains all hub-specific content and metadata.
 * Everything is organized by hub in folders for maximum maintainability.
 *
 * Structure:
 * - /hubs/gnymble/    - All Gnymble content (metadata, hero, cta, faq, about, pricing, etc.)
 * - /hubs/percymd/    - All PercyMD content
 * - /hubs/percytech/  - All PercyTech content
 * - /hubs/percytext/  - All PercyText content
 * - types.ts          - Shared TypeScript interfaces
 */

import type { HubType } from "./types";
import * as gnymble from "./hubs/gnymble";
import * as percymd from "./hubs/percymd";
import * as percytech from "./hubs/percytech";
import * as percytext from "./hubs/percytext";

// Export types
export * from "./types";

/**
 * HUB METADATA HELPERS
 */

// Backward compatibility: export HUB_METADATA constant
export const HUB_METADATA = {
  gnymble: gnymble.gnymbleMetadata,
  percymd: percymd.percymdMetadata,
  percytech: percytech.percytechMetadata,
  percytext: percytext.percytextMetadata,
} as const;

export const getHubMetadata = (hubType: HubType) => {
  return HUB_METADATA[hubType] || HUB_METADATA.gnymble;
};

export const getHubId = (hubType: HubType): number => getHubMetadata(hubType).id;
export const getHubDisplayName = (hubType: HubType): string => getHubMetadata(hubType).displayName;
export const getHubDomain = (hubType: HubType): string => getHubMetadata(hubType).domain;
export const getHubIconPath = (hubType: HubType): string => getHubMetadata(hubType).iconPath;
export const getHubDescription = (hubType: HubType): string => getHubMetadata(hubType).description;

export const getHubById = (id: number): HubType | null => {
  const metadataMap = [
    { id: gnymble.gnymbleMetadata.id, type: "gnymble" as HubType },
    { id: percymd.percymdMetadata.id, type: "percymd" as HubType },
    { id: percytech.percytechMetadata.id, type: "percytech" as HubType },
    { id: percytext.percytextMetadata.id, type: "percytext" as HubType },
  ];

  const found = metadataMap.find((m) => m.id === id);
  return found ? found.type : null;
};

export const getAllHubTypes = (): HubType[] => ["percytech", "gnymble", "percymd", "percytext"]; // Ordered by ID
export const isValidHubType = (value: string): value is HubType => {
  return ["gnymble", "percymd", "percytech", "percytext"].includes(value);
};

/**
 * HUB COLORS
 */
export const getHubColors = (hubType: HubType) => {
  switch (hubType) {
    case "percytech":
      return percytech.percytechColors;
    case "gnymble":
      return gnymble.gnymbleColors;
    case "percymd":
      return percymd.percymdColors;
    case "percytext":
      return percytext.percytextColors;
    default:
      return gnymble.gnymbleColors;
  }
};

/**
 * HUB BUSINESS TYPES
 */
export const getHubBusinessTypes = (hubType: HubType): string[] => {
  switch (hubType) {
    case "percytech":
      return percytech.percytechBusinessTypes;
    case "gnymble":
      return gnymble.gnymbleBusinessTypes;
    case "percymd":
      return percymd.percymdBusinessTypes;
    case "percytext":
      return percytext.percytextBusinessTypes;
    default:
      return gnymble.gnymbleBusinessTypes;
  }
};

/**
 * HUB SEO DATA
 */
export const getHubSEO = (hubType: HubType) => {
  switch (hubType) {
    case "percytech":
      return percytech.percytechSEO;
    case "gnymble":
      return gnymble.gnymbleSEO;
    case "percymd":
      return percymd.percymdSEO;
    case "percytext":
      return percytext.percytextSEO;
    default:
      return gnymble.gnymbleSEO;
  }
};

/**
 * HOME PAGE CONTENT HELPERS
 */
export const getHubHeroContent = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymbleHero;
    case "percymd":
      return percymd.percymdHero;
    case "percytech":
      return percytech.percytechHero;
    case "percytext":
      return percytext.percytextHero;
    default:
      return gnymble.gnymbleHero;
  }
};

export const getHubCTAContent = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymbleCTA;
    case "percymd":
      return percymd.percymdCTA;
    case "percytech":
      return percytech.percytechCTA;
    case "percytext":
      return percytext.percytextCTA;
    default:
      return gnymble.gnymbleCTA;
  }
};

export const getHubProblemSolutionContent = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymbleProblemSolution;
    case "percymd":
      return percymd.percymdProblemSolution;
    case "percytech":
      return percytech.percytechProblemSolution;
    case "percytext":
      return percytext.percytextProblemSolution;
    default:
      return gnymble.gnymbleProblemSolution;
  }
};

export const getHubStatsContent = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymbleStats;
    case "percymd":
      return percymd.percymdStats;
    case "percytech":
      return percytech.percytechStats;
    case "percytext":
      return percytext.percytextStats;
    default:
      return gnymble.gnymbleStats;
  }
};

export const getHubTestimonialsContent = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymbleTestimonials;
    case "percymd":
      return percymd.percymdTestimonials;
    case "percytech":
      return percytech.percytechTestimonials;
    case "percytext":
      return percytext.percytextTestimonials;
    default:
      return gnymble.gnymbleTestimonials;
  }
};

/**
 * DEMO MESSAGES
 */
export const getHubDemoMessages = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymbleDemoMessages;
    case "percymd":
      return percymd.percymdDemoMessages;
    case "percytech":
      return percytech.percytechDemoMessages;
    case "percytext":
      return percytext.percytextDemoMessages;
    default:
      return gnymble.gnymbleDemoMessages;
  }
};

/**
 * FAQ PAGE CONTENT HELPER
 */
export const getHubFAQContent = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymbleFAQ;
    case "percymd":
      return percymd.percymdFAQ;
    case "percytech":
      return percytech.percytechFAQ;
    case "percytext":
      return percytext.percytextFAQ;
    default:
      return gnymble.gnymbleFAQ;
  }
};

/**
 * ABOUT PAGE CONTENT HELPER
 */
export const getHubAboutContent = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymbleAbout;
    case "percymd":
      return percymd.percymdAbout;
    case "percytech":
      return percytech.percytechAbout;
    case "percytext":
      return percytext.percytextAbout;
    default:
      return gnymble.gnymbleAbout;
  }
};

/**
 * PRICING PAGE CONTENT HELPER
 */
export const getHubPricingContent = (hubType: HubType) => {
  switch (hubType) {
    case "gnymble":
      return gnymble.gnymblePricing;
    case "percymd":
      return percymd.percymdPricing;
    case "percytech":
      return percytech.percytechPricing;
    case "percytext":
      return percytext.percytextPricing;
    default:
      return gnymble.gnymblePricing;
  }
};

/**
 * COMPLETE HUB CONTENT HELPER
 * Get all content for a hub at once
 */
export const getHubContent = (hubType: HubType) => {
  return {
    hero: getHubHeroContent(hubType),
    cta: getHubCTAContent(hubType),
    problemSolution: getHubProblemSolutionContent(hubType),
    stats: getHubStatsContent(hubType),
    testimonials: getHubTestimonialsContent(hubType),
    faq: getHubFAQContent(hubType),
    about: getHubAboutContent(hubType),
    pricing: getHubPricingContent(hubType),
  };
};
