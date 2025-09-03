import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./client-context";
import type { Database } from "@sms-hub/types";

type Customer = Database["public"]["Tables"]["customers"]["Row"];

// Get customer subscription details (works for both B2B and B2C)
export const useCustomerSubscription = (customerId: string | null) => {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["customer-subscription", customerId],
    queryFn: async () => {
      if (!customerId) throw new Error("Customer ID is required");

      const { data, error } = await supabase
        .from("customers")
        .select(
          `
          id,
          customer_type,
          stripe_customer_id,
          stripe_subscription_id,
          subscription_status,
          subscription_tier,
          billing_email,
          subscription_ends_at,
          created_at,
          updated_at
        `
        )
        .eq("id", customerId)
        .single();

      if (error) throw error;
      return data as Customer;
    },
    enabled: !!customerId,
  });
};

// Get customer by user profile (for B2C)
export const useCustomerByUser = (userId: string | null) => {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["customer-by-user", userId],
    queryFn: async () => {
      if (!userId) return null;

      // First check if user has direct customer relationship
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("customer_id, is_individual_customer")
        .eq("id", userId)
        .single();

      if (!userProfile?.customer_id) return null;

      // Get customer data
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", userProfile.customer_id)
        .single();

      if (error) throw error;
      return data as Customer;
    },
    enabled: !!userId,
  });
};

// Get customer by company (for B2B)
export const useCustomerByCompany = (companyId: string | null) => {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["customer-by-company", companyId],
    queryFn: async () => {
      if (!companyId) return null;

      // Get company's customer ID
      const { data: company } = await supabase
        .from("companies")
        .select("customer_id")
        .eq("id", companyId)
        .single();

      if (!company?.customer_id) return null;

      // Get customer data
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", company.customer_id)
        .single();

      if (error) throw error;
      return data as Customer;
    },
    enabled: !!companyId,
  });
};

// Get current user's customer (works for both B2B and B2C)
export const useCurrentCustomer = () => {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["current-customer"],
    queryFn: async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get user profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("customer_id, company_id, is_individual_customer")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error("User profile not found");

      // For B2C users with direct customer relationship
      if (profile.is_individual_customer && profile.customer_id) {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", profile.customer_id)
          .single();

        if (error) throw error;
        return data as Customer;
      }

      // For B2B users, get customer through company
      if (profile.company_id) {
        const { data: company } = await supabase
          .from("companies")
          .select("customer_id")
          .eq("id", profile.company_id)
          .single();

        if (company?.customer_id) {
          const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("id", company.customer_id)
            .single();

          if (error) throw error;
          return data as Customer;
        }
      }

      return null;
    },
  });
};

// Create customer (for new signups)
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  return useMutation({
    mutationFn: async (data: {
      hub_id: number;
      customer_type: "company" | "individual";
      stripe_customer_id?: string;
      billing_email: string;
      company_id?: string;
      user_id?: string;
    }) => {
      const { data: customer, error } = await supabase
        .from("customers")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return customer as Customer;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["current-customer"] });
      queryClient.invalidateQueries({
        queryKey: ["customer-by-company", data.company_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["customer-by-user", data.user_id],
      });
    },
  });
};

// Update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string } & Partial<Customer>) => {
      const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Customer;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-subscription", data.id],
      });
      queryClient.invalidateQueries({ queryKey: ["current-customer"] });
      queryClient.invalidateQueries({ queryKey: ["customer-by-company"] });
      queryClient.invalidateQueries({ queryKey: ["customer-by-user"] });
    },
  });
};

// Cancel subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      const { data, error } = await supabase
        .from("customers")
        .update({
          subscription_status: "canceled",
          subscription_cancel_at_period_end: true,
        })
        .eq("id", customerId)
        .select()
        .single();

      if (error) throw error;
      return data as Customer;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-subscription", data.id],
      });
      queryClient.invalidateQueries({ queryKey: ["current-customer"] });
    },
  });
};

// Reactivate subscription
export const useReactivateSubscription = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      const { data, error } = await supabase
        .from("customers")
        .update({
          subscription_status: "active",
          subscription_cancel_at_period_end: false,
        })
        .eq("id", customerId)
        .select()
        .single();

      if (error) throw error;
      return data as Customer;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-subscription", data.id],
      });
      queryClient.invalidateQueries({ queryKey: ["current-customer"] });
    },
  });
};
