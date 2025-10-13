/**
 * Shared name parsing utilities for Edge Functions
 * This is a Deno-compatible version that mirrors src/utils/nameUtils.ts
 */

export interface ParsedName {
  firstName: string | null;
  lastName: string | null;
}

export function parseFullName(fullName: string | null | undefined): ParsedName {
  if (!fullName?.trim()) {
    return { firstName: null, lastName: null };
  }

  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || null,
    lastName: parts.slice(1).join(" ") || null,
  };
}

export function formatFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string | null {
  const parts: string[] = [];
  if (firstName?.trim()) parts.push(firstName.trim());
  if (lastName?.trim()) parts.push(lastName.trim());
  return parts.length > 0 ? parts.join(" ") : null;
}

export function getDisplayName(params: {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  fallback?: string;
}): string {
  const { fullName, firstName, lastName, email, fallback = "Unknown" } = params;

  // Priority 1: Full name
  if (fullName?.trim()) {
    return fullName.trim();
  }

  // Priority 2: Combine first + last name
  if (firstName || lastName) {
    const formatted = formatFullName(firstName, lastName);
    if (formatted) return formatted;
  }

  // Priority 3: Extract name from email
  if (email?.trim()) {
    const emailName = email.split("@")[0];
    if (emailName && emailName.trim()) {
      return emailName.trim();
    }
  }

  // Priority 4: Fallback
  return fallback;
}
