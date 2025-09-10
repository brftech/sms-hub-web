import { getSupabaseClient } from "@sms-hub/supabase";

export interface Company {
  id: string;
  hub_id: number;
  public_name: string;
  legal_name?: string | null;
  company_account_number: string;
  billing_email: string;
  company_phone_number?: string | null;
  point_of_contact_email?: string | null;
  website?: string | null;
  address?: string | null;
  address_street?: string | null;
  city?: string | null;
  state_region?: string | null;
  postal_code?: string | null;
  country_of_registration?: string | null;
  industry?: string | null;
  vertical_type?: string | null;
  size?: string | null;
  legal_form?: string | null;
  ein?: string | null;
  tax_issuing_country?: string | null;
  billing_address?: any | null;
  stripe_customer_id?: string | null;
  subscription_status?: string | null;
  subscription_tier?: string | null;
  is_active?: boolean | null;
  account_onboarding_step?: string | null;
  created_by_profile_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CompanyStats {
  total: number;
  active: number;
  inactive: number;
  byIndustry: Record<string, number>;
  bySize: Record<string, number>;
  bySubscriptionTier: Record<string, number>;
}

class CompaniesService {
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
    subscription_tier?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Company[]> {
    let query = this.supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (options?.hub_id) {
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

    if (options?.subscription_tier && options.subscription_tier !== "all") {
      query = query.eq("subscription_tier", options.subscription_tier);
    }

    if (options?.search) {
      query = query.or(
        `public_name.ilike.%${options.search}%,legal_name.ilike.%${options.search}%,billing_email.ilike.%${options.search}%,company_account_number.ilike.%${options.search}%`
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

    // Calculate industry distribution
    companies.forEach((company) => {
      const industry = company.industry || "Unknown";
      stats.byIndustry[industry] = (stats.byIndustry[industry] || 0) + 1;
    });

    // Calculate size distribution
    companies.forEach((company) => {
      const size = company.size || "Unknown";
      stats.bySize[size] = (stats.bySize[size] || 0) + 1;
    });

    // Calculate subscription tier distribution
    companies.forEach((company) => {
      const tier = company.subscription_tier || "Unknown";
      stats.bySubscriptionTier[tier] =
        (stats.bySubscriptionTier[tier] || 0) + 1;
    });

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

  async getUniqueSubscriptionTiers(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("companies")
      .select("subscription_tier")
      .not("subscription_tier", "is", null);

    if (error) {
      console.error("Error fetching subscription tiers:", error);
      return [];
    }

    const tiers =
      data
        ?.map((item) => item.subscription_tier)
        .filter((tier): tier is string => tier !== null) || [];
    return [...new Set(tiers)]; // Remove duplicates
  }

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

      // Calculate industry distribution
      companies?.forEach((company) => {
        const industry = company.industry || "Unknown";
        stats.byIndustry[industry] = (stats.byIndustry[industry] || 0) + 1;
      });

      // Calculate size distribution
      companies?.forEach((company) => {
        const size = company.size || "Unknown";
        stats.bySize[size] = (stats.bySize[size] || 0) + 1;
      });

      // Calculate subscription tier distribution
      companies?.forEach((company) => {
        const tier = company.subscription_tier || "Unknown";
        stats.bySubscriptionTier[tier] =
          (stats.bySubscriptionTier[tier] || 0) + 1;
      });

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

  async getGlobalUniqueSubscriptionTiers(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("companies")
      .select("subscription_tier")
      .not("subscription_tier", "is", null);

    if (error) {
      console.error("Error fetching global subscription tiers:", error);
      return [];
    }

    const tiers =
      data
        ?.map((item) => item.subscription_tier)
        .filter((tier): tier is string => tier !== null) || [];
    return [...new Set(tiers)]; // Remove duplicates
  }

  // Update company onboarding step
  async updateCompanyOnboardingStep(
    companyId: string,
    onboardingStep: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("companies")
        .update({ account_onboarding_step: onboardingStep })
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
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  // Create a new company
  async createCompany(company: Partial<Company>): Promise<{ success: boolean; data?: Company; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("companies")
        .insert([{
          ...company,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
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
        error: error instanceof Error ? error.message : "Unknown error" 
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
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  // Delete a company
  async deleteCompany(companyId: string): Promise<{ success: boolean; error?: string }> {
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
        error: error instanceof Error ? error.message : "Unknown error" 
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

export const companiesService = new CompaniesService();
