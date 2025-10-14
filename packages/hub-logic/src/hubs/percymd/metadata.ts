/**
 * PercyMD Hub Metadata
 * Core identity and configuration
 */

import { percymdColors } from "./colors";

export const percymdMetadata = {
  id: 2,
  name: "percymd" as const,
  displayName: "PercyMD",
  domain: "percymd.com",
  iconPath: "/percymd-icon-logo.svg",
  description: "SMS Solutions for Medical Practices",
  color: "blue", // Primary brand color
  colors: percymdColors,
};
