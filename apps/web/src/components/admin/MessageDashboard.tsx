import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { messageService, MessageData, MessageAnalytics } from "@/services";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Search,
  Filter,
} from "lucide-react";

const MessageDashboard: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [analytics, setAnalytics] = useState<MessageAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    sender: "all",
    source: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 20;

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      // For now, we'll use a simple approach since the service returns all messages
      // In a real implementation, you'd want pagination support
      const allMessages = await messageService.getLeadMessages(""); // Empty string for all
      setMessages(allMessages);
      setTotalCount(allMessages.length);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      const result = await messageService.getMessageAnalytics();
      setAnalytics(result);
    } catch (error) {
      console.error("Error loading analytics:", error);
      setAnalytics(null);
    }
  }, []);

  useEffect(() => {
    loadMessages();
    loadAnalytics();
  }, [loadMessages, loadAnalytics]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    if (key === "sender" && value === "all") {
      setFilters((prev) => ({ ...prev, [key]: undefined }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
    setCurrentPage(1);
  };

  const filteredMessages = messages.filter((message) => {
    if (
      filters.search &&
      !message.text.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.sender &&
      filters.sender !== "all" &&
      message.sender !== filters.sender
    ) {
      return false;
    }
    if (
      filters.source &&
      filters.source !== "all" &&
      message.metadata?.source !== filters.source
    ) {
      return false;
    }
    return true;
  });

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getSenderBadgeVariant = (sender: string) => {
    return sender === "user" ? "default" : "secondary";
  };

  const getSourceBadgeVariant = (source: string) => {
    switch (source) {
      case "phone-ui":
        return "outline";
      case "web-form":
        return "secondary";
      case "api":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Message Dashboard</h1>
        <Button onClick={() => window.location.reload()}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalMessages}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User Messages
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.messagesBySender.user || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Business Messages
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.messagesBySender.business || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.averageResponseTime.toFixed(1)}s
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search messages..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sender</label>
              <Select
                value={filters.sender || "all"}
                onValueChange={(value) => handleFilterChange("sender", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All senders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All senders</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Source</label>
              <Select
                value={filters.source || "all"}
                onValueChange={(value) => handleFilterChange("source", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  <SelectItem value="phone-ui">Phone UI</SelectItem>
                  <SelectItem value="web-form">Web Form</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Lead ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMessages.length > 0 ? (
                paginatedMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <Badge variant={getSenderBadgeVariant(message.sender)}>
                        {message.sender}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={message.text}>
                        {message.text}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getSourceBadgeVariant(
                          message.metadata?.source || "unknown"
                        )}
                      >
                        {message.metadata?.source || "unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>{message.businessName || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {message.leadId ? (
                        <Badge variant="outline" className="font-mono text-xs">
                          {message.leadId.substring(0, 8)}...
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    {loading ? "Loading messages..." : "No messages found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredMessages.length
                )}{" "}
                of {filteredMessages.length} messages
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageDashboard;
