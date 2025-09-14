import { UserProfile } from "../types/roles";

export function getUserDisplayName(user: UserProfile | null): string {
  if (!user) return "Guest User";

  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }

  if (user.first_name) {
    return user.first_name;
  }

  if (user.email) {
    return user.email;
  }

  return "Unknown User";
}

export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return "U";

  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";

  return firstInitial + lastInitial;
}

export function formatUserRole(role?: string): string {
  if (!role) return "User";

  switch (role.toLowerCase()) {
    case "superadmin":
      return "Superadmin";
    case "admin":
      return "Administrator";
    case "onboarded":
      return "Onboarded User";
    case "user":
      return "User";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}
