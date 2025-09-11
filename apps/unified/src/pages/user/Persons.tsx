import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardContent } from "@sms-hub/ui";
import { useHub, Button, Input, Badge } from "@sms-hub/ui";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  Tag,
  Star,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";

interface Person {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  tags: string[];
  last_contact: string;
  message_count: number;
  status: "active" | "unsubscribed" | "blocked";
  notes?: string;
  location?: string;
  is_favorite: boolean;
  created_at: string;
}

export function Persons() {
  const { user } = useAuth();
  const { hubConfig } = useHub();
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");

  // Mock data for now - will be replaced with actual API calls
  useEffect(() => {
    const mockPersons: Person[] = [
      {
        id: "1",
        name: "John Smith",
        phone: "+1-555-0101",
        email: "john@example.com",
        company: "Acme Corp",
        tags: ["VIP", "Customer"],
        last_contact: "2024-01-22T14:30:00Z",
        message_count: 15,
        status: "active",
        notes: "Interested in premium package",
        location: "New York, NY",
        is_favorite: true,
        created_at: "2024-01-10T09:00:00Z",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        phone: "+1-555-0102",
        email: "sarah@techstart.com",
        company: "TechStart Inc",
        tags: ["Lead", "Follow-up"],
        last_contact: "2024-01-21T16:45:00Z",
        message_count: 8,
        status: "active",
        notes: "Requested pricing information",
        location: "San Francisco, CA",
        is_favorite: false,
        created_at: "2024-01-15T11:30:00Z",
      },
      {
        id: "3",
        name: "Mike Wilson",
        phone: "+1-555-0103",
        company: "Wilson & Associates",
        tags: ["Customer", "Renewal"],
        last_contact: "2024-01-20T10:15:00Z",
        message_count: 23,
        status: "active",
        notes: "Annual contract renewal due next month",
        location: "Chicago, IL",
        is_favorite: true,
        created_at: "2023-12-01T08:00:00Z",
      },
      {
        id: "4",
        name: "Emily Davis",
        phone: "+1-555-0104",
        email: "emily@retail.com",
        company: "Retail Solutions",
        tags: ["Prospect"],
        last_contact: "2024-01-18T13:20:00Z",
        message_count: 3,
        status: "unsubscribed",
        notes: "Unsubscribed from promotional messages",
        location: "Miami, FL",
        is_favorite: false,
        created_at: "2024-01-12T14:45:00Z",
      },
      {
        id: "5",
        name: "David Brown",
        phone: "+1-555-0105",
        email: "david@consulting.com",
        company: "Brown Consulting",
        tags: ["VIP", "Partner"],
        last_contact: "2024-01-23T09:30:00Z",
        message_count: 31,
        status: "active",
        notes: "Strategic partner - high priority",
        location: "Boston, MA",
        is_favorite: true,
        created_at: "2023-11-15T10:00:00Z",
      },
    ];

    setTimeout(() => {
      setPersons(mockPersons);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredPersons = persons.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.phone.includes(searchQuery) ||
      person.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || person.status === statusFilter;
    const matchesTag = tagFilter === "all" || person.tags.includes(tagFilter);

    return matchesSearch && matchesStatus && matchesTag;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "unsubscribed":
        return "bg-yellow-100 text-yellow-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const allTags = Array.from(new Set(persons.flatMap((p) => p.tags)));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Persons</h1>
            <p className="text-muted-foreground">
              Manage your contact address book
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
          <h1 className="text-2xl font-bold text-foreground">Persons</h1>
          <p className="text-muted-foreground">
            Manage your contact address book
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <UserPlus className="w-4 h-4 mr-2" />
            Import Contacts
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Person
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">{persons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Conversations
                </p>
                <p className="text-2xl font-bold">
                  {persons.filter((p) => p.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">
                  {persons.filter((p) => p.is_favorite).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Tags</p>
                <p className="text-2xl font-bold">{allTags.length}</p>
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
                placeholder="Search contacts..."
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
              <option value="unsubscribed">Unsubscribed</option>
              <option value="blocked">Blocked</option>
            </select>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Persons List */}
      <div className="space-y-2">
        {filteredPersons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No contacts found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Add your first contact to get started"}
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPersons.map((person) => (
            <Card
              key={person.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {person.name}
                        </h3>
                        {person.is_favorite && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <Badge
                          variant="outline"
                          className={getStatusColor(person.status)}
                        >
                          {person.status}
                        </Badge>
                      </div>

                      {person.company && (
                        <p className="text-sm text-muted-foreground mb-1">
                          {person.company}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{person.phone}</span>
                        </div>
                        {person.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{person.email}</span>
                          </div>
                        )}
                        {person.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{person.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{person.message_count} messages</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Last contact {getRelativeTime(person.last_contact)}
                          </span>
                        </div>
                      </div>

                      {person.notes && (
                        <p className="text-xs text-muted-foreground mb-2 italic">
                          "{person.notes}"
                        </p>
                      )}

                      {person.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          {person.tags.map((tag, index) => (
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
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
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
