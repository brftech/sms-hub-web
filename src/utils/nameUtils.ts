/**
 * Utility functions for parsing and formatting names
 */

export interface ParsedName {
  firstName: string | null;
  lastName: string | null;
}

/**
 * Parse a full name string into first and last name components
 * @param fullName - The full name to parse (e.g., "John Doe")
 * @returns Object with firstName and lastName properties
 *
 * @example
 * parseFullName("John Doe") // { firstName: "John", lastName: "Doe" }
 * parseFullName("Mary Jane Watson") // { firstName: "Mary", lastName: "Jane Watson" }
 * parseFullName("Prince") // { firstName: "Prince", lastName: null }
 * parseFullName(null) // { firstName: null, lastName: null }
 */
export function parseFullName(fullName: string | null | undefined): ParsedName {
  if (!fullName?.trim()) {
    return { firstName: null, lastName: null };
  }

  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/); // Split on any whitespace

  if (parts.length === 0) {
    return { firstName: null, lastName: null };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: null };
  }

  // First part is first name, everything else is last name
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Format first and last name into a full name string
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Full name string or null if both are null
 *
 * @example
 * formatFullName("John", "Doe") // "John Doe"
 * formatFullName("Prince", null) // "Prince"
 * formatFullName(null, null) // null
 */
export function formatFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string | null {
  const first = firstName?.trim() || "";
  const last = lastName?.trim() || "";

  if (!first && !last) {
    return null;
  }

  return [first, last].filter(Boolean).join(" ");
}

/**
 * Get display name from either full name or first/last name components
 * Falls back to email or a default string if no name is available
 *
 * @param options - Name components and fallbacks
 * @returns A display-friendly name string
 */
export function getDisplayName(options: {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  fallback?: string;
}): string {
  const { fullName, firstName, lastName, email, fallback = "Unknown" } = options;

  // Try full name first
  if (fullName?.trim()) {
    return fullName.trim();
  }

  // Try combining first and last name
  const formatted = formatFullName(firstName, lastName);
  if (formatted) {
    return formatted;
  }

  // Try first name only
  if (firstName?.trim()) {
    return firstName.trim();
  }

  // Fall back to email (without domain)
  if (email?.trim()) {
    return email.split("@")[0];
  }

  // Ultimate fallback
  return fallback;
}
