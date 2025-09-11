import { useState, useEffect, useMemo } from "react";
import { useHub } from "@sms-hub/ui";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import {
  Search,
  UserPlus,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Filter,
  Clock,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { leadsService, Lead } from "../../services/leadsService";

const Leads = () => {
  const { currentHub } = useHub();
  const { isGlobalView } = useGlobalView();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  // Filtering states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Sorting states
  const [sortField, setSortField] = useState<keyof Lead>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch leads from database
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

      console.log("Leads: Current hub:", currentHub);
      console.log("Leads: Global view:", isGlobalView);
      console.log("Leads: Using hub_id:", isGlobalView ? "ALL HUBS" : hubId);

      // Build filter options
      const filterOptions: any = {
        search: searchQuery || undefined,
        limit: 1000,
      };

      // Only filter by hub_id if not in global view
      if (!isGlobalView) {
        filterOptions.hub_id = hubId;
      }

      // Fetch leads with filters
      const fetchedLeads = await leadsService.instance.getLeads(filterOptions);

      console.log("Leads: Fetched leads:", fetchedLeads);
      console.log("Leads: Count:", fetchedLeads.length);

      setLeads(fetchedLeads);
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

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingLead(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateLead = async () => {
    if (!editingLead) return;

    try {
      setIsUpdating(true);
      // TODO: Implement lead update in service
      await fetchData();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Failed to update lead");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!deletingLeadId) return;

    try {
      // TODO: Implement lead deletion in service
      await fetchData();
      setShowDeleteConfirm(false);
      setDeletingLeadId(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Failed to delete lead");
    }
  };

  const handleCreateLead = async (newLead: Partial<Lead>) => {
    try {
      setIsUpdating(true);
      // TODO: Implement lead creation in service
      await fetchData();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create lead");
    } finally {
      setIsUpdating(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter leads when search query or global view changes
  useEffect(() => {
    fetchData();
  }, [searchQuery, isGlobalView]);

  // Compute filtered and sorted leads using useMemo to prevent flicker
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((l) => l.priority === priorityFilter);
    }

    // Apply source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((l) => l.source === sourceFilter);
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
  }, [
    leads,
    statusFilter,
    priorityFilter,
    sourceFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: keyof Lead) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "new":
        return {
          label: "New",
          icon: Clock,
          color: "text-blue-600",
          bg: "bg-blue-100",
        };
      case "contacted":
        return {
          label: "Contacted",
          icon: MessageSquare,
          color: "text-yellow-600",
          bg: "bg-yellow-100",
        };
      case "qualified":
        return {
          label: "Qualified",
          icon: CheckCircle,
          color: "text-purple-600",
          bg: "bg-purple-100",
        };
      case "converted":
        return {
          label: "Converted",
          icon: TrendingUp,
          color: "text-green-600",
          bg: "bg-green-100",
        };
      case "lost":
        return {
          label: "Lost",
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-100",
        };
      default:
        return {
          label: status,
          icon: AlertCircle,
          color: "text-gray-600",
          bg: "bg-gray-100",
        };
    }
  };

  // Get priority color
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          label: "Urgent",
          color: "text-purple-800",
          bg: "bg-purple-100",
        };
      case "high":
        return { label: "High", color: "text-red-800", bg: "bg-red-100" };
      case "medium":
        return {
          label: "Medium",
          color: "text-yellow-800",
          bg: "bg-yellow-100",
        };
      case "low":
        return { label: "Low", color: "text-green-800", bg: "bg-green-100" };
      default:
        return { label: priority, color: "text-gray-800", bg: "bg-gray-100" };
    }
  };

  // Get display name for lead
  const getLeadDisplayName = (lead: Lead) => {
    if (lead.first_name && lead.last_name) {
      return `${lead.first_name} ${lead.last_name}`;
    }
    if (lead.name) {
      return lead.name;
    }
    return "Unknown";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leads from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
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
            {isGlobalView ? "Global Leads" : "Leads"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isGlobalView
              ? "Manage leads from all hubs"
              : `Manage leads from ${currentHub} hub`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Lead
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

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">
            Leads ({filteredLeads.length})
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
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="campaign">Campaign</option>
                <option value="other">Other</option>
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
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Lead</span>
                    {sortField === "name" &&
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
                    <span>Contact</span>
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
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority</span>
                    {sortField === "priority" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("source")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Source</span>
                    {sortField === "source" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    {sortField === "created_at" &&
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
              {filteredLeads.map((lead) => {
                const statusInfo = getStatusInfo(lead.status || "new");
                const priorityInfo = getPriorityInfo(lead.priority || "medium");
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getLeadDisplayName(lead)}
                        </div>
                        {lead.company_name && (
                          <div className="text-xs text-gray-500">
                            {lead.company_name}
                          </div>
                        )}
                      </div>
                    </td>
                    {isGlobalView && (
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {lead.hub_id === 0
                            ? "PercyTech"
                            : lead.hub_id === 1
                              ? "Gnymble"
                              : lead.hub_id === 2
                                ? "PercyMD"
                                : lead.hub_id === 3
                                  ? "PercyText"
                                  : "Unknown"}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-xs text-gray-600">
                        <div>{lead.email}</div>
                        <div>{lead.phone || lead.lead_phone_number}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                      >
                        <statusInfo.icon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bg} ${priorityInfo.color}`}
                      >
                        {priorityInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {lead.source || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Lead"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingLeadId(lead.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Lead"
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

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No leads found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ||
              statusFilter !== "all" ||
              priorityFilter !== "all" ||
              sourceFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No leads have been created yet."}
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
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Lead
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this lead? This action cannot be
              undone and will remove all associated data.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingLeadId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLead}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Add modals for edit, create, and view details */}
    </div>
  );
};

export default Leads;
