import { test, expect } from "@playwright/test";

test.describe("Sales Dashboard", () => {
  test("should load Sales Dashboard page", async ({ page }) => {
    await page.goto("/admin");

    // Sales Dashboard should load (development has auto-access)
    const dashboardHeader = page.locator('h1:has-text("Sales Dashboard")');
    await expect(dashboardHeader).toBeVisible({ timeout: 10000 });
  });

  test("should display statistics cards", async ({ page }) => {
    await page.goto("/admin");

    // Wait for dashboard to load
    await page.waitForLoadState("networkidle");

    // Verify key statistics are visible
    const leadsCard = page.locator("text=/Total Leads|Leads/i").first();
    const emailCard = page.locator("text=/Email Subscribers/i").first();

    await expect(leadsCard).toBeVisible({ timeout: 5000 });
    await expect(emailCard).toBeVisible({ timeout: 5000 });
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
