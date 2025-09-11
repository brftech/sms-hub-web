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

class VerificationsService {
  private supabase = getSupabaseClient();

  async getVerifications(
    filters: VerificationFilters = {}
  ): Promise<Verification[]> {
    try {
      let query = this.supabase.from("verifications").select(`
        *,
        hub:hubs(
          hub_number,
          name
        ),
        existing_user:user_profiles(
          id,
          email,
          first_name,
          last_name
        )
      `);

      // Apply filters
      if (filters.hub_id !== undefined) {
        query = query.eq("hub_id", filters.hub_id);
      }

      if (filters.preferred_verification_method) {
        query = query.eq(
          "preferred_verification_method",
          filters.preferred_verification_method
        );
      }

      if (filters.onboarding_step) {
        query = query.eq("onboarding_step", filters.onboarding_step);
      }

      if (filters.is_existing_user !== undefined) {
        query = query.eq("is_existing_user", filters.is_existing_user);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error fetching verifications:", error);
        throw error;
      }

      // Process the data to add computed fields
      const verifications = (data || []).map((verification) => ({
        ...verification,
        // Add computed fields for display
        status: this.getStatus(verification),
        full_name: this.getFullName(verification),
        contact_info: this.getContactInfo(verification),
        verification_age: this.getVerificationAge(verification),
      })) as unknown as Verification[];

      // Apply search filter after fetching
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return verifications.filter(
          (verification) =>
            verification.email?.toLowerCase().includes(searchTerm) ||
            verification.mobile_phone?.toLowerCase().includes(searchTerm) ||
            verification.full_name?.toLowerCase().includes(searchTerm) ||
            verification.hub?.name?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply status filter
      if (filters.status) {
        return verifications.filter(
          (verification) => verification.status === filters.status
        );
      }

      return verifications;
    } catch (error) {
      console.error("Error in getVerifications:", error);
      throw error;
    }
  }

  async getVerificationById(id: string): Promise<Verification | null> {
    try {
      const { data, error } = await this.supabase
        .from("verifications")
        .select(
          `
          *,
          hub:hubs(
            hub_number,
            name
          ),
          existing_user:user_profiles(
            id,
            email,
            first_name,
            last_name
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching verification:", error);
        return null;
      }

      return {
        ...data,
        status: this.getStatus(data),
        full_name: this.getFullName(data),
        contact_info: this.getContactInfo(data),
        verification_age: this.getVerificationAge(data),
      } as unknown as Verification;
    } catch (error) {
      console.error("Error in getVerificationById:", error);
      return null;
    }
  }

  async createVerification(verificationData: any): Promise<Verification> {
    try {
      const { data, error } = await this.supabase
        .from("verifications")
        .insert([verificationData])
        .select(
          `
          *,
          hub:hubs(
            hub_number,
            name
          ),
          existing_user:user_profiles(
            id,
            email,
            first_name,
            last_name
          )
        `
        )
        .single();

      if (error) {
        console.error("Error creating verification:", error);
        throw error;
      }

      return {
        ...data,
        status: this.getStatus(data),
        full_name: this.getFullName(data),
        contact_info: this.getContactInfo(data),
        verification_age: this.getVerificationAge(data),
      } as unknown as Verification;
    } catch (error) {
      console.error("Error in createVerification:", error);
      throw error;
    }
  }

  async updateVerification(id: string, updates: any): Promise<Verification> {
    try {
      const { data, error } = await this.supabase
        .from("verifications")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          hub:hubs(
            hub_number,
            name
          ),
          existing_user:user_profiles(
            id,
            email,
            first_name,
            last_name
          )
        `
        )
        .single();

      if (error) {
        console.error("Error updating verification:", error);
        throw error;
      }

      return {
        ...data,
        status: this.getStatus(data),
        full_name: this.getFullName(data),
        contact_info: this.getContactInfo(data),
        verification_age: this.getVerificationAge(data),
      } as unknown as Verification;
    } catch (error) {
      console.error("Error in updateVerification:", error);
      throw error;
    }
  }

  async deleteVerification(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("verifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting verification:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteVerification:", error);
      throw error;
    }
  }

  // Helper methods for computed fields
  private getStatus(
    verification: any
  ): "pending" | "completed" | "expired" | "failed" {
    if (verification.verification_completed_at) return "completed";
    if (verification.user_created_at) return "completed";

    // Check if verification is expired (older than 24 hours)
    const createdAt = new Date(verification.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) return "expired";

    return "pending";
  }

  private getFullName(verification: any): string {
    if (
      verification.existing_user?.first_name &&
      verification.existing_user?.last_name
    ) {
      return `${verification.existing_user.first_name} ${verification.existing_user.last_name}`;
    }

    // Try to get name from step_data
    if (
      verification.step_data?.first_name &&
      verification.step_data?.last_name
    ) {
      return `${verification.step_data.first_name} ${verification.step_data.last_name}`;
    }

    return "Unknown User";
  }

  private getContactInfo(verification: any): string {
    const parts = [];
    if (verification.email) parts.push(verification.email);
    if (verification.mobile_phone) parts.push(verification.mobile_phone);
    return parts.join(" • ");
  }

  private getVerificationAge(verification: any): string {
    const createdAt = new Date(verification.created_at);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return createdAt.toLocaleDateString();
  }
}

export const verificationsService = {
  instance: new VerificationsService(),
};
