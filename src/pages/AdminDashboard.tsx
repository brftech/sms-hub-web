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
} from "@sms-hub/ui/marketing";
import { getHubColorClasses } from "@sms-hub/utils";
import { getSupabaseClient } from "../lib/supabaseSingleton";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { 
  Database, 
  Users, 
  MessageSquare, 
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';


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
  
  // Use singleton Supabase client to avoid multiple instances
  const supabase = getSupabaseClient();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentEmailSubscribers, setRecentEmailSubscribers] = useState<EmailSubscriber[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [smsSubscribers, setSmsSubscribers] = useState<any[]>([]);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [leadsFilter, setLeadsFilter] = useState<'recent' | 'all'>('recent');
  const [emailFilter, setEmailFilter] = useState<'recent' | 'all'>('recent');
  const [smsFilter, setSmsFilter] = useState<'recent' | 'all'>('recent');

  // Admin authentication check
  const [adminAuth, setAdminAuth] = useState(true); // Always allow in development
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

  // Admin access is always allowed in development (set in useState above)

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




      // Check for errors silently




      // Get recent data in parallel
      const [emailSubscribersDataResult, leadsDataResult, smsSubscribersDataResult, hubsDataResult] = await Promise.all([
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
          .from('sms_subscribers')
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

      if (smsSubscribersDataResult.error) {
        // Handle error silently
      } else {
        setSmsSubscribers(smsSubscribersDataResult.data || []);
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('leads')
        .insert({
          ...leadFormData,
          created_at: new Date().toISOString()
        });

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
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

  const addLeadToEmailList = async (lead: Lead) => {
    try {
      setCrudLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('email_subscribers')
        .insert({
          email: lead.email,
          first_name: lead.name?.split(' ')[0] || null,
          last_name: lead.name?.split(' ').slice(1).join(' ') || null,
          hub_id: lead.hub_id,
          source: lead.source || 'lead_conversion',
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to email list');
    } finally {
      setCrudLoading(false);
    }
  };

  const addLeadToSmsList = async (lead: Lead) => {
    try {
      setCrudLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('sms_subscribers')
        .insert({
          phone: lead.email, // Assuming email field contains phone for now
          first_name: lead.name?.split(' ')[0] || null,
          last_name: lead.name?.split(' ').slice(1).join(' ') || null,
          hub_id: lead.hub_id,
          source: lead.source || 'lead_conversion',
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to SMS list');
    } finally {
      setCrudLoading(false);
    }
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


          {/* Leads - Main Focus */}
          <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800 hover:border-gray-700 transition-colors mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-white text-xl">
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Leads Management
                </CardTitle>
                <div className="flex items-center gap-3">
                  <select
                    value={leadsFilter}
                    onChange={(e) => setLeadsFilter(e.target.value as 'recent' | 'all')}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                  >
                    <option value="recent">Recent</option>
                    <option value="all">All</option>
                  </select>
                  <Button
                    onClick={() => setShowCreateLeadForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </div>
              </div>
            </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
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
                              onClick={() => addLeadToEmailList(lead)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 bg-green-900/50 border-green-700 hover:bg-green-800/50"
                              title="Add to Email List"
                            >
                              <Users className="w-3 h-3 text-green-300" />
                            </Button>
                            <Button
                              onClick={() => addLeadToSmsList(lead)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 bg-blue-900/50 border-blue-700 hover:bg-blue-800/50"
                              title="Add to SMS List"
                            >
                              <MessageSquare className="w-3 h-3 text-blue-300" />
                            </Button>
                            <Button
                              onClick={() => startEditLead(lead)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 bg-gray-700/50 border-gray-600 hover:bg-gray-600/50"
                              title="Edit Lead"
                            >
                              <Edit className="w-3 h-3 text-gray-300" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteLead(lead.id)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 bg-red-900/50 border-red-700 hover:bg-red-800/50"
                              disabled={crudLoading && deletingLead === lead.id}
                              title="Delete Lead"
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

          {/* Subscriber Lists - Secondary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Subscribers */}
            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-white">
                    <Users className="w-5 h-5 mr-2" />
                    Email Subscribers
                  </CardTitle>
                  <select
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value as 'recent' | 'all')}
                    className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                  >
                    <option value="recent">Recent</option>
                    <option value="all">All</option>
                  </select>
                </div>
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

            {/* SMS Subscribers */}
            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-white">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    SMS Subscribers
                  </CardTitle>
                  <select
                    value={smsFilter}
                    onChange={(e) => setSmsFilter(e.target.value as 'recent' | 'all')}
                    className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                  >
                    <option value="recent">Recent</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {smsSubscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">
                          {subscriber.first_name && subscriber.last_name 
                            ? `${subscriber.first_name} ${subscriber.last_name}`
                            : subscriber.phone
                          }
                        </p>
                        <p className="text-sm text-gray-400">
                          {showSensitiveData ? subscriber.phone : '***-***-****'}
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
