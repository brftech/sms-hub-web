import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button,
  PageLayout,
  useHub,
  SEO
} from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import { getEnvironmentConfig } from "../config/environment";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { 
  Database, 
  Users, 
  MessageSquare, 
  Settings, 
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface TableStats {
  name: string;
  count: number;
  lastUpdated: string;
}

interface EmailSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  hub_id: number;
  status: string | null;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface Lead {
  id: string;
  email: string;
  name: string | null;
  company_name: string | null;
  hub_id: number;
  source: string | null;
  status: string | null;
  lead_score: number | null;
  created_at: string | null;
  converted_at: string | null;
}

interface Hub {
  hub_number: number;
  name: string;
  domain: string | null;
}

export const AdminDashboard: React.FC = () => {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);
  
  // Use environment configuration for Supabase connection
  const [supabase] = useState(() => {
    const envConfig = getEnvironmentConfig();
    return createClient(envConfig.supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY);
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [recentEmailSubscribers, setRecentEmailSubscribers] = useState<EmailSubscriber[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Admin authentication check
  const [adminAuth, setAdminAuth] = useState(false);
  const [authCode, setAuthCode] = useState('');

  // CRUD operations state
  const [showCreateLeadForm, setShowCreateLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<string | null>(null);
  const [crudLoading, setCrudLoading] = useState(false);
  
  // Form data for creating/editing leads
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    source: 'contact_form',
    status: 'new',
    lead_score: 50,
    hub_id: 1
  });

  // Check if user is authorized to access admin dashboard
  useEffect(() => {
    const checkAdminAccess = () => {
      const isDev = import.meta.env.MODE === 'development';
      const isLocalhost = window.location.hostname === 'localhost';
      const storedAuth = localStorage.getItem('admin_auth_token');
      const authTimestamp = localStorage.getItem('admin_auth_timestamp');
      
      // Allow access in development
      if (isDev || isLocalhost) {
        setAdminAuth(true);
        return;
      }
      
      // Check if user has valid admin token (expires after 24 hours)
      if (storedAuth && authTimestamp) {
        const tokenTime = new Date(authTimestamp).getTime();
        const now = new Date().getTime();
        const hoursDiff = (now - tokenTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setAdminAuth(true);
          return;
        } else {
          // Token expired, remove it
          localStorage.removeItem('admin_auth_token');
          localStorage.removeItem('admin_auth_timestamp');
        }
      }
      
      // Check for admin access code in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const adminCode = urlParams.get('admin');
      
      if (adminCode === import.meta.env.VITE_ADMIN_ACCESS_CODE) {
        setAdminAuth(true);
        localStorage.setItem('admin_auth_token', 'authenticated');
        localStorage.setItem('admin_auth_timestamp', new Date().toISOString());
        // Remove the admin code from URL for security
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    checkAdminAccess();
  }, []);

  const handleAdminAuth = () => {
    if (authCode === import.meta.env.VITE_ADMIN_ACCESS_CODE) {
      setAdminAuth(true);
      localStorage.setItem('admin_auth_token', 'authenticated');
      localStorage.setItem('admin_auth_timestamp', new Date().toISOString());
      setAuthCode('');
    } else {
      setError('Invalid admin access code');
    }
  };

  const fetchDatabaseStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);


      // Get table statistics with proper count queries
      const [leadsResult, emailSubscribersResult, hubsResult] = await Promise.all([
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('email_subscribers')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('hubs')
          .select('*', { count: 'exact', head: true })
      ]);


      // Check for errors silently

      // Use the count property from Supabase response
      const emailSubscribersCount = emailSubscribersResult.count || 0;
      const leadsCount = leadsResult.count || 0;
      const hubsCount = hubsResult.count || 0;


      setTableStats([
        {
          name: 'Leads',
          count: leadsCount,
          lastUpdated: new Date().toISOString()
        },
        {
          name: 'Email Subscribers',
          count: emailSubscribersCount,
          lastUpdated: new Date().toISOString()
        },
        {
          name: 'Hubs',
          count: hubsCount,
          lastUpdated: new Date().toISOString()
        }
      ]);

      // Get recent data in parallel
      const [emailSubscribersDataResult, leadsDataResult, hubsDataResult] = await Promise.all([
        supabase
          .from('email_subscribers')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('hubs')
          .select('*')
          .order('hub_number', { ascending: true })
      ]);


      if (emailSubscribersDataResult.error) {
        // Handle error silently
      } else {
        setRecentEmailSubscribers(emailSubscribersDataResult.data || []);
      }

      if (leadsDataResult.error) {
        // Handle error silently
      } else {
        setRecentLeads(leadsDataResult.data || []);
      }

      if (hubsDataResult.error) {
        // Handle error silently
      } else {
        setHubs(hubsDataResult.data || []);
      }

      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (adminAuth) {
      fetchDatabaseStats();
    }
  }, [adminAuth, fetchDatabaseStats]);

  const exportData = async (tableName: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName.toLowerCase())
        .select('*');

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tableName.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  // CRUD Functions for Leads
  const resetLeadForm = () => {
    setLeadFormData({
      name: '',
      email: '',
      company_name: '',
      source: 'contact_form',
      status: 'new',
      lead_score: 50,
      hub_id: 1
    });
  };

  const handleCreateLead = async () => {
    try {
      setCrudLoading(true);
      setError(null);

      const { error } = await supabase
        .from('leads')
        .insert([{
          ...leadFormData,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        throw error;
      }

      setShowCreateLeadForm(false);
      resetLeadForm();
      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lead');
    } finally {
      setCrudLoading(false);
    }
  };

  const handleEditLead = async () => {
    if (!editingLead) return;

    try {
      setCrudLoading(true);
      setError(null);

      const { error } = await supabase
        .from('leads')
        .update(leadFormData)
        .eq('id', editingLead.id);

      if (error) {
        throw error;
      }

      setEditingLead(null);
      resetLeadForm();
      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead');
    } finally {
      setCrudLoading(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    try {
      setCrudLoading(true);
      setError(null);

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) {
        throw error;
      }

      setDeletingLead(null);
      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
    } finally {
      setCrudLoading(false);
    }
  };

  const startEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setLeadFormData({
      name: lead.name || '',
      email: lead.email,
      company_name: lead.company_name || '',
      source: lead.source || 'contact_form',
      status: lead.status || 'new',
      lead_score: lead.lead_score || 50,
      hub_id: lead.hub_id
    });
  };

  const cancelEdit = () => {
    setEditingLead(null);
    setShowCreateLeadForm(false);
    resetLeadForm();
  };

  // Show authentication form if not authenticated
  if (!adminAuth) {
    return (
      <PageLayout
        showNavigation={true}
        showFooter={true}
        navigation={<Navigation />}
        footer={<Footer />}
      >
        <SEO
          title="Admin Access - SMS Hub"
          description="Secure admin access to SMS Hub management dashboard"
          keywords="admin, dashboard, SMS management, secure access"
        />

        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
          {/* Subtle background elements */}
          <div className="absolute inset-0">
            <div
              className={`absolute top-0 left-1/4 w-96 h-96 ${hubColors.bgLight} rounded-full blur-3xl`}
            ></div>
            <div
              className={`absolute bottom-0 right-1/4 w-96 h-96 ${hubColors.bgLight} rounded-full blur-3xl`}
            ></div>
          </div>

          <div className="relative z-10 w-full max-w-md">
            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
              <CardHeader className="text-center">
                <div className={`mx-auto w-12 h-12 ${hubColors.bgLight} rounded-full flex items-center justify-center mb-4`}>
                  <Shield className={`w-6 h-6 ${hubColors.text}`} />
                </div>
                <CardTitle className="text-xl text-white">Admin Access Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-center">
                  Enter admin access code to view database information
                </p>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Admin Access Code"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminAuth()}
                  />
                  <Button 
                    onClick={handleAdminAuth}
                    className={`w-full ${hubColors.bg} text-white ${hubColors.bgHover}`}
                    disabled={!authCode.trim()}
                  >
                    Access Dashboard
                  </Button>
                </div>
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
                <p className="text-xs text-gray-400 text-center">
                  Contact system administrator for access code
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      <SEO
        title="Admin Dashboard - SMS Hub"
        description="Sales and marketing data management for SMS Hub platform"
        keywords="admin, dashboard, sales, marketing, SMS management, analytics"
      />

      <div className="min-h-screen bg-black pt-20 pb-12 relative">
        {/* Subtle background elements */}
        <div className="absolute inset-0">
          <div
            className={`absolute top-0 left-1/4 w-96 h-96 ${hubColors.bgLight} rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute bottom-0 right-1/4 w-96 h-96 ${hubColors.bgLight} rounded-full blur-3xl`}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <Database className={`w-8 h-8 mr-3 ${hubColors.text}`} />
                  Admin Dashboard
                </h1>
                <p className="text-gray-300 mt-2">
                  Sales and marketing data management
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  variant="outline"
                  size="sm"
                  className="flex items-center bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50"
                >
                  {showSensitiveData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showSensitiveData ? 'Hide' : 'Show'} Sensitive Data
                </Button>
                <Button
                  onClick={fetchDatabaseStats}
                  disabled={loading}
                  className={`flex items-center ${hubColors.bg} text-white ${hubColors.bgHover}`}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Last updated: {lastRefresh.toLocaleString()}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Database Statistics - Leads Focus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {tableStats.map((stat) => (
              <Card 
                key={stat.name} 
                className={`bg-gray-900/90 backdrop-blur-sm border-gray-800 ${
                  stat.name === 'Leads' ? 'ring-2 ring-orange-500/50 border-orange-500/30' : ''
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${
                    stat.name === 'Leads' ? 'text-orange-400' : 'text-white'
                  }`}>
                    {stat.name}
                    {stat.name === 'Leads' && <span className="ml-2 text-xs text-orange-300">⭐ Main Focus</span>}
                  </CardTitle>
                  <Database className={`h-4 w-4 ${
                    stat.name === 'Leads' ? 'text-orange-400' : 'text-gray-400'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    stat.name === 'Leads' ? 'text-orange-400' : 'text-white'
                  }`}>
                    {stat.count}
                  </div>
                  <p className="text-xs text-gray-400">
                    Records in database
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      onClick={() => exportData(stat.name)}
                      size="sm"
                      variant="outline"
                      className={`flex items-center ${
                        stat.name === 'Leads' 
                          ? 'bg-orange-900/50 text-orange-300 border-orange-700 hover:bg-orange-800/50'
                          : 'bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50'
                      }`}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Data - Leads First */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Leads - Main Focus */}
            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800 ring-2 ring-orange-500/50 border-orange-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-orange-400">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Recent Leads
                    <span className="ml-2 text-xs text-orange-300">⭐ Priority</span>
                  </CardTitle>
                  <Button
                    onClick={() => setShowCreateLeadForm(true)}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Lead
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="p-3 bg-gray-800/50 rounded-lg border border-orange-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">
                          {lead.name || lead.company_name || 'Unknown'}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {lead.lead_score && (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                lead.lead_score >= 80 ? 'bg-green-900/50 text-green-300' :
                                lead.lead_score >= 60 ? 'bg-yellow-900/50 text-yellow-300' :
                                'bg-red-900/50 text-red-300'
                              }`}>
                                Score: {lead.lead_score}
                              </span>
                            )}
                            {lead.status && (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                lead.status === 'converted' ? 'bg-green-900/50 text-green-300' :
                                lead.status === 'qualified' ? 'bg-blue-900/50 text-blue-300' :
                                'bg-gray-800/50 text-gray-300'
                              }`}>
                                {lead.status}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              onClick={() => startEditLead(lead)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 bg-gray-700/50 border-gray-600 hover:bg-gray-600/50"
                            >
                              <Edit className="w-3 h-3 text-gray-300" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteLead(lead.id)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 bg-red-900/50 border-red-700 hover:bg-red-800/50"
                              disabled={crudLoading && deletingLead === lead.id}
                            >
                              <Trash2 className="w-3 h-3 text-red-300" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {showSensitiveData ? lead.email : '***@***.***'}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                          Source: {lead.source || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Created: {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      {lead.converted_at && (
                        <p className="text-xs text-green-400 mt-1">
                          Converted: {new Date(lead.converted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Email Subscribers */}
            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Users className="w-5 h-5 mr-2" />
                  Recent Email Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEmailSubscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">
                          {subscriber.first_name && subscriber.last_name 
                            ? `${subscriber.first_name} ${subscriber.last_name}`
                            : subscriber.email
                          }
                        </p>
                        <p className="text-sm text-gray-400">
                          {subscriber.email}
                        </p>
                        <p className="text-sm text-gray-400">
                          Created: {subscriber.created_at ? new Date(subscriber.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {subscriber.status && (
                            <span className="inline-block px-2 py-1 text-xs bg-blue-900/50 text-blue-300 rounded-full">
                              {subscriber.status}
                            </span>
                          )}
                          {subscriber.source && (
                            <span className="inline-block px-2 py-1 text-xs bg-green-900/50 text-green-300 rounded-full">
                              {subscriber.source}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          Hub: {hubs.find(h => h.hub_number === subscriber.hub_id)?.name || subscriber.hub_id}
                        </p>
                        <p className="text-xs text-gray-400">
                          {showSensitiveData ? subscriber.email : '***@***.***'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales & Marketing Actions */}
          <Card className="mt-6 bg-gray-900/90 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="w-5 h-5 mr-2" />
                Sales & Marketing Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-center h-20 bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50">
                  <Plus className="w-4 h-4 mr-2" />
                  <div className="text-center">
                    <div className="font-medium">Add Company</div>
                    <div className="text-xs text-gray-400">Create new company</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center justify-center h-20 bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50">
                  <Upload className="w-4 h-4 mr-2" />
                  <div className="text-center">
                    <div className="font-medium">Import Leads</div>
                    <div className="text-xs text-gray-400">Bulk import leads</div>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center justify-center h-20 bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50">
                  <Download className="w-4 h-4 mr-2" />
                  <div className="text-center">
                    <div className="font-medium">Export Report</div>
                    <div className="text-xs text-gray-400">Generate sales report</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create/Edit Lead Modal */}
          {(showCreateLeadForm || editingLead) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      {editingLead ? 'Edit Lead' : 'Create New Lead'}
                    </CardTitle>
                    <Button
                      onClick={cancelEdit}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-gray-800 border-gray-700 hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={leadFormData.name}
                      onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter lead name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={leadFormData.email}
                      onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={leadFormData.company_name}
                      onChange={(e) => setLeadFormData({...leadFormData, company_name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Source
                      </label>
                      <select
                        value={leadFormData.source}
                        onChange={(e) => setLeadFormData({...leadFormData, source: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="contact_form">Contact Form</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social_media">Social Media</option>
                        <option value="email_campaign">Email Campaign</option>
                        <option value="cold_outreach">Cold Outreach</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={leadFormData.status}
                        onChange={(e) => setLeadFormData({...leadFormData, status: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Lead Score: {leadFormData.lead_score}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={leadFormData.lead_score}
                      onChange={(e) => setLeadFormData({...leadFormData, lead_score: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Hub
                    </label>
                    <select
                      value={leadFormData.hub_id}
                      onChange={(e) => setLeadFormData({...leadFormData, hub_id: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {hubs.map((hub) => (
                        <option key={hub.hub_number} value={hub.hub_number}>
                          {hub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={editingLead ? handleEditLead : handleCreateLead}
                      disabled={crudLoading || !leadFormData.name || !leadFormData.email}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {crudLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {editingLead ? 'Update Lead' : 'Create Lead'}
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
