import { getSupabaseClient } from "../lib/supabaseSingleton";

export interface PhoneNumber {
  id: string;
  hub_id: number;
  company_id: string | null;
  phone_number: string;
  assigned_to_campaign: string | null;
  campaign_id?: string;
  created_at: string | null;
  updated_at: string | null;
  // Joined data
  company: {
    id: string;
    public_name: string;
    legal_name: string | null;
    company_account_number: string;
  } | null;
  hub?: {
    hub_number: number;
    name: string;
  };
  campaign: {
    id: string;
    name: string;
    status: string | null;
  } | null;
  // Computed fields for display
  formatted_number?: string;
  status?: "available" | "assigned" | "reserved" | "suspended";
  type?: "local" | "toll_free" | "short_code";
  area_code?: string;
  region?: string;
  country?: string;
  assigned_to?: string;
  assigned_account?: string;
  assigned_at?: string;
  last_used?: string;
  message_count?: number;
  capabilities?: string[];
  monthly_cost?: number;
  provider?: string;
}

export interface PhoneNumberFilters {
  search?: string;
  hub_id?: number;
  company_id?: string | null;
  assigned_to_campaign?: string | null;
  campaign_id?: string;
  limit?: number;
}

class PhoneNumbersService {
  private supabase = getSupabaseClient();

