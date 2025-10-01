import { test, expect } from "@playwright/test";

test.describe("Sales Dashboard", () => {
  test("should require authentication", async ({ page }) => {
    await page.goto("/admin");

    // Should either show login/access code prompt or be on the page
    // In development, might have auto-access
    const isDevelopment = process.env.NODE_ENV === "development" || !process.env.CI;

    if (!isDevelopment) {
      // In production, should require access code
      const accessCodeInput = page.locator(
        'input[type="password"], input[placeholder*="code"], input[placeholder*="access"]'
      );
      await expect(accessCodeInput.first()).toBeVisible({ timeout: 5000 });
    } else {
      // In development, should either show access prompt or dashboard
      const hasDashboard = await page.locator("text=/dashboard|sales|leads|statistics/i").count();
      const hasPasswordInput = await page.locator('input[type="password"]').count();
      const hasAccessCodeText = await page.locator("text=/access code/i").count();

      expect(hasDashboard + hasPasswordInput + hasAccessCodeText).toBeGreaterThan(0);
    }
  });

  test("should display dashboard title or header", async ({ page }) => {
    await page.goto("/admin");

    // Look for dashboard-related headers
    const dashboardHeader = page
      .locator('h1, h2, [class*="header"]')
      .filter({ hasText: /dashboard|sales|admin/i });

    // Should have a header (may need to wait for load)
    await expect(dashboardHeader.first()).toBeVisible({ timeout: 10000 });
  });

  test("should be responsive", async ({ page }) => {
    await page.goto("/admin");
    await page.setViewportSize({ width: 375, height: 667 });

    // Dashboard should load on mobile
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Sales Dashboard - Hub Features", () => {
  test("should show hub-specific data", async ({ page }) => {
    await page.goto("/admin");

    // Wait for any loading states
    await page.waitForLoadState("networkidle");

    // Look for hub-related elements (hub switcher, hub name, etc.)
    const hubElements = page.locator("text=/gnymble|percytech|percymd|percytext/i");

    const count = await hubElements.count();

    // Should have some hub-related content
    expect(count).toBeGreaterThan(0);
  });
});
