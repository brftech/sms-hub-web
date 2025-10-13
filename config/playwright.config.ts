import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for SMS Hub Web
 *
 * This config tests the marketing website and Sales Dashboard across multiple
 * browsers and device types to ensure compatibility and responsive design.
 *
 * Test Structure:
 * - test/e2e/web/       - Marketing pages (home, contact, pricing) - 3 browsers
 * - test/e2e/admin/     - Sales Dashboard tests - 2 browsers
 * - test/e2e/integration/ - Cross-page navigation - 1 browser
 *
 * Total: 6 test projects (browsers x test suites)
 */
export default defineConfig({
  testDir: "../test/e2e",
  testMatch: /.*\.spec\.ts/, // Only match .spec.ts files (not .test.ts which are for Vitest)
  testIgnore: ["**/node_modules/**", "**/unit/**", "**/integration/**/*.test.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 30 * 1000, // 30 seconds per test

  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Marketing Website Tests - 3 Browsers
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*(\/|\\)e2e(\/|\\)web(\/|\\).*\.spec\.ts$/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /.*(\/|\\)e2e(\/|\\)web(\/|\\).*\.spec\.ts$/,
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
      testMatch: /.*(\/|\\)e2e(\/|\\)web(\/|\\).*\.spec\.ts$/,
    },

    // Sales Dashboard Tests - 2 Browsers
    {
      name: "admin-chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*(\/|\\)e2e(\/|\\)admin(\/|\\).*\.spec\.ts$/,
    },
    {
      name: "admin-firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /.*(\/|\\)e2e(\/|\\)admin(\/|\\).*\.spec\.ts$/,
    },

    // Integration Tests - 1 Browser
    {
      name: "integration",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*(\/|\\)e2e(\/|\\)integration(\/|\\).*\.spec\.ts$/,
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
