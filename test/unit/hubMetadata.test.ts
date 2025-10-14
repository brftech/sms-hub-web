/**
 * Unit tests for hub metadata utilities
 */
/// <reference types="vitest/globals" />

import { describe, it, expect } from "vitest";
import {
  HUB_METADATA,
  getHubMetadata,
  getHubId,
  getHubDisplayName,
  getHubDomain,
  getHubIconPath,
  getHubDescription,
  getHubById,
  getAllHubTypes,
  isValidHubType,
} from "@sms-hub/hub-logic";
import type { HubType } from "../../packages/hub-logic/src/types";

describe("HUB_METADATA constant", () => {
  it("should have all four hubs defined", () => {
    expect(HUB_METADATA).toHaveProperty("percytech");
    expect(HUB_METADATA).toHaveProperty("gnymble");
    expect(HUB_METADATA).toHaveProperty("percymd");
    expect(HUB_METADATA).toHaveProperty("percytext");
  });

  it("should have unique IDs for each hub", () => {
    const ids = Object.values(HUB_METADATA).map((h) => h.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have all required fields for each hub", () => {
    Object.values(HUB_METADATA).forEach((hub) => {
      expect(hub).toHaveProperty("id");
      expect(hub).toHaveProperty("name");
      expect(hub).toHaveProperty("displayName");
      expect(hub).toHaveProperty("domain");
      expect(hub).toHaveProperty("iconPath");
      expect(hub).toHaveProperty("description");
    });
  });

  it("should have consistent icon paths", () => {
    Object.entries(HUB_METADATA).forEach(([hubType, metadata]) => {
      expect(metadata.iconPath).toBe(`/${hubType}-icon-logo.svg`);
    });
  });
});

describe("getHubId", () => {
  it("should return 0 for percytech", () => {
    expect(getHubId("percytech")).toBe(0);
  });

  it("should return 1 for gnymble", () => {
    expect(getHubId("gnymble")).toBe(1);
  });

  it("should return 2 for percymd", () => {
    expect(getHubId("percymd")).toBe(2);
  });

  it("should return 3 for percytext", () => {
    expect(getHubId("percytext")).toBe(3);
  });

  it("should return numbers not strings", () => {
    expect(typeof getHubId("gnymble")).toBe("number");
  });
});

describe("getHubDisplayName", () => {
  it("should return PercyTech for percytech", () => {
    expect(getHubDisplayName("percytech")).toBe("PercyTech");
  });

  it("should return Gnymble for gnymble", () => {
    expect(getHubDisplayName("gnymble")).toBe("Gnymble");
  });

  it("should return PercyMD for percymd", () => {
    expect(getHubDisplayName("percymd")).toBe("PercyMD");
  });

  it("should return PercyText for percytext", () => {
    expect(getHubDisplayName("percytext")).toBe("PercyText");
  });

  it("should capitalize correctly", () => {
    const displayNames = Object.keys(HUB_METADATA).map((key) => getHubDisplayName(key as HubType));
    displayNames.forEach((name) => {
      expect(name[0]).toBe(name[0].toUpperCase());
    });
  });
});

describe("getHubDomain", () => {
  it("should return percytech.com for percytech", () => {
    expect(getHubDomain("percytech")).toBe("percytech.com");
  });

  it("should return gnymble.com for gnymble", () => {
    expect(getHubDomain("gnymble")).toBe("gnymble.com");
  });

  it("should return percymd.com for percymd", () => {
    expect(getHubDomain("percymd")).toBe("percymd.com");
  });

  it("should return percytext.com for percytext", () => {
    expect(getHubDomain("percytext")).toBe("percytext.com");
  });

  it("should always end with .com", () => {
    const domains = Object.keys(HUB_METADATA).map((key) => getHubDomain(key as HubType));
    domains.forEach((domain) => {
      expect(domain).toMatch(/\.com$/);
    });
  });
});

describe("getHubIconPath", () => {
  it("should return correct icon path for each hub", () => {
    expect(getHubIconPath("percytech")).toBe("/percytech-icon-logo.svg");
    expect(getHubIconPath("gnymble")).toBe("/gnymble-icon-logo.svg");
    expect(getHubIconPath("percymd")).toBe("/percymd-icon-logo.svg");
    expect(getHubIconPath("percytext")).toBe("/percytext-icon-logo.svg");
  });

  it("should start with forward slash", () => {
    const paths = Object.keys(HUB_METADATA).map((key) => getHubIconPath(key as HubType));
    paths.forEach((path) => {
      expect(path).toMatch(/^\//);
    });
  });

  it("should end with .svg", () => {
    const paths = Object.keys(HUB_METADATA).map((key) => getHubIconPath(key as HubType));
    paths.forEach((path) => {
      expect(path).toMatch(/\.svg$/);
    });
  });
});

describe("getHubDescription", () => {
  it("should return non-empty descriptions", () => {
    const descriptions = Object.keys(HUB_METADATA).map((key) => getHubDescription(key as HubType));
    descriptions.forEach((desc) => {
      expect(desc.length).toBeGreaterThan(0);
    });
  });

  it("should include SMS in all descriptions", () => {
    const descriptions = Object.keys(HUB_METADATA).map((key) => getHubDescription(key as HubType));
    descriptions.forEach((desc) => {
      expect(desc).toContain("SMS");
    });
  });
});

describe("getHubMetadata", () => {
  it("should return complete metadata object", () => {
    const metadata = getHubMetadata("gnymble");
    expect(metadata).toHaveProperty("id");
    expect(metadata).toHaveProperty("name");
    expect(metadata).toHaveProperty("displayName");
    expect(metadata).toHaveProperty("domain");
    expect(metadata).toHaveProperty("iconPath");
    expect(metadata).toHaveProperty("description");
  });

  it("should return correct metadata for each hub", () => {
    const gnymbleMetadata = getHubMetadata("gnymble");
    expect(gnymbleMetadata.id).toBe(1);
    expect(gnymbleMetadata.name).toBe("gnymble");
    expect(gnymbleMetadata.displayName).toBe("Gnymble");
  });

  it("should return same reference as HUB_METADATA", () => {
    const metadata = getHubMetadata("percytech");
    expect(metadata).toBe(HUB_METADATA.percytech);
  });
});

describe("getHubById", () => {
  it("should return percytech for ID 0", () => {
    expect(getHubById(0)).toBe("percytech");
  });

  it("should return gnymble for ID 1", () => {
    expect(getHubById(1)).toBe("gnymble");
  });

  it("should return percymd for ID 2", () => {
    expect(getHubById(2)).toBe("percymd");
  });

  it("should return percytext for ID 3", () => {
    expect(getHubById(3)).toBe("percytext");
  });

  it("should return null for invalid ID", () => {
    expect(getHubById(999)).toBeNull();
  });

  it("should return null for negative ID", () => {
    expect(getHubById(-1)).toBeNull();
  });
});

describe("getAllHubTypes", () => {
  it("should return array of all hub types", () => {
    const hubTypes = getAllHubTypes();
    expect(Array.isArray(hubTypes)).toBe(true);
    expect(hubTypes.length).toBe(4);
  });

  it("should include all expected hubs", () => {
    const hubTypes = getAllHubTypes();
    expect(hubTypes).toContain("percytech");
    expect(hubTypes).toContain("gnymble");
    expect(hubTypes).toContain("percymd");
    expect(hubTypes).toContain("percytext");
  });
});

describe("isValidHubType", () => {
  it("should return true for valid hub types", () => {
    expect(isValidHubType("percytech")).toBe(true);
    expect(isValidHubType("gnymble")).toBe(true);
    expect(isValidHubType("percymd")).toBe(true);
    expect(isValidHubType("percytext")).toBe(true);
  });

  it("should return false for invalid hub types", () => {
    expect(isValidHubType("invalid")).toBe(false);
    expect(isValidHubType("")).toBe(false);
    expect(isValidHubType("PercyTech")).toBe(false); // Case sensitive
  });

  it("should return false for non-string values", () => {
    expect(isValidHubType(null as unknown as string)).toBe(false);
    expect(isValidHubType(undefined as unknown as string)).toBe(false);
    expect(isValidHubType(123 as unknown as string)).toBe(false);
  });
});

describe("hubMetadata integration tests", () => {
  it("should be able to convert hub type to ID and back", () => {
    const hubType: HubType = "gnymble";
    const id = getHubId(hubType);
    const retrievedHubType = getHubById(id);
    expect(retrievedHubType).toBe(hubType);
  });

  it("should maintain consistency across all accessor functions", () => {
    const hubType: HubType = "percymd";
    const metadata = getHubMetadata(hubType);

    expect(metadata.id).toBe(getHubId(hubType));
    expect(metadata.displayName).toBe(getHubDisplayName(hubType));
    expect(metadata.domain).toBe(getHubDomain(hubType));
    expect(metadata.iconPath).toBe(getHubIconPath(hubType));
    expect(metadata.description).toBe(getHubDescription(hubType));
  });

  it("should validate all hub types from getAllHubTypes", () => {
    const allHubTypes = getAllHubTypes();
    allHubTypes.forEach((hubType) => {
      expect(isValidHubType(hubType)).toBe(true);
    });
  });
});
