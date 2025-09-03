import { getSupabaseClient } from '@sms-hub/supabase'

export interface UserProfile {
  id: string
  hub_id: number
  account_number: string
  email: string
  first_name?: string | null
  last_name?: string | null
  mobile_phone_number?: string | null
  company_id?: string | null
  lead_id?: string | null
  role?: 'admin' | 'user' | 'manager' | null
  is_active?: boolean | null
  onboarding_step?: string | null
  onboarding_data?: any | null
  payment_status?: string | null
  payment_date?: string | null
  stripe_session_id?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  byRole: Record<string, number>
  byPaymentStatus: Record<string, number>
  byOnboardingStep: Record<string, number>
}

class UsersService {
  private supabase: ReturnType<typeof getSupabaseClient>

  constructor() {
    this.supabase = getSupabaseClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('UsersService: Testing database connection...');
      
      // Try a simple query to test connection
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (error) {
        console.error('UsersService: Connection test failed:', error);
        return false;
      }

      console.log('UsersService: Connection test successful');
      return true;
    } catch (err) {
      console.error('UsersService: Connection test error:', err);
      return false;
    }
  }

  async getUsers(options?: {
    hub_id?: number
    is_active?: boolean
    role?: string
    payment_status?: string
    onboarding_step?: string
    search?: string
    limit?: number
    offset?: number
  }): Promise<UserProfile[]> {
    let query = this.supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (options?.hub_id) {
      query = query.eq('hub_id', options.hub_id)
    }

    if (options?.is_active !== undefined) {
      query = query.eq('is_active', options.is_active)
    }

    if (options?.role && options.role !== 'all') {
      query = query.eq('role', options.role)
    }

    if (options?.payment_status && options.payment_status !== 'all') {
      query = query.eq('payment_status', options.payment_status)
    }

    if (options?.onboarding_step && options.onboarding_step !== 'all') {
      query = query.eq('onboarding_step', options.onboarding_step)
    }

    if (options?.search) {
      query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%,account_number.ilike.%${options.search}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 100) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching users:', error)
      console.error('Error details:', error.message, error.details, error.hint)
      throw new Error('Failed to fetch users')
    }

    return (data || []) as UserProfile[]
  }

  async getUserById(id: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user')
    }

    return data as UserProfile
  }

  async getUserStats(hub_id?: number): Promise<UserStats> {
    // Get all users for stats calculation
    const users = await this.getUsers({ hub_id })

    const stats: UserStats = {
      total: users.length,
      active: users.filter(user => user.is_active).length,
      inactive: users.filter(user => !user.is_active).length,
      byRole: {},
      byPaymentStatus: {},
      byOnboardingStep: {}
    }

    // Calculate role distribution
    users.forEach(user => {
      const role = user.role || 'Unknown'
      stats.byRole[role] = (stats.byRole[role] || 0) + 1
    })

    // Calculate payment status distribution
    users.forEach(user => {
      const status = user.payment_status || 'Unknown'
      stats.byPaymentStatus[status] = (stats.byPaymentStatus[status] || 0) + 1
    })

    // Calculate onboarding step distribution
    users.forEach(user => {
      const step = user.onboarding_step || 'Unknown'
      stats.byOnboardingStep[step] = (stats.byOnboardingStep[step] || 0) + 1
    })

    return stats
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('user_profiles')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating user status:', error)
      throw new Error('Failed to update user status')
    }
  }

  async updateUserRole(id: string, role: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_profiles')
      .update({ 
        role: role as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating user role:', error)
      throw new Error('Failed to update user role')
    }
  }

  async updateUserPaymentStatus(id: string, paymentStatus: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_profiles')
      .update({ 
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating user payment status:', error)
      throw new Error('Failed to update user payment status')
    }
  }

  async getUniqueRoles(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('role')
      .not('role', 'is', null)

    if (error) {
      console.error('Error fetching roles:', error)
      return []
    }

    const roles = data?.map(item => item.role).filter((role): role is string => role !== null) || []
    return [...new Set(roles)] // Remove duplicates
  }

  async getUniquePaymentStatuses(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('payment_status')
      .not('payment_status', 'is', null)

    if (error) {
      console.error('Error fetching payment statuses:', error)
      return []
    }

    const statuses = data?.map(item => item.payment_status).filter((status): status is string => status !== null) || []
    return [...new Set(statuses)] // Remove duplicates
  }

  async getUniqueOnboardingSteps(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('onboarding_step')
      .not('onboarding_step', 'is', null)

    if (error) {
      console.error('Error fetching onboarding steps:', error)
      return []
    }

    const steps = data?.map(item => item.onboarding_step).filter((step): step is string => step !== null) || []
    return [...new Set(steps)] // Remove duplicates
  }
}

export const usersService = new UsersService()
