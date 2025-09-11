import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useHub } from "@sms-hub/ui";
import { Card, CardContent } from "@sms-hub/ui";
import { Button } from "@sms-hub/ui";
import { Input } from "@sms-hub/ui";
import { Badge } from "@sms-hub/ui";
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Conversation {
  id: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  status: "active" | "paused" | "archived";
  assigned_to?: string;
  tags: string[];
}

export function Conversations() {
  // const { user } = useAuth();
  // const { hubConfig } = useHub();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data for now - will be replaced with actual API calls
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: "1",
        contact_name: "John Smith",
        contact_phone: "+1-555-0101",
        contact_email: "john@example.com",
        last_message: "Thanks for the update!",
        last_message_time: "2 minutes ago",
        unread_count: 0,
        status: "active",
        assigned_to: "You",
        tags: ["VIP", "Follow-up"],
      },
      {
        id: "2",
        contact_name: "Sarah Johnson",
        contact_phone: "+1-555-0102",
        last_message: "Can you send me more details about the pricing?",
        last_message_time: "1 hour ago",
        unread_count: 2,
        status: "active",
        assigned_to: "Team",
        tags: ["Pricing"],
      },
      {
        id: "3",
        contact_name: "Mike Wilson",
        contact_phone: "+1-555-0103",
        last_message: "I'm interested in your services",
        last_message_time: "3 hours ago",
        unread_count: 1,
        status: "active",
        assigned_to: "You",
        tags: ["Lead"],
      },
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.contact_phone.includes(searchQuery) ||
      conv.last_message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || conv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-4 h-4" />;
      case "paused":
        return <Clock className="w-4 h-4" />;
      case "archived":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Conversations
            </h1>
            <p className="text-muted-foreground">
              Manage your SMS conversations
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
          <h1 className="text-2xl font-bold text-foreground">Conversations</h1>
          <p className="text-muted-foreground">
            Manage your SMS conversations with customers
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
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
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No conversations found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Start a conversation with a customer"}
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Start New Conversation
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">
                          {conversation.contact_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {conversation.contact_name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getStatusColor(conversation.status)}
                        >
                          {getStatusIcon(conversation.status)}
                          <span className="ml-1 capitalize">
                            {conversation.status}
                          </span>
                        </Badge>
                        {conversation.unread_count > 0 && (
                          <Badge className="bg-orange-500 text-white">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {conversation.last_message}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{conversation.contact_phone}</span>
                        </div>
                        {conversation.contact_email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{conversation.contact_email}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{conversation.last_message_time}</span>
                        </div>
                        <span>•</span>
                        <span>Assigned to {conversation.assigned_to}</span>
                      </div>

                      {conversation.tags.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {conversation.tags.map((tag, index) => (
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
