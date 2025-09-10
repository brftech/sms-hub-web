import { getSupabaseClient } from '../lib/supabaseSingleton'
import type { SupabaseClient } from '@sms-hub/supabase'

export interface Lead {
  id: string
  hub_id: number
  email: string
  name?: string | null
  lead_phone_number?: string | null
  company_name?: string | null
  platform_interest?: string | null
  source?: string | null
  message?: string | null
  ip_address?: string | null
  interaction_count: number | null
  last_interaction_at: string | null
  created_at: string | null
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  updated_at: string | null
  lead_score: number | null
  priority?: 'low' | 'medium' | 'high' | 'urgent' | null
  source_type?: string | null
  user_agent?: string | null
}

export interface LeadActivity {
  id: string
  hub_id: number
  lead_id: string
  activity_type: string
  activity_data: any
  ip_address?: string | null
  user_agent?: string | null
  created_at: string | null
  description?: string | null
}

export interface LeadStats {
  total: number
  new: number
  contacted: number
  qualified: number
  converted: number
  lost: number
  byPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
  bySource: Record<string, number>
}

class LeadsService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = getSupabaseClient()
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('LeadsService: Testing database connection...');
      
      // Try a simple query to test connection
      const { error } = await this.supabase
        .from('leads')
        .select('count')
        .limit(1);

      if (error) {
        console.error('LeadsService: Connection test failed:', error);
        return false;
      }

      console.log('LeadsService: Connection test successful');
      return true;
    } catch (err) {
      console.error('LeadsService: Connection test error:', err);
      return false;
    }
  }

  async getLeads(options?: {
    hub_id?: number
    status?: string
    priority?: string
    source?: string
    search?: string
    limit?: number
    offset?: number
  }): Promise<Lead[]> {
    let query = this.supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (options?.hub_id) {
      query = query.eq('hub_id', options.hub_id)
    }

    if (options?.status && options.status !== 'all') {
      query = query.eq('status', options.status)
    }

    if (options?.priority && options.priority !== 'all') {
      query = query.eq('priority', options.priority)
    }

    if (options?.source && options.source !== 'all') {
      query = query.eq('source', options.source)
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
      console.error('Error fetching leads:', error)
      throw new Error('Failed to fetch leads')
    }

    // Transform data to handle null values properly
    return (data || []).map(lead => ({
      ...lead,
      status: lead.status || 'new',
      email: lead.email || '',
      hub_id: lead.hub_id || 0,
      interaction_count: lead.interaction_count || 0,
      lead_score: lead.lead_score || 0
    })) as Lead[]
  }

  async getLeadById(id: string): Promise<Lead | null> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching lead:', error)
      throw new Error('Failed to fetch lead')
    }

    if (!data) return null

    // Transform data to handle null values properly
    return {
      ...data,
      status: data.status || 'new',
      email: data.email || '',
      hub_id: data.hub_id || 0,
      interaction_count: data.interaction_count || 0,
      lead_score: data.lead_score || 0
    } as Lead
  }

  async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    const { data, error } = await this.supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching lead activities:', error)
      throw new Error('Failed to fetch lead activities')
    }

    // Transform data to handle null values properly
    return (data || []).map(activity => ({
      ...activity,
      hub_id: activity.hub_id || 0,
      lead_id: activity.lead_id || '',
      activity_type: activity.activity_type || '',
      activity_data: activity.activity_data || {}
    })) as LeadActivity[]
  }

  async getLeadStats(hub_id?: number): Promise<LeadStats> {
    // Get all leads for stats calculation
    const leads = await this.getLeads({ hub_id })

    const stats: LeadStats = {
      total: leads.length,
      new: leads.filter(lead => lead.status === 'new').length,
      contacted: leads.filter(lead => lead.status === 'contacted').length,
      qualified: leads.filter(lead => lead.status === 'qualified').length,
      converted: leads.filter(lead => lead.status === 'converted').length,
      lost: leads.filter(lead => lead.status === 'lost').length,
      byPriority: {
        low: leads.filter(lead => lead.priority === 'low').length,
        medium: leads.filter(lead => lead.priority === 'medium').length,
        high: leads.filter(lead => lead.priority === 'high').length,
        urgent: leads.filter(lead => lead.priority === 'urgent').length,
      },
      bySource: {}
    }

    // Calculate source distribution
    leads.forEach(lead => {
      const source = lead.source || 'Unknown'
      stats.bySource[source] = (stats.bySource[source] || 0) + 1
    })

    return stats
  }

  async updateLeadStatus(id: string, status: string): Promise<void> {
    const { error } = await this.supabase
      .from('leads')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating lead status:', error)
      throw new Error('Failed to update lead status')
    }
  }

  async updateLeadPriority(id: string, priority: string): Promise<void> {
    const { error } = await this.supabase
      .from('leads')
      .update({ 
        priority,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating lead priority:', error)
      throw new Error('Failed to update lead priority')
    }
  }

  async addLeadActivity(leadId: string, activityType: string, description?: string, activityData?: any): Promise<void> {
    const { error } = await this.supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        activity_type: activityType,
        description,
        activity_data: activityData || {},
        hub_id: 2 // Default to Gnymble hub for now
      })

    if (error) {
      console.error('Error adding lead activity:', error)
      throw new Error('Failed to add lead activity')
    }
  }

  async getUniqueSources(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('source')
      .not('source', 'is', null)

    if (error) {
      console.error('Error fetching sources:', error)
      return []
    }

    const sources = data?.map(item => item.source).filter((source): source is string => source !== null) || []
    return [...new Set(sources)] // Remove duplicates
  }
}

// Lazy-loaded service instance
let _leadsService: LeadsService | null = null;

export const leadsService = {
  get instance() {
    if (!_leadsService) {
      _leadsService = new LeadsService();
    }
    return _leadsService;
  }
};
