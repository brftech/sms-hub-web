import { useState, useEffect } from "react";
import { Card, CardContent } from "@sms-hub/ui";
import { Button } from "@sms-hub/ui";
import { Input } from "@sms-hub/ui";
import { Badge } from "@sms-hub/ui";
import {
  Phone,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Building2,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  ChevronDown,
  Zap,
} from "lucide-react";

interface PhoneNumber {
  id: string;
  number: string;
  formatted_number: string;
  status: "available" | "assigned" | "reserved" | "suspended";
  type: "local" | "toll_free" | "short_code";
  area_code: string;
  region: string;
  country: string;
  assigned_to?: string;
  assigned_account?: string;
  assigned_at?: string;
  created_at: string;
  last_used?: string;
  message_count: number;
  capabilities: string[];
  monthly_cost: number;
  provider: string;
}

export function PhoneNumbers() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("number");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Mock data for now - will be replaced with actual API calls
  useEffect(() => {
    const mockPhoneNumbers: PhoneNumber[] = [
      {
        id: "1",
        number: "+15551234567",
        formatted_number: "(555) 123-4567",
        status: "assigned",
        type: "local",
        area_code: "555",
        region: "New York, NY",
        country: "US",
        assigned_to: "101 Distributors",
        assigned_account: "acc_101",
        assigned_at: "2024-01-15T10:30:00Z",
        created_at: "2024-01-10T09:00:00Z",
        last_used: "2024-01-22T14:30:00Z",
        message_count: 1250,
        capabilities: ["SMS", "Voice", "MMS"],
        monthly_cost: 15.0,
        provider: "Bandwidth",
      },
      {
        id: "2",
        number: "+15551234568",
        formatted_number: "(555) 123-4568",
        status: "assigned",
        type: "local",
        area_code: "555",
        region: "Chicago, IL",
        country: "US",
        assigned_to: "Ansteads",
        assigned_account: "acc_ansteads",
        assigned_at: "2024-01-10T09:15:00Z",
        created_at: "2024-01-05T08:00:00Z",
        last_used: "2024-01-21T16:45:00Z",
        message_count: 3200,
        capabilities: ["SMS", "Voice", "MMS"],
        monthly_cost: 15.0,
        provider: "Bandwidth",
      },
      {
        id: "3",
        number: "+18005551234",
        formatted_number: "(800) 555-1234",
        status: "assigned",
        type: "toll_free",
        area_code: "800",
        region: "National",
        country: "US",
        assigned_to: "B&Gs Cigars",
        assigned_account: "acc_bng",
        assigned_at: "2024-01-05T11:30:00Z",
        created_at: "2024-01-01T10:00:00Z",
        last_used: "2024-01-22T09:15:00Z",
        message_count: 2100,
        capabilities: ["SMS", "Voice"],
        monthly_cost: 25.0,
        provider: "Bandwidth",
      },
      {
        id: "4",
        number: "+15551234569",
        formatted_number: "(555) 123-4569",
        status: "available",
        type: "local",
        area_code: "555",
        region: "Los Angeles, CA",
        country: "US",
        created_at: "2024-01-20T14:00:00Z",
        message_count: 0,
        capabilities: ["SMS", "Voice", "MMS"],
        monthly_cost: 15.0,
        provider: "Bandwidth",
      },
      {
        id: "5",
        number: "+15551234570",
        formatted_number: "(555) 123-4570",
        status: "reserved",
        type: "local",
        area_code: "555",
        region: "Miami, FL",
        country: "US",
        assigned_to: "ARI",
        assigned_account: "acc_ari",
        assigned_at: "2024-01-20T14:00:00Z",
        created_at: "2024-01-18T12:00:00Z",
        message_count: 0,
        capabilities: ["SMS", "Voice", "MMS"],
        monthly_cost: 15.0,
        provider: "Bandwidth",
      },
      {
        id: "6",
        number: "+18005551235",
        formatted_number: "(800) 555-1235",
        status: "suspended",
        type: "toll_free",
        area_code: "800",
        region: "National",
        country: "US",
        assigned_to: "Audacy",
        assigned_account: "acc_audacy",
        assigned_at: "2023-12-01T08:00:00Z",
        created_at: "2023-11-15T10:00:00Z",
        last_used: "2024-01-15T10:20:00Z",
        message_count: 890,
        capabilities: ["SMS", "Voice"],
        monthly_cost: 25.0,
        provider: "Bandwidth",
      },
    ];

    const timer = setTimeout(() => {
      setPhoneNumbers(mockPhoneNumbers);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredPhoneNumbers = phoneNumbers
    .filter((phone) => {
      const matchesSearch =
        phone.number.includes(searchQuery) ||
        phone.formatted_number.includes(searchQuery) ||
        phone.assigned_to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.region.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || phone.status === statusFilter;
      const matchesType = typeFilter === "all" || phone.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof PhoneNumber];
      let bValue = b[sortBy as keyof PhoneNumber];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

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
      case "available":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "local":
        return "bg-purple-100 text-purple-800";
      case "toll_free":
        return "bg-orange-100 text-orange-800";
      case "short_code":
        return "bg-indigo-100 text-indigo-800";
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
            <h1 className="text-2xl font-bold text-gray-900">gPhone Numbers</h1>
            <p className="text-gray-600">
              Manage phone number inventory and assignments
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
          <h1 className="text-2xl font-bold text-gray-900">gPhone Numbers</h1>
          <p className="text-gray-600">
            Manage phone number inventory and assignments
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Phone Number
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Total Numbers</p>
                <p className="text-2xl font-bold">{phoneNumbers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold">
                  {phoneNumbers.filter((p) => p.status === "available").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-2xl font-bold">
                  {phoneNumbers.filter((p) => p.status === "assigned").length}
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
                  {phoneNumbers
                    .reduce((sum, p) => sum + p.message_count, 0)
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
                placeholder="Search phone numbers..."
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
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="reserved">Reserved</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            >
              <option value="all">All Types</option>
              <option value="local">Local</option>
              <option value="toll_free">Toll-Free</option>
              <option value="short_code">Short Code</option>
            </select>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
              >
                <option value="number">Sort by Number</option>
                <option value="assigned_at">Sort by Assignment Date</option>
                <option value="message_count">Sort by Messages</option>
                <option value="monthly_cost">Sort by Cost</option>
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

      {/* Phone Numbers List */}
      <div className="space-y-2">
        {filteredPhoneNumbers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No phone numbers found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Add your first phone number to get started"}
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Phone Number
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredPhoneNumbers.map((phone) => (
            <Card key={phone.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {phone.formatted_number}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getStatusColor(phone.status)}
                        >
                          {phone.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getTypeColor(phone.type)}
                        >
                          {phone.type.replace("_", " ")}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {phone.region} • {phone.provider} • $
                        {phone.monthly_cost}/month
                      </p>

                      {phone.assigned_to && (
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>Assigned to {phone.assigned_to}</span>
                          </div>
                          {phone.assigned_at && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Since {formatDate(phone.assigned_at)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>
                            {phone.message_count.toLocaleString()} messages
                          </span>
                        </div>
                        {phone.last_used && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Last used {getRelativeTime(phone.last_used)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4" />
                          <span>{phone.capabilities.join(", ")}</span>
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