  async getPhoneNumbers(
    filters: PhoneNumberFilters = {}
  ): Promise<PhoneNumber[]> {
    try {
      let query = this.supabase.from("phone_numbers").select(`
        *,
        company:companies(
          id,
          public_name,
          legal_name,
          company_account_number
        ),
        hub:hubs(
          hub_number,
          name
        ),
        campaign:campaigns(
          id,
          name,
          status
        )
      `);

      // Apply filters
      if (filters.hub_id !== undefined) {
        query = query.eq("hub_id", filters.hub_id);
      }

      if (filters.company_id) {
        query = query.eq("company_id", filters.company_id);
      }

      if (filters.assigned_to_campaign !== undefined) {
        if (filters.assigned_to_campaign === null) {
          query = query.is("assigned_to_campaign", null);
        } else {
          query = query.eq(
            "assigned_to_campaign",
            filters.assigned_to_campaign
          );
        }
      }

      if (filters.campaign_id) {
        query = query.eq("campaign_id", filters.campaign_id);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error fetching phone numbers:", error);
        throw error;
      }

      // Process the data to add computed fields
      const phoneNumbers = (data || []).map((phone) => ({
        ...phone,
        // Add computed fields for display
        formatted_number: this.formatPhoneNumber(phone.phone_number),
        status: this.getStatus(phone),
        type: this.getPhoneType(phone.phone_number),
        area_code: this.extractAreaCode(phone.phone_number),
        region: this.getRegion(phone.phone_number),
        country: "US", // Default for now
        assigned_to: phone.company?.public_name,
        assigned_account: phone.company?.company_account_number,
        assigned_at:
          phone.assigned_to_campaign && phone.created_at
            ? phone.created_at
            : undefined,
        last_used: undefined, // TODO: Calculate from messages
        message_count: 0, // TODO: Calculate from messages table
        capabilities: ["SMS", "Voice", "MMS"], // Default capabilities
        monthly_cost: this.getMonthlyCost(phone.phone_number),
        provider: "Bandwidth", // Default provider
      }));

      // Apply search filter after fetching
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return phoneNumbers.filter(
          (phone) =>
            phone.phone_number.toLowerCase().includes(searchTerm) ||
            phone.formatted_number?.toLowerCase().includes(searchTerm) ||
            phone.company?.public_name?.toLowerCase().includes(searchTerm) ||
            phone.company?.legal_name?.toLowerCase().includes(searchTerm) ||
            phone.hub?.name?.toLowerCase().includes(searchTerm)
        );
      }

      return phoneNumbers;
    } catch (error) {
      console.error("Error in getPhoneNumbers:", error);
      throw error;
    }
  }

  async getPhoneNumberById(id: string): Promise<PhoneNumber | null> {
    try {
      const { data, error } = await this.supabase
        .from("phone_numbers")
        .select(
          `
          *,
          company:companies(
            id,
            public_name,
            legal_name,
            company_account_number
          ),
          hub:hubs(
            hub_number,
            name
          ),
          campaign:campaigns(
            id,
            name,
            status
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching phone number:", error);
        return null;
      }

      return {
        ...data,
        formatted_number: this.formatPhoneNumber(data.phone_number),
        status: this.getStatus(data),
        type: this.getPhoneType(data.phone_number),
        area_code: this.extractAreaCode(data.phone_number),
        region: this.getRegion(data.phone_number),
        country: "US",
        assigned_to: data.company?.public_name,
        assigned_account: data.company?.company_account_number,
        assigned_at:
          data.assigned_to_campaign && data.created_at
            ? data.created_at
            : undefined,
        last_used: undefined,
        message_count: 0,
        capabilities: ["SMS", "Voice", "MMS"],
        monthly_cost: this.getMonthlyCost(data.phone_number),
        provider: "Bandwidth",
      };
    } catch (error) {
      console.error("Error in getPhoneNumberById:", error);
      return null;
    }
  }

  async createPhoneNumber(
    phoneData: Partial<PhoneNumber>
  ): Promise<PhoneNumber> {
    try {
      const { data, error } = await this.supabase
        .from("phone_numbers")
        .insert([
          {
            id: phoneData.id || crypto.randomUUID(),
            hub_id: phoneData.hub_id || 1,
            phone_number: phoneData.phone_number || "",
            ...phoneData,
          },
        ])
        .select(
          `
          *,
          company:companies(
            id,
            public_name,
            legal_name,
            company_account_number
          ),
          hub:hubs(
            hub_number,
            name
          ),
          campaign:campaigns(
            id,
            name,
            status
          )
        `
        )
        .single();

      if (error) {
        console.error("Error creating phone number:", error);
        throw error;
      }

      return {
        ...data,
        formatted_number: this.formatPhoneNumber(data.phone_number),
        status: this.getStatus(data),
        type: this.getPhoneType(data.phone_number),
        area_code: this.extractAreaCode(data.phone_number),
        region: this.getRegion(data.phone_number),
        country: "US",
        assigned_to: data.company?.public_name,
        assigned_account: data.company?.company_account_number,
        assigned_at:
          data.assigned_to_campaign && data.created_at
            ? data.created_at
            : undefined,
        last_used: undefined,
        message_count: 0,
        capabilities: ["SMS", "Voice", "MMS"],
        monthly_cost: this.getMonthlyCost(data.phone_number),
        provider: "Bandwidth",
      };
    } catch (error) {
      console.error("Error in createPhoneNumber:", error);
      throw error;
    }
  }

  async updatePhoneNumber(
    id: string,
    updates: Partial<PhoneNumber>
  ): Promise<PhoneNumber> {
    try {
      const { data, error } = await this.supabase
        .from("phone_numbers")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          company:companies(
            id,
            public_name,
            legal_name,
            company_account_number
          ),
          hub:hubs(
            hub_number,
            name
          ),
          campaign:campaigns(
            id,
            name,
            status
          )
        `
        )
        .single();

      if (error) {
        console.error("Error updating phone number:", error);
        throw error;
      }

      return {
        ...data,
        formatted_number: this.formatPhoneNumber(data.phone_number),
        status: this.getStatus(data),
        type: this.getPhoneType(data.phone_number),
        area_code: this.extractAreaCode(data.phone_number),
        region: this.getRegion(data.phone_number),
        country: "US",
        assigned_to: data.company?.public_name,
        assigned_account: data.company?.company_account_number,
        assigned_at:
          data.assigned_to_campaign && data.created_at
            ? data.created_at
            : undefined,
        last_used: undefined,
        message_count: 0,
        capabilities: ["SMS", "Voice", "MMS"],
        monthly_cost: this.getMonthlyCost(data.phone_number),
        provider: "Bandwidth",
      };
    } catch (error) {
      console.error("Error in updatePhoneNumber:", error);
      throw error;
    }
  }

  async deletePhoneNumber(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("phone_numbers")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting phone number:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error in deletePhoneNumber:", error);
      throw error;
    }
  }

  // Helper methods for computed fields
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Format based on length
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      // US number with country code
      const areaCode = cleaned.slice(1, 4);
      const exchange = cleaned.slice(4, 7);
      const number = cleaned.slice(7, 11);
      return `(${areaCode}) ${exchange}-${number}`;
    } else if (cleaned.length === 10) {
      // US number without country code
      const areaCode = cleaned.slice(0, 3);
      const exchange = cleaned.slice(3, 6);
      const number = cleaned.slice(6, 10);
      return `(${areaCode}) ${exchange}-${number}`;
    } else if (
      cleaned.startsWith("800") ||
      cleaned.startsWith("888") ||
      cleaned.startsWith("877") ||
      cleaned.startsWith("866")
    ) {
      // Toll-free number
      const first = cleaned.slice(0, 3);
      const second = cleaned.slice(3, 6);
      const third = cleaned.slice(6, 10);
      return `(${first}) ${second}-${third}`;
    }

    return phoneNumber; // Return original if can't format
  }

  private getStatus(
    phone: any
  ): "available" | "assigned" | "reserved" | "suspended" {
    if (phone.company_id && phone.assigned_to_campaign) return "assigned";
    if (phone.company_id && !phone.assigned_to_campaign) return "reserved";
    if (!phone.company_id) return "available";
    return "available";
  }

  private getPhoneType(
    phoneNumber: string
  ): "local" | "toll_free" | "short_code" {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (
      cleaned.startsWith("800") ||
      cleaned.startsWith("888") ||
      cleaned.startsWith("877") ||
      cleaned.startsWith("866")
    ) {
      return "toll_free";
    } else if (cleaned.length <= 6) {
      return "short_code";
    } else {
      return "local";
    }
  }

  private extractAreaCode(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return cleaned.slice(1, 4);
    } else if (cleaned.length === 10) {
      return cleaned.slice(0, 3);
    }

    return "";
  }

  private getRegion(phoneNumber: string): string {
    const areaCode = this.extractAreaCode(phoneNumber);

    // Simple area code to region mapping (you could expand this)
    const areaCodeMap: { [key: string]: string } = {
      "212": "New York, NY",
      "213": "Los Angeles, CA",
      "312": "Chicago, IL",
      "305": "Miami, FL",
      "415": "San Francisco, CA",
      "555": "Test Area",
    };

    return areaCodeMap[areaCode] || "Unknown Region";
  }

  private getMonthlyCost(phoneNumber: string): number {
    const type = this.getPhoneType(phoneNumber);

    switch (type) {
      case "toll_free":
        return 25.0;
      case "short_code":
        return 50.0;
      case "local":
      default:
        return 15.0;
    }
  }
}

export const phoneNumbersService = {
  instance: new PhoneNumbersService(),
};
