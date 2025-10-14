/**
 * Unit tests to enforce flat structure and prevent deep nesting
 */
/// <reference types="vitest/globals" />

import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Component structure validation", () => {
  const componentsDir = path.resolve(__dirname, "../../src/components");

  it("should have components directory", () => {
    expect(fs.existsSync(componentsDir)).toBe(true);
  });

  it("should not have /home/, /ui/, or /examples/ subfolders", () => {
    const forbiddenFolders = ["home", "ui", "examples"];

    if (fs.existsSync(componentsDir)) {
      const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
      const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

      forbiddenFolders.forEach((forbidden) => {
        expect(folders).not.toContain(forbidden);
      });
    }
  });

  it("should not have nested shared folders", () => {
    if (fs.existsSync(componentsDir)) {
      const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
      const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

      // Should not have any folder named 'shared'
      expect(folders).not.toContain("shared");
    }
  });

  it("should have flat structure with direct component files", () => {
    // Key components should be directly in /components/, not nested
    const expectedComponents = [
      "HeroSection.tsx",
      "HomeLayout.tsx",
      "Footer.tsx",
      "Navigation.tsx",
      "CTA.tsx",
    ];

    expectedComponents.forEach((component) => {
      const componentPath = path.join(componentsDir, component);
      expect(fs.existsSync(componentPath)).toBe(true);
    });
  });
});

describe("Folder structure validation", () => {
  const srcDir = path.resolve(__dirname, "../../src");

  it("should not have /hooks/ folder", () => {
    const hooksDir = path.join(srcDir, "hooks");
    expect(fs.existsSync(hooksDir)).toBe(false);
  });

  it("should not have /styles/ folder", () => {
    const stylesDir = path.join(srcDir, "styles");
    expect(fs.existsSync(stylesDir)).toBe(false);
  });

  it("should not have /lib/ folder", () => {
    const libDir = path.join(srcDir, "lib");
    expect(fs.existsSync(libDir)).toBe(false);
  });

  it("should not have /test/ folder in src", () => {
    const testDir = path.join(srcDir, "test");
    expect(fs.existsSync(testDir)).toBe(false);
  });

  it("should have /services/ folder", () => {
    const servicesDir = path.join(srcDir, "services");
    expect(fs.existsSync(servicesDir)).toBe(true);
  });

  it("should have supabaseSingleton in /services/", () => {
    const singletonPath = path.join(srcDir, "services", "supabaseSingleton.ts");
    expect(fs.existsSync(singletonPath)).toBe(true);
  });
});

describe("Hub-logic structure validation", () => {
  const hubLogicDir = path.resolve(__dirname, "../../packages/hub-logic/src");

  it("should have /hubs/ folder", () => {
    const hubsDir = path.join(hubLogicDir, "hubs");
    expect(fs.existsSync(hubsDir)).toBe(true);
  });

  it("should have all four hub folders", () => {
    const hubsDir = path.join(hubLogicDir, "hubs");
    const expectedHubs = ["gnymble", "percymd", "percytech", "percytext"];

    expectedHubs.forEach((hub) => {
      const hubDir = path.join(hubsDir, hub);
      expect(fs.existsSync(hubDir)).toBe(true);
    });
  });

  it("should have required files in each hub folder", () => {
    const hubsDir = path.join(hubLogicDir, "hubs");
    const expectedHubs = ["gnymble", "percymd", "percytech", "percytext"];
    const requiredFiles = [
      "metadata.ts",
      "colors.ts",
      "hero.ts",
      "cta.ts",
      "faq.ts",
      "about.ts",
      "pricing.ts",
      "seo.ts",
      "businessTypes.ts",
      "index.ts",
    ];

    expectedHubs.forEach((hub) => {
      const hubDir = path.join(hubsDir, hub);

      requiredFiles.forEach((file) => {
        const filePath = path.join(hubDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });
  });

  it("should not have old monolithic hub files in root", () => {
    const oldFiles = [
      "gnymble.ts",
      "percymd.ts",
      "percytech.ts",
      "percytext.ts",
      "hubContent.ts",
      "hubMetadata.ts",
      "faqContent.ts",
      "aboutContent.ts",
      "pricingContent.ts",
    ];

    oldFiles.forEach((file) => {
      const filePath = path.join(hubLogicDir, file);
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });
});

describe("Documentation structure validation", () => {
  const docsDir = path.resolve(__dirname, "../../docs");

  it("should have exactly 6 .md files in /docs/", () => {
    const entries = fs.readdirSync(docsDir);
    const mdFiles = entries.filter((file) => file.endsWith(".md"));

    expect(mdFiles.length).toBe(6);
  });

  it("should have all required documentation files", () => {
    const requiredDocs = [
      "readme.md",
      "claude.md",
      "architecture.md",
      "deployment.md",
      "troubleshooting.md",
      "agent_lessons.md",
    ];

    requiredDocs.forEach((doc) => {
      const docPath = path.join(docsDir, doc);
      expect(fs.existsSync(docPath)).toBe(true);
    });
  });

  it("should not have /archive/ folder", () => {
    const archiveDir = path.join(docsDir, "archive");
    expect(fs.existsSync(archiveDir)).toBe(false);
  });

  it("should not have old docs in /docs/ root", () => {
    const oldDocs = [
      "admin-authentication-setup.md",
      "performance.md",
      "sms-hub-app2-integration.md",
    ];

    oldDocs.forEach((doc) => {
      const docPath = path.join(docsDir, doc);
      expect(fs.existsSync(docPath)).toBe(false);
    });
  });

  it("should not have readme.md or claude.md in project root", () => {
    const rootDir = path.resolve(__dirname, "../..");

    expect(fs.existsSync(path.join(rootDir, "readme.md"))).toBe(false);
    expect(fs.existsSync(path.join(rootDir, "claude.md"))).toBe(false);
  });
});
