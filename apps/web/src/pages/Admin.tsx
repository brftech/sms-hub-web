import { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { leadsService, Lead, LeadStats } from "../services/leadsService";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { currentHub } = useHub();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch leads and stats from database
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get hub ID based on current hub
      const hubId = currentHub === 'gnymble' ? 1 : 
                   currentHub === 'percymd' ? 2 :
                   currentHub === 'percytext' ? 3 :
                   currentHub === 'percytech' ? 0 : 1; // Default to gnymble (1)
      
      console.log('Admin: Current hub:', currentHub);
      console.log('Admin: Using hub_id:', hubId);

      // Fetch leads with filters
      const fetchedLeads = await leadsService.getLeads({
        // hub_id: hubId, // Temporarily commented out to see all leads
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        source: sourceFilter !== 'all' ? sourceFilter : undefined,
        search: searchQuery || undefined,
        limit: 1000 // Get all leads for now
      });

      console.log('Admin: Fetched leads:', fetchedLeads);
      console.log('Admin: Lead count:', fetchedLeads.length);

      // Fetch stats
      const fetchedStats = await leadsService.getLeadStats(); // Temporarily no hub filtering

      // Fetch available sources for filter dropdown
      const sources = await leadsService.getUniqueSources();

      setLeads(fetchedLeads);
      setFilteredLeads(fetchedLeads);
      setStats(fetchedStats);
      setAvailableSources(sources);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
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

  // Update lead status
  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      await leadsService.updateLeadStatus(leadId, newStatus);
      await leadsService.addLeadActivity(leadId, 'status_change', `Status changed to ${newStatus}`);
      
      // Refresh data to show updated status
      await fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update lead status');
    }
  };

  // Update lead priority
  const handlePriorityUpdate = async (leadId: string, newPriority: string) => {
    try {
      await leadsService.updateLeadPriority(leadId, newPriority);
      await leadsService.addLeadActivity(leadId, 'priority_change', `Priority changed to ${newPriority}`);
      
      // Refresh data to show updated priority
      await fetchData();
    } catch (err) {
      console.error('Error updating priority:', err);
      setError('Failed to update lead priority');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter leads when filters change
  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter, sourceFilter, searchQuery]);

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'new':
        return { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" /> };
      case 'contacted':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <MessageSquare className="w-4 h-4" /> };
      case 'qualified':
        return { color: 'bg-purple-100 text-purple-800', icon: <CheckCircle className="w-4 h-4" /> };
      case 'converted':
        return { color: 'bg-green-100 text-green-800', icon: <TrendingUp className="w-4 h-4" /> };
      case 'lost':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-4 h-4" /> };
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'urgent':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get display name for lead
  const getLeadDisplayName = (lead: Lead) => {
    if (lead.first_name && lead.last_name) {
      return `${lead.first_name} ${lead.last_name}`;
    }
    if (lead.name) {
      return lead.name;
    }
    return 'Unknown';
  };

  // Get display phone for lead
  const getLeadDisplayPhone = (lead: Lead) => {
    return lead.phone || lead.lead_phone_number || 'No phone';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leads from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Data</h3>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info - Remove this after fixing the issue */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-yellow-800">Debug Info</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p><strong>Current Hub:</strong> {currentHub}</p>
                          <p><strong>Hub ID:</strong> {currentHub === 'gnymble' ? 1 : 
                   currentHub === 'percymd' ? 2 :
                   currentHub === 'percytext' ? 3 :
                   currentHub === 'percytech' ? 0 : 1}</p>
            <p><strong>Total Leads:</strong> {filteredLeads.length}</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contacted</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.contacted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Qualified</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.qualified}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Converted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Lost</p>
                  <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                {availableSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Leads ({filteredLeads.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
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
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {getLeadDisplayName(lead).charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getLeadDisplayName(lead)}
                          </div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {getLeadDisplayPhone(lead)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.company_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.source || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${getStatusInfo(lead.status).color}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.priority || 'medium'}
                        onChange={(e) => handlePriorityUpdate(lead.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${getPriorityColor(lead.priority || 'medium')}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(lead.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || sourceFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No leads have been submitted yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
