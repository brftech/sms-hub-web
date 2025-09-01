import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHub } from '@sms-hub/ui'
import { 
  MessageSquare, 
  Users, 
  Building, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle,
  UserPlus,
  Eye
} from 'lucide-react'
import { dashboardService, DashboardStats, RecentActivity, Alert, SystemHealth } from '../services/dashboardService'

const Dashboard = () => {
  const { currentHub } = useHub()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get hub ID based on current hub
      const hubId = currentHub === 'gnymble' ? 1 : 
                   currentHub === 'percymd' ? 2 :
                   currentHub === 'percytext' ? 3 :
                   currentHub === 'percytech' ? 0 : 1 // Default to gnymble (1)

      console.log('Dashboard: Current hub:', currentHub)
      console.log('Dashboard: Using hub_id:', hubId)

      // Fetch all dashboard data in parallel
      const [statsData, activityData, alertsData, healthData] = await Promise.all([
        dashboardService.getDashboardStats(hubId),
        dashboardService.getRecentActivity(hubId),
        dashboardService.getAlerts(hubId),
        dashboardService.getSystemHealth()
      ])

      setStats(statsData)
      setRecentActivity(activityData)
      setAlerts(alertsData)
      setSystemHealth(healthData)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
  }, [currentHub])

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [currentHub])

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      UserPlus,
      Building,
      CheckCircle,
      MessageSquare,
      AlertTriangle,
      Clock
    }
    return iconMap[iconName] || Activity
  }

  // Navigation functions for card clicks
  const navigateToCompanies = () => navigate('/companies')
  const navigateToUsers = () => navigate('/users')
  const navigateToLeads = () => navigate('/leads')
  const navigateToTempSignups = () => navigate('/temp-signups')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Dashboard</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Activity className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of {currentHub} hub activity and performance
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
            onClick={navigateToCompanies}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
                <p className="text-xs text-green-600 mt-1">+{stats.activeCompanies} active</p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
            onClick={navigateToUsers}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+{stats.activeUsers} active</p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
            onClick={navigateToLeads}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                <p className="text-xs text-yellow-600 mt-1">{stats.pendingLeads} pending</p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
            onClick={navigateToTempSignups}
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Temp Signups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTempSignups}</p>
                <p className="text-xs text-yellow-600 mt-1">{stats.pendingVerifications} pending verification</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{stats.messagesThisMonth.toLocaleString()} this month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+{stats.revenueGrowth}% this month</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-600">{systemHealth?.overallHealth || 0}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">All systems operational</p>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = getIconComponent(activity.icon)
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Alerts & Notifications</h3>
          </div>
          <div className="p-6">
            {alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => {
                  const IconComponent = getIconComponent(alert.icon)
                  return (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg bg-white ${alert.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-500">{alert.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-8 w-8 text-green-400" />
                <p className="mt-2 text-sm text-gray-500">All systems running smoothly</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Add User</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Building className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Add Company</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Send Message</span>
          </button>
          <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-5 h-5 mr-2 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard