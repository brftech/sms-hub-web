import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("should display contact form", async ({ page }) => {
    // Verify form is visible
    await expect(page.locator("form")).toBeVisible();

    // Verify essential form fields exist (based on actual Contact.tsx structure)
    const firstNameInput = page.locator('input[name="firstName"]');
    const lastNameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
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

  test("should fill and submit contact form (intercept)", async ({ page }) => {
    // Intercept Edge Function call and assert payload
    const intercepted = page.waitForRequest(
      (req) => req.url().includes("/api/submit-contact") && req.method() === "POST"
    );

    const firstNameInput = page.locator('input[name="firstName"]');
    const lastNameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');

    await firstNameInput.fill("John");
    await lastNameInput.fill("Doe");
    await emailInput.fill("john.doe@example.com");
    if (await messageInput.isVisible()) {
      await messageInput.fill("This is a test message from Playwright");
    }

    // Submit
    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Submit"), button:has-text("Send")'
    );
    await submitButton.first().click();

    const req = await intercepted;
    const body = JSON.parse(req.postData() || "{}");
    expect(body).toMatchObject({
      email: "john.doe@example.com",
    });
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Form should still be visible on mobile
    await expect(page.locator("form")).toBeVisible();
  });
});
