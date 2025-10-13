/**
 * Unit tests for name parsing and formatting utilities
 */
/// <reference types="vitest/globals" />

import { describe, it, expect } from "vitest";
import { parseFullName, formatFullName, getDisplayName } from "../../src/utils/nameUtils";

describe("parseFullName", () => {
  it("should parse a two-word name correctly", () => {
    const result = parseFullName("John Doe");
    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  it("should parse multi-word last names", () => {
    const result = parseFullName("Mary Jane Watson");
    expect(result).toEqual({
      firstName: "Mary",
      lastName: "Jane Watson",
    });
  });

  it("should handle single word names", () => {
    const result = parseFullName("Prince");
    expect(result).toEqual({
      firstName: "Prince",
      lastName: null,
    });
  });

  it("should handle null input", () => {
    const result = parseFullName(null);
    expect(result).toEqual({
      firstName: null,
      lastName: null,
    });
  });

  it("should handle undefined input", () => {
    const result = parseFullName(undefined);
    expect(result).toEqual({
      firstName: null,
      lastName: null,
    });
  });

  it("should handle empty string", () => {
    const result = parseFullName("");
    expect(result).toEqual({
      firstName: null,
      lastName: null,
    });
  });

  it("should handle whitespace-only string", () => {
    const result = parseFullName("   ");
    expect(result).toEqual({
      firstName: null,
      lastName: null,
    });
  });

  it("should trim whitespace from names", () => {
    const result = parseFullName("  John   Doe  ");
    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  it("should handle multiple spaces between names", () => {
    const result = parseFullName("John    Doe");
    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
    });
  });

  it("should handle names with hyphens", () => {
    const result = parseFullName("Mary-Jane Parker");
    expect(result).toEqual({
      firstName: "Mary-Jane",
      lastName: "Parker",
    });
  });

  it("should handle names with apostrophes", () => {
    const result = parseFullName("Patrick O'Brien");
    expect(result).toEqual({
      firstName: "Patrick",
      lastName: "O'Brien",
    });
  });

  it("should handle four-word names", () => {
    const result = parseFullName("Juan Carlos De La Cruz");
    expect(result).toEqual({
      firstName: "Juan",
      lastName: "Carlos De La Cruz",
    });
  });
});

describe("formatFullName", () => {
  it("should format first and last name", () => {
    const result = formatFullName("John", "Doe");
    expect(result).toBe("John Doe");
  });

  it("should handle first name only", () => {
    const result = formatFullName("Prince", null);
    expect(result).toBe("Prince");
  });

  it("should handle last name only (unusual case)", () => {
    const result = formatFullName(null, "Smith");
    expect(result).toBe("Smith");
  });

  it("should return null for both null", () => {
    const result = formatFullName(null, null);
    expect(result).toBeNull();
  });

  it("should return null for both undefined", () => {
    const result = formatFullName(undefined, undefined);
    expect(result).toBeNull();
  });

  it("should handle empty strings", () => {
    const result = formatFullName("", "");
    expect(result).toBeNull();
  });

  it("should trim whitespace", () => {
    const result = formatFullName("  John  ", "  Doe  ");
    expect(result).toBe("John Doe");
  });

  it("should handle mixed null and empty string", () => {
    const result = formatFullName("John", "");
    expect(result).toBe("John");
  });
});

describe("getDisplayName", () => {
  it("should use full name when available", () => {
    const result = getDisplayName({
      fullName: "John Doe",
      firstName: "Jane",
      lastName: "Smith",
      email: "test@example.com",
    });
    expect(result).toBe("John Doe");
  });

  it("should combine first and last name when full name is not available", () => {
    const result = getDisplayName({
      firstName: "Jane",
      lastName: "Smith",
      email: "test@example.com",
    });
    expect(result).toBe("Jane Smith");
  });

  it("should use first name only when last name is missing", () => {
    const result = getDisplayName({
      firstName: "Jane",
      email: "test@example.com",
    });
    expect(result).toBe("Jane");
  });

  it("should extract name from email when no name is available", () => {
    const result = getDisplayName({
      email: "john.doe@example.com",
    });
    expect(result).toBe("john.doe");
  });

  it("should use fallback when nothing is available", () => {
    const result = getDisplayName({
      fallback: "Guest User",
    });
    expect(result).toBe("Guest User");
  });

  it("should use default fallback when nothing is available", () => {
    const result = getDisplayName({});
    expect(result).toBe("Unknown");
  });

  it("should trim whitespace from full name", () => {
    const result = getDisplayName({
      fullName: "  John Doe  ",
    });
    expect(result).toBe("John Doe");
  });

  it("should handle null values", () => {
    const result = getDisplayName({
      fullName: null,
      firstName: null,
      lastName: null,
      email: null,
    });
    expect(result).toBe("Unknown");
  });

  it("should prioritize full name over combined name", () => {
    const result = getDisplayName({
      fullName: "Dr. John Smith",
      firstName: "John",
      lastName: "Smith",
    });
    expect(result).toBe("Dr. John Smith");
  });

  it("should handle empty email", () => {
    const result = getDisplayName({
      email: "",
      fallback: "Anonymous",
    });
    expect(result).toBe("Anonymous");
  });
});

describe("nameUtils integration tests", () => {
  it("should handle round-trip parsing and formatting", () => {
    const originalName = "John Doe";
    const { firstName, lastName } = parseFullName(originalName);
    const formatted = formatFullName(firstName, lastName);
    expect(formatted).toBe(originalName);
  });

  it("should handle edge case names in display context", () => {
    const testCases = [
      {
        input: { fullName: "Cher" },
        expected: "Cher",
      },
      {
        input: { firstName: "Madonna", lastName: null },
        expected: "Madonna",
      },
      {
        input: { email: "admin@system.local" },
        expected: "admin",
      },
    ];

    testCases.forEach(({ input, expected }) => {
      expect(getDisplayName(input)).toBe(expected);
    });
  });
});
