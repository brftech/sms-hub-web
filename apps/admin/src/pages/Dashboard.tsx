import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { MessageSquare, Users, Building, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'
import { useAdminStats } from '@sms-hub/supabase'

export function Dashboard() {
  const { hubConfig, currentHub } = useHub()
  const { data: stats } = useAdminStats(hubConfig.hubNumber)

  const overviewStats = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Companies',
      value: stats?.activeCompanies || 0,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Messages Today',
      value: stats?.messagesToday || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Revenue (MTD)',
      value: `$${(stats?.revenueThisMonth || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  const alertsStats = [
    {
      title: 'Failed Messages',
      value: stats?.failedMessages || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Pending Reviews',
      value: stats?.pendingReviews || 0,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold hub-text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          {hubConfig.displayName} platform overview and management
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {alertsStats.map((stat) => (
          <Card key={stat.title} className="border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>New user registrations today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentSignups?.map((signup, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{signup.name}</div>
                    <div className="text-sm text-muted-foreground">{signup.email}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(signup.created_at).toLocaleTimeString()}
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-muted-foreground">
                  No recent signups
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Platform status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Message Queue</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS Gateway</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
                  <span className="text-sm text-yellow-600">Degraded</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}