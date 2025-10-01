# E2E Tests for SMS Hub Web

## 📋 Test Structure

This directory contains end-to-end tests for the SMS Hub Web marketing site and Sales Dashboard.

### Directory Organization

```
test/e2e/
├── web/              # Marketing website tests (home, contact, pricing)
├── admin/            # Sales Dashboard tests
├── integration/      # Cross-page navigation and integration tests
└── README.md         # This file
```

## 🎭 Test Projects (6 Browsers)

The Playwright config runs tests across **6 different browser configurations**:

### Marketing Website Tests (`web/`)

1. **chromium** - Desktop Chrome
2. **firefox** - Desktop Firefox
3. **mobile** - Mobile (Pixel 5)

### Sales Dashboard Tests (`admin/`)

4. **admin-chromium** - Desktop Chrome
5. **admin-firefox** - Desktop Firefox

### Integration Tests (`integration/`)

6. **integration** - Desktop Chrome

## 🚀 Running Tests

```bash
# Run all tests
npx playwright test

# Run specific suite
npx playwright test web/
npx playwright test admin/
npx playwright test integration/

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=mobile
npx playwright test --project=admin-chromium

# Interactive UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Run specific test file
npx playwright test web/contact.spec.ts
```

## 📊 Viewing Results

```bash
# Open HTML report
npx playwright show-report

# Generate and open report
npx playwright test --reporter=html
npx playwright show-report
```

## 🧪 Test Coverage

### Web Tests (`web/`)

- ✅ **home.spec.ts** - Home page loading, branding, navigation
- ✅ **contact.spec.ts** - Contact form validation and submission
- ✅ **pricing.spec.ts** - Pricing page display and CTAs

### Admin Tests (`admin/`)

- ✅ **sales-dashboard.spec.ts** - Dashboard access, hub-specific data

### Integration Tests (`integration/`)

- ✅ **navigation.spec.ts** - Cross-page navigation, hub context

## 📝 Writing New Tests

Create test files in the appropriate directory:

```typescript
// test/e2e/web/new-feature.spec.ts
import { test, expect } from "@playwright/test";

test.describe("New Feature", () => {
  test("should work correctly", async ({ page }) => {
    await page.goto("/");
    // Your test code
  });
});
```

## 🎯 Best Practices

1. **Use semantic selectors**: Prefer text content and ARIA labels over CSS classes
2. **Wait for elements**: Use `await expect().toBeVisible()` instead of arbitrary waits
3. **Test user flows**: Focus on what users actually do
4. **Keep tests independent**: Each test should work standalone
5. **Use descriptive names**: Test names should explain what they verify

## 🔧 Configuration

Tests are configured in `config/playwright.config.ts`:

- Timeout: 30 seconds per test
- Retries: 2 in CI, 0 locally
- Screenshots: On failure only
- Video: Retained on failure
- Traces: On first retry

## 📱 Responsive Testing

Mobile tests automatically use Pixel 5 viewport (393x851).
Tests can also explicitly set viewport:

```typescript
await page.setViewportSize({ width: 375, height: 667 });
```

## 🐛 Debugging

1. **UI Mode**: `npx playwright test --ui` - Interactive test runner
2. **Debug Mode**: `npx playwright test --debug` - Step through tests
3. **Headed Mode**: `npx playwright test --headed` - See browser
4. **Trace Viewer**: After failure, open trace file for detailed playback

## 📦 What Gets Tested

✅ Page loading and navigation
✅ Form validation and submission  
✅ Responsive design (mobile + desktop)
✅ Cross-browser compatibility
✅ Hub-specific branding
✅ Sales Dashboard access
✅ Integration between pages

## ❌ What Doesn't Get Tested

- Backend API endpoints (use integration tests)
- Database operations (use unit tests)
- User authentication flows (no signup in marketing site)
- External service integrations (mocked in tests)

---

**Status**: ✅ Active | **Last Updated**: October 1, 2025
