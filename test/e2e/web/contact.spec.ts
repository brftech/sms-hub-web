import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("should display contact form", async ({ page }) => {
    // Verify form is visible
    await expect(page.locator("form")).toBeVisible();

    // Verify essential form fields exist
    const emailInput = page.locator('input[type="email"], input[name*="email"]');
    const nameInput = page.locator('input[name*="name"], input[placeholder*="name"]');

    await expect(emailInput.first()).toBeVisible();
    await expect(nameInput.first()).toBeVisible();
  });

  test("should have submit button", async ({ page }) => {
    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Submit"), button:has-text("Send")'
    );
    await expect(submitButton.first()).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Submit"), button:has-text("Send")'
    );
    await submitButton.first().click();

    // HTML5 validation or custom validation should prevent submission
    // Wait a bit to see if any error messages appear
    await page.waitForTimeout(500);

    // Should still be on contact page (not redirected)
    await expect(page).toHaveURL(/.*\/contact/);
  });

  test("should fill out contact form", async ({ page }) => {
    // Fill out form fields
    const emailInput = page.locator('input[type="email"], input[name*="email"]').first();
    const nameInput = page.locator('input[name*="name"], input[placeholder*="name"]').first();
    const messageInput = page.locator('textarea, input[name*="message"]').first();

    await nameInput.fill("Test User");
    await emailInput.fill("test@example.com");

    if (await messageInput.isVisible()) {
      await messageInput.fill("This is a test message from Playwright");
    }

    // Verify values were entered
    await expect(nameInput).toHaveValue("Test User");
    await expect(emailInput).toHaveValue("test@example.com");
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Form should still be visible on mobile
    await expect(page.locator("form")).toBeVisible();
  });
});
