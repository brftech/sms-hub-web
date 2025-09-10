import { getSupabaseClient } from "@sms-hub/supabase";

export interface CleanupResult {
  success: boolean;
  message: string;
  details?: {
    companiesDeleted: number;
    verificationsDeleted: number;
    userProfilesDeleted: number;
    leadsDeleted: number;
    authUsersDeleted: number;
    [key: string]: number;
  };
  error?: string;
}

class DataCleanupService {
  private supabase: ReturnType<typeof getSupabaseClient>;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    this.supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey);
  }

  // Get current data counts for safety check
  async getCurrentDataCounts(): Promise<Record<string, number>> {
    try {
      const [
        companiesCount,
        verificationsCount,
        userProfilesCount,
        leadsCount,
        authUsersCount,
      ] = await Promise.all([
        this.supabase.from("companies").select("id", { count: "exact" }),
        this.supabase.from("verifications").select("id", { count: "exact" }),
        this.supabase.from("user_profiles").select("id", { count: "exact" }),
        this.supabase.from("leads").select("id", { count: "exact" }),
        this.supabase.auth.admin.listUsers(),
      ]);

      return {
        companies: companiesCount.count || 0,
        verifications: verificationsCount.count || 0,
        userProfiles: userProfilesCount.count || 0,
        leads: leadsCount.count || 0,
        authUsers: (authUsersCount.data as any)?.length || 0,
      };
    } catch (error) {
      console.error("Error getting data counts:", error);
      throw new Error("Failed to get current data counts");
    }
  }

  // Perform the data cleanup operation
  async performDataCleanup(): Promise<CleanupResult> {
    try {
      console.log("Starting data cleanup operation...");

      // First, get current counts for reporting
      const beforeCounts = await this.getCurrentDataCounts();

      // Delete data from public schema tables using direct operations
      console.log("Deleting data from public schema tables...");

      const cleanupResults = await Promise.allSettled([
        // Keep companies created before Sept 1, 2025 (delete those created after)
        this.supabase
          .from("companies")
          .delete()
          .gt("created_at", "2025-09-01"),

        this.supabase.from("verifications").delete(),
        this.supabase.from("verification_attempts").delete(),
        this.supabase.from("user_profiles").delete(),
        this.supabase.from("leads").delete(),
        this.supabase.from("lead_activities").delete(),
        this.supabase.from("memberships").delete(),
        this.supabase.from("onboarding_submissions").delete(),
        this.supabase.from("onboarding_steps").delete(),
        this.supabase.from("phone_numbers").delete(),
        this.supabase.from("tcr_integrations").delete(),
        this.supabase.from("bandwidth_accounts").delete(),
        this.supabase.from("brands").delete(),
        this.supabase.from("campaigns").delete(),
        this.supabase.from("campaign_phone_assignments").delete(),
        this.supabase.from("admin_audit_logs").delete(),
        this.supabase.from("payment_history").delete(),
      ]);

      // Log cleanup results
      cleanupResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Cleanup operation ${index} failed:`, result.reason);
        }
      });

      // Note: Auth schema cleanup requires direct database access or admin privileges
      // For now, we'll focus on the public schema tables
      console.log(
        "Public schema cleanup completed. Auth schema cleanup requires admin privileges."
      );

      // Get after counts
      const afterCounts = await this.getCurrentDataCounts();

      // Calculate what was deleted
      const details = {
        companiesDeleted: beforeCounts.companies - afterCounts.companies,
        verificationsDeleted:
          beforeCounts.verifications - afterCounts.verifications,
        userProfilesDeleted:
          beforeCounts.userProfiles - afterCounts.userProfiles,
        leadsDeleted: beforeCounts.leads - afterCounts.leads,
        authUsersDeleted: beforeCounts.authUsers - afterCounts.authUsers,
      };

      console.log("Data cleanup completed successfully");
      console.log("Deleted:", details);

      return {
        success: true,
        message:
          "Data cleanup completed successfully (public schema only). Auth schema cleanup requires admin privileges.",
        details,
      };
    } catch (error) {
      console.error("Error during data cleanup:", error);

      return {
        success: false,
        message: "Data cleanup failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Alternative method using direct SQL execution if RPC is not available
  async performDataCleanupDirect(): Promise<CleanupResult> {
    try {
      console.log("Starting direct data cleanup operation...");

      // Get current counts
      const beforeCounts = await this.getCurrentDataCounts();

      // Execute cleanup SQL directly using individual table operations
      console.log("Executing cleanup using direct table operations...");

      const cleanupResults = await Promise.allSettled([
        // Keep companies created before Sept 1, 2025 (delete those created after)
        this.supabase
          .from("companies")
          .delete()
          .gt("created_at", "2025-09-01"),

        this.supabase.from("verifications").delete(),
        this.supabase.from("verification_attempts").delete(),
        this.supabase.from("user_profiles").delete(),
        this.supabase.from("leads").delete(),
        this.supabase.from("lead_activities").delete(),
        this.supabase.from("memberships").delete(),
        this.supabase.from("onboarding_submissions").delete(),
        this.supabase.from("onboarding_steps").delete(),
        this.supabase.from("phone_numbers").delete(),
        this.supabase.from("tcr_integrations").delete(),
        this.supabase.from("bandwidth_accounts").delete(),
        this.supabase.from("brands").delete(),
        this.supabase.from("campaigns").delete(),
        this.supabase.from("campaign_phone_assignments").delete(),
        this.supabase.from("admin_audit_logs").delete(),
        this.supabase.from("payment_history").delete(),
      ]);

      // Log cleanup results
      cleanupResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Direct cleanup operation ${index} failed:`,
            result.reason
          );
        }
      });

      // Get after counts
      const afterCounts = await this.getCurrentDataCounts();

      const details = {
        companiesDeleted: beforeCounts.companies - afterCounts.companies,
        verificationsDeleted:
          beforeCounts.verifications - afterCounts.verifications,
        userProfilesDeleted:
          beforeCounts.userProfiles - afterCounts.userProfiles,
        leadsDeleted: beforeCounts.leads - afterCounts.leads,
        authUsersDeleted: beforeCounts.authUsers - afterCounts.authUsers,
      };

      return {
        success: true,
        message:
          "Direct data cleanup completed successfully (public schema only)",
        details,
      };
    } catch (error) {
      console.error("Error during direct data cleanup:", error);
      return {
        success: false,
        message: "Direct data cleanup failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Method to handle foreign key constraints by deleting in correct order
  async performDataCleanupWithFKHandling(): Promise<CleanupResult> {
    try {
      console.log("Starting data cleanup with foreign key handling...");

      // Get current counts
      const beforeCounts = await this.getCurrentDataCounts();

      // Delete in order to respect foreign key constraints
      // Start with child tables, then parent tables
      const cleanupOrder = [
        // Child tables first (no dependencies)
        "campaign_phone_assignments",
        "lead_activities",
        "onboarding_steps",
        "verification_attempts",
        "admin_audit_logs",
        "payment_history",

        // Intermediate tables
        "campaigns",
        "brands",
        "tcr_integrations",
        "bandwidth_accounts",
        "phone_numbers",
        "onboarding_submissions",
        "memberships",

        // Core tables
        "leads",
        "user_profiles",
        "verifications",

        // Companies last (keep those before Sept 1, 2025)
        "companies",
      ];

      console.log("Deleting tables in order to respect foreign keys...");

      for (const tableName of cleanupOrder) {
        try {
          if (tableName === "companies") {
            // Special handling for companies - keep those before Sept 1, 2025 (delete those created after)
            const { error } = await this.supabase
              .from(tableName)
              .delete()
              .gt("created_at", "2025-09-01");

            if (error) {
              console.error(`Failed to delete from ${tableName}:`, error);
            } else {
              console.log(`Successfully cleaned ${tableName}`);
            }
          } else {
            // Delete all records from other tables
            const { error } = await this.supabase.from(tableName).delete();

            if (error) {
              console.error(`Failed to delete from ${tableName}:`, error);
            } else {
              console.log(`Successfully cleaned ${tableName}`);
            }
          }
        } catch (tableError) {
          console.error(`Error cleaning table ${tableName}:`, tableError);
        }
      }

      // Get after counts
      const afterCounts = await this.getCurrentDataCounts();

      const details = {
        companiesDeleted: beforeCounts.companies - afterCounts.companies,
        verificationsDeleted:
          beforeCounts.verifications - afterCounts.verifications,
        userProfilesDeleted:
          beforeCounts.userProfiles - afterCounts.userProfiles,
        leadsDeleted: beforeCounts.leads - afterCounts.leads,
        authUsersDeleted: beforeCounts.authUsers - afterCounts.authUsers,
      };

      return {
        success: true,
        message:
          "Data cleanup completed successfully with foreign key handling (public schema only)",
        details,
      };
    } catch (error) {
      console.error("Error during FK-aware data cleanup:", error);
      return {
        success: false,
        message: "FK-aware data cleanup failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const dataCleanupService = new DataCleanupService();
