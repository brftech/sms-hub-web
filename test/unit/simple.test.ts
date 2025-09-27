// Simple test to verify Vitest setup works
/// <reference types="vitest/globals" />
describe("Simple Test", () => {
  it("should work", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle async operations", async () => {
    const result = await Promise.resolve("test");
    expect(result).toBe("test");
  });

  it("should have access to global test utilities", () => {
    expect(global.testUtils).toBeDefined();
    expect(typeof global.testUtils.waitFor).toBe("function");
  });
});
