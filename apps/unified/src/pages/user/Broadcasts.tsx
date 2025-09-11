import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useHub } from "@sms-hub/ui";
import { Card, CardContent } from "@sms-hub/ui";
import { Button } from "@sms-hub/ui";
import { Input } from "@sms-hub/ui";
import { Badge } from "@sms-hub/ui";
import {
  Zap,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Play,
  Pause,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";

interface Broadcast {
  id: string;
  name: string;
  description: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "failed";
  recipient_count: number;
  sent_count: number;
  delivery_rate: number;
  created_at: string;
  scheduled_for?: string;
  sent_at?: string;
  tags: string[];
  created_by: string;
}

export function Broadcasts() {
  // const { user } = useAuth();
  // const { hubConfig } = useHub();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data for now - will be replaced with actual API calls
  useEffect(() => {
    const mockBroadcasts: Broadcast[] = [
      {
        id: "1",
        name: "Welcome New Customers",
        description: "Welcome message for new signups",
        status: "sent",
        recipient_count: 150,
        sent_count: 148,
        delivery_rate: 98.7,
        created_at: "2024-01-15T10:30:00Z",
        sent_at: "2024-01-15T11:00:00Z",
        tags: ["Welcome", "Automated"],
        created_by: "You",
      },
      {
        id: "2",
        name: "Holiday Sale Promotion",
        description: "Special discount for holiday season",
        status: "scheduled",
        recipient_count: 500,
        sent_count: 0,
        delivery_rate: 0,
        created_at: "2024-01-20T14:00:00Z",
        scheduled_for: "2024-01-25T09:00:00Z",
        tags: ["Promotion", "Holiday"],
        created_by: "You",
      },
      {
        id: "3",
        name: "Product Update Notification",
        description: "Important updates about our services",
        status: "sending",
        recipient_count: 200,
        sent_count: 45,
        delivery_rate: 22.5,
        created_at: "2024-01-22T16:30:00Z",
        tags: ["Update", "Important"],
        created_by: "Team",
      },
      {
        id: "4",
        name: "Follow-up Campaign",
        description: "Follow up with recent leads",
        status: "draft",
        recipient_count: 75,
        sent_count: 0,
        delivery_rate: 0,
        created_at: "2024-01-23T09:15:00Z",
        tags: ["Follow-up", "Leads"],
        created_by: "You",
      },
    ];

    setTimeout(() => {
      setBroadcasts(mockBroadcasts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredBroadcasts = broadcasts.filter((broadcast) => {
    const matchesSearch =
      broadcast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broadcast.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || broadcast.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "sending":
        return "bg-yellow-100 text-yellow-800";
      case "sent":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="w-4 h-4" />;
      case "scheduled":
        return <Calendar className="w-4 h-4" />;
      case "sending":
        return <Play className="w-4 h-4" />;
      case "sent":
        return <CheckCircle2 className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Broadcasts</h1>
            <p className="text-muted-foreground">
              Manage your SMS broadcast campaigns
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
          <h1 className="text-2xl font-bold text-foreground">Broadcasts</h1>
          <p className="text-muted-foreground">
            Create and manage SMS broadcast campaigns
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Broadcasts
                </p>
                <p className="text-2xl font-bold">{broadcasts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Recipients
                </p>
                <p className="text-2xl font-bold">
                  {broadcasts
                    .reduce((sum, b) => sum + b.recipient_count, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Messages Sent</p>
                <p className="text-2xl font-bold">
                  {broadcasts
                    .reduce((sum, b) => sum + b.sent_count, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg. Delivery Rate
                </p>
                <p className="text-2xl font-bold">
                  {broadcasts.length > 0
                    ? (
                        broadcasts.reduce(
                          (sum, b) => sum + b.delivery_rate,
                          0
                        ) / broadcasts.length
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search broadcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="sent">Sent</option>
              <option value="paused">Paused</option>
              <option value="failed">Failed</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Broadcasts List */}
      <div className="space-y-2">
        {filteredBroadcasts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No broadcasts found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Create your first broadcast campaign"}
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Broadcast
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBroadcasts.map((broadcast) => (
            <Card
              key={broadcast.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Zap className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {broadcast.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getStatusColor(broadcast.status)}
                        >
                          {getStatusIcon(broadcast.status)}
                          <span className="ml-1 capitalize">
                            {broadcast.status}
                          </span>
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {broadcast.description}
                      </p>

                      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {broadcast.recipient_count.toLocaleString()}{" "}
                            recipients
                          </span>
                        </div>
                        {broadcast.sent_count > 0 && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {broadcast.sent_count.toLocaleString()} sent
                            </span>
                          </div>
                        )}
                        {broadcast.delivery_rate > 0 && (
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>
                              {broadcast.delivery_rate}% delivery rate
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Created {formatDate(broadcast.created_at)}</span>
                        {broadcast.scheduled_for && (
                          <>
                            <span>•</span>
                            <span>
                              Scheduled for{" "}
                              {formatDate(broadcast.scheduled_for)}
                            </span>
                          </>
                        )}
                        {broadcast.sent_at && (
                          <>
                            <span>•</span>
                            <span>Sent {formatDate(broadcast.sent_at)}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>By {broadcast.created_by}</span>
                      </div>

                      {broadcast.tags.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {broadcast.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
