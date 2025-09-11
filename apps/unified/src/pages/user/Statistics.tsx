import { useState, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import { useHub } from "@sms-hub/ui";
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
  MessageSquare,
  Users,
  Zap,
  Clock,
  CheckCircle2,
  Download,
  Filter,
} from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  date: string;
  messages: number;
  conversations: number;
  broadcasts: number;
}

export function Statistics() {
  // const { user } = useAuth();
  // const { hubConfig } = useHub();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Mock data for now - will be replaced with actual API calls
  useEffect(() => {
    const mockChartData: ChartData[] = [
      { date: "2024-01-01", messages: 45, conversations: 12, broadcasts: 2 },
      { date: "2024-01-02", messages: 52, conversations: 15, broadcasts: 1 },
      { date: "2024-01-03", messages: 38, conversations: 10, broadcasts: 3 },
      { date: "2024-01-04", messages: 67, conversations: 18, broadcasts: 2 },
      { date: "2024-01-05", messages: 73, conversations: 22, broadcasts: 4 },
      { date: "2024-01-06", messages: 58, conversations: 16, broadcasts: 1 },
      { date: "2024-01-07", messages: 82, conversations: 25, broadcasts: 3 },
      { date: "2024-01-08", messages: 91, conversations: 28, broadcasts: 2 },
      { date: "2024-01-09", messages: 76, conversations: 21, broadcasts: 5 },
      { date: "2024-01-10", messages: 89, conversations: 24, broadcasts: 3 },
      { date: "2024-01-11", messages: 95, conversations: 26, broadcasts: 4 },
      { date: "2024-01-12", messages: 88, conversations: 23, broadcasts: 2 },
      { date: "2024-01-13", messages: 102, conversations: 29, broadcasts: 6 },
      { date: "2024-01-14", messages: 97, conversations: 27, broadcasts: 3 },
      { date: "2024-01-15", messages: 113, conversations: 31, broadcasts: 5 },
      { date: "2024-01-16", messages: 108, conversations: 30, broadcasts: 4 },
      { date: "2024-01-17", messages: 125, conversations: 35, broadcasts: 7 },
      { date: "2024-01-18", messages: 119, conversations: 33, broadcasts: 5 },
      { date: "2024-01-19", messages: 134, conversations: 38, broadcasts: 6 },
      { date: "2024-01-20", messages: 142, conversations: 41, broadcasts: 8 },
      { date: "2024-01-21", messages: 138, conversations: 39, broadcasts: 7 },
      { date: "2024-01-22", messages: 156, conversations: 44, broadcasts: 9 },
      { date: "2024-01-23", messages: 149, conversations: 42, broadcasts: 8 },
      { date: "2024-01-24", messages: 167, conversations: 47, broadcasts: 10 },
      { date: "2024-01-25", messages: 173, conversations: 49, broadcasts: 11 },
      { date: "2024-01-26", messages: 158, conversations: 45, broadcasts: 9 },
      { date: "2024-01-27", messages: 184, conversations: 52, broadcasts: 12 },
      { date: "2024-01-28", messages: 192, conversations: 55, broadcasts: 13 },
      { date: "2024-01-29", messages: 201, conversations: 58, broadcasts: 14 },
      { date: "2024-01-30", messages: 198, conversations: 56, broadcasts: 13 },
    ];

    const timer = setTimeout(() => {
      setChartData(mockChartData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const statCards: StatCard[] = [
    {
      title: "Total Messages",
      value: "2,847",
      change: 12.5,
      changeType: "increase",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "text-blue-500",
    },
    {
      title: "Active Conversations",
      value: "156",
      change: 8.3,
      changeType: "increase",
      icon: <Users className="w-5 h-5" />,
      color: "text-green-500",
    },
    {
      title: "Broadcasts Sent",
      value: "89",
      change: 15.2,
      changeType: "increase",
      icon: <Zap className="w-5 h-5" />,
      color: "text-orange-500",
    },
    {
      title: "Delivery Rate",
      value: "98.7%",
      change: 2.1,
      changeType: "increase",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-purple-500",
    },
    {
      title: "Response Rate",
      value: "23.4%",
      change: 5.7,
      changeType: "increase",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-indigo-500",
    },
    {
      title: "Avg Response Time",
      value: "2.3h",
      change: 12.8,
      changeType: "decrease",
      icon: <Clock className="w-5 h-5" />,
      color: "text-red-500",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "broadcast",
      title: "Holiday Sale Campaign",
      description: "Sent to 500 recipients",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "conversation",
      title: "New conversation with John Smith",
      description: "Started via broadcast response",
      time: "4 hours ago",
      status: "active",
    },
    {
      id: "3",
      type: "broadcast",
      title: "Product Update Notification",
      description: "Sent to 200 recipients",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: "4",
      type: "conversation",
      title: "Sarah Johnson unsubscribed",
      description: "Removed from promotional list",
      time: "2 days ago",
      status: "completed",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Statistics</h1>
            <p className="text-muted-foreground">
              View your SMS campaign analytics
            </p>
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
          <h1 className="text-2xl font-bold text-foreground">Statistics</h1>
          <p className="text-muted-foreground">
            View your SMS campaign analytics and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">
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
                    <span className="text-sm text-muted-foreground">
                      vs last period
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Messages Over Time</CardTitle>
            <CardDescription>
              Daily message volume for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Chart visualization will be implemented
                </p>
                <p className="text-sm text-muted-foreground">
                  Data points: {chartData.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Conversations Over Time</CardTitle>
            <CardDescription>
              Daily conversation count for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Chart visualization will be implemented
                </p>
                <p className="text-sm text-muted-foreground">
                  Data points: {chartData.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest SMS campaign and conversation activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 rounded-lg border"
              >
                <div className="flex-shrink-0">
                  {activity.type === "broadcast" ? (
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-orange-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        activity.status === "completed"
                          ? "text-green-600 border-green-200"
                          : "text-blue-600 border-blue-200"
                      }
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

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">
                Best Performing Day
              </h3>
              <p className="text-2xl font-bold text-foreground">January 30</p>
              <p className="text-sm text-muted-foreground">201 messages sent</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">
                Most Active Time
              </h3>
              <p className="text-2xl font-bold text-foreground">2-4 PM</p>
              <p className="text-sm text-muted-foreground">
                Peak conversation time
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">Growth Rate</h3>
              <p className="text-2xl font-bold text-foreground">+15.2%</p>
              <p className="text-sm text-muted-foreground">vs last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
