import type { AuthUser } from "../types";

/**
 * Get user's display name from various fields
 */
export function getUserDisplayName(user: AuthUser | null | undefined): string {
  if (!user) return "Guest User";

  // Try full name first
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`.trim();
  }

  // Try first name only
  if (user.first_name) {
    return user.first_name;
  }

  // Try last name only
  if (user.last_name) {
    return user.last_name;
  }

  // Fall back to email
  if (user.email) {
    return user.email;
  }

  // Fall back to phone
  if (user.mobile_phone_number) {
    return user.mobile_phone_number;
  }

  return "Unknown User";
}

/**
 * Get user's initials for avatar display
 */
export function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null
): string {
  // Try to get initials from name
  if (firstName || lastName) {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return (firstInitial + lastInitial) || "U";
  }

  // Try to get initials from email
  if (email && email.includes("@")) {
    const username = email.split("@")[0];
    if (username.includes(".")) {
      const parts = username.split(".");
      return (
        parts[0].charAt(0).toUpperCase() + 
        (parts[1] ? parts[1].charAt(0).toUpperCase() : "")
      );
    }
    return username.charAt(0).toUpperCase();
  }

  return "U";
}

/**
 * Format user role for display
 */
export function formatUserRole(role?: string | null): string {
  if (!role) return "User";

  const roleMap: Record<string, string> = {
    superadmin: "Super Administrator",
    admin: "Administrator",
    onboarded: "Verified User",
    user: "User",
  };

  const lowerRole = role.toLowerCase();
  return roleMap[lowerRole] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

/**
 * Get user's avatar URL or generate one
 */
export function getUserAvatar(user: AuthUser | null | undefined): string | null {
  if (!user) return null;

  // Check if user has a custom avatar URL (future feature)
  // if (user.avatar_url) return user.avatar_url;

  // Generate avatar URL from email
  if (user.email) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getUserDisplayName(user)
    )}&background=random&color=fff&size=200&bold=true`;
  }

  return null;
}

/**
 * Check if user profile is complete
 */
export function isProfileComplete(user: AuthUser | null | undefined): boolean {
  if (!user) return false;

  return Boolean(
    user.first_name &&
    user.last_name &&
    user.email &&
    user.mobile_phone_number
  );
}

/**
 * Get user's company status
 */
export function getUserCompanyStatus(user: AuthUser | null | undefined): {
  hasCompany: boolean;
  isCompanyAdmin: boolean;
} {
  if (!user) {
    return { hasCompany: false, isCompanyAdmin: false };
  }

  return {
    hasCompany: Boolean(user.company_id),
    isCompanyAdmin: Boolean(user.company_admin),
  };
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return "";

  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Format as +1 (XXX) XXX-XXXX for US numbers with country code
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return original for other formats
  return phone;
}