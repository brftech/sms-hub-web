# SMS Hub Testing Guide

## 🧪 Testing Structure

This monorepo uses a **hybrid testing approach**:

```
test/
├── unit/           # Cross-package unit tests
├── integration/    # Cross-package integration tests
├── e2e/           # End-to-end application tests
├── utils/          # Shared testing utilities
└── fixtures/       # Test data and mocks
```

## 📦 Package-Level Tests

Each package and app should have its own tests:

```
packages/ui/
├── src/
├── __tests__/      # Unit tests for UI components
└── package.json

apps/web/
├── src/
├── __tests__/      # Unit tests for web app
└── package.json
```

## 🚀 Running Tests

### All Tests

```bash
pnpm test                    # Run all tests
pnpm test:unit             # Run only unit tests
pnpm test:integration      # Run only integration tests
pnpm test:e2e              # Run only E2E tests
```

### Package-Specific Tests

```bash
pnpm test --filter=@sms-hub/ui
pnpm test --filter=@sms-hub/web
pnpm test --filter=@sms-hub/types
```

### Watch Mode

```bash
pnpm test:watch            # Watch all tests
pnpm test:watch --filter=@sms-hub/ui
```

## 🛠️ Test Configuration

### Jest Configuration

- **Root**: `jest.config.js` (monorepo-wide settings)
- **Packages**: `jest.config.js` (package-specific overrides)
- **Apps**: `jest.config.js` (app-specific overrides)

### Test Environment

- **Unit**: `jsdom` for React components
- **Integration**: Node.js with Supabase test client
- **E2E**: Playwright with real browser

## 📝 Writing Tests

### Unit Tests

```typescript
// packages/ui/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
// test/integration/hub-context.test.ts
import { createTestClient } from "../utils/test-client";
import { HubProvider } from "@sms-hub/ui";

describe("Hub Context Integration", () => {
  it("maintains hub context across navigation", async () => {
    // Test hub context persistence
  });
});
```

### E2E Tests

```typescript
// test/e2e/signup-flow.spec.ts
import { test, expect } from "@playwright/test";

test("complete signup flow", async ({ page }) => {
  await page.goto("/gnymble/signup");
  // Test complete signup process
});
```

## 🔧 Test Utilities

### Common Helpers

- `createTestClient()` - Supabase test client
- `renderWithProviders()` - React component with context
- `mockHubConfig()` - Hub configuration mocks
- `createTestUser()` - User fixture creation

### Mock Data

- Hub configurations
- User profiles
- Company data
- SMS messages

## 📊 Test Coverage

### Coverage Targets

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 60%+ coverage
- **E2E Tests**: Critical user flows

### Coverage Reports

```bash
pnpm test:coverage         # Generate coverage report
pnpm test:coverage:html    # HTML coverage report
```

## 🚨 Testing Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking

- Mock external dependencies (Supabase, Stripe)
- Use realistic test data
- Avoid testing implementation details

### 3. Async Testing

- Always await async operations
- Use proper error handling
- Test both success and failure cases

### 4. Hub Context

- Test with different hub configurations
- Verify hub isolation
- Test hub switching (admin users)

## 🔍 Debugging Tests

### Debug Mode

```bash
pnpm test:debug            # Run tests in debug mode
```

### Logging

```bash
pnpm test --verbose        # Verbose test output
```

### Single Test

```bash
pnpm test --testNamePattern="Button renders correctly"
```

## 📚 Testing Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Turbo Testing Guide](https://turbo.build/repo/docs/core-concepts/monorepos/testing)
