import { getSupabaseClient } from "../lib/supabaseSingleton";
import type { SupabaseClient } from "@sms-hub/supabase";
import type { Company } from "@sms-hub/types";

// Re-export for components that import from this service
export type { Company };

export interface CompanyStats {
  total: number;
  active: number;
  inactive: number;
  byIndustry: Record<string, number>;
  bySize: Record<string, number>;
  bySubscriptionTier: Record<string, number>;
}

class CompaniesService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = getSupabaseClient();
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      console.log("CompaniesService: Testing database connection...");

      // Try a simple query to test connection
      const { error } = await this.supabase
        .from("companies")
        .select("count")
        .limit(1);

      if (error) {
        console.error("CompaniesService: Connection test failed:", error);
        return false;
      }

      console.log("CompaniesService: Connection test successful");
      return true;
    } catch (err) {
      console.error("CompaniesService: Connection test error:", err);
      return false;
    }
  }

  async getCompanies(options?: {
    hub_id?: number;
    is_active?: boolean;
    industry?: string;
    size?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Company[]> {
    let query = this.supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (options?.hub_id !== undefined) {
      query = query.eq("hub_id", options.hub_id);
    }

    if (options?.is_active !== undefined) {
      query = query.eq("is_active", options.is_active);
    }

    if (options?.industry && options.industry !== "all") {
      query = query.eq("industry", options.industry);
    }

    if (options?.size && options.size !== "all") {
      query = query.eq("size", options.size);
    }

    if (options?.search) {
      query = query.or(
        `public_name.ilike.%${options.search}%,legal_name.ilike.%${options.search}%,company_account_number.ilike.%${options.search}%`
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
      console.error("Error fetching companies:", error);
      throw new Error("Failed to fetch companies");
    }

    return (data || []) as Company[];
  }

  async getCompanyById(id: string): Promise<Company | null> {
    const { data, error } = await this.supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching company:", error);
      throw new Error("Failed to fetch company");
    }

    return data as Company;
  }

  async getCompanyStats(hub_id?: number): Promise<CompanyStats> {
    // Get all companies for stats calculation
    const companies = await this.getCompanies({ hub_id });

    const stats: CompanyStats = {
      total: companies.length,
      active: companies.filter((company) => company.is_active).length,
      inactive: companies.filter((company) => !company.is_active).length,
      byIndustry: {},
      bySize: {},
      bySubscriptionTier: {},
    };

    // Calculate industry distribution (field removed from schema)
    companies.forEach((company) => {
      const industry = "Unknown"; // Field removed from schema
      stats.byIndustry[industry] = (stats.byIndustry[industry] || 0) + 1;
    });

    // Calculate size distribution (field removed from schema)
    companies.forEach((company) => {
      const size = "Unknown"; // Field removed from schema
      stats.bySize[size] = (stats.bySize[size] || 0) + 1;
    });

    // Calculate subscription tier distribution
    // Note: subscription_tier is in customers table, not companies table
    // All companies are marked as "Unknown" for subscription tier
    stats.bySubscriptionTier["Unknown"] = companies.length;

    return stats;
  }

  async updateCompanyStatus(id: string, isActive: boolean): Promise<void> {
    const { error } = await this.supabase
      .from("companies")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating company status:", error);
      throw new Error("Failed to update company status");
    }
  }

  async updateCompanySubscription(
    id: string,
    subscriptionTier: string,
    subscriptionStatus: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from("companies")
      .update({
        subscription_tier: subscriptionTier,
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating company subscription:", error);
      throw new Error("Failed to update company subscription");
    }
  }

  async getUniqueIndustries(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("companies")
      .select("industry")
      .not("industry", "is", null);

    if (error) {
      console.error("Error fetching industries:", error);
      return [];
    }

    const industries =
      data
        ?.map((item) => item.industry)
        .filter((industry): industry is string => industry !== null) || [];
    return [...new Set(industries)]; // Remove duplicates
  }

  async getUniqueSizes(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("companies")
      .select("size")
      .not("size", "is", null);

    if (error) {
      console.error("Error fetching sizes:", error);
      return [];
    }

    const sizes =
      data
        ?.map((item) => item.size)
        .filter((size): size is string => size !== null) || [];
    return [...new Set(sizes)]; // Remove duplicates
  }

  // Note: subscription_tier is in customers table, not companies table

  // Global methods for fetching data across all hubs
  async getGlobalCompanyStats(): Promise<CompanyStats> {
    try {
      const { data: companies, error } = await this.supabase
        .from("companies")
        .select("*");

      if (error) {
        console.error("Error fetching global company stats:", error);
        throw new Error("Failed to fetch global company stats");
      }

      const stats: CompanyStats = {
        total: companies?.length || 0,
        active: companies?.filter((c) => c.is_active).length || 0,
        inactive: companies?.filter((c) => !c.is_active).length || 0,
        byIndustry: {},
        bySize: {},
        bySubscriptionTier: {},
      };

      // Calculate industry distribution (field removed from schema)
      companies?.forEach((company) => {
        const industry = "Unknown"; // Field removed from schema
        stats.byIndustry[industry] = (stats.byIndustry[industry] || 0) + 1;
      });

      // Calculate size distribution (field removed from schema)
      companies?.forEach((company) => {
        const size = "Unknown"; // Field removed from schema
        stats.bySize[size] = (stats.bySize[size] || 0) + 1;
      });

      // Calculate subscription tier distribution
      // Note: subscription_tier is in customers table, not companies table
      // All companies are marked as "Unknown" for subscription tier
      stats.bySubscriptionTier["Unknown"] = companies?.length || 0;

      return stats;
    } catch (error) {
      console.error("Error in getGlobalCompanyStats:", error);
      throw error;
    }
  }

  async getGlobalUniqueIndustries(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("companies")
      .select("industry")
      .not("industry", "is", null);

    if (error) {
      console.error("Error fetching global industries:", error);
      return [];
    }

    const industries =
      data
        ?.map((item) => item.industry)
        .filter((industry): industry is string => industry !== null) || [];
    return [...new Set(industries)]; // Remove duplicates
  }

  async getGlobalUniqueSizes(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("companies")
      .select("size")
      .not("size", "is", null);

    if (error) {
      console.error("Error fetching global sizes:", error);
      return [];
    }

    const sizes =
      data
        ?.map((item) => item.size)
        .filter((size): size is string => size !== null) || [];
    return [...new Set(sizes)]; // Remove duplicates
  }

  // Note: subscription_tier is in customers table, not companies table

  // Update company onboarding step
  async updateCompanyOnboardingStep(
    companyId: string,
    onboardingStep: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("companies")
        .update({ /* account_onboarding_step field removed from schema */ })
        .eq("id", companyId);

      if (error) {
        console.error("Error updating company onboarding step:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating company onboarding step:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Create a new company
  async createCompany(
    company: Partial<Company>
  ): Promise<{ success: boolean; data?: Company; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("companies")
        .insert([
          {
            id: company.id || crypto.randomUUID(),
            hub_id: company.hub_id || 1,
            public_name: company.public_name || "Unnamed Company",
            company_account_number:
              company.company_account_number || `COMP-${Date.now()}`,
            // billing_email moved to customers table
            ...company,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating company:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Company };
    } catch (error) {
      console.error("Error creating company:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Update company details
  async updateCompany(
    companyId: string,
    updates: Partial<Company>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("companies")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", companyId);

      if (error) {
        console.error("Error updating company:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating company:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Delete a company
  async deleteCompany(
    companyId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("companies")
        .delete()
        .eq("id", companyId);

      if (error) {
        console.error("Error deleting company:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting company:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Add a complete account (company + customer + initial user)
  async addAccount(accountData: {
    // Company fields
    companyName: string;
    legalName?: string;
    hub_id: number;
    
    // Customer fields  
    billingEmail: string;
    subscriptionTier?: string;
    paymentStatus?: string;
    
    // Initial user fields
    userEmail: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: string;
  }): Promise<{ 
    success: boolean; 
    data?: {
      company?: Company;
      customerId?: string;
      userId?: string;
    };
    error?: string 
  }> {
    try {
      // Generate unique identifiers
      const companyId = crypto.randomUUID();
      const accountNumber = `ACC-${Date.now()}`;
      
      // Step 1: Create company
      const { data: company, error: companyError } = await this.supabase
        .from("companies")
        .insert([{
          id: companyId,
          hub_id: accountData.hub_id,
          public_name: accountData.companyName,
          legal_name: accountData.legalName || accountData.companyName,
          company_account_number: accountNumber,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (companyError) {
        console.error("Error creating company:", companyError);
        return { success: false, error: `Failed to create company: ${companyError.message}` };
      }

      // Step 2: Create customer record if billing email provided
      let customerId = null;
      if (accountData.billingEmail) {
        const { data: customer, error: customerError } = await this.supabase
          .from("customers")
          .insert([{
            id: crypto.randomUUID(),
            hub_id: accountData.hub_id,
            company_id: companyId,
            billing_email: accountData.billingEmail,
            subscription_tier: accountData.subscriptionTier || 'FREE',
            payment_status: accountData.paymentStatus || 'PENDING',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (customerError) {
          console.error("Error creating customer:", customerError);
          // Rollback company creation
          await this.supabase.from("companies").delete().eq("id", companyId);
          return { success: false, error: `Failed to create customer: ${customerError.message}` };
        }
        
        customerId = customer?.id;
      }

      // Step 3: Create initial user profile if email provided
      let userId = null;
      if (accountData.userEmail) {
        // Note: This creates a profile but not auth - that needs Edge Function
        const { data: profile, error: profileError } = await this.supabase
          .from("user_profiles")
          .insert([{
            id: crypto.randomUUID(),
            hub_id: accountData.hub_id,
            company_id: companyId,
            account_number: `USR-${Date.now()}`,
            email: accountData.userEmail,
            first_name: accountData.firstName,
            last_name: accountData.lastName,
            mobile_phone_number: accountData.phoneNumber,
            role: accountData.role || 'MEMBER',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          // Note: Not rolling back company/customer as they might still be useful
        } else {
          userId = profile?.id;
        }
      }

      return { 
        success: true, 
        data: {
          company: company as Company,
          customerId,
          userId
        }
      };
    } catch (error) {
      console.error("Error in addAccount:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Get users for a company
  async getCompanyUsers(companyId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching company users:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching company users:", error);
      return [];
    }
  }
}

// Lazy-loaded service instance
let _companiesService: CompaniesService | null = null;

export const companiesService = {
  get instance() {
    if (!_companiesService) {
      _companiesService = new CompaniesService();
    }
    return _companiesService;
  },
};
