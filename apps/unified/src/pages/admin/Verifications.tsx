import { useState, useEffect, useMemo } from "react";
import { useHub } from "@sms-hub/ui";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import {
  Search,
  Clock,
  RefreshCw,
  Eye,
  Trash2,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
} from "lucide-react";
import {
  verificationsService,
  Verification,
} from "../../services/verificationsService";

const Verifications = () => {
  const { currentHub } = useHub();
  const { isGlobalView } = useGlobalView();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingVerificationId, setDeletingVerificationId] = useState<string | null>(null);
  
  // Filtering states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  
  // Sorting states
  const [sortField, setSortField] = useState<keyof Verification>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch verifications from database
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

      console.log("Verifications: Current hub:", currentHub);
      console.log("Verifications: Global view:", isGlobalView);
      console.log(
        "Verifications: Using hub_id:",
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

      // Fetch verifications with filters
      const fetchedVerifications = await verificationsService.instance.getVerifications(filterOptions);

      console.log("Verifications: Fetched verifications:", fetchedVerifications);
      console.log("Verifications: Count:", fetchedVerifications.length);

      setVerifications(fetchedVerifications);
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

  const handleDeleteVerification = async () => {
    if (!deletingVerificationId) return;
    
    try {
      await verificationsService.instance.deleteVerification(deletingVerificationId);
      await fetchData();
      setShowDeleteConfirm(false);
      setDeletingVerificationId(null);
    } catch (error) {
      console.error("Error deleting verification:", error);
      alert("Failed to delete verification");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter verifications when search query or global view changes
  useEffect(() => {
    fetchData();
  }, [
    searchQuery,
    isGlobalView,
  ]);

  // Compute filtered and sorted verifications using useMemo to prevent flicker
  const filteredVerifications = useMemo(() => {
    let filtered = [...verifications];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(v => {
        if (statusFilter === "verified") return v.is_verified === true;
        if (statusFilter === "unverified") return v.is_verified !== true;
        if (statusFilter === "expired") return v.expires_at && new Date(v.expires_at) < new Date();
        return true;
      });
    }
    
    // Apply method filter
    if (methodFilter !== "all") {
      filtered = filtered.filter(v => v.auth_method === methodFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      
      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return filtered;
  }, [verifications, statusFilter, methodFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Verification) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getVerificationStatus = (verification: Verification) => {
    if (verification.is_verified) {
      return { label: "Verified", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" };
    }
    if (verification.expires_at && new Date(verification.expires_at) < new Date()) {
      return { label: "Expired", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100" };
    }
    if (verification.verification_attempts && verification.max_attempts && 
        verification.verification_attempts >= parseInt(verification.max_attempts)) {
      return { label: "Max Attempts", icon: XCircle, color: "text-red-600", bg: "bg-red-100" };
    }
    return { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verifications from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Error Loading Data
          </h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={fetchData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          <h1 className="text-2xl font-bold text-gray-900">
            {isGlobalView ? "Global Verifications" : "Verifications"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isGlobalView
              ? "Manage verifications from all hubs"
              : `Manage verifications from ${currentHub} hub`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search verifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Verifications Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">
            Verifications ({filteredVerifications.length})
          </h3>
          
          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="expired">Expired</option>
              </select>
              
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Methods</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("first_name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>User</span>
                    {sortField === "first_name" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                {isGlobalView && (
                  <th 
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("hub_id")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Hub</span>
                      {sortField === "hub_id" && (
                        sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                )}
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("auth_method")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Method</span>
                    {sortField === "auth_method" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("verification_code")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Code</span>
                    {sortField === "verification_code" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("is_verified")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === "is_verified" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    {sortField === "created_at" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVerifications.map((verification) => {
                const status = getVerificationStatus(verification);
                return (
                  <tr key={verification.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {verification.first_name} {verification.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {verification.email || verification.mobile_phone_number}
                        </div>
                      </div>
                    </td>
                    {isGlobalView && (
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {verification.hub_id === 0
                            ? "PercyTech"
                            : verification.hub_id === 1
                              ? "Gnymble"
                              : verification.hub_id === 2
                                ? "PercyMD"
                                : verification.hub_id === 3
                                  ? "PercyText"
                                  : "Unknown"}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {verification.auth_method === "email" ? (
                          <Mail className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Phone className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-600 capitalize">
                          {verification.auth_method}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="text-xs font-mono text-gray-600">
                        {verification.verification_code || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                      >
                        <status.icon className="w-3 h-3 mr-1" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {verification.created_at
                        ? new Date(verification.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedVerification(verification)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingVerificationId(verification.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Verification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="relative inline-block text-left">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredVerifications.length === 0 && (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No verifications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== "all" || methodFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No verifications have been created yet."}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Verification
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this verification? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingVerificationId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVerification}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Add verification details modal */}
    </div>
  );
};

export default Verifications;