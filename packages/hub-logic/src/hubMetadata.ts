/**
 * Hub metadata and utilities
 * Central source of truth for all hub-related data
 */

import { HubType } from "./types";

export interface HubMetadata {
  id: number;
  name: HubType;
  displayName: string;
  domain: string;
  iconPath: string;
  description: string;
}

/**
 * Complete hub metadata for all hubs
 * Single source of truth for hub information
 */
export const HUB_METADATA: Record<HubType, HubMetadata> = {
  percytech: {
    id: 0,
    name: "percytech",
    displayName: "PercyTech",
    domain: "percytech.com",
    iconPath: "/percytech-icon-logo.svg",
    description: "SMS Solutions for Technology Companies",
  },
  gnymble: {
    id: 1,
    name: "gnymble",
    displayName: "Gnymble",
    domain: "gnymble.com",
    iconPath: "/gnymble-icon-logo.svg",
    description: "SMS Solutions for Retail Businesses",
  },
  percymd: {
    id: 2,
    name: "percymd",
    displayName: "PercyMD",
    domain: "percymd.com",
    iconPath: "/percymd-icon-logo.svg",
    description: "SMS Solutions for Medical Practices",
  },
  percytext: {
    id: 3,
    name: "percytext",
    displayName: "PercyText",
    domain: "percytext.com",
    iconPath: "/percytext-icon-logo.svg",
    description: "SMS Solutions for All Businesses",
  },
};

/**
 * Get complete metadata for a hub
 * @param hubType - The hub type
 * @returns Hub metadata object
 */
export function getHubMetadata(hubType: HubType): HubMetadata {
  return HUB_METADATA[hubType];
}

/**
 * Get hub ID number
 * @param hubType - The hub type
 * @returns Hub ID number
 */
export function getHubId(hubType: HubType): number {
  return HUB_METADATA[hubType].id;
}

/**
 * Get hub display name
 * @param hubType - The hub type
 * @returns Display name (e.g., "PercyTech", "Gnymble")
 */
export function getHubDisplayName(hubType: HubType): string {
  return HUB_METADATA[hubType].displayName;
}

/**
 * Get hub domain
 * @param hubType - The hub type
 * @returns Hub domain (e.g., "percytech.com")
 */
export function getHubDomain(hubType: HubType): string {
  return HUB_METADATA[hubType].domain;
}

/**
 * Get hub icon path
 * @param hubType - The hub type
 * @returns Path to hub icon
 */
export function getHubIconPath(hubType: HubType): string {
  return HUB_METADATA[hubType].iconPath;
}

/**
 * Get hub description
 * @param hubType - The hub type
 * @returns Hub description
 */
export function getHubDescription(hubType: HubType): string {
  return HUB_METADATA[hubType].description;
}

/**
 * Get hub by ID
 * @param id - Hub ID number
 * @returns Hub type or null if not found
 */
export function getHubById(id: number): HubType | null {
  const entry = Object.entries(HUB_METADATA).find(([_, meta]) => meta.id === id);
  return entry ? (entry[0] as HubType) : null;
}

/**
 * Get all hub types
 * @returns Array of all hub types
 */
export function getAllHubTypes(): HubType[] {
  return Object.keys(HUB_METADATA) as HubType[];
}

/**
 * Check if a string is a valid hub type
 * @param value - Value to check
 * @returns True if valid hub type
 */
export function isValidHubType(value: string): value is HubType {
  return value in HUB_METADATA;
}
