import { useState } from 'react'
import { useHub, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sms-hub/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sms-hub/ui'
import { BarChart3, TrendingUp, MessageSquare, Users, DollarSign, Activity } from 'lucide-react'
import { useAdminAnalytics } from '@sms-hub/supabase'

export function Analytics() {
  const { hubConfig } = useHub()
  const [timeRange, setTimeRange] = useState('30d')
  const { data: analytics } = useAdminAnalytics(hubConfig.hubNumber, timeRange)

  const kpiCards = [
    {
      title: 'Message Volume',
      value: (analytics?.totalMessages || 0).toLocaleString(),
      change: analytics?.messageGrowth || 0,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Delivery Rate',
      value: `${analytics?.deliveryRate || 0}%`,
      change: analytics?.deliveryRateChange || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Users',
      value: (analytics?.activeUsers || 0).toLocaleString(),
      change: analytics?.userGrowth || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Revenue',
      value: `$${(analytics?.revenue || 0).toLocaleString()}`,
      change: analytics?.revenueGrowth || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hub-text-primary">Analytics</h1>
          <p className="text-muted-foreground">
            {hubConfig.displayName} platform performance and insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change >= 0 ? '+' : ''}{kpi.change.toFixed(1)}% from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Message Volume Trend</CardTitle>
            <CardDescription>
              Daily message volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Chart visualization would be rendered here</p>
                <p className="text-sm">(Integration with charting library needed)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>
              Success vs failure rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <p>Delivery rate chart would be rendered here</p>
                <p className="text-sm">(Integration with charting library needed)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Companies by Volume</CardTitle>
            <CardDescription>
              Highest message senders this {timeRange}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.topCompanies?.map((company, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {company.account_number}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{company.message_count.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">messages</div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed Message Analysis</CardTitle>
            <CardDescription>
              Common failure reasons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.failureReasons?.map((reason, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-sm">{reason.reason}</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">{reason.count}</div>
                    <div className="text-xs text-muted-foreground">
                      ({((reason.count / stats.failed) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-muted-foreground">
                  No failure data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}