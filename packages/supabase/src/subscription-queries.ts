import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./client";

// Helper to get supabase client with null check
const getSupabaseClient = () => {
  if (!supabase) throw new Error("Supabase client not initialized");
  return supabase;
};

// Get company subscription details
export const useCompanySubscription = (companyId: string) => {
  return useQuery({
    queryKey: ["subscription", companyId],
    queryFn: async () => {
      if (!companyId) throw new Error("Company ID is required");

      const supabase = getSupabaseClient();

      if (!supabase) throw new Error("Failed to initialize Supabase client");

      // Get customer subscription details by company_id
      const { data, error } = await getSupabaseClient()
        .from("customers")
        .select(
          `
          id,
          stripe_customer_id,
          subscription_status,
          subscription_tier,
          billing_email
        `
        )
        .eq("company_id", companyId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
    staleTime: 1 * 60 * 1000, // 1 minute (subscription data changes less frequently)
  });
};

// Get payment history for a company
export const usePaymentHistory = (companyId: string, limit = 10) => {
  return useQuery({
    queryKey: ["payment-history", companyId, limit],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await getSupabaseClient()
        .from("payment_history")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get upcoming invoice (via Edge Function)
export const useUpcomingInvoice = (companyId: string) => {
  return useQuery({
    queryKey: ["upcoming-invoice", companyId],
    queryFn: async () => {
      if (!companyId) return null;

      const supabase = getSupabaseClient();

      // Get company's customer
      const { data: customer } = await supabase
        .from("customers")
        .select("stripe_customer_id")
        .eq("company_id", companyId)
        .single();

      if (!customer?.stripe_customer_id) return null;

      // Call Edge Function to get upcoming invoice from Stripe
      const { data, error } = await getSupabaseClient().functions.invoke(
        "get-upcoming-invoice",
        {
          body: { customerId: customer.stripe_customer_id },
        }
      );

      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });
};

// Create checkout session for subscription
export const useCreateCheckoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      companyId: string;
      priceId: string;
      successUrl: string;
      cancelUrl: string;
      customerId?: string;
    }) => {
      const { data, error } = await getSupabaseClient().functions.invoke(
        "create-checkout-session",
        {
          body: params,
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate subscription data after checkout
      queryClient.invalidateQueries({
        queryKey: ["subscription", variables.companyId],
      });
    },
  });
};

// Update subscription (upgrade/downgrade)
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      companyId: string;
      subscriptionId: string;
      newPriceId: string;
      prorationBehavior?: "create_prorations" | "none" | "always_invoice";
    }) => {
      const { data, error } = await getSupabaseClient().functions.invoke(
        "update-subscription",
        {
          body: params,
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subscription", variables.companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["upcoming-invoice", variables.companyId],
      });
    },
  });
};

// Cancel subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      companyId: string;
      subscriptionId: string;
      cancelAtPeriodEnd?: boolean;
      cancellationReason?: string;
    }) => {
      const { data, error } = await getSupabaseClient().functions.invoke(
        "cancel-subscription",
        {
          body: params,
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subscription", variables.companyId],
      });
    },
  });
};

// Resume a canceled subscription
export const useResumeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      companyId: string;
      subscriptionId: string;
    }) => {
      const { data, error } = await getSupabaseClient().functions.invoke(
        "resume-subscription",
        {
          body: params,
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subscription", variables.companyId],
      });
    },
  });
};

// Update payment method
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      companyId: string;
      customerId: string;
      paymentMethodId: string;
    }) => {
      const { data, error } = await getSupabaseClient().functions.invoke(
        "update-payment-method",
        {
          body: params,
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["payment-methods", variables.companyId],
      });
    },
  });
};

