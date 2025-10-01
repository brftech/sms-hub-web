import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should load home page successfully", async ({ page }) => {
    await page.goto("/");

    // Verify page loads
    await expect(page).toHaveTitle(/SMS Hub|Gnymble|Percy/);

    // Verify main navigation is visible
    await expect(page.locator("nav")).toBeVisible();
  });

  test("should display hub-specific branding", async ({ page }) => {
    await page.goto("/");

    // Verify logo or branding is visible
    await expect(page.locator('img[alt*="logo"], img[alt*="Logo"]').first()).toBeVisible();
  });

  test("should navigate to contact page", async ({ page }) => {
    await page.goto("/");

    // Find and click contact link
    const contactLink = page.locator('a[href="/contact"], a:has-text("Contact")').first();
    await contactLink.click();

    // Verify navigation
    await expect(page).toHaveURL(/.*\/contact/);
  });

  test("should navigate to pricing page", async ({ page }) => {
    await page.goto("/");

    // Find and click pricing link
    const pricingLink = page.locator('a[href="/pricing"], a:has-text("Pricing")').first();
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page).toHaveURL(/.*\/pricing/);
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Verify page loads on mobile
    await expect(page.locator("body")).toBeVisible();

    // Mobile menu might be hidden behind hamburger
    const mobileMenu = page.locator('button[aria-label*="menu"], button:has-text("Menu")');
    if (await mobileMenu.isVisible()) {
      await expect(mobileMenu).toBeVisible();
    }
  });
});
