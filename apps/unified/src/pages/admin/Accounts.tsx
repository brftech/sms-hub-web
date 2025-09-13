import { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui";
import { AccountViewModal, AccountEditModal, AccountDeleteModal } from "@sms-hub/ui";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import { getSupabaseClient } from "../../lib/supabaseSingleton";
import { customersService, Customer } from "../../services/customersService";
import { companiesService, Company } from "../../services/companiesService";
import {
  Building2,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Users,
  MessageSquare,
  Calendar,
  Edit,
  Eye,
  ChevronDown,
  RefreshCw,
  Shield,
  Trash2,
} from "lucide-react";

// Unified account type that combines companies and customers
interface UnifiedAccount {
  id: string;
  type: 'company' | 'customer' | 'company_customer';
  name: string;
  email: string;
  status: string;
  payment_status?: string;
  payment_type?: string;
  service_type?: string;
  hub_id: number;
  created_at: string;
  // Original data
  company?: Company;
  customer?: Customer;
  user_count?: number;
  has_texting?: boolean;
  has_other_services?: boolean;
}

export function Accounts() {
  const { currentHub } = useHub();
  const { isGlobalView } = useGlobalView();
  const [accounts, setAccounts] = useState<UnifiedAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<UnifiedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<UnifiedAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all entities (companies and customers) from database
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

      console.log("Accounts: Current hub:", currentHub);
      console.log("Accounts: Global view:", isGlobalView);
      console.log("Accounts: Using hub_id:", isGlobalView ? "ALL HUBS" : hubId);

      // Build filter options
      const filterOptions: any = {
        search: searchQuery || undefined,
        limit: 1000,
      };

      // Only filter by hub_id if not in global view
      if (!isGlobalView) {
        filterOptions.hub_id = hubId;
      }

      // Fetch both companies and customers in parallel
      const [fetchedCompanies, fetchedCustomers] = await Promise.all([
        companiesService.instance.getCompanies(filterOptions),
        customersService.instance.getCustomers(filterOptions),
      ]);

      console.log("Accounts: Fetched companies:", fetchedCompanies.length);
      console.log("Accounts: Fetched customers:", fetchedCustomers.length);

      // Create a map of company IDs that have customers
      const companiesWithCustomers = new Set(
        fetchedCustomers
          .filter(c => c.company_id)
          .map(c => c.company_id)
      );

      // Merge companies and customers into unified accounts
      const unifiedAccounts: UnifiedAccount[] = [];

      // Add companies
      fetchedCompanies.forEach(company => {
        const hasCustomer = companiesWithCustomers.has(company.id);
        const customer = fetchedCustomers.find(c => c.company_id === company.id);
        
        unifiedAccounts.push({
          id: company.id,
          type: hasCustomer ? 'company_customer' : 'company',
          name: company.public_name || 'Unnamed Company',
          email: customer?.billing_email || company.contact_email || '-',
          status: company.is_active ? 'active' : 'inactive',
          payment_status: customer?.payment_status || 'none',
          payment_type: customer?.payment_type || 'none',
          service_type: hasCustomer ? 'texting' : 'other',
          hub_id: company.hub_id,
          created_at: company.created_at || '',
          company: company,
          customer: customer,
          user_count: 0, // TODO: Calculate from memberships
          has_texting: hasCustomer,
          has_other_services: !hasCustomer,
        });
      });

      // Add standalone customers (not linked to companies)
      fetchedCustomers
        .filter(customer => !customer.company_id)
        .forEach(customer => {
          unifiedAccounts.push({
            id: customer.id,
            type: 'customer',
            name: customer.billing_email.split('@')[0], // Use email prefix as name
            email: customer.billing_email,
            status: customer.is_active ? 'active' : 'inactive',
            payment_status: customer.payment_status || 'pending',
            payment_type: customer.payment_type || 'none',
            service_type: 'texting',
            hub_id: customer.hub_id,
            created_at: customer.created_at || '',
            customer: customer,
            user_count: 0,
            has_texting: true,
            has_other_services: false,
          });
        });

      console.log("Accounts: Total unified accounts:", unifiedAccounts.length);

      setAccounts(unifiedAccounts);
      setFilteredAccounts(unifiedAccounts);
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

  // Modal handlers
  const handleViewAccount = (account: UnifiedAccount) => {
    setSelectedAccount(account);
    setIsViewModalOpen(true);
  };

  const handleEditAccount = (account: UnifiedAccount) => {
    setSelectedAccount(account);
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteAccount = (account: UnifiedAccount) => {
    setSelectedAccount(account);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateAccount = async (updates: Partial<UnifiedAccount>) => {
    if (!selectedAccount) return;

    try {
      setIsUpdating(true);
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      // Update based on account type
      if (selectedAccount.company && updates.company) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-account`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              account_type: 'company',
              account_id: selectedAccount.company.id,
              updates: updates.company,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update company");
        }
      }

      if (selectedAccount.customer && updates.customer) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-account`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              account_type: 'customer',
              account_id: selectedAccount.customer.id,
              updates: updates.customer,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update customer");
        }
      }

      alert("Account updated successfully!");
      await fetchData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating account:", error);
      alert(error.message || "Failed to update account");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async (permanent: boolean) => {
    if (!selectedAccount) return;

    try {
      setIsDeleting(true);
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            account_id: selectedAccount.id,
            account_type: selectedAccount.type,
            permanent: permanent,
            company_id: selectedAccount.company?.id,
            customer_id: selectedAccount.customer?.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete account");
      }

      const result = await response.json();
      alert(result.message);
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter customers when search query or global view changes
  useEffect(() => {
    fetchData();
  }, [searchQuery, isGlobalView]);

  // Apply filters and sorting to accounts
  useEffect(() => {
    let filtered = [...accounts];

    // Apply entity filter
    if (entityFilter !== "all") {
      filtered = filtered.filter((account) => {
        if (entityFilter === "company") return account.type === 'company';
        if (entityFilter === "customer") return account.type === 'customer';
        if (entityFilter === "company_customer") return account.type === 'company_customer';
        if (entityFilter === "texting") return account.has_texting;
        if (entityFilter === "other") return account.has_other_services;
        return true;
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((account) => {
        if (statusFilter === "active") return account.status === 'active';
        if (statusFilter === "inactive") return account.status === 'inactive';
        if (statusFilter === "paid") return account.payment_status === 'completed';
        if (statusFilter === "pending") return account.payment_status === 'pending';
        return true;
      });
    }

    // Apply type filter (payment type)
    if (typeFilter !== "all") {
      filtered = filtered.filter((account) => {
        if (typeFilter === "stripe") return account.payment_type === 'stripe';
        if (typeFilter === "barter") return account.payment_type === 'barter';
        if (typeFilter === "courtesy") return account.payment_type === 'courtesy';
        if (typeFilter === "none") return account.payment_type === 'none';
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof UnifiedAccount];
      let bVal: any = b[sortBy as keyof UnifiedAccount];

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

    setFilteredAccounts(filtered);
  }, [accounts, statusFilter, typeFilter, entityFilter, sortBy, sortOrder]);

  const getStatusColor = (account: UnifiedAccount) => {
    if (account.status === 'active') return "bg-green-100 text-green-800";
    if (account.status === 'inactive') return "bg-gray-100 text-gray-800";
    return "bg-gray-100 text-gray-800";
  };

  const getEntityTypeColor = (account: UnifiedAccount) => {
    if (account.type === 'company_customer') return "bg-purple-100 text-purple-800";
    if (account.type === 'company') return "bg-blue-100 text-blue-800";
    if (account.type === 'customer') return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "none":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBillingStatusColor = (subscriptionStatus: string) => {
    switch (subscriptionStatus) {
      case "active":
        return "bg-green-100 text-green-800";
      case "past_due":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading accounts from database...
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
            {isGlobalView 
              ? "Global Accounts" 
              : `${currentHub.charAt(0).toUpperCase() + currentHub.slice(1)} Accounts`}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={() => {
              /* Add account functionality */
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
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

      {/* Accounts List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">
            Accounts ({filteredAccounts.length})
          </h3>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              
              <select
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Entities</option>
                <option value="company_customer">Texting Platform</option>
                <option value="company">Company Only</option>
                <option value="customer">Customer Only</option>
                <option value="texting">Has Texting</option>
                <option value="other">Other Services</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Payment</option>
                <option value="stripe">Stripe</option>
                <option value="barter">Barter</option>
                <option value="courtesy">Courtesy</option>
                <option value="none">None</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="created_at">Sort by Date</option>
                <option value="user_count">Sort by Users</option>
                <option value="message_count">Sort by Messages</option>
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
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No accounts found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search or filter criteria."
                  : "No accounts have been created yet."}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  {isGlobalView && (
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hub
                    </th>
                  )}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {account.name}
                        </div>
                        {account.company?.company_account_number && (
                          <div className="text-xs text-gray-500 font-mono">
                            {account.company.company_account_number}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        account.type === 'company_customer' ? 'bg-purple-100 text-purple-800' :
                        account.type === 'company' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {account.type === 'company_customer' ? 'Platform' : 
                         account.type === 'company' ? 'Company' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {account.email}
                    </td>
                    {isGlobalView && (
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {account.hub_id === 0 ? "PercyTech" :
                           account.hub_id === 1 ? "Gnymble" :
                           account.hub_id === 2 ? "PercyMD" :
                           account.hub_id === 3 ? "PercyText" :
                           "Unknown"}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {account.payment_type && account.payment_type !== 'none' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {account.payment_type}
                          </span>
                        )}
                        {account.payment_status && account.payment_status !== 'none' && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            account.payment_status === 'active' || account.payment_status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : account.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {account.payment_status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {account.has_texting && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            SMS
                          </span>
                        )}
                        {account.has_other_services && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Other
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        account.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {account.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewAccount(account)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Account"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <AccountViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={handleEditAccount}
        account={selectedAccount}
      />

      <AccountEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateAccount}
        account={selectedAccount}
        isUpdating={isUpdating}
      />

      <AccountDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        account={selectedAccount}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default Accounts;