// Get payment methods
export const usePaymentMethods = (companyId: string) => {
  return useQuery({
    queryKey: ["payment-methods", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const supabase = getSupabaseClient();

      // Get company's customer
      const { data: customer } = await supabase
        .from("customers")
        .select("stripe_customer_id")
        .eq("company_id", companyId)
        .single();

      if (!customer?.stripe_customer_id) return [];

      const { data, error } = await getSupabaseClient().functions.invoke(
        "get-payment-methods",
        {
          body: { customerId: customer.stripe_customer_id },
        }
      );

      if (error) throw error;
      return data?.paymentMethods || [];
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get invoices
export const useInvoices = (companyId: string, limit = 10) => {
  return useQuery({
    queryKey: ["invoices", companyId, limit],
    queryFn: async () => {
      if (!companyId) return [];

      const supabase = getSupabaseClient();

      // Get company's customer
      const { data: customer } = await supabase
        .from("customers")
        .select("stripe_customer_id")
        .eq("company_id", companyId)
        .single();

      if (!customer?.stripe_customer_id) return [];

      const { data, error } = await getSupabaseClient().functions.invoke(
        "get-invoices",
        {
          body: {
            customerId: customer.stripe_customer_id,
            limit,
          },
        }
      );

      if (error) throw error;
      return data?.invoices || [];
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });
};

// Create portal session for Stripe Customer Portal
export const useCreatePortalSession = () => {
  return useMutation({
    mutationFn: async (params: {
      companyId: string;
      customerId: string;
      returnUrl: string;
    }) => {
      const { data, error } = await getSupabaseClient().functions.invoke(
        "create-portal-session",
        {
          body: params,
        }
      );

      if (error) throw error;
      return data;
    },
  });
};

// Get subscription usage (for metered billing)
export const useSubscriptionUsage = (companyId: string) => {
  return useQuery({
    queryKey: ["subscription-usage", companyId],
    queryFn: async () => {
      if (!companyId) return null;

      // TODO: Get current usage from database when usage_records table is created
      const usage = null;

      // Also get subscription info for limits
      const { data: customer } = await getSupabaseClient()
        .from("customers")
        .select("subscription_tier")
        .eq("company_id", companyId)
        .single();

      const tier = customer?.subscription_tier || "free";

      return {
        current: usage || { sms_sent: 0, sms_received: 0 },
        tier: tier,
        limits: getSubscriptionLimits(tier),
      };
    },
    enabled: !!companyId,
    staleTime: 1 * 60 * 1000, // 1 minute for usage data
  });
};

// Helper function to get subscription limits by tier
function getSubscriptionLimits(tier: string) {
  const limits: Record<
    string,
    { 
      sms_monthly: number; 
      users: number; 
      phone_numbers: number;
      contacts: number;
      throughput_per_min: number;
      max_segments: number;
    }
  > = {
    free: { 
      sms_monthly: 100, 
      users: 1, 
      phone_numbers: 1,
      contacts: 25,
      throughput_per_min: 5,
      max_segments: 1
    },
    starter: { 
      sms_monthly: 200, 
      users: 1, 
      phone_numbers: 1,
      contacts: 50,
      throughput_per_min: 10,
      max_segments: 1
    },
    core: { 
      sms_monthly: 1500, 
      users: 3, 
      phone_numbers: 1,
      contacts: 500,
      throughput_per_min: 40,
      max_segments: 3
    },
    elite: { 
      sms_monthly: 8000, 
      users: -1, // unlimited
      phone_numbers: 2,
      contacts: 3000,
      throughput_per_min: 200,
      max_segments: 8
    },
    enterprise: { 
      sms_monthly: 50000, 
      users: -1, // unlimited
      phone_numbers: -1, // unlimited
      contacts: -1, // unlimited
      throughput_per_min: -1, // unlimited
      max_segments: -1 // unlimited
    },
    vip: { 
      sms_monthly: -1, // unlimited
      users: -1, // unlimited
      phone_numbers: -1, // unlimited
      contacts: -1, // unlimited
      throughput_per_min: -1, // unlimited
      max_segments: -1 // unlimited
    },
  };

  return limits[tier] || limits.free;
}

// Check if company has active subscription
export const useHasActiveSubscription = (companyId: string) => {
  const { data: subscription } = useCompanySubscription(companyId);

  return {
    hasActiveSubscription: subscription?.subscription_status === "active",
    isTrialing: subscription?.subscription_status === "trialing",
    isCanceled: subscription?.subscription_status === "canceled",
    isPastDue: subscription?.subscription_status === "past_due",
    subscription,
  };
};
