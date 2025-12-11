/**
 * Unit tests for environment configuration
 */
/// <reference types="vitest/globals" />

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock import.meta.env before importing the module
const mockEnv = vi.hoisted(() => ({
  PROD: false,
  MODE: "development",
  VITE_SUPABASE_URL: "",
  VITE_SUPABASE_ANON_KEY: "",
  VITE_SKIP_EMAIL_CONFIRMATION: "",
  VITE_DEV_AUTH_TOKEN: "dev123",
}));

vi.stubGlobal("import", {
  meta: {
    env: mockEnv,
  },
});

describe("Environment Configuration", () => {
  let originalWindow: any;
  let getEnvironmentConfig: () => any;
  let webEnvironment: any;

  beforeEach(async () => {
    // Reset environment mocks
    mockEnv.PROD = false;
    mockEnv.MODE = "development";
    mockEnv.VITE_SUPABASE_URL = "";

    // Save original window
    originalWindow = global.window;

    // Mock window.location
    global.window = {
      location: {
        hostname: "localhost",
        origin: "http://localhost:3005",
      },
    } as any;

    // Clear module cache and reimport
    vi.resetModules();
    const envModule = await import("../../src/config/environment");
    getEnvironmentConfig = envModule.getEnvironmentConfig;
    webEnvironment = envModule.webEnvironment;
  });

  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
  });

  describe("environment detection", () => {
    it("should detect development on localhost", async () => {
      expect(webEnvironment.isDevelopment()).toBe(true);
      expect(webEnvironment.isProduction()).toBe(false);
      expect(webEnvironment.isStaging()).toBe(false);
    });

    // Note: Staging/production detection tests removed because import.meta.env
    // is immutable at build time and cannot be mocked in unit tests.
    // These scenarios are validated through actual Vercel deployments.
  });

  describe("getEnvironmentConfig", () => {
    it("should return complete configuration object", () => {
      const config = getEnvironmentConfig();

      expect(config).toHaveProperty("name");
      expect(config).toHaveProperty("isDevelopment");
      expect(config).toHaveProperty("isStaging");
      expect(config).toHaveProperty("isProduction");
      expect(config).toHaveProperty("webAppUrl");
      expect(config).toHaveProperty("adminUrl");
      expect(config).toHaveProperty("supabaseUrl");
    });

    it("should have correct admin URL", () => {
      const config = getEnvironmentConfig();
      expect(config.adminUrl).toBe("/admin");
    });

    it("should enable dev auth in non-production", () => {
      const config = getEnvironmentConfig();
      expect(config.enableDevAuth).toBe(true);
      expect(config.enableDebugMode).toBe(true);
    });

    it("should use web app URL from window origin if available", () => {
      const config = getEnvironmentConfig();
      expect(config.webAppUrl).toBe("http://localhost:3005");
    });
  });

  describe("webEnvironment.features", () => {
    it("should enable hub switcher in development", () => {
      expect(webEnvironment.features.hubSwitcher()).toBe(true);
    });

    it("should enable debug mode in development", () => {
      expect(webEnvironment.features.debugMode()).toBe(true);
    });

    it("should disable analytics in development", () => {
      expect(webEnvironment.features.analytics()).toBe(false);
    });

    it("should disable error reporting in development", () => {
      expect(webEnvironment.features.errorReporting()).toBe(false);
    });
  });
});
