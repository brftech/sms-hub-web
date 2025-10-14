/**
 * PercyText Hub Metadata
 * Core identity and configuration
 */

import { percytextColors } from "./colors";

export const percytextMetadata = {
  id: 3,
  name: "percytext" as const,
  displayName: "PercyText",
  domain: "percytext.com",
  iconPath: "/percytext-icon-logo.svg",
  description: "SMS Solutions for All Businesses",
  color: "purple", // Primary brand color
  colors: percytextColors,
};
