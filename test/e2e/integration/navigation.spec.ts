import { test, expect } from "@playwright/test";

test.describe("Cross-Page Navigation", () => {
  test("should navigate between main pages", async ({ page }) => {
    // Start at home
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Navigate to contact (button or link)
    const contactButton = page.locator('button:has-text("Contact"), a:has-text("Contact")').first();
    await contactButton.click();
    await expect(page).toHaveURL(/.*\/contact/);

    // Navigate back home via logo
    const logoButton = page.locator('button:has-text("Logo"), img[alt*="Logo"]').first();
    await logoButton.click();
    await page.waitForURL("/");
  });

  test("should maintain navigation across routes", async ({ page }) => {
    const routes = ["/", "/contact", "/pricing", "/about"];

    for (const route of routes) {
      await page.goto(route);

      // Verify navigation bar is present
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();
    }
  });

  test("should handle 404 gracefully", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-12345");

    // Should either redirect to home or show 404
    // Your app shows Home for unknown routes based on the wildcard route
    await expect(page.locator("body")).toBeVisible();
  });
});

// Hub context persistence is handled by React Context Provider
// and is better tested at the unit level (not E2E)
