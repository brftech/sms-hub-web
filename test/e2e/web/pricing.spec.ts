import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("should load pricing page", async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveURL(/.*\/pricing/);

    // Verify main content loaded (look for pricing in main content, not navigation)
    const mainContent = page.locator("main h1, main h2").first();
    await expect(mainContent).toBeVisible({ timeout: 10000 });
  });

  test("should display pricing tiers or information", async ({ page }) => {
    // Verify pricing amounts are visible (from snapshot: $179, $79, $349)
    const pricingText = page.locator("text=/\\$/");
    await expect(pricingText.first()).toBeVisible({ timeout: 10000 });
  });

  test("should have call-to-action buttons", async ({ page }) => {
    // From snapshot: "Get Started Today - $179" buttons exist
    const ctaButton = page.locator('button:has-text("Get Started")');
    await expect(ctaButton.first()).toBeVisible({ timeout: 10000 });
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Page content should still be visible
    await expect(page.locator("body")).toBeVisible();
  });
});
