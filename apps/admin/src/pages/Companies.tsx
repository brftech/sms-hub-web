import { useState, useEffect, useMemo } from "react";
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
  Edit,
  X,
  Trash2,
  UserPlus,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Filter,
} from "lucide-react";
import {
  companiesService,
  Company,
} from "../services/companiesService";
import { CreateCompanyModal } from "../components/CreateCompanyModal";
import { CompanyDetailsModal } from "../components/CompanyDetailsModal";

const Companies = () => {
  const { currentHub } = useHub();
  const { isGlobalView } = useGlobalView();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  
  // Filtering states
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [onboardingFilter, setOnboardingFilter] = useState<string>("all");
  
  // Sorting states
  const [sortField, setSortField] = useState<keyof Company>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

      // Fetch companies with filters
      const fetchedCompanies =
        await companiesService.getCompanies(filterOptions);

      console.log("Companies: Fetched companies:", fetchedCompanies);
      console.log("Companies: Count:", fetchedCompanies.length);

      setCompanies(fetchedCompanies);
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

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingCompany(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateOnboardingStep = async (companyId: string, newStep: string) => {
    try {
      setIsUpdating(true);
      const result = await companiesService.updateCompanyOnboardingStep(companyId, newStep);
      
      if (result.success) {
        // Refresh the data to show the update
        await fetchData();
        handleCloseEditModal();
      } else {
        alert(`Failed to update: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateCompany = async () => {
    if (!editingCompany) return;
    
    try {
      setIsUpdating(true);
      const result = await companiesService.updateCompany(editingCompany.id, editingCompany);
      
      if (result.success) {
        await fetchData();
        handleCloseEditModal();
      } else {
        alert(`Failed to update: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!deletingCompanyId) return;
    
    try {
      const result = await companiesService.deleteCompany(deletingCompanyId);
      
      if (result.success) {
        await fetchData();
        setShowDeleteConfirm(false);
        setDeletingCompanyId(null);
      } else {
        alert(`Failed to delete: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company");
    }
  };

  const handleCreateCompany = async (newCompany: Partial<Company>) => {
    try {
      setIsUpdating(true);
      const result = await companiesService.createCompany(newCompany);
      
      if (result.success) {
        await fetchData();
        setIsCreateModalOpen(false);
      } else {
        alert(`Failed to create: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company");
    } finally {
      setIsUpdating(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter companies when search query or global view changes
  useEffect(() => {
    fetchData();
  }, [
    searchQuery,
    isGlobalView,
  ]);

  // Compute filtered and sorted companies using useMemo to prevent flicker
  const filteredCompanies = useMemo(() => {
    let filtered = [...companies];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => statusFilter === "active" ? c.is_active : !c.is_active);
    }
    
    // Apply onboarding filter
    if (onboardingFilter !== "all") {
      filtered = filtered.filter(c => c.account_onboarding_step === onboardingFilter);
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
  }, [companies, statusFilter, onboardingFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Company) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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
    <div className="h-full flex flex-col space-y-4">
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
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
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

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">
            Companies ({filteredCompanies.length})
          </h3>
          
          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={onboardingFilter}
                onChange={(e) => setOnboardingFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Steps</option>
                <option value="authentication">Authentication</option>
                <option value="payment">Payment</option>
                <option value="personalInfo">Personal Info</option>
                <option value="businessInfo">Business Info</option>
                <option value="brandSubmission">Brand Submission</option>
                <option value="privacySetup">Privacy Setup</option>
                <option value="campaignSubmission">Campaign Submission</option>
                <option value="gphoneProcurement">gPhone Procurement</option>
                <option value="accountSetup">Account Setup</option>
                <option value="completed">Completed</option>
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
                  onClick={() => handleSort("public_name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Company</span>
                    {sortField === "public_name" && (
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
                  onClick={() => handleSort("billing_email")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Billing Email</span>
                    {sortField === "billing_email" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("account_onboarding_step")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Onboarding Step</span>
                    {sortField === "account_onboarding_step" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("is_active")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === "is_active" && (
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
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {company.public_name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {company.company_account_number}
                      </div>
                    </div>
                  </td>
                  {isGlobalView && (
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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

                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                    {company.billing_email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {company.account_onboarding_step || "Not set"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        company.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {company.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditCompany(company)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit Company"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingCompanyId(company.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Company"
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
              {searchQuery || statusFilter !== "all" || onboardingFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No companies have been created yet."}
            </p>
          </div>
        )}
      </div>

      {/* Edit Company Modal */}
      {isEditModalOpen && editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Company
              </h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Public Name
                </label>
                <input
                  type="text"
                  value={editingCompany.public_name || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    public_name: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Legal Name
                </label>
                <input
                  type="text"
                  value={editingCompany.legal_name || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    legal_name: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Email
                </label>
                <input
                  type="email"
                  value={editingCompany.billing_email || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    billing_email: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Phone
                </label>
                <input
                  type="tel"
                  value={editingCompany.company_phone_number || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    company_phone_number: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={editingCompany.industry || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    industry: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  value={editingCompany.size || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    size: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Onboarding Step
                </label>
                <select
                  value={editingCompany.account_onboarding_step || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    account_onboarding_step: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Step</option>
                  <option value="authentication">Authentication</option>
                  <option value="payment">Payment</option>
                  <option value="personalInfo">Personal Info</option>
                  <option value="businessInfo">Business Info</option>
                  <option value="brandSubmission">Brand Submission</option>
                  <option value="privacySetup">Privacy Setup</option>
                  <option value="campaignSubmission">Campaign Submission</option>
                  <option value="gphoneProcurement">gPhone Procurement</option>
                  <option value="accountSetup">Account Setup</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingCompany.is_active ? "active" : "inactive"}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    is_active: e.target.value === "active"
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={editingCompany.website || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    website: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editingCompany.address_street || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    address_street: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street Address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={editingCompany.city || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    city: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Region
                </label>
                <input
                  type="text"
                  value={editingCompany.state_region || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    state_region: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={editingCompany.postal_code || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    postal_code: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={editingCompany.country_of_registration || ""}
                  onChange={(e) => setEditingCompany({
                    ...editingCompany,
                    country_of_registration: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCompany}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Update Company"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Company Modal */}
      {isCreateModalOpen && (
        <CreateCompanyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateCompany}
          isCreating={isUpdating}
          hubId={currentHub === "gnymble" ? 1 : currentHub === "percymd" ? 2 : currentHub === "percytext" ? 3 : 0}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Company
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this company? This action cannot be undone and will remove all associated data.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingCompanyId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCompany}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Details Modal */}
      {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
};

export default Companies;
