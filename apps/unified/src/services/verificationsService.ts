import { getSupabaseClient } from "../lib/supabaseSingleton";

export interface Verification {
  id: string;
  hub_id: number;
  email?: string;
  mobile_phone?: string;
  verification_code?: string;
  verification_sent_at?: string;
  last_verification_attempt_at?: string;
  preferred_verification_method: string;
  onboarding_step: string;
  step_data: any;
  marketing_consent: boolean;
  terms_accepted_at?: string;
  privacy_policy_accepted_at?: string;
  is_existing_user: boolean;
  existing_user_id?: string;
  verification_completed_at?: string;
  user_created_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  hub?: {
    hub_number: number;
    name: string;
  };
  existing_user?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  // Computed fields for display
  status?: "pending" | "completed" | "expired" | "failed";
  full_name?: string;
  contact_info?: string;
  verification_age?: string;
}

export interface VerificationFilters {
  search?: string;
  hub_id?: number;
  status?: string;
  preferred_verification_method?: string;
  onboarding_step?: string;
  is_existing_user?: boolean;
  limit?: number;
}

// DEPRECATED: The verifications table has been removed from the database.
// This service is kept as a stub to prevent breaking the Admin Dashboard.
// It will be removed once the Admin Dashboard is updated to remove verification features.
class VerificationsService {
  private supabase = getSupabaseClient();

  async getVerifications(
    filters: VerificationFilters = {}
  ): Promise<Verification[]> {
    console.warn("VerificationsService: verifications table no longer exists. Returning empty array.");
    return [];
  }

  async getVerificationById(id: string): Promise<Verification | null> {
    console.warn("VerificationsService: verifications table no longer exists. Returning null.");
    return null;
  }

  async createVerification(verificationData: any): Promise<Verification> {
    console.error("VerificationsService: Cannot create verification - table no longer exists.");
    throw new Error("Verifications table has been removed. Use Supabase native auth instead.");
  }

  async updateVerification(id: string, updates: any): Promise<Verification> {
    console.error("VerificationsService: Cannot update verification - table no longer exists.");
    throw new Error("Verifications table has been removed. Use Supabase native auth instead.");
  }

  async deleteVerification(id: string): Promise<boolean> {
    console.error("VerificationsService: Cannot delete verification - table no longer exists.");
    throw new Error("Verifications table has been removed. Use Supabase native auth instead.");
  }
}

export const verificationsService = {
  instance: new VerificationsService(),
};