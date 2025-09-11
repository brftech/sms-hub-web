import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import { Button } from "@sms-hub/ui";
import { Input } from "@sms-hub/ui";
import { Badge } from "@sms-hub/ui";
import {
  Building2,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Users,
  MessageSquare,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
} from "lucide-react";

interface Account {
  id: string;
  name: string;
  type: "company" | "individual";
  status: "active" | "inactive" | "suspended" | "pending";
  industry: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  created_at: string;
  last_activity: string;
  user_count: number;
  message_count: number;
  phone_numbers: number;
  subscription_tier: "starter" | "professional" | "enterprise";
  billing_status: "current" | "past_due" | "cancelled";
}

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Mock data for now - will be replaced with actual API calls
  useEffect(() => {
    const mockAccounts: Account[] = [
      {
        id: "1",
        name: "101 Distributors",
        type: "company",
        status: "active",
        industry: "Retail",
        contact_email: "admin@101distributors.com",
        contact_phone: "+1-555-0101",
        address: "123 Main St, New York, NY 10001",
        created_at: "2024-01-15T10:30:00Z",
        last_activity: "2024-01-22T14:30:00Z",
        user_count: 5,
        message_count: 1250,
        phone_numbers: 3,
        subscription_tier: "professional",
        billing_status: "current",
      },
      {
        id: "2",
        name: "Ansteads",
        type: "company",
        status: "active",
        industry: "Manufacturing",
        contact_email: "contact@ansteads.com",
        contact_phone: "+1-555-0102",
        address: "456 Industrial Blvd, Chicago, IL 60601",
        created_at: "2024-01-10T09:15:00Z",
        last_activity: "2024-01-21T16:45:00Z",
        user_count: 12,
        message_count: 3200,
        phone_numbers: 8,
        subscription_tier: "enterprise",
        billing_status: "current",
      },
      {
        id: "3",
        name: "ARI",
        type: "company",
        status: "pending",
        industry: "Technology",
        contact_email: "info@ari.com",
        contact_phone: "+1-555-0103",
        address: "789 Tech Park, San Francisco, CA 94105",
        created_at: "2024-01-20T14:00:00Z",
        last_activity: "2024-01-20T14:00:00Z",
        user_count: 0,
        message_count: 0,
        phone_numbers: 0,
        subscription_tier: "starter",
        billing_status: "current",
      },
      {
        id: "4",
        name: "Audacy",
        type: "company",
        status: "inactive",
        industry: "Media",
        contact_email: "support@audacy.com",
        contact_phone: "+1-555-0104",
        address: "321 Media Center, Los Angeles, CA 90210",
        created_at: "2023-12-01T08:00:00Z",
        last_activity: "2024-01-15T10:20:00Z",
        user_count: 8,
        message_count: 890,
        phone_numbers: 5,
        subscription_tier: "professional",
        billing_status: "past_due",
      },
      {
        id: "5",
        name: "B&Gs Cigars",
        type: "company",
        status: "active",
        industry: "Retail",
        contact_email: "sales@bngcigars.com",
        contact_phone: "+1-555-0105",
        address: "654 Tobacco Row, Miami, FL 33101",
        created_at: "2024-01-05T11:30:00Z",
        last_activity: "2024-01-22T09:15:00Z",
        user_count: 3,
        message_count: 2100,
        phone_numbers: 2,
        subscription_tier: "professional",
        billing_status: "current",
      },
    ];

    const timer = setTimeout(() => {
      setAccounts(mockAccounts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredAccounts = accounts
    .filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.contact_email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        account.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || account.status === statusFilter;
      const matchesType = typeFilter === "all" || account.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Account];
      let bValue = b[sortBy as keyof Account];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-800";
      case "past_due":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubscriptionTierColor = (tier: string) => {
    switch (tier) {
      case "starter":
        return "bg-blue-100 text-blue-800";
      case "professional":
        return "bg-purple-100 text-purple-800";
      case "enterprise":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600">
              Manage customer accounts and companies
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
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600">
            Manage customer accounts and companies
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Total Accounts</p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold">
                  {accounts.filter((a) => a.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">
                  {accounts.reduce((sum, a) => sum + a.user_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">
                  {accounts
                    .reduce((sum, a) => sum + a.message_count, 0)
                    .toLocaleString()}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="all">All Types</option>
              <option value="company">Company</option>
              <option value="individual">Individual</option>
            </select>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
              >
                <option value="name">Sort by Name</option>
                <option value="created_at">Sort by Date</option>
                <option value="user_count">Sort by Users</option>
                <option value="message_count">Sort by Messages</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <ChevronDown
                  className={`w-4 h-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <div className="space-y-2">
        {filteredAccounts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No accounts found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Add your first account to get started"}
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAccounts.map((account) => (
            <Card
              key={account.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {account.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getStatusColor(account.status)}
                        >
                          {account.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getBillingStatusColor(
                            account.billing_status
                          )}
                        >
                          {account.billing_status.replace("_", " ")}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getSubscriptionTierColor(
                            account.subscription_tier
                          )}
                        >
                          {account.subscription_tier}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {account.industry}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{account.contact_email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{account.contact_phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{account.address}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{account.user_count} users</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>
                            {account.message_count.toLocaleString()} messages
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{account.phone_numbers} phone numbers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Last activity{" "}
                            {getRelativeTime(account.last_activity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
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
