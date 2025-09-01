import { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui";
import { useGlobalView } from "../contexts/GlobalViewContext";
import {
  Building,
  Users,
  AlertTriangle,
  Search,
  RefreshCw,
  Plus,
  DollarSign,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  companiesService,
  Company,
  CompanyStats,
} from "../services/companiesService";

const Companies = () => {
  const { currentHub } = useHub();
  const { isGlobalView } = useGlobalView();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableSubscriptionTiers, setAvailableSubscriptionTiers] = useState<
    string[]
  >([]);

  // Fetch companies and stats from database
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

      console.log("Companies: Current hub:", currentHub);
      console.log("Companies: Global view:", isGlobalView);
      console.log(
        "Companies: Using hub_id:",
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

      if (industryFilter !== "all") {
        filterOptions.industry = industryFilter;
      }

      if (sizeFilter !== "all") {
        filterOptions.size = sizeFilter;
      }

      if (subscriptionFilter !== "all") {
        filterOptions.subscription_tier = subscriptionFilter;
      }

      // Fetch companies with filters
      const fetchedCompanies =
        await companiesService.getCompanies(filterOptions);

      console.log("Companies: Fetched companies:", fetchedCompanies);
      console.log("Companies: Count:", fetchedCompanies.length);

      // Fetch stats (global or hub-specific)
      const fetchedStats = isGlobalView
        ? await companiesService.getGlobalCompanyStats()
        : await companiesService.getCompanyStats(hubId);

      // Fetch available filter options (global or hub-specific)
      const industries = isGlobalView
        ? await companiesService.getGlobalUniqueIndustries()
        : await companiesService.getUniqueIndustries();
      const sizes = isGlobalView
        ? await companiesService.getGlobalUniqueSizes()
        : await companiesService.getUniqueSizes();
      const subscriptionTiers = isGlobalView
        ? await companiesService.getGlobalUniqueSubscriptionTiers()
        : await companiesService.getUniqueSubscriptionTiers();

      setCompanies(fetchedCompanies);
      setFilteredCompanies(fetchedCompanies);
      setStats(fetchedStats);
      setAvailableIndustries(industries);
      setAvailableSizes(sizes);
      setAvailableSubscriptionTiers(subscriptionTiers);
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

  // Filter companies when filters change or global view changes
  useEffect(() => {
    fetchData();
  }, [
    industryFilter,
    sizeFilter,
    subscriptionFilter,
    searchQuery,
    isGlobalView,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading companies from database...
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
            <AlertTriangle className="h-6 w-6 text-red-600" />
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
          <h1 className="text-2xl font-bold text-gray-900">
            {isGlobalView ? "Global Companies" : "Companies"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isGlobalView
              ? "Manage companies from all hubs"
              : `Manage companies from ${currentHub} hub`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Company
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
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Total Companies
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-xs text-blue-600 mt-1 truncate">
                  All companies
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Active Companies
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
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Inactive Companies
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
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Industries
                </p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {Object.keys(stats.byIndustry).length}
                </p>
                <p className="text-xs text-yellow-600 mt-1 truncate">
                  Unique sectors
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
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Industries</option>
              {availableIndustries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>

            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Sizes</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <select
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subscriptions</option>
              {availableSubscriptionTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Companies ({filteredCompanies.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                {isGlobalView && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hub
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {company.public_name}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {company.company_account_number}
                      </div>
                    </div>
                  </td>
                  {isGlobalView && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {company.hub_id === 0
                          ? "PercyTech"
                          : company.hub_id === 1
                            ? "Gnymble"
                            : company.hub_id === 2
                              ? "PercyMD"
                              : company.hub_id === 3
                                ? "PercyText"
                                : "Unknown"}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {company.industry || "Not specified"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.size || "Not specified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.subscription_tier || "Not specified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {company.billing_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {company.is_active ? "Active" : "Inactive"}
                    </span>
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

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No companies found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ||
              industryFilter !== "all" ||
              sizeFilter !== "all" ||
              subscriptionFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No companies have been created yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
