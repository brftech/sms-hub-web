import { useState, useEffect } from "react";
import { Card, CardContent } from "@sms-hub/ui";
import { Button, Badge, useHub } from "@sms-hub/ui";
import { Input } from "@sms-hub/ui";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import {
  phoneNumbersService,
  PhoneNumber,
} from "../../services/phoneNumbersService";
import {
  Phone,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Building2,
  MessageSquare,
  Calendar,
  Clock,
  Edit,
  Eye,
  ChevronDown,
  Zap,
  RefreshCw,
  Shield,
} from "lucide-react";

export function PhoneNumbers() {
  const { currentHub } = useHub();
  const { isGlobalView } = useGlobalView();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [filteredPhoneNumbers, setFilteredPhoneNumbers] = useState<
    PhoneNumber[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch phone numbers from database
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get hub ID based on current hub (only used for non-global view)
      const hubId =
        currentHub === "gnymble"
          ? 1
          : currentHub === "percymd"
            ? 2
            : currentHub === "percytext"
              ? 3
              : currentHub === "percytech"
                ? 0
                : 1; // Default to gnymble (1)

      console.log("PhoneNumbers: Current hub:", currentHub);
      console.log("PhoneNumbers: Global view:", isGlobalView);
      console.log(
        "PhoneNumbers: Using hub_id:",
        isGlobalView ? "ALL HUBS" : hubId
      );

      // Build filter options
      const filterOptions: any = {
        search: searchQuery || undefined,
        limit: 1000,
      };

      // Only filter by hub_id if not in global view
      if (!isGlobalView) {
        filterOptions.hub_id = hubId;
      }

      // Fetch phone numbers with filters
      const fetchedPhoneNumbers =
        await phoneNumbersService.instance.getPhoneNumbers(filterOptions);

      console.log("PhoneNumbers: Fetched phone numbers:", fetchedPhoneNumbers);
      console.log("PhoneNumbers: Count:", fetchedPhoneNumbers.length);

      setPhoneNumbers(fetchedPhoneNumbers);
      setFilteredPhoneNumbers(fetchedPhoneNumbers);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter phone numbers when search query or global view changes
  useEffect(() => {
    fetchData();
  }, [searchQuery, isGlobalView]);

  // Apply filters and sorting to phone numbers
  useEffect(() => {
    let filtered = [...phoneNumbers];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((phone) => phone.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((phone) => phone.type === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof PhoneNumber];
      let bVal: any = b[sortBy as keyof PhoneNumber];

      // Handle nested properties
      if (sortBy === "number") {
        aVal = a.phone_number;
        bVal = b.phone_number;
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredPhoneNumbers(filtered);
  }, [phoneNumbers, statusFilter, typeFilter, sortBy, sortOrder]);

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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading phone numbers from database...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Error Loading Data
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <div className="mt-6">
            <button
              onClick={fetchData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isGlobalView ? "Global gPhone Numbers" : "gPhone Numbers"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isGlobalView
              ? "Manage phone number inventory from all hubs"
              : `Manage phone number inventory from ${currentHub} hub`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search phone numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={() => {
              /* Add phone number functionality */
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Phone Number
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Phone Numbers List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">
            Phone Numbers ({filteredPhoneNumbers.length})
          </h3>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="local">Local</option>
                <option value="toll_free">Toll-Free</option>
                <option value="short_code">Short Code</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="number">Sort by Number</option>
                <option value="assigned_at">Sort by Assignment Date</option>
                <option value="message_count">Sort by Messages</option>
                <option value="monthly_cost">Sort by Cost</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronDown
                  className={`w-4 h-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto flex-1">
          <div className="space-y-2 p-4">
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
                <Card
                  key={phone.id}
                  className="hover:shadow-md transition-shadow"
                >
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
                              {phone.formatted_number || phone.phone_number}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getStatusColor(
                                phone.status || "available"
                              )}
                            >
                              {phone.status || "available"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getTypeColor(phone.type || "local")}
                            >
                              {(phone.type || "local").replace("_", " ")}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {phone.region || "Unknown Region"} •{" "}
                            {phone.provider || "Unknown Provider"} • $
                            {phone.monthly_cost || 0}/month
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
                                  <span>
                                    Since {formatDate(phone.assigned_at)}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>
                                {(phone.message_count || 0).toLocaleString()}{" "}
                                messages
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
                              <span>
                                {(
                                  phone.capabilities || ["SMS", "Voice", "MMS"]
                                ).join(", ")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building2 className="w-4 h-4" />
                              <span>
                                {phone.hub?.name || `Hub ${phone.hub_id}`}
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
      </div>
    </div>
  );
}

export default PhoneNumbers;
