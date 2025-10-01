import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("should load pricing page", async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveURL(/.*\/pricing/);

    // Check for pricing-related content
    const pricingContent = page.locator("text=/pricing|price|plan|subscribe|tier/i").first();

    // At least some pricing-related text should be visible
    await expect(pricingContent).toBeVisible({ timeout: 10000 });
  });

  test("should display pricing tiers or information", async ({ page }) => {
    // Look for common pricing page elements
    const hasPricingCards = await page
      .locator('[class*="price"], [class*="tier"], [class*="plan"]')
      .count();
    const hasPricingText = await page.locator("text=/\\$|price|month|year/i").count();

    // Should have some pricing information
    expect(hasPricingCards + hasPricingText).toBeGreaterThan(0);
  });

  test("should have call-to-action buttons", async ({ page }) => {
    // Look for CTA buttons
    const ctaButtons = page.locator(
      'button:has-text("Get Started"), button:has-text("Subscribe"), button:has-text("Sign Up"), a:has-text("Get Started"), a:has-text("Subscribe")'
    );

    const buttonCount = await ctaButtons.count();

    // Should have at least one CTA
    expect(buttonCount).toBeGreaterThan(0);
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Page content should still be visible
    await expect(page.locator("body")).toBeVisible();
  });
});
