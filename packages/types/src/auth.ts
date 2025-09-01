import type { Database } from "./database";

export type Verification = Database["public"]["Tables"]["verifications"]["Row"];
export type VerificationAttempt =
  Database["public"]["Tables"]["verification_attempts"]["Row"];
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type Membership = Database["public"]["Tables"]["memberships"]["Row"];

export interface AuthContextType {
  user: UserProfile | null;
  session: any | null;
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
