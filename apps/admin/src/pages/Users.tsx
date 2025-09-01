import { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Users as UsersIcon,
  CheckCircle,
  Clock,
  Shield,
  RefreshCw,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { usersService, UserProfile, UserStats } from "../services/usersService";

const Users = () => {
  const { currentHub } = useHub();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [onboardingStepFilter, setOnboardingStepFilter] =
    useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [availablePaymentStatuses, setAvailablePaymentStatuses] = useState<
    string[]
  >([]);
  const [availableOnboardingSteps, setAvailableOnboardingSteps] = useState<
    string[]
  >([]);

  // Fetch users and stats from database
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get hub ID based on current hub
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

      console.log("Users: Current hub:", currentHub);
      console.log("Users: Using hub_id:", hubId);

      // Build filter options
      const filterOptions: any = {
        hub_id: hubId,
        search: searchQuery || undefined,
        limit: 1000,
      };

      if (roleFilter !== "all") {
        filterOptions.role = roleFilter;
      }

      if (paymentStatusFilter !== "all") {
        filterOptions.payment_status = paymentStatusFilter;
      }

      if (onboardingStepFilter !== "all") {
        filterOptions.onboarding_step = onboardingStepFilter;
      }

      // Fetch users with filters
      const fetchedUsers = await usersService.getUsers(filterOptions);

      console.log("Users: Fetched users:", fetchedUsers);
      console.log("Users: Count:", fetchedUsers.length);

      // Fetch stats
      const fetchedStats = await usersService.getUserStats(hubId);

      // Fetch available filter options
      const roles = await usersService.getUniqueRoles();
      const paymentStatuses = await usersService.getUniquePaymentStatuses();
      const onboardingSteps = await usersService.getUniqueOnboardingSteps();

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      setStats(fetchedStats);
      setAvailableRoles(roles);
      setAvailablePaymentStatuses(paymentStatuses);
      setAvailableOnboardingSteps(onboardingSteps);
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

  // Filter users when filters change
  useEffect(() => {
    fetchData();
  }, [roleFilter, paymentStatusFilter, onboardingStepFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users from database...</p>
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users from {currentHub} hub
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </button>
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

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Total Users
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-xs text-blue-600 mt-1 truncate">All users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Active Users
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
                <p className="text-xs text-green-600 mt-1 truncate">
                  Currently active
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Inactive Users
                </p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {stats.inactive}
                </p>
                <p className="text-xs text-red-600 mt-1 truncate">
                  Needs attention
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors duration-200">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Roles
                </p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {Object.keys(stats.byRole).length}
                </p>
                <p className="text-xs text-yellow-600 mt-1 truncate">
                  User roles
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Payment Status</option>
              {availablePaymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={onboardingStepFilter}
              onChange={(e) => setOnboardingStepFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Onboarding Steps</option>
              {availableOnboardingSteps.map((step) => (
                <option key={step} value={step}>
                  {step}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Users ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-sm">
                      {user.account_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "manager"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.payment_status || "Not specified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ||
              roleFilter !== "all" ||
              paymentStatusFilter !== "all" ||
              onboardingStepFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No users have been created yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
