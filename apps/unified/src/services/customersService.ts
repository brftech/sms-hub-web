import { getSupabaseClient } from "../lib/supabaseSingleton";

export interface Customer {
  id: string;
  company_id: string | null;
  user_id: string | null;
  billing_email: string;
  customer_type: string;
  hub_id: number;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  subscription_tier: string | null;
  is_active: boolean | null;
  trial_ends_at: string | null;
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
  user_count?: number;
  message_count?: number;
  phone_numbers?: number;
}

export interface CustomerFilters {
  search?: string;
  hub_id?: number;
  subscription_status?: string;
  subscription_tier?: string;
  is_active?: boolean;
  limit?: number;
}

class CustomersService {
  private supabase = getSupabaseClient();

  async getCustomers(filters: CustomerFilters = {}): Promise<Customer[]> {
    try {
      let query = this.supabase.from("customers").select(`
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
          )
        `);

      // Apply filters
      if (filters.hub_id !== undefined) {
        query = query.eq("hub_id", filters.hub_id);
      }

      if (filters.subscription_status) {
        query = query.eq("subscription_status", filters.subscription_status);
      }

      if (filters.subscription_tier) {
        query = query.eq("subscription_tier", filters.subscription_tier);
      }

      if (filters.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error fetching customers:", error);
        throw error;
      }

      // Process the data to add computed fields
      const customers = (data || []).map((customer) => ({
        ...customer,
        // Add computed fields that would come from other tables
        user_count: 0, // TODO: Calculate from user_profiles
        message_count: 0, // TODO: Calculate from messages table
        phone_numbers: 0, // TODO: Calculate from phone_numbers table
      }));

      // Apply search filter after fetching (since it might search across joined tables)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return customers.filter(
          (customer) =>
            customer.billing_email.toLowerCase().includes(searchTerm) ||
            customer.company?.public_name?.toLowerCase().includes(searchTerm) ||
            customer.company?.legal_name?.toLowerCase().includes(searchTerm) ||
            customer.hub?.name?.toLowerCase().includes(searchTerm)
        );
      }

      return customers;
    } catch (error) {
      console.error("Error in getCustomers:", error);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      const { data, error } = await this.supabase
        .from("customers")
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
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching customer:", error);
        return null;
      }

      return {
        ...data,
        user_count: 0, // TODO: Calculate
        message_count: 0, // TODO: Calculate
        phone_numbers: 0, // TODO: Calculate
      };
    } catch (error) {
      console.error("Error in getCustomerById:", error);
      return null;
    }
  }

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await this.supabase
        .from("customers")
        .insert([
          {
            id: customerData.id || crypto.randomUUID(),
            hub_id: customerData.hub_id || 1,
            billing_email: customerData.billing_email || "billing@example.com",
            customer_type: customerData.customer_type || "individual",
            ...customerData,
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
          )
        `
        )
        .single();

      if (error) {
        console.error("Error creating customer:", error);
        throw error;
      }

      return {
        ...data,
        user_count: 0,
        message_count: 0,
        phone_numbers: 0,
      };
    } catch (error) {
      console.error("Error in createCustomer:", error);
      throw error;
    }
  }

  async updateCustomer(
    id: string,
    updates: Partial<Customer>
  ): Promise<Customer> {
    try {
      const { data, error } = await this.supabase
        .from("customers")
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
          )
        `
        )
        .single();

      if (error) {
        console.error("Error updating customer:", error);
        throw error;
      }

      return {
        ...data,
        user_count: 0,
        message_count: 0,
        phone_numbers: 0,
      };
    } catch (error) {
      console.error("Error in updateCustomer:", error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("customers")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting customer:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteCustomer:", error);
      throw error;
    }
  }
}

export const customersService = {
  instance: new CustomersService(),
};
