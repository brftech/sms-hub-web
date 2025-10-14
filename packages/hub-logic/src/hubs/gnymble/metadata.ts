/**
 * Gnymble Hub Metadata
 * Core identity and configuration
 */

import { gnymbleColors } from "./colors";

export const gnymbleMetadata = {
  id: 1,
  name: "gnymble" as const,
  displayName: "Gnymble",
  domain: "gnymble.com",
  iconPath: "/gnymble-icon-logo.svg",
  description: "SMS Solutions for Retail Businesses",
  color: "orange", // Primary brand color
  colors: gnymbleColors,
};
