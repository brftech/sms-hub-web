import { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Eye, 
  Trash2,
  Phone,
  Mail,
  Building,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Shield
} from "lucide-react";
import { tempSignupsService, TempSignup, TempSignupStats } from "../services/tempSignupsService";

const TempSignups = () => {
  const { currentHub } = useHub();
  const [tempSignups, setTempSignups] = useState<TempSignup[]>([]);
  const [filteredTempSignups, setFilteredTempSignups] = useState<TempSignup[]>([]);
  const [stats, setStats] = useState<TempSignupStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [authMethodFilter, setAuthMethodFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [expiryFilter, setExpiryFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableAuthMethods, setAvailableAuthMethods] = useState<string[]>([]);

  // Fetch temp signups and stats from database
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get hub ID based on current hub
      const hubId = currentHub === 'gnymble' ? 1 : 
                   currentHub === 'percymd' ? 2 :
                   currentHub === 'percytext' ? 3 :
                   currentHub === 'percytech' ? 0 : 1; // Default to gnymble (1)
      
      console.log('TempSignups: Current hub:', currentHub);
      console.log('TempSignups: Using hub_id:', hubId);

      // Build filter options
      const filterOptions: any = {
        hub_id: hubId,
        search: searchQuery || undefined,
        limit: 1000
      };

      if (authMethodFilter !== 'all') {
        filterOptions.auth_method = authMethodFilter;
      }

      if (verificationFilter === 'verified') {
        filterOptions.is_verified = true;
      } else if (verificationFilter === 'unverified') {
        filterOptions.is_verified = false;
      }

      if (expiryFilter === 'expired') {
        filterOptions.is_expired = true;
      } else if (expiryFilter === 'active') {
        filterOptions.is_expired = false;
      }

      // Fetch temp signups with filters
      const fetchedTempSignups = await tempSignupsService.getTempSignups(filterOptions);

      console.log('TempSignups: Fetched temp signups:', fetchedTempSignups);
      console.log('TempSignups: Count:', fetchedTempSignups.length);

      // Fetch stats
      const fetchedStats = await tempSignupsService.getTempSignupStats(hubId);

      // Fetch available auth methods for filter dropdown
      const authMethods = await tempSignupsService.getUniqueAuthMethods();

      setTempSignups(fetchedTempSignups);
      setFilteredTempSignups(fetchedTempSignups);
      setStats(fetchedStats);
      setAvailableAuthMethods(authMethods);
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

  // Delete temp signup
  const handleDeleteTempSignup = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this temporary signup?')) {
      try {
        await tempSignupsService.deleteTempSignup(id);
        await fetchData(); // Refresh data
      } catch (err) {
        console.error('Error deleting temp signup:', err);
        setError('Failed to delete temporary signup');
      }
    }
  };

  // Cleanup expired signups
  const handleCleanupExpired = async () => {
    if (window.confirm('Are you sure you want to cleanup all expired temporary signups?')) {
      try {
        const deletedCount = await tempSignupsService.cleanupExpiredSignups();
        alert(`Cleaned up ${deletedCount} expired temporary signups`);
        await fetchData(); // Refresh data
      } catch (err) {
        console.error('Error cleaning up expired signups:', err);
        setError('Failed to cleanup expired signups');
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter temp signups when filters change
  useEffect(() => {
    fetchData();
  }, [authMethodFilter, verificationFilter, expiryFilter, searchQuery]);

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

  // Check if signup is expired
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  // Get verification status
  const getVerificationStatus = (signup: TempSignup) => {
    if (signup.is_verified) {
      return { status: 'verified', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
    }
    if (isExpired(signup.expires_at)) {
      return { status: 'expired', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> };
    }
    return { status: 'pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading temporary signups from database...</p>
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Temporary Signups</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage temporary signups from {currentHub} hub
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCleanupExpired}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Cleanup Expired
          </button>
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

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Signups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unverified</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unverified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Auth Methods</p>
                <p className="text-2xl font-bold text-purple-600">{Object.keys(stats.byAuthMethod).length}</p>
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
                placeholder="Search signups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={authMethodFilter}
              onChange={(e) => setAuthMethodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Auth Methods</option>
              {availableAuthMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>

            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Verification Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Expiry Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Temp Signups Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Temporary Signups ({filteredTempSignups.length})
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
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auth Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTempSignups.map((signup) => {
                const verificationStatus = getVerificationStatus(signup);
                return (
                  <tr key={signup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {signup.first_name.charAt(0).toUpperCase()}{signup.last_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {signup.first_name} {signup.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{signup.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{signup.company_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {signup.mobile_phone_number}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="w-3 h-3 mr-1" />
                        {signup.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{signup.auth_method}</div>
                      {signup.verification_attempts !== null && (
                        <div className="text-xs text-gray-500">
                          {signup.verification_attempts} attempts
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verificationStatus.color}`}>
                        {verificationStatus.icon}
                        <span className="ml-1">{verificationStatus.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(signup.expires_at)}</div>
                      {isExpired(signup.expires_at) && (
                        <div className="text-xs text-red-500">Expired</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTempSignup(signup.id)}
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

        {filteredTempSignups.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No temporary signups found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || authMethodFilter !== 'all' || verificationFilter !== 'all' || expiryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No temporary signups have been created yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempSignups;
