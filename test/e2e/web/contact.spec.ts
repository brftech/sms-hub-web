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
    // Intercept Supabase Edge Function call and assert payload
    let capturedBody: any = null;
    const intercepted = new Promise<void>((resolve) => {
      page.route("**/functions/v1/submit-contact", async (route) => {
        const req = route.request();
        const bodyText = req.postData() || "{}";
        try {
          capturedBody = JSON.parse(bodyText);
        } catch {
          capturedBody = {};
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
        resolve();
      });
    });

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

    // Satisfy 3s anti-spam timer in Contact.tsx before submitting
    await page.waitForTimeout(3100);

    // Submit
    const submitButton = page.locator(
      'button[type="submit"], button:has-text("Submit"), button:has-text("Send")'
    );
    await submitButton.first().click();

    await intercepted; // wait for the route to capture the request
    expect(capturedBody).toBeTruthy();
    expect(capturedBody.email).toBe("john.doe@example.com");
  });

  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Form should still be visible on mobile
    await expect(page.locator("form")).toBeVisible();
  });
});
