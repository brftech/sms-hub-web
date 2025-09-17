module.exports = {
  // Monorepo-wide Jest configuration
  projects: [
    // Integration tests at root level
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/../test/integration/**/*.{test,spec}.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
      preset: 'ts-jest',
      moduleNameMapper: {
        '^@sms-hub/(.*)$': '<rootDir>/../packages/$1/src',
        '^@/(.*)$': '<rootDir>/../apps/web/src/$1',
      },
    },
    // Unit tests at root level
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/../test/unit/**/*.{test,spec}.{ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
      preset: 'ts-jest',
      moduleNameMapper: {
        '^@sms-hub/(.*)$': '<rootDir>/../packages/$1/src',
      },
    },
    // Package-level tests (if they exist)
    '<rootDir>/../packages/*/jest.config.js',
    '<rootDir>/../apps/*/jest.config.js',
  ],
  
  // Global test configuration
  testTimeout: 10000,
  verbose: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  
  // Global setup and teardown
  globalSetup: '<rootDir>/../test/global-setup.ts',
  globalTeardown: '<rootDir>/../test/global-teardown.ts',
  
  // File extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/.turbo/',
    '/coverage/',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    '../packages/*/src/**/*.{ts,tsx}',
    '../apps/*/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
