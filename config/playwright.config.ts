import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "../test/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // Web app tests
    {
      name: "web-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3000" },
      testDir: "../test/e2e/web",
    },
    {
      name: "web-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3000" },
      testDir: "../test/e2e/web",
    },
    {
      name: "web-mobile",
      use: { ...devices["Pixel 5"], baseURL: "http://localhost:3000" },
      testDir: "../test/e2e/web",
    },
    // Unified app tests
    {
      name: "unified-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3001" },
      testDir: "../test/e2e/unified",
    },
    {
      name: "unified-firefox",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3001" },
      testDir: "../test/e2e/unified",
    },
    // Cross-app integration tests
    {
      name: "integration",
      use: { ...devices["Desktop Chrome"] },
      testDir: "../test/e2e/integration",
    },
  ],

  webServer: [
    {
      command: "pnpm dev --filter=@sms-hub/web",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: "pnpm dev --filter=@sms-hub/unified",
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});
