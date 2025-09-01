import { createSupabaseClient } from '@sms-hub/supabase'

export interface TempSignup {
  id: string
  hub_id: number
  email: string
  first_name: string
  last_name: string
  company_name: string
  mobile_phone_number: string
  auth_method: string
  verification_code?: string | null
  verification_attempts?: number | null
  max_attempts?: number | null
  stripe_customer_id?: string | null
  created_at?: string | null
  expires_at: string
  is_verified?: boolean | null
  verified_at?: string | null
}

export interface TempSignupStats {
  total: number
  verified: number
  unverified: number
  expired: number
  byAuthMethod: Record<string, number>
  byHub: Record<string, number>
}

class TempSignupsService {
  private supabase: ReturnType<typeof createSupabaseClient>

  constructor() {
    // Get environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    this.supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('TempSignupsService: Testing database connection...');
      
      // Try a simple query to test connection
      const { data, error } = await this.supabase
        .from('temp_signups')
        .select('count')
        .limit(1);

      if (error) {
        console.error('TempSignupsService: Connection test failed:', error);
        return false;
      }

      console.log('TempSignupsService: Connection test successful');
      return true;
    } catch (err) {
      console.error('TempSignupsService: Connection test error:', err);
      return false;
    }
  }

  async getTempSignups(options?: {
    hub_id?: number
    auth_method?: string
    is_expired?: boolean
    is_verified?: boolean
    search?: string
    limit?: number
    offset?: number
  }): Promise<TempSignup[]> {
    let query = this.supabase
      .from('temp_signups')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (options?.hub_id) {
      query = query.eq('hub_id', options.hub_id)
    }

    if (options?.auth_method && options.auth_method !== 'all') {
      query = query.eq('auth_method', options.auth_method)
    }

    if (options?.is_expired !== undefined) {
      const now = new Date().toISOString()
      if (options.is_expired) {
        query = query.lt('expires_at', now)
      } else {
        query = query.gte('expires_at', now)
      }
    }

    if (options?.is_verified !== undefined) {
      query = query.eq('is_verified', options.is_verified)
    }

    if (options?.search) {
      query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%,company_name.ilike.%${options.search}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 100) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching temp signups:', error)
      console.error('Error details:', error.message, error.details, error.hint)
      throw new Error('Failed to fetch temp signups')
    }

    return (data || []) as TempSignup[]
  }

  async getTempSignupById(id: string): Promise<TempSignup | null> {
    const { data, error } = await this.supabase
      .from('temp_signups')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching temp signup:', error)
      throw new Error('Failed to fetch temp signup')
    }

    return data as TempSignup
  }

  async getTempSignupStats(hub_id?: number): Promise<TempSignupStats> {
    // Get all temp signups for stats calculation
    const tempSignups = await this.getTempSignups({ hub_id })

    const now = new Date()
    const stats: TempSignupStats = {
      total: tempSignups.length,
      verified: tempSignups.filter(signup => signup.is_verified === true).length,
      unverified: tempSignups.filter(signup => signup.is_verified !== true).length,
      expired: tempSignups.filter(signup => new Date(signup.expires_at) < now).length,
      byAuthMethod: {},
      byHub: {}
    }

    // Calculate auth method distribution
    tempSignups.forEach(signup => {
      const method = signup.auth_method || 'Unknown'
      stats.byAuthMethod[method] = (stats.byAuthMethod[method] || 0) + 1
    })

    // Calculate hub distribution
    tempSignups.forEach(signup => {
      const hub = signup.hub_id.toString()
      stats.byHub[hub] = (stats.byHub[hub] || 0) + 1
    })

    return stats
  }

  async deleteTempSignup(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('temp_signups')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting temp signup:', error)
      throw new Error('Failed to delete temp signup')
    }
  }

  async updateVerificationAttempts(id: string, attempts: number): Promise<void> {
    const { error } = await this.supabase
      .from('temp_signups')
      .update({ 
        verification_attempts: attempts
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating verification attempts:', error)
      throw new Error('Failed to update verification attempts')
    }
  }

  async getUniqueAuthMethods(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('temp_signups')
      .select('auth_method')
      .not('auth_method', 'is', null)

    if (error) {
      console.error('Error fetching auth methods:', error)
      return []
    }

    const methods = data?.map(item => item.auth_method).filter((method): method is string => method !== null) || []
    return [...new Set(methods)] // Remove duplicates
  }

  async getExpiredSignups(): Promise<TempSignup[]> {
    const now = new Date().toISOString()
    const { data, error } = await this.supabase
      .from('temp_signups')
      .select('*')
      .lt('expires_at', now)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching expired signups:', error)
      throw new Error('Failed to fetch expired signups')
    }

    return (data || []) as TempSignup[]
  }

  async cleanupExpiredSignups(): Promise<number> {
    const now = new Date().toISOString()
    const { data, error } = await this.supabase
      .from('temp_signups')
      .delete()
      .lt('expires_at', now)
      .select()

    if (error) {
      console.error('Error cleaning up expired signups:', error)
      throw new Error('Failed to cleanup expired signups')
    }

    return data?.length || 0
  }
}

export const tempSignupsService = new TempSignupsService()
