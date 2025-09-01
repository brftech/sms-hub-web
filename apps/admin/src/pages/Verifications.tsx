import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Mail,
  Phone,
  User,
  Building,
  Calendar,
  Search,
  Filter,
  Trash2,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { useGlobalView } from "../contexts/GlobalViewContext";
import { useHub } from "@sms-hub/ui";
import {
  verificationsService,
  Verification,
  VerificationStats,
} from "../services/verificationsService";

const Verifications = () => {
  const navigate = useNavigate();
  const { currentHub } = useHub();
  const { isGlobalView } = useGlobalView();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<
    Verification[]
  >([]);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    authMethod: "",
    status: "",
    hubId: "",
    dateRange: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVerifications, setSelectedVerifications] = useState<string[]>(
    []
  );
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch verifications and stats from database
  const fetchData = async () => {
    try {
      setLoading(true);
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

      let fetchedVerifications: Verification[] = [];
      let fetchedStats: VerificationStats | null = null;

      if (isGlobalView) {
        // Fetch global data
        fetchedVerifications = await verificationsService.getVerifications();
        fetchedStats = await verificationsService.getGlobalVerificationStats();
      } else {
        // Fetch hub-specific data
        fetchedVerifications = await verificationsService.getVerifications({
          hub_id: hubId,
        });
        fetchedStats = await verificationsService.getVerificationStats(hubId);
      }

      setVerifications(fetchedVerifications);
      setFilteredVerifications(fetchedVerifications);
      setStats(fetchedStats);

      console.log(
        "Verifications: Fetched verifications:",
        fetchedVerifications
      );
      console.log("Verifications: Count:", fetchedVerifications.length);
    } catch (err) {
      console.error("Error fetching verifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch verifications"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter verifications when filters change or global view changes
  useEffect(() => {
    let filtered = verifications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (verification) =>
          verification.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          verification.mobile_phone_number?.includes(searchTerm) ||
          verification.first_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          verification.last_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          verification.company_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.authMethod) {
      filtered = filtered.filter(
        (verification) => verification.auth_method === filters.authMethod
      );
    }

    if (filters.status) {
      if (filters.status === 'verified') {
        filtered = filtered.filter(verification => verification.is_verified === true);
      } else if (filters.status === 'unverified') {
        filtered = filtered.filter(verification => verification.is_verified !== true);
      } else if (filters.status === 'expired') {
        filtered = filtered.filter(verification => 
          verification.expires_at && new Date(verification.expires_at) < new Date()
        );
      } else if (filters.status === 'max_attempts') {
        filtered = filtered.filter(verification => 
          verification.verification_attempts && verification.max_attempts && 
          verification.verification_attempts >= parseInt(verification.max_attempts)
        );
      }
    }

    if (filters.hubId && !isGlobalView) {
      filtered = filtered.filter(
        (verification) => verification.hub_id?.toString() === filters.hubId
      );
    }

    if (filters.dateRange) {
      const now = new Date();
      const cutoff = new Date();

      switch (filters.dateRange) {
        case "today":
          cutoff.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(
        (verification) => new Date(verification.created_at || "") >= cutoff
      );
    }

    setFilteredVerifications(filtered);
  }, [verifications, searchTerm, filters, isGlobalView]);

  // Refresh data when hub or global view changes
  useEffect(() => {
    fetchData();
  }, [currentHub, isGlobalView]);

  const handleDeleteVerification = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this verification?")) {
      try {
        await verificationsService.deleteVerification(id);
        setVerifications(verifications.filter((v) => v.id !== id));
        setFilteredVerifications(
          filteredVerifications.filter((v) => v.id !== id)
        );

        // Refresh stats
        await fetchData();
      } catch (err) {
        console.error("Error deleting verification:", err);
        alert("Failed to delete verification");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVerifications.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedVerifications.length} verifications?`
      )
    ) {
      try {
        for (const id of selectedVerifications) {
          await verificationsService.deleteVerification(id);
        }

        setVerifications(
          verifications.filter((v) => !selectedVerifications.includes(v.id))
        );
        setFilteredVerifications(
          filteredVerifications.filter(
            (v) => !selectedVerifications.includes(v.id)
          )
        );
        setSelectedVerifications([]);
        setShowBulkActions(false);

        // Refresh stats
        await fetchData();
      } catch (err) {
        console.error("Error bulk deleting verifications:", err);
        alert("Failed to delete some verifications");
      }
    }
  };

  const handleBulkAction = async () => {
    if (selectedVerifications.length === 0) return;

    try {
      switch (bulkAction) {
        case "delete":
          await handleBulkDelete();
          break;
        case "export":
          // Export logic here
          console.log("Exporting verifications:", selectedVerifications);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("Error performing bulk action:", err);
    }
  };

  const getVerificationStatus = (verification: Verification) => {
    if (verification.is_verified) {
      return {
        status: "verified",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    }
    if (
      verification.verification_attempts &&
      verification.max_attempts &&
      verification.verification_attempts >= parseInt(verification.max_attempts)
    ) {
      return {
        status: "max_attempts",
        color: "text-red-600",
        bg: "bg-red-100",
      };
    }
    if (
      verification.expires_at &&
      new Date(verification.expires_at) < new Date()
    ) {
      return {
        status: "expired",
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    }
    return { status: "pending", color: "text-yellow-600", bg: "bg-yellow-100" };
  };

  const getAuthMethodIcon = (method: string) => {
    switch (method) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "sms":
        return <Phone className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "max_attempts":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "expired":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading verifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading verifications</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isGlobalView ? "Global Verifications" : "Verifications"}
          </h1>
          <p className="text-gray-600">
            {isGlobalView
              ? "Manage verifications from all hubs"
              : `Manage verifications for ${currentHub} hub`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showFilters
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4 mr-2 inline" />
            Filters
          </button>

          <button
            onClick={fetchData}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.verified}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Unverified</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.unverified}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.expired}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search verifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auth Method
              </label>
              <select
                value={filters.authMethod}
                onChange={(e) =>
                  setFilters({ ...filters, authMethod: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Methods</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="expired">Expired</option>
                <option value="max_attempts">Max Attempts</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedVerifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-blue-800">
              {selectedVerifications.length} verification
              {selectedVerifications.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center space-x-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Action</option>
                <option value="delete">Delete Selected</option>
                <option value="export">Export Selected</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setSelectedVerifications([]);
                  setShowBulkActions(false);
                }}
                className="px-3 py-2 text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verifications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      selectedVerifications.length ===
                        filteredVerifications.length &&
                      filteredVerifications.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVerifications(
                          filteredVerifications.map((v) => v.id)
                        );
                      } else {
                        setSelectedVerifications([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                {isGlobalView && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hub
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVerifications.map((verification) => {
                const status = getVerificationStatus(verification);
                return (
                  <tr key={verification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVerifications.includes(
                          verification.id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVerifications([
                              ...selectedVerifications,
                              verification.id,
                            ]);
                          } else {
                            setSelectedVerifications(
                              selectedVerifications.filter(
                                (id) => id !== verification.id
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {verification.first_name} {verification.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {verification.email}
                          </div>
                          {verification.company_name && (
                            <div className="text-xs text-gray-400">
                              {verification.company_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    {isGlobalView && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {verification.hub_id}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getAuthMethodIcon(verification.auth_method)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {verification.auth_method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(status.status)}
                        <span
                          className={`ml-2 text-sm font-medium ${status.color}`}
                        >
                          {status.status.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {verification.created_at
                        ? new Date(verification.created_at).toLocaleDateString()
                        : "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/verifications/${verification.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteVerification(verification.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No verifications found</p>
            <p className="text-gray-400 text-sm">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Try adjusting your search or filters"
                : "Verifications will appear here once they are created"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verifications;
