import { getSupabaseClient } from '../lib/supabaseSingleton'
import type { SupabaseClient } from '@sms-hub/supabase'

export interface NavigationCounts {
  companies: number;
  users: number;
  verifications: number;
  leads: number;
}

class NavigationCountsService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = getSupabaseClient()
  }

  async getCounts(hubId?: number, isGlobalView?: boolean): Promise<NavigationCounts> {
    try {
      // Build base queries
      let companiesQuery = this.supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
      
      let usersQuery = this.supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
      
      let verificationsQuery = this.supabase
        .from('verifications')
        .select('*', { count: 'exact', head: true })
      
      let leadsQuery = this.supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      // Apply hub filter if not in global view
      if (!isGlobalView && hubId !== undefined) {
        companiesQuery = companiesQuery.eq('hub_id', hubId)
        usersQuery = usersQuery.eq('hub_id', hubId)
        verificationsQuery = verificationsQuery.eq('hub_id', hubId)
        leadsQuery = leadsQuery.eq('hub_id', hubId)
      }

      // Execute all queries in parallel
      const [companiesResult, usersResult, verificationsResult, leadsResult] = await Promise.all([
        companiesQuery,
        usersQuery,
        verificationsQuery,
        leadsQuery
      ])

      return {
        companies: companiesResult.count || 0,
        users: usersResult.count || 0,
        verifications: verificationsResult.count || 0,
        leads: leadsResult.count || 0
      }
    } catch (error) {
      console.error('Error fetching navigation counts:', error)
      return {
        companies: 0,
        users: 0,
        verifications: 0,
        leads: 0
      }
    }
  }
}

// Export singleton instance
export const navigationCountsService = new NavigationCountsService();

// Also export for compatibility with code expecting .instance
export const navigationCountsServiceLazy = {
  get instance() {
    return navigationCountsService;
  }
};