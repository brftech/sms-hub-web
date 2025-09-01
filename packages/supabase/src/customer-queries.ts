import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createSupabaseClient } from './client'
import type { Database } from '@sms-hub/types'

type Customer = Database['public']['Tables']['customers']['Row']

// Create a single supabase client instance
const getSupabaseClient = () => {
  // Get from window if available (set by user app)
  if (typeof window !== 'undefined' && (window as any).__supabaseClient) {
    return (window as any).__supabaseClient;
  }
  
  // Otherwise create a new one
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required');
  }
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Get customer subscription details (works for both B2B and B2C)
export const useCustomerSubscription = (customerId: string | null) => {
  const supabase = getSupabaseClient()
  
  return useQuery({
    queryKey: ['customer-subscription', customerId],
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID is required')
      const { data, error } = await supabase
        .from('customers')
        .select(`
          id,
          customer_type,
          stripe_customer_id,
          stripe_subscription_id,
          subscription_status,
          subscription_tier,
          billing_email,
          billing_address,
          last_payment_at,
          trial_ends_at,
          subscription_ends_at,
          metadata
        `)
        .eq('id', customerId)
        .single()
      
      if (error) throw error
      return data as Customer
    },
    enabled: !!customerId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Get customer by user profile (for B2C)
export const useCustomerByUser = (userId: string | null) => {
  return useQuery({
    queryKey: ['customer-by-user', userId],
    queryFn: async () => {
      if (!userId) return null
      
      const supabase = getSupabaseClient()
      
      // First check if user has direct customer relationship
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('customer_id, is_individual_customer')
        .eq('id', userId)
        .single()
      
      if (!userProfile?.customer_id) return null
      
      // Get customer data
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userProfile.customer_id)
        .single()
      
      if (error) throw error
      return data as Customer
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Get customer by company (for B2B)
export const useCustomerByCompany = (companyId: string | null) => {
  return useQuery({
    queryKey: ['customer-by-company', companyId],
    queryFn: async () => {
      if (!companyId) return null
      
      const supabase = getSupabaseClient()
      
      // First get company's customer_id
      const { data: company } = await supabase
        .from('companies')
        .select('customer_id')
        .eq('id', companyId)
        .single()
      
      if (!company?.customer_id) return null
      
      // Get customer data
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', company.customer_id)
        .single()
      
      if (error) throw error
      return data as Customer
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  })
}

// Combined hook to get customer from either path
export const useCurrentCustomer = () => {
  const supabase = getSupabaseClient()
  
  return useQuery({
    queryKey: ['current-customer'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      
      // Check B2C path first (direct customer)
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('customer_id, is_individual_customer, company_id')
        .eq('id', user.id)
        .single()
      
      if (!userProfile) return null
      
      // If user has direct customer relationship
      if (userProfile.customer_id && userProfile.is_individual_customer) {
        const { data: customer } = await supabase
          .from('customers')
          .select('*')
          .eq('id', userProfile.customer_id)
          .single()
        
        return customer as Customer
      }
      
      // Otherwise check B2B path (through company)
      if (userProfile.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('customer_id')
          .eq('id', userProfile.company_id)
          .single()
        
        if (company?.customer_id) {
          const { data: customer } = await supabase
            .from('customers')
            .select('*')
            .eq('id', company.customer_id)
            .single()
          
          return customer as Customer
        }
      }
      
      return null
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Create checkout session with customer type support
export const useCreateCustomerCheckout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params: {
      email: string
      priceId: string
      successUrl: string
      cancelUrl: string
      customerType: 'company' | 'individual'
      companyId?: string
      userId?: string
      hubId: number
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: params
      })
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-customer'] })
      queryClient.invalidateQueries({ queryKey: ['customer-subscription'] })
    },
  })
}

// Update customer subscription
export const useUpdateCustomerSubscription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params: {
      customerId: string
      subscriptionId: string
      newPriceId: string
      prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice'
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.functions.invoke('update-subscription', {
        body: params
      })
      
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-subscription', variables.customerId] })
      queryClient.invalidateQueries({ queryKey: ['current-customer'] })
    },
  })
}

// Cancel customer subscription
export const useCancelCustomerSubscription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params: {
      customerId: string
      subscriptionId: string
      cancelAtPeriodEnd?: boolean
      cancellationReason?: string
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: params
      })
      
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-subscription', variables.customerId] })
      queryClient.invalidateQueries({ queryKey: ['current-customer'] })
    },
  })
}

// Create portal session for customer
export const useCreateCustomerPortalSession = () => {
  return useMutation({
    mutationFn: async (params: {
      customerId: string
      stripeCustomerId: string
      returnUrl: string
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          customerId: params.stripeCustomerId,
          returnUrl: params.returnUrl
        }
      })
      
      if (error) throw error
      return data
    },
  })
}