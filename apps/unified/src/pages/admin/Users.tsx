import { useState, useEffect } from "react";
import {
  useHub,
  UserViewModal,
  UserEditModal,
  UserDeleteModal,
  BaseModal,
  ModalSection,
  ModalButtonGroup,
  ModalButton,
  ModalFormLayout,
  ModalFormColumn,
  ModalStepIndicator,
} from "@sms-hub/ui";
import { useGlobalView } from "../../contexts/GlobalViewContext";
// Removed getSupabaseAdminClient import - admin operations should use Edge Functions or API endpoints
import {
  Search,
  UserPlus,
  Users as UsersIcon,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Filter,
  Shield,
} from "lucide-react";
import { UserProfile, usersService } from "../../services/usersService";
import { Company, companiesService } from "../../services/companiesService";

const Users = () => {
  const { currentHub } = useHub();
  const { isGlobalView } = useGlobalView();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedHubId, setSelectedHubId] = useState<number>(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [createNewCompany, setCreateNewCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [createUserStep, setCreateUserStep] = useState(0);
  
  // Form field state for multi-step form
  const [createUserFormData, setCreateUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "MEMBER",
  });

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtering states
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  // Sorting states
  const [sortField, setSortField] = useState<keyof UserProfile>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch companies for the selected hub
  const fetchCompanies = async (hubId: number) => {
    try {
      const fetchedCompanies = await companiesService.instance.getCompanies({
        hub_id: hubId,
        is_active: true,
        limit: 1000,
      });
      setCompanies(fetchedCompanies);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setCompanies([]);
    }
  };

  // Fetch users from database
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

      console.log("Users: Current hub:", currentHub);
      console.log("Users: Global view:", isGlobalView);
      console.log("Users: Using hub_id:", isGlobalView ? "ALL HUBS" : hubId);

      // Build filter options
      const filterOptions: Record<string, string | number | undefined> = {
        search: searchQuery || undefined,
        limit: 1000,
      };

      // Only filter by hub_id if not in global view
      if (!isGlobalView) {
        filterOptions.hub_id = hubId;
      }

      // Fetch users with filters
      const fetchedUsers = await usersService.instance.getUsers(filterOptions);

      console.log("Users: Fetched users:", fetchedUsers);
      console.log("Users: Count:", fetchedUsers.length);

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
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

  const resetCreateForm = () => {
    setSelectedHubId(0);
    setSelectedCompanyId("");
    setCreateNewCompany(false);
    setNewCompanyName("");
    setCreateUserStep(0);
    setCreateUserFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "MEMBER",
    });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    resetCreateForm();
  };

  // CRUD Handler Functions
  const handleViewUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: UserProfile) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateUser = async (updatedUser: Partial<UserProfile>) => {
    if (!editingUser) return;

    try {
      setIsUpdating(true);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: editingUser.id,
            ...updatedUser,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update user");
      }

      console.log("User updated successfully:", result);
      alert("User updated successfully!");
      await fetchData();
      handleCloseEditModal();
    } catch (error: unknown) {
      console.error("Error updating user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to update user: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async (permanent: boolean) => {
    if (!deletingUser) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: deletingUser.id,
            permanent,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete user");
      }

      console.log("User deleted successfully:", result);
      alert(
        `User ${permanent ? "permanently deleted" : "deactivated"} successfully!`
      );
      await fetchData();
      handleCloseDeleteModal();
    } catch (error: unknown) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to delete user: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Modal close handlers
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch companies when modal opens or hub changes
  useEffect(() => {
    if (isCreateModalOpen) {
      fetchCompanies(selectedHubId);
    }
  }, [isCreateModalOpen, selectedHubId]);

  // Filter users when search query or global view changes
  useEffect(() => {
    fetchData();
  }, [searchQuery, isGlobalView]);

  // Apply filters and sorting to users
  useEffect(() => {
    let filtered = [...users];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((u) =>
        statusFilter === "active" ? u.is_active : !u.is_active
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Apply payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((u) => u.payment_status === paymentFilter);
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

    setFilteredUsers(filtered);
  }, [
    users,
    statusFilter,
    roleFilter,
    paymentFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: keyof UserProfile) => {
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
          <p className="mt-4 text-muted-foreground">
            Loading users from database...
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
          <h1 className="text-2xl font-bold text-foreground">
            {isGlobalView 
              ? "Global Users" 
              : `${currentHub.charAt(0).toUpperCase() + currentHub.slice(1)} Users`}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={async () => {
              setIsCreateModalOpen(true);
              // Fetch companies for the default hub (PercyTech)
              await fetchCompanies(0);
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
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

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">
            Users ({filteredUsers.length})
          </h3>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "active" | "inactive"
                  )
                }
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payment</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
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
                    {sortField === "first_name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                {isGlobalView && (
                  <th
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("hub_id")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Hub</span>
                      {sortField === "hub_id" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </div>
                  </th>
                )}
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {sortField === "email" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {sortField === "role" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("payment_status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Payment</span>
                    {sortField === "payment_status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("is_active")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === "is_active" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {user.account_number}
                      </div>
                    </div>
                  </td>
                  {isGlobalView && (
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.hub_id === 0
                          ? "PercyTech"
                          : user.hub_id === 1
                            ? "Gnymble"
                            : user.hub_id === 2
                              ? "PercyMD"
                              : user.hub_id === 3
                                ? "PercyText"
                                : "Unknown"}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {user.payment_status || "None"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery ||
              statusFilter !== "all" ||
              roleFilter !== "all" ||
              paymentFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No users have been created yet."}
            </p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <BaseModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create New User"
        subtitle={createUserStep === 0 ? "Personal Information" : createUserStep === 1 ? "Account Settings" : "Organization"}
        icon={<UserPlus className="w-5 h-5" />}
        variant="default"
        size="md"
      >
        <form
          id="create-user-form"
          autoComplete="off"
          onSubmit={async (e) => {
            e.preventDefault();
            
            if (createUserStep < 2) {
              setCreateUserStep(createUserStep + 1);
              return;
            }
            
            // Validate passwords match
            if (createUserFormData.password !== createUserFormData.confirmPassword) {
              alert("Passwords do not match!");
              setCreateUserStep(1); // Go back to password step
              return;
            }

            // Prevent multiple submissions
            if (isUpdating) {
              console.log("Already submitting, ignoring duplicate request");
              return;
            }

            try {
              setIsUpdating(true);

              let companyId = selectedCompanyId;

              // Create new company if requested
              if (createNewCompany && newCompanyName.trim()) {
                console.log("Creating new company:", newCompanyName);
                
                // First check if company already exists
                const existingCompanies = await companiesService.instance.getCompanies({
                  hub_id: selectedHubId,
                  search: newCompanyName.trim(),
                });
                
                const exactMatch = existingCompanies.find(
                  c => c.public_name.toLowerCase() === newCompanyName.trim().toLowerCase()
                );
                
                if (exactMatch) {
                  console.log("Company already exists, using existing:", exactMatch.id);
                  companyId = exactMatch.id;
                } else {
                  const companyResult =
                    await companiesService.instance.createCompany({
                      public_name: newCompanyName.trim(),
                      hub_id: selectedHubId,
                      is_active: true,
                    });

                  if (!companyResult.success) {
                    throw new Error(
                      `Failed to create company: ${companyResult.error}`
                    );
                  }

                  companyId = companyResult.data?.id || "";
                  console.log("Company created with ID:", companyId);
                }
              }

              console.log("Creating user with data:", {
                email: createUserFormData.email,
                first_name: createUserFormData.firstName,
                last_name: createUserFormData.lastName,
                role: createUserFormData.role,
                hub_id: selectedHubId,
                company_id: companyId,
                mobile_phone_number: createUserFormData.phone,
              });

              // Call the create-user Edge Function
              const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                  },
                  body: JSON.stringify({
                    email: createUserFormData.email,
                    password: createUserFormData.password,
                    first_name: createUserFormData.firstName,
                    last_name: createUserFormData.lastName,
                    role: createUserFormData.role,
                    hub_id: selectedHubId,
                    company_id: companyId || undefined,
                    mobile_phone_number: createUserFormData.phone || undefined,
                  }),
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(result.error || "Failed to create user");
              }

              console.log("User created successfully:", result);
              alert(
                `User created successfully! Account number: ${result.user.account_number}`
              );

              // Refresh the users list
              await fetchData();
              handleCloseCreateModal();
            } catch (error: unknown) {
              console.error("Error creating user:", error);
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              alert(`Failed to create user: ${errorMessage}`);
            } finally {
              setIsUpdating(false);
            }
          }}
        >
          <div>
            <ModalStepIndicator currentStep={createUserStep} totalSteps={3} />
            
            {/* Step 0: Personal Information */}
            {createUserStep === 0 && (
              <ModalFormLayout>
                <ModalFormColumn>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={createUserFormData.firstName}
                      onChange={(e) => setCreateUserFormData({...createUserFormData, firstName: e.target.value})}
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={createUserFormData.lastName}
                      onChange={(e) => setCreateUserFormData({...createUserFormData, lastName: e.target.value})}
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </ModalFormColumn>
                <ModalFormColumn>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={createUserFormData.email}
                      onChange={(e) => setCreateUserFormData({...createUserFormData, email: e.target.value})}
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={createUserFormData.phone}
                      onChange={(e) => setCreateUserFormData({...createUserFormData, phone: e.target.value})}
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </ModalFormColumn>
              </ModalFormLayout>
            )}
            
            {/* Step 1: Account Settings */}
            {createUserStep === 1 && (
              <ModalFormLayout>
                <ModalFormColumn>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={createUserFormData.password}
                      onChange={(e) => setCreateUserFormData({...createUserFormData, password: e.target.value})}
                      required
                      autoComplete="new-password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      placeholder="Enter secure password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={createUserFormData.confirmPassword}
                      onChange={(e) => setCreateUserFormData({...createUserFormData, confirmPassword: e.target.value})}
                      required
                      autoComplete="new-password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      placeholder="Confirm password"
                    />
                  </div>
                </ModalFormColumn>
                <ModalFormColumn>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={createUserFormData.role}
                      onChange={(e) => setCreateUserFormData({...createUserFormData, role: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="VIEWER">Viewer</option>
                      <option value="SUPPORT">Support</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPERADMIN">Super Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hub Assignment
                    </label>
                    <select
                      value={selectedHubId}
                      onChange={async (e) => {
                        const newHubId = Number(e.target.value);
                        setSelectedHubId(newHubId);
                        setSelectedCompanyId(""); // Reset company when hub changes
                        await fetchCompanies(newHubId); // Fetch companies for the new hub
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                    >
                      <option value={0}>PercyTech</option>
                      <option value={1}>Gnymble</option>
                      <option value={2}>PercyMD</option>
                      <option value={3}>PercyText</option>
                    </select>
                  </div>
                </ModalFormColumn>
              </ModalFormLayout>
            )}
            
            {/* Step 2: Organization */}
            {createUserStep === 2 && (
              <ModalFormLayout>
                <ModalFormColumn span={2}>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="createNewCompany"
                      checked={createNewCompany}
                      onChange={(e) => {
                        setCreateNewCompany(e.target.checked);
                        if (e.target.checked) {
                          setSelectedCompanyId("");
                        }
                      }}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="createNewCompany"
                      className="text-sm font-medium text-gray-700"
                    >
                      Create New Company
                    </label>
                  </div>

                  {createNewCompany ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                        required={createNewCompany}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Company (Optional)
                      </label>
                      <select
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      >
                        <option value="">No Company</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.public_name} ({company.company_account_number})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </ModalFormColumn>
              </ModalFormLayout>
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div>
              {createUserStep > 0 && (
                <button
                  type="button"
                  onClick={() => setCreateUserStep(createUserStep - 1)}
                  className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCloseCreateModal}
                className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {createUserStep < 2 ? (
                  <>Next</>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {isUpdating ? "Creating..." : "Create User"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </BaseModal>

      {/* Shared Modal Components */}
      <UserViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onEdit={handleEditUser}
        user={selectedUser}
      />

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleUpdateUser}
        user={editingUser}
        isUpdating={isUpdating}
      />

      <UserDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        user={deletingUser}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Users;
