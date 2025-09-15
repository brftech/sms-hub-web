module.exports = {
  // Monorepo-wide Jest configuration
  projects: [
    // Root-level tests (integration, e2e, etc.)
    {
      displayName: 'root',
      testMatch: ['<rootDir>/../test/**/*.{test,spec}.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
      moduleNameMapper: {
        '^@sms-hub/(.*)$': '<rootDir>/../packages/$1/src',
      },
    },
  ],
  
  // Global test configuration
  testTimeout: 10000,
  verbose: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  
  // Global setup and teardown
  globalSetup: '<rootDir>/../test/global-setup.ts',
  globalTeardown: '<rootDir>/../test/global-teardown.ts',
  
  // Test environment variables
  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
  
  // Module name mapping for monorepo packages
  moduleNameMapper: {
    '^@sms-hub/(.*)$': '<rootDir>/../packages/$1/src',
    '^@/(.*)$': '<rootDir>/../apps/web/src/$1',
    // Mock static assets
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/../test/utils/file-mock.js',
  },
  

  
  // Test environment
  testEnvironment: 'jsdom',
  
  // TypeScript configuration
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
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
