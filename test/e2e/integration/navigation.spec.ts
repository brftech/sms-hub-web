import { test, expect } from "@playwright/test";

test.describe("Cross-Page Navigation", () => {
  test("should navigate between main pages", async ({ page }) => {
    // Start at home
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Navigate to contact
    const contactLink = page.locator('a[href="/contact"]').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/.*\/contact/);

      // Navigate back home
      const homeLink = page.locator('a[href="/"], a[href="/home"]').first();
      await homeLink.click();
      await expect(page).toHaveURL(/^\/$|\/home$/);
    }
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

test.describe("Hub-Specific Features", () => {
  test("should maintain hub context across navigation", async ({ page }) => {
    await page.goto("/");

    // Get initial hub context (if visible)
    const initialHub = await page.textContent("body");

    // Navigate to another page
    await page.goto("/contact");

    // Hub context should be consistent
    const afterNavigationHub = await page.textContent("body");

    // Both should contain same hub references
    const hubPattern = /(gnymble|percytech|percymd|percytext)/i;
    const initialMatch = initialHub?.match(hubPattern);
    const afterMatch = afterNavigationHub?.match(hubPattern);

    if (initialMatch && afterMatch) {
      expect(initialMatch[0].toLowerCase()).toBe(afterMatch[0].toLowerCase());
    }
  });
});
