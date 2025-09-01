// Global test teardown - runs once after all tests
export default async function globalTeardown() {
  console.log("🧹 Cleaning up global test environment...");

  // Clean up any global test state
  // Close database connections, clear mocks, etc.

  console.log("✅ Global test environment cleanup complete");
}
