import type { Database } from "./database";

export type Verification = Database["public"]["Tables"]["sms_verifications"]["Row"];
// Note: verification_attempts table doesn't exist in the current schema
// export type VerificationAttempt =
//   Database["public"]["Tables"]["verification_attempts"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type Membership = Database["public"]["Tables"]["memberships"]["Row"];

export interface AuthContextType {
  user: UserProfile | null;
  session: {
    access_token?: string;
    refresh_token?: string;
    user?: unknown;
  } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithPhone: (phone: string, hubId: number) => Promise<void>;
  verifyOTP: (token: string, verificationId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface SignupData {
  hub_id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  mobile_phone_number: string;
  email: string;
  auth_method?: "sms" | "email";
}

export interface VerificationData {
  verification_id: string;
  verification_code: string;
}
