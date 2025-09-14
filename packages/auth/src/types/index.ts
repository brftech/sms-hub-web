import type { UserProfile, Membership } from "@sms-hub/types";

export interface AuthUser extends UserProfile {
  memberships?: Membership[];
}

export interface AuthSession {
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    email?: string;
    phone?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
}

export interface AuthConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  redirectUrl?: string;
  persistSession?: boolean;
  autoRefreshToken?: boolean;
  detectSessionInUrl?: boolean;
  debug?: boolean;
}

export type UserRole = "USER" | "ONBOARDED" | "ADMIN" | "SUPERADMIN";

export interface Permission {
  resource: string;
  action: string;
}

export interface RoutePermission {
  path: string;
  roles?: UserRole[];
  permissions?: Permission[];
}