import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import { Button } from "@sms-hub/ui";
import { Badge } from "@sms-hub/ui";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Phone,
  MessageSquare,
  Mic,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  Globe,
  DollarSign,
} from "lucide-react";

interface AdminStatCard {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface SystemMetrics {
  total_accounts: number;
  active_accounts: number;
  total_users: number;
  total_phone_numbers: number;
  total_messages: number;
  total_voice_apps: number;
  system_uptime: number;
  revenue: number;
  growth_rate: number;
}

export function AdminStatistics() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  // Mock data for now - will be replaced with actual API calls
  useEffect(() => {
    const mockMetrics: SystemMetrics = {
      total_accounts: 156,
      active_accounts: 142,
      total_users: 1247,
      total_phone_numbers: 89,
      total_messages: 125430,
      total_voice_apps: 23,
      system_uptime: 99.8,
      revenue: 45680,
      growth_rate: 15.2,
    };

    const timer = setTimeout(() => {
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const statCards: AdminStatCard[] = [
    {
      title: "Total Accounts",
      value: metrics?.total_accounts.toLocaleString() || "0",
      change: 12.5,
      changeType: "increase",
      icon: <Building2 className="w-5 h-5" />,
      color: "text-orange-500",
      description: "Customer accounts across all hubs",
    },
    {
      title: "Active Users",
      value: metrics?.total_users.toLocaleString() || "0",
      change: 8.3,
      changeType: "increase",
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-500",
      description: "Users actively using the platform",
    },
    {
      title: "Phone Numbers",
      value: metrics?.total_phone_numbers.toLocaleString() || "0",
      change: 15.2,
      changeType: "increase",
      icon: <Phone className="w-5 h-5" />,
      color: "text-green-500",
      description: "gPhone numbers in inventory",
    },
    {
      title: "Messages Sent",
      value: metrics?.total_messages.toLocaleString() || "0",
      change: 22.1,
      changeType: "increase",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "text-purple-500",
      description: "SMS messages sent this period",
    },
    {
      title: "Voice Apps",
      value: metrics?.total_voice_apps.toLocaleString() || "0",
      change: 5.7,
      changeType: "increase",
      icon: <Mic className="w-5 h-5" />,
      color: "text-indigo-500",
      description: "Active voice applications",
    },
    {
      title: "System Uptime",
      value: `${metrics?.system_uptime || 0}%`,
      change: 0.2,
      changeType: "increase",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-green-500",
      description: "Platform availability",
    },
    {
      title: "Monthly Revenue",
      value: `$${metrics?.revenue.toLocaleString() || "0"}`,
      change: 18.5,
      changeType: "increase",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-500",
      description: "Current month revenue",
    },
    {
      title: "Growth Rate",
      value: `${metrics?.growth_rate || 0}%`,
      change: 3.2,
      changeType: "increase",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-500",
      description: "Month-over-month growth",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "account",
      title: "New account created: TechStart Inc",
      description: "Professional tier subscription activated",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "user",
      title: "User John Smith logged in",
      description: "From 101 Distributors account",
      time: "4 hours ago",
      status: "completed",
    },
    {
      id: "3",
      type: "phone",
      title: "Phone number +1-555-123-4567 assigned",
      description: "Assigned to B&Gs Cigars account",
      time: "6 hours ago",
      status: "completed",
    },
    {
      id: "4",
      type: "voice",
      title: "Voice app 'Customer Support IVR' updated",
      description: "New menu options added",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: "5",
      type: "system",
      title: "System maintenance completed",
      description: "Database optimization and security updates",
      time: "2 days ago",
      status: "completed",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              System Statistics
            </h1>
            <p className="text-gray-600">Platform-wide analytics and metrics</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            System Statistics
          </h1>
          <p className="text-gray-600">
            Platform-wide analytics and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}%
                    </span>
                    <span className="text-sm text-gray-500">
                      vs last period
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Usage</CardTitle>
            <CardDescription>
              Daily usage metrics for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Chart visualization will be implemented
                </p>
                <p className="text-sm text-gray-500">Real-time usage data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue and growth trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  Chart visualization will be implemented
                </p>
                <p className="text-sm text-gray-500">Revenue analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest platform events and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 rounded-lg border"
              >
                <div className="flex-shrink-0">
                  {activity.type === "account" ? (
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-orange-600" />
                    </div>
                  ) : activity.type === "user" ? (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  ) : activity.type === "phone" ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                  ) : activity.type === "voice" ? (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Mic className="w-4 h-4 text-purple-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">System Status</h3>
              <p className="text-2xl font-bold text-green-600">Operational</p>
              <p className="text-sm text-gray-500">
                All systems running normally
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Response Time</h3>
              <p className="text-2xl font-bold text-blue-600">45ms</p>
              <p className="text-sm text-gray-500">Average API response</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Global Reach</h3>
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-gray-500">Countries served</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
