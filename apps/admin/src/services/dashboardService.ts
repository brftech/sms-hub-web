import { createSupabaseClient } from '@sms-hub/supabase'

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCompanies: number
  activeCompanies: number
  totalLeads: number
  pendingLeads: number
  totalTempSignups: number
  pendingVerifications: number
  totalMessages: number
  messagesThisMonth: number
  revenue: number
  revenueGrowth: number
}

export interface RecentActivity {
  id: string
  type: 'user_signup' | 'company_created' | 'lead_converted' | 'message_sent'
  title: string
  description: string
  time: string
  icon: string
  color: string
}

export interface Alert {
  id: string
  type: 'warning' | 'info' | 'error' | 'success'
  title: string
  description: string
  icon: string
  color: string
}

export interface SystemHealth {
  apiStatus: 'operational' | 'degraded' | 'down'
  databaseStatus: 'operational' | 'degraded' | 'down'
  smsGatewayStatus: 'operational' | 'degraded' | 'down'
  messageQueueStatus: 'operational' | 'degraded' | 'down'
  overallHealth: number
}

class DashboardService {
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

  async getDashboardStats(hubId: number): Promise<DashboardStats> {
    try {
      // Get users stats
      const { data: usersData, error: usersError } = await this.supabase
        .from('user_profiles')
        .select('id, is_active, created_at')
        .eq('hub_id', hubId)

      if (usersError) throw usersError

      const totalUsers = usersData?.length || 0
      const activeUsers = usersData?.filter(user => user.is_active).length || 0

      // Get companies stats
      const { data: companiesData, error: companiesError } = await this.supabase
        .from('companies')
        .select('id, is_active, created_at')
        .eq('hub_id', hubId)

      if (companiesError) throw companiesError

      const totalCompanies = companiesData?.length || 0
      const activeCompanies = companiesData?.filter(company => company.is_active).length || 0

      // Get leads stats
      const { data: leadsData, error: leadsError } = await this.supabase
        .from('leads')
        .select('id, status, created_at')
        .eq('hub_id', hubId)

      if (leadsError) throw leadsError

      const totalLeads = leadsData?.length || 0
      const pendingLeads = leadsData?.filter(lead => lead.status === 'pending').length || 0

      // Get temp signups stats
      const { data: tempSignupsData, error: tempSignupsError } = await this.supabase
        .from('temp_signups')
        .select('id, is_verified, created_at')
        .eq('hub_id', hubId)

      if (tempSignupsError) throw tempSignupsError

      const totalTempSignups = tempSignupsData?.length || 0
      const pendingVerifications = tempSignupsData?.filter(signup => !signup.is_verified).length || 0

      // Get messages stats (mock for now since we don't have a messages table)
      const totalMessages = 15420 // Mock data
      const messagesThisMonth = 2340 // Mock data

      // Get revenue stats (mock for now since we don't have a revenue table)
      const revenue = 45600 // Mock data
      const revenueGrowth = 12.5 // Mock data

      return {
        totalUsers,
        activeUsers,
        totalCompanies,
        activeCompanies,
        totalLeads,
        pendingLeads,
        totalTempSignups,
        pendingVerifications,
        totalMessages,
        messagesThisMonth,
        revenue,
        revenueGrowth
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw new Error('Failed to fetch dashboard stats')
    }
  }

  async getRecentActivity(hubId: number): Promise<RecentActivity[]> {
    try {
      const activities: RecentActivity[] = []

      // Get recent user signups
      const { data: recentUsers, error: usersError } = await this.supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email, created_at')
        .eq('hub_id', hubId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (!usersError && recentUsers) {
        recentUsers.forEach(user => {
          activities.push({
            id: user.id,
            type: 'user_signup',
            title: 'New user signed up',
            description: `${user.first_name || 'User'} ${user.last_name || ''} joined the platform`,
            time: this.getTimeAgo(user.created_at),
            icon: 'UserPlus',
            color: 'text-blue-600'
          })
        })
      }

      // Get recent companies
      const { data: recentCompanies, error: companiesError } = await this.supabase
        .from('companies')
        .select('id, public_name, created_at')
        .eq('hub_id', hubId)
        .order('created_at', { ascending: false })
        .limit(3)

      if (!companiesError && recentCompanies) {
        recentCompanies.forEach(company => {
          activities.push({
            id: company.id,
            type: 'company_created',
            title: 'New company created',
            description: `${company.public_name} was added`,
            time: this.getTimeAgo(company.created_at),
            icon: 'Building',
            color: 'text-green-600'
          })
        })
      }

      // Get recent leads
      const { data: recentLeads, error: leadsError } = await this.supabase
        .from('leads')
        .select('id, first_name, last_name, status, created_at')
        .eq('hub_id', hubId)
        .order('created_at', { ascending: false })
        .limit(3)

      if (!leadsError && recentLeads) {
        recentLeads.forEach(lead => {
          if (lead.status === 'converted') {
            activities.push({
              id: lead.id,
              type: 'lead_converted',
              title: 'Lead converted',
              description: `Lead ${lead.first_name} ${lead.last_name} converted to user`,
              time: this.getTimeAgo(lead.created_at),
              icon: 'CheckCircle',
              color: 'text-purple-600'
            })
          }
        })
      }

      // Sort by time and return top 5
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }
  }

  async getAlerts(hubId: number): Promise<Alert[]> {
    try {
      const alerts: Alert[] = []

      // Check for high temp signup volume
      const { data: tempSignups, error: tempSignupsError } = await this.supabase
        .from('temp_signups')
        .select('id, created_at')
        .eq('hub_id', hubId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

      if (!tempSignupsError && tempSignups && tempSignups.length > 50) {
        alerts.push({
          id: 'high-signups',
          type: 'warning',
          title: 'High signup volume',
          description: `${tempSignups.length} new signups in the last 24 hours`,
          icon: 'AlertTriangle',
          color: 'text-yellow-600'
        })
      }

      // Check for pending verifications
      const { data: pendingVerifications, error: pendingError } = await this.supabase
        .from('temp_signups')
        .select('id')
        .eq('hub_id', hubId)
        .eq('is_verified', false)

      if (!pendingError && pendingVerifications && pendingVerifications.length > 20) {
        alerts.push({
          id: 'pending-verifications',
          type: 'info',
          title: 'Pending verifications',
          description: `${pendingVerifications.length} signups awaiting verification`,
          icon: 'Clock',
          color: 'text-blue-600'
        })
      }

      // Check for inactive companies
      const { data: inactiveCompanies, error: inactiveError } = await this.supabase
        .from('companies')
        .select('id')
        .eq('hub_id', hubId)
        .eq('is_active', false)

      if (!inactiveError && inactiveCompanies && inactiveCompanies.length > 10) {
        alerts.push({
          id: 'inactive-companies',
          type: 'warning',
          title: 'Inactive companies',
          description: `${inactiveCompanies.length} companies are currently inactive`,
          icon: 'AlertTriangle',
          color: 'text-yellow-600'
        })
      }

      return alerts
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return []
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    try {
      // Test database connection
      const { error: dbError } = await this.supabase
        .from('user_profiles')
        .select('id')
        .limit(1)

      const databaseStatus = dbError ? 'down' : 'operational'

      // Mock other statuses for now
      const apiStatus = 'operational'
      const smsGatewayStatus = 'operational'
      const messageQueueStatus = 'operational'

      // Calculate overall health
      const statuses = [apiStatus, databaseStatus, smsGatewayStatus, messageQueueStatus]
      const operationalCount = statuses.filter(status => status === 'operational').length
      const overallHealth = (operationalCount / statuses.length) * 100

      return {
        apiStatus,
        databaseStatus,
        smsGatewayStatus,
        messageQueueStatus,
        overallHealth
      }
    } catch (error) {
      console.error('Error checking system health:', error)
      return {
        apiStatus: 'down',
        databaseStatus: 'down',
        smsGatewayStatus: 'down',
        messageQueueStatus: 'down',
        overallHealth: 0
      }
    }
  }

  private getTimeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString()
  }
}

export const dashboardService = new DashboardService()
