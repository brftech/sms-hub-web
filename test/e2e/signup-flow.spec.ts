import { test, expect } from "@playwright/test";

test.describe("Signup Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to signup page before each test
    await page.goto("/gnymble/signup");
  });

  test("complete signup flow for new user", async ({ page }) => {
    // Test the complete signup process
    await expect(page).toHaveTitle(/Gnymble/);

    // Fill out signup form
    await page.fill('[data-testid="company-name"]', "Test Cigar Shop");
    await page.fill('[data-testid="first-name"]', "John");
    await page.fill('[data-testid="last-name"]', "Doe");

    // Submit first step
    await page.click('[data-testid="submit-step-1"]');

    // Verify we're on step 2
    await expect(page.locator('[data-testid="step-2"]')).toBeVisible();

    // Fill out contact information
    await page.fill('[data-testid="phone-number"]', "+15551234567");
    await page.fill('[data-testid="email"]', "john@testcigarshop.com");

    // Select verification method
    await page.click('[data-testid="verification-sms"]');

    // Submit verification step
    await page.click('[data-testid="submit-verification"]');

    // Verify verification code was sent
    await expect(
      page.locator('[data-testid="verification-sent"]')
    ).toBeVisible();
  });

  test("handles existing user signup attempt", async ({ page }) => {
    // Test cross-hub account detection
    await page.fill('[data-testid="company-name"]', "Test Company");
    await page.fill('[data-testid="first-name"]', "Jane");
    await page.fill('[data-testid="last-name"]', "Smith");
    await page.fill('[data-testid="phone-number"]', "+15551234567");
    await page.fill('[data-testid="email"]', "existing@user.com");

    await page.click('[data-testid="submit-verification"]');

    // Should show cross-hub warning
    await expect(
      page.locator('[data-testid="cross-hub-warning"]')
    ).toBeVisible();
  });

  test("hub-specific branding is applied", async ({ page }) => {
    // Verify Gnymble-specific branding
    await expect(page.locator('[data-testid="hub-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="hub-name"]')).toContainText(
      "Gnymble"
    );

    // Check hub-specific colors
    const primaryColor = await page
      .locator('[data-testid="primary-color"]')
      .getCSSProperty("background-color");
    expect(primaryColor.value).toBe("rgb(204, 85, 0)"); // Gnymble orange
  });
});

test.describe("Hub Switching", () => {
  test("admin can switch between hubs", async ({ page }) => {
    // Login as admin user
    await page.goto("/gnymble/login");
    await page.fill('[data-testid="email"]', "admin@gnymble.com");
    await page.fill('[data-testid="password"]', "admin123");
    await page.click('[data-testid="login-button"]');

    // Navigate to dashboard
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();

    // Open hub switcher
    await page.click('[data-testid="hub-switcher"]');

    // Switch to PercyMD
    await page.click('[data-testid="hub-percymd"]');

    // Verify hub context changed
    await expect(page.locator('[data-testid="current-hub"]')).toContainText(
      "PercyMD"
    );
  });
});
