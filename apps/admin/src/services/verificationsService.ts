import { getSupabaseClient } from "@sms-hub/supabase";

export interface Verification {
  id: string;
  hub_id: number;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  mobile_phone_number: string;
  auth_method: string;
  verification_code?: string | null;
  verification_attempts?: number | null;
  max_attempts?: string | null;
  stripe_customer_id?: string | null;
  created_at?: string | null;
  expires_at: string;
  is_verified?: boolean | null;
  verified_at?: string | null;
}

export interface VerificationStats {
  total: number;
  verified: number;
  unverified: number;
  expired: number;
  byAuthMethod: Record<string, number>;
  byHub: Record<string, number>;
}

class VerificationsService {
  private supabase: ReturnType<typeof getSupabaseClient>;

  constructor() {
    // Get environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    this.supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      console.log("VerificationsService: Testing database connection...");

      // Try a simple query to test connection
      const { data, error } = await this.supabase
        .from("verifications")
        .select("count")
        .limit(1);

      if (error) {
        console.error("VerificationsService: Connection test failed:", error);
        return false;
      }

      console.log("VerificationsService: Connection test successful");
      return true;
    } catch (err) {
      console.error("VerificationsService: Connection test error:", err);
      return false;
    }
  }

  async getVerifications(options?: {
    hub_id?: number;
    auth_method?: string;
    is_expired?: boolean;
    is_verified?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Verification[]> {
    let query = this.supabase
      .from("verifications")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (options?.hub_id) {
      query = query.eq("hub_id", options.hub_id);
    }

    if (options?.auth_method && options.auth_method !== "all") {
      query = query.eq("auth_method", options.auth_method);
    }

    if (options?.is_expired !== undefined) {
      const now = new Date().toISOString();
      if (options.is_expired) {
        query = query.lt("expires_at", now);
      } else {
        query = query.gte("expires_at", now);
      }
    }

    if (options?.is_verified !== undefined) {
      query = query.eq("is_verified", options.is_verified);
    }

    if (options?.search) {
      query = query.or(
        `first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%,company_name.ilike.%${options.search}%`
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 100) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching verifications:", error);
      console.error("Error details:", error.message, error.details, error.hint);
      throw new Error("Failed to fetch verifications");
    }

    return (data || []) as Verification[];
  }

  async getVerificationById(id: string): Promise<Verification | null> {
    const { data, error } = await this.supabase
      .from("verifications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching verification:", error);
      throw new Error("Failed to fetch verification");
    }

    return data as Verification;
  }

  async getVerificationStats(hub_id?: number): Promise<VerificationStats> {
    // Get all verifications for stats calculation
    const verifications = await this.getVerifications({ hub_id });

    const now = new Date();
    const stats: VerificationStats = {
      total: verifications.length,
      verified: verifications.filter((signup) => signup.is_verified === true)
        .length,
      unverified: verifications.filter((signup) => signup.is_verified !== true)
        .length,
      expired: verifications.filter(
        (signup) => new Date(signup.expires_at) < now
      ).length,
      byAuthMethod: {},
      byHub: {},
    };

    // Calculate auth method distribution
    verifications.forEach((signup) => {
      const method = signup.auth_method || "Unknown";
      stats.byAuthMethod[method] = (stats.byAuthMethod[method] || 0) + 1;
    });

    // Calculate hub distribution
    verifications.forEach((signup) => {
      const hub = signup.hub_id.toString();
      stats.byHub[hub] = (stats.byHub[hub] || 0) + 1;
    });

    return stats;
  }

  async deleteVerification(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("verifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting verification:", error);
      throw new Error("Failed to delete verification");
    }
  }

  async updateVerificationAttempts(
    id: string,
    attempts: number
  ): Promise<void> {
    const { error } = await this.supabase
      .from("verifications")
      .update({
        verification_attempts: attempts,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating verification attempts:", error);
      throw new Error("Failed to update verification attempts");
    }
  }

  async getUniqueAuthMethods(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("verifications")
      .select("auth_method")
      .not("auth_method", "is", null);

    if (error) {
      console.error("Error fetching auth methods:", error);
      return [];
    }

    const methods =
      data
        ?.map((item) => item.auth_method)
        .filter((method): method is string => method !== null) || [];
    return [...new Set(methods)]; // Remove duplicates
  }

  async getExpiredSignups(): Promise<Verification[]> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("verifications")
      .select("*")
      .lt("expires_at", now)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching expired signups:", error);
      throw new Error("Failed to fetch expired signups");
    }

    return (data || []) as Verification[];
  }

  async cleanupExpiredSignups(): Promise<number> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("verifications")
      .delete()
      .lt("expires_at", now)
      .select();

    if (error) {
      console.error("Error cleaning up expired signups:", error);
      throw new Error("Failed to cleanup expired signups");
    }

    return data?.length || 0;
  }

  // Global methods for fetching data across all hubs
  async getGlobalVerificationStats(): Promise<VerificationStats> {
    try {
      const { data: verifications, error } = await this.supabase
        .from("verifications")
        .select("*");

      if (error) {
        console.error("Error fetching global verification stats:", error);
        throw new Error("Failed to fetch global verification stats");
      }

      const now = new Date();
      const stats: VerificationStats = {
        total: verifications?.length || 0,
        verified:
          verifications?.filter((signup) => signup.is_verified === true)
            .length || 0,
        unverified:
          verifications?.filter((signup) => signup.is_verified !== true)
            .length || 0,
        expired:
          verifications?.filter((signup) => new Date(signup.expires_at) < now)
            .length || 0,
        byAuthMethod: {},
        byHub: {},
      };

      // Calculate auth method distribution
      verifications?.forEach((signup) => {
        const method = signup.auth_method || "Unknown";
        stats.byAuthMethod[method] = (stats.byAuthMethod[method] || 0) + 1;
      });

      // Calculate hub distribution
      verifications?.forEach((signup) => {
        const hub = signup.hub_id.toString();
        stats.byHub[hub] = (stats.byHub[hub] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error in getGlobalVerificationStats:", error);
      throw error;
    }
  }

  async getGlobalUniqueAuthMethods(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("verifications")
      .select("auth_method")
      .not("auth_method", "is", null);

    if (error) {
      console.error("Error fetching global auth methods:", error);
      return [];
    }

    const methods =
      data
        ?.map((item) => item.auth_method)
        .filter((method): method is string => method !== null) || [];
    return [...new Set(methods)]; // Remove duplicates
  }

  async verifyCode(verificationData: {
    verification_id: string;
    verification_code: string;
    email: string;
    mobile_phone_number: string;
    auth_method: string;
  }): Promise<any> {
    try {
      const { data, error } = await this.supabase.functions.invoke(
        "verify-code",
        { body: verificationData }
      );

      if (error) {
        console.error("Error verifying code:", error);
        throw new Error("Failed to verify code");
      }

      return data;
    } catch (error) {
      console.error("Error in verifyCode:", error);
      throw error;
    }
  }
}

export const verificationsService = new VerificationsService();
