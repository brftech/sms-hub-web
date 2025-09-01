import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthService } from "./auth";
import { createSupabaseClient } from "./client";

// Create a single supabase client instance
const getSupabaseClient = () => {
  // Get from window if available (set by user app)
  if (typeof window !== "undefined" && (window as any).__supabaseClient) {
    return (window as any).__supabaseClient;
  }

  // Otherwise create a new one
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key are required");
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

// Auth Queries
export const useAuth = () => {
  const queryClient = useQueryClient();
  const supabase = getSupabaseClient();
  const authService = createAuthService(supabase);

  const userQuery = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => authService.getCurrentUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    ...userQuery,
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
  };
};

export const useUserProfile = () => {
  const supabase = getSupabaseClient();
  const authService = createAuthService(supabase);

  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => authService.getCurrentUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hub Queries
export const useHubConfigs = () => {
  return useQuery({
    queryKey: ["hub-configs"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("hub_configs")
        .select("*, hubs(*)")
        .order("hub_id");

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useHubConfig = (hubId: number) => {
  return useQuery({
    queryKey: ["hub-config", hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("hub_configs")
        .select("*, hubs(*)")
        .eq("hub_id", hubId)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// Company Queries
export const useCompanies = (hubId: number) => {
  return useQuery({
    queryKey: ["companies", hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("hub_id", hubId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Onboarding Queries
export const useOnboardingSubmission = (companyId: string, hubId: number) => {
  return useQuery({
    queryKey: ["onboarding-submission", companyId, hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("onboarding_submissions")
        .select("*")
        .eq("company_id", companyId)
        .eq("hub_id", hubId)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

export const useOnboardingSteps = (hubId: number) => {
  return useQuery({
    queryKey: ["onboarding-steps", hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("onboarding_steps")
        .select("*")
        .eq("hub_id", hubId)
        .order("step_number");

      if (error) throw error;
      return data;
    },
  });
};

// Lead Queries
export const useLeads = (hubId: number) => {
  return useQuery({
    queryKey: ["leads", hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("hub_id", hubId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// SMS Queries
export const useBrands = (companyId: string) => {
  return useQuery({
    queryKey: ["brands", companyId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Mutations
export const useCreateVerification = () => {
  const queryClient = useQueryClient();
  const supabase = getSupabaseClient();
  const authService = createAuthService(supabase);

  return useMutation({
    mutationFn: (data: any) => authService.createVerification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verifications"] });
    },
  });
};

export const useVerifyCode = () => {
  const queryClient = useQueryClient();
  const supabase = getSupabaseClient();
  const authService = createAuthService(supabase);

  return useMutation({
    mutationFn: (data: any) => authService.verifyCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      hub_id: number;
      public_name: string;
      billing_email: string;
      created_by_profile_id: string;
    }) => {
      // Get hub name for account number generation
      const client = getSupabaseClient();
      const { data: hub, error: hubError } = await client
        .from("hubs")
        .select("name")
        .eq("hub_number", data.hub_id)
        .single();

      if (hubError || !hub) {
        throw new Error("Hub not found");
      }

      // Generate company account number
      const { data: accountNumber, error: accountError } = await client.rpc(
        "generate_company_account_number",
        { hub_name: hub.name }
      );

      if (accountError) throw accountError;

      const { data: result, error } = await client
        .from("companies")
        .insert([
          {
            ...data,
            company_account_number: accountNumber,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies", data.hub_id] });
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      hub_id: number;
      email: string;
      name?: string;
      lead_phone_number?: string;
      company_name?: string;
      platform_interest?: string;
      source?: string;
      message?: string;
      ip_address?: string;
    }) => {
      const client = getSupabaseClient();
      const { data: result, error } = await client
        .from("leads")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["leads", data.hub_id] });
    },
  });
};

export const useUpdateOnboardingSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      current_step: string;
      step_data: Record<string, any>;
      stripe_status?: string;
      tcr_brand_id?: string;
      tcr_campaign_id?: string;
      assigned_phone_number?: string;
    }) => {
      const client = getSupabaseClient();
      const { data: result, error } = await client
        .from("onboarding_submissions")
        .update(data)
        .eq("id", data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-submission"] });
    },
  });
};

// Create onboarding submission mutation
export const useCreateOnboardingSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      company_id: string;
      hub_id: number;
      user_id: string;
      current_step: string;
      step_data: Record<string, any>;
    }) => {
      const client = getSupabaseClient();
      const { data: result, error } = await client
        .from("onboarding_submissions")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-submission"] });
    },
  });
};

// Current user's company hook
export const useCurrentUserCompany = () => {
  const { data: userProfile } = useUserProfile();
  return useQuery({
    queryKey: ["company", userProfile?.company_id],
    queryFn: async () => {
      if (!userProfile?.company_id) return null;
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", userProfile.company_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.company_id,
    staleTime: 5 * 60 * 1000,
  });
};

// Current user's phone numbers hook
export const useCurrentUserPhoneNumbers = () => {
  const { data: userProfile } = useUserProfile();
  return useQuery({
    queryKey: ["phone-numbers", userProfile?.hub_id],
    queryFn: async () => {
      if (!userProfile?.hub_id) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("phone_numbers")
        .select("*")
        .eq("hub_id", userProfile.hub_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userProfile?.hub_id,
    staleTime: 5 * 60 * 1000,
  });
};

// Messages hook (placeholder - no messages table exists yet)
export const useMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: () => [],
    staleTime: 5 * 60 * 1000,
  });
};

// Current user's campaigns hook
export const useCurrentUserCampaigns = () => {
  const { data: userProfile } = useUserProfile();
  return useQuery({
    queryKey: ["user-campaigns", userProfile?.hub_id],
    queryFn: async () => {
      if (!userProfile?.hub_id) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("hub_id", userProfile.hub_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userProfile?.hub_id,
    staleTime: 5 * 60 * 1000,
  });
};

// Admin-specific hooks
export const useAdminUsers = (hubId: number) => {
  return useQuery({
    queryKey: ["admin-users", hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("hub_id", hubId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAdminCompanies = (hubId: number) => {
  return useQuery({
    queryKey: ["admin-companies", hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("hub_id", hubId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useAdminMessages = (hubId: number) => {
  return useQuery({
    queryKey: ["admin-messages", hubId],
    queryFn: async () => {
      // Placeholder since SMS messages table doesn't exist yet
      return [];
    },
  });
};

export const useAdminStats = (hubId: number) => {
  return useQuery({
    queryKey: ["admin-stats", hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data: companies } = await supabase
        .from("companies")
        .select("*")
        .eq("hub_id", hubId);

      const { data: users } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("hub_id", hubId);

      return {
        totalCompanies: companies?.length || 0,
        activeCompanies: companies?.filter((c) => c.is_active)?.length || 0,
        totalUsers: users?.length || 0,
        activeUsers: users?.filter((u) => u.is_active)?.length || 0,
        messagesToday: 0,
        revenueThisMonth: 0,
        failedMessages: 0,
        pendingReviews: 0,
        recentSignups:
          users?.filter((u) => {
            const createdAt = new Date(u.created_at!);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return createdAt > weekAgo;
          }) || [],
      };
    },
  });
};

export const useAdminAnalytics = (hubId: number, timeRange: string) => {
  return useQuery({
    queryKey: ["admin-analytics", hubId, timeRange],
    queryFn: async () => {
      // Placeholder analytics data
      return {
        totalMessages: 0,
        messageGrowth: 0,
        deliveryRate: 0,
        deliveryRateChange: 0,
        activeUsers: 0,
        userGrowth: 0,
        revenue: 0,
        revenueGrowth: 0,
        messagesSent: [],
        topCompanies: [],
        failureReasons: [],
      };
    },
  });
};

export const useAdminSettings = (hubId: number) => {
  return useQuery({
    queryKey: ["admin-settings", hubId],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("hub_configs")
        .select("*")
        .eq("hub_id", hubId)
        .single();

      if (error) throw error;
      return data;
    },
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      to_number: string;
      message_body: string;
      from_number?: string;
      campaign_id?: string;
    }) => {
      // TODO: Implement message sending via texting API
      console.log("Sending message:", data);
      return { id: "temp-message-id", status: "pending", ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

// Update company mutation
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const supabase = getSupabaseClient();
      const { data: result, error } = await supabase
        .from("companies")
        .update(data)
        .eq("id", data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["company", data.id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

// Update user profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; [key: string]: any }) => {
      const client = getSupabaseClient();
      const { data: result, error } = await client
        .from("user_profiles")
        .update(data)
        .eq("id", data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
};

// Backward compatibility aliases
export const useCompany = useCurrentUserCompany;
export const usePhoneNumbers = useCurrentUserPhoneNumbers;
export const useCampaigns = useCurrentUserCampaigns;
