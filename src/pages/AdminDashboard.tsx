import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  PageLayout,
  useHub,
  SEO,
} from "@sms-hub/ui/marketing";
import { getHubColorClasses } from "@sms-hub/utils";
import { getHubId, getHubDisplayName } from "@sms-hub/hub-logic";
import { getSupabaseClient } from "../services/supabaseSingleton";
import { createSubscriberService } from "../services/subscriberService";
import { getDisplayName } from "../utils/nameUtils";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import FloatingHubSwitcher from "../components/FloatingHubSwitcher";
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
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Phone,
  Building,
  Tag,
  ExternalLink,
  Activity,
  CheckSquare,
  Square,
  Mail,
} from "lucide-react";

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
  phone: string | null;
  lead_phone_number: string | null;
  company_name: string | null;
  message: string | null;
  hub_id: number;
  source: string | null;
  status: string | null;
  lead_score: number | null;
  campaign_source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  platform_interest: string | null;
  budget_range: string | null;
  timeline: string | null;
  interaction_count: number | null;
  last_interaction_at: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string | null;
  converted_at: string | null;
  updated_at: string | null;
}

interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  activity_data: Record<string, unknown>;
  created_at: string;
}

interface Hub {
  hub_number: number;
  name: string;
  domain: string | null;
}

export const AdminDashboard: React.FC = () => {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  // Use regular anon key client (RLS is disabled on marketing tables)
  // Security is handled at application layer via admin access code
  const supabase = React.useMemo(() => getSupabaseClient(), []);
  const subscriberService = React.useMemo(() => createSubscriberService(supabase), [supabase]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentEmailSubscribers, setRecentEmailSubscribers] = useState<EmailSubscriber[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [smsSubscribers, setSmsSubscribers] = useState<any[]>([]);
  const [showSensitiveData, setShowSensitiveData] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [leadsFilter, setLeadsFilter] = useState<"recent" | "all">("recent");
  const [emailFilter, setEmailFilter] = useState<"recent" | "all">("recent");
  const [smsFilter, setSmsFilter] = useState<"recent" | "all">("recent");
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [leadActivities, setLeadActivities] = useState<Record<string, LeadActivity[]>>({});

  // Track subscription status for each lead
  const [leadSubscriptionStatus, setLeadSubscriptionStatus] = useState<
    Record<string, { isEmailSubscriber: boolean; isSmsSubscriber: boolean }>
  >({});

  // Bulk selection state
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  // Total counts (not just recent)
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [totalEmailSubscribersCount, setTotalEmailSubscribersCount] = useState(0);
  const [totalSmsSubscribersCount, setTotalSmsSubscribersCount] = useState(0);

  // Admin authentication check
  const [adminAuth, setAdminAuth] = useState(() => {
    // Check if already authenticated (stored in localStorage with timestamp)
    const token = localStorage.getItem("admin_auth_token");
    const timestamp = localStorage.getItem("admin_auth_timestamp");

    // In development, allow bypassing auth if no access code is set
    if (import.meta.env.DEV && !import.meta.env.VITE_ADMIN_ACCESS_CODE) {
      console.warn("⚠️ Admin dashboard accessible without authentication in DEV mode");
      return true;
    }

    // Check if authenticated within last 24 hours
    if (token === "authenticated" && timestamp) {
      const authTime = new Date(timestamp).getTime();
      const now = new Date().getTime();
      const hoursSinceAuth = (now - authTime) / (1000 * 60 * 60);

      if (hoursSinceAuth < 24) {
        return true;
      }
    }

    return false;
  });
  const [authCode, setAuthCode] = useState("");

  // CRUD operations state
  const [showCreateLeadForm, setShowCreateLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<string | null>(null);
  const [crudLoading, setCrudLoading] = useState(false);

  // Form data for creating/editing leads
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    email: "",
    company_name: "",
    source: "contact_form",
    status: "new",
    lead_score: 50,
    hub_id: 1,
  });

  // Admin access is always allowed in development (set in useState above)

  const handleAdminAuth = () => {
    if (authCode === import.meta.env.VITE_ADMIN_ACCESS_CODE) {
      setAdminAuth(true);
      localStorage.setItem("admin_auth_token", "authenticated");
      localStorage.setItem("admin_auth_timestamp", new Date().toISOString());
      setAuthCode("");
    } else {
      setError("Invalid admin access code");
    }
  };

  // Check subscription status for all leads (optimized batch query)
  const checkLeadSubscriptionStatus = useCallback(
    async (leads: Lead[]) => {
      const statusMap: Record<string, { isEmailSubscriber: boolean; isSmsSubscriber: boolean }> =
        {};

      if (leads.length === 0) return;

      // Get the hub ID (should be consistent across all leads in the query)
      const hubId = leads[0]?.hub_id;
      if (!hubId) return;

      // BATCH QUERY 1: Get ALL email subscriptions in one query
      const emails = leads.map((l) => l.email).filter(Boolean);
      const emailSet = new Set<string>();

      if (emails.length > 0) {
        const { data: emailSubs, error: emailError } = await supabase
          .from("email_subscribers")
          .select("email")
          .eq("hub_id", hubId)
          .in("email", emails);

        if (emailError) {
          console.error("Error batch checking email subscriptions:", emailError);
        } else if (emailSubs && Array.isArray(emailSubs)) {
          emailSubs.forEach((sub: { email: string }) => emailSet.add(sub.email));
        }
      }

      // BATCH QUERY 2: Get ALL SMS subscriptions in one query
      const phones = leads.map((l) => l.phone || l.lead_phone_number).filter(Boolean) as string[];
      const smsSet = new Set<string>();

      if (phones.length > 0) {
        const { data: smsSubs, error: smsError } = await supabase
          .from("sms_subscribers")
          .select("phone_number")
          .eq("hub_id", hubId)
          .in("phone_number", phones);

        if (smsError) {
          console.error("Error batch checking SMS subscriptions:", smsError);
        } else if (smsSubs && Array.isArray(smsSubs)) {
          smsSubs.forEach((sub: { phone_number: string }) => smsSet.add(sub.phone_number));
        }
      }

      // Build status map from batch results
      for (const lead of leads) {
        const phoneNumber = lead.phone || lead.lead_phone_number;
        statusMap[lead.id] = {
          isEmailSubscriber: emailSet.has(lead.email),
          isSmsSubscriber: phoneNumber ? smsSet.has(phoneNumber) : false,
        };
      }

      setLeadSubscriptionStatus(statusMap);
    },
    [supabase]
  );

  const fetchDatabaseStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Debug: Log connection info
      // eslint-disable-next-line no-console
      console.log("🔌 Admin Dashboard - Connecting to Supabase:", {
        url: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        mode: import.meta.env.DEV ? "development" : "production",
      });

      // Get current hub ID for filtering
      const currentHubId = getHubId(currentHub);

      // Get recent data AND total counts in parallel, filtered by current hub
      const [
        emailSubscribersDataResult,
        leadsDataResult,
        smsSubscribersDataResult,
        hubsDataResult,
        emailCountResult,
        leadsCountResult,
        smsCountResult,
      ] = await Promise.all([
        supabase
          .from("email_subscribers")
          .select("*")
          .eq("hub_id", currentHubId)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("leads")
          .select("*")
          .eq("hub_id", currentHubId)
          .order("last_interaction_at", { ascending: false, nullsFirst: false })
          .limit(10),
        supabase
          .from("sms_subscribers")
          .select("*")
          .eq("hub_id", currentHubId)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("hubs").select("*").order("hub_number", { ascending: true }),
        // Count queries
        supabase
          .from("email_subscribers")
          .select("*", { count: "exact", head: true })
          .eq("hub_id", currentHubId),
        supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("hub_id", currentHubId),
        supabase
          .from("sms_subscribers")
          .select("*", { count: "exact", head: true })
          .eq("hub_id", currentHubId),
      ]);

      // Collect any errors
      const errors = [];
      if (emailSubscribersDataResult.error) {
        errors.push(`Email Subscribers: ${emailSubscribersDataResult.error.message}`);
        console.error("Email subscribers error:", emailSubscribersDataResult.error);
      } else {
        setRecentEmailSubscribers(emailSubscribersDataResult.data || []);
      }

      if (leadsDataResult.error) {
        errors.push(`Leads: ${leadsDataResult.error.message}`);
        console.error("Leads error:", leadsDataResult.error);
      } else {
        const fetchedLeads = leadsDataResult.data || [];
        setRecentLeads(fetchedLeads);
        // Check subscription status for all leads
        if (fetchedLeads.length > 0) {
          checkLeadSubscriptionStatus(fetchedLeads);
        }
      }

      if (smsSubscribersDataResult.error) {
        errors.push(`SMS Subscribers: ${smsSubscribersDataResult.error.message}`);
        console.error("SMS subscribers error:", smsSubscribersDataResult.error);
      } else {
        setSmsSubscribers(smsSubscribersDataResult.data || []);
      }

      if (hubsDataResult.error) {
        errors.push(`Hubs: ${hubsDataResult.error.message}`);
        console.error("Hubs error:", hubsDataResult.error);
      } else {
        setHubs(hubsDataResult.data || []);
      }

      // Show errors if any
      if (errors.length > 0) {
        setError(`Database errors: ${errors.join("; ")}`);
      }

      // Set total counts
      setTotalEmailSubscribersCount(emailCountResult.count || 0);
      setTotalLeadsCount(leadsCountResult.count || 0);
      setTotalSmsSubscribersCount(smsCountResult.count || 0);

      // Debug logging
      // eslint-disable-next-line no-console
      console.log("✅ Admin Dashboard Data:", {
        currentHub,
        currentHubId,
        leadsCount: leadsCountResult.count,
        leadsData: leadsDataResult.data,
        emailCount: emailCountResult.count,
        smsCount: smsCountResult.count,
        hubsCount: hubsDataResult.data?.length || 0,
      });

      setLastRefresh(new Date());
    } catch (err) {
      console.error("❌ Admin Dashboard Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [supabase, currentHub, checkLeadSubscriptionStatus]);

  useEffect(() => {
    if (adminAuth) {
      fetchDatabaseStats();
    }
  }, [adminAuth, fetchDatabaseStats]);

  // CRUD Functions for Leads
  const resetLeadForm = () => {
    setLeadFormData({
      name: "",
      email: "",
      company_name: "",
      source: "contact_form",
      status: "new",
      lead_score: 50,
      hub_id: 1,
    });
  };

  const handleCreateLead = async () => {
    try {
      setCrudLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("leads").insert({
        ...leadFormData,
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      setShowCreateLeadForm(false);
      resetLeadForm();
      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead");
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
        .from("leads")
        .update(leadFormData)
        .eq("id", editingLead.id);

      if (error) {
        throw error;
      }

      setEditingLead(null);
      resetLeadForm();
      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead");
    } finally {
      setCrudLoading(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }

    try {
      setCrudLoading(true);
      setError(null);

      const { error } = await supabase.from("leads").delete().eq("id", leadId);

      if (error) {
        throw error;
      }

      setDeletingLead(null);
      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lead");
    } finally {
      setCrudLoading(false);
    }
  };

  const startEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setLeadFormData({
      name: lead.name || "",
      email: lead.email,
      company_name: lead.company_name || "",
      source: lead.source || "contact_form",
      status: lead.status || "new",
      lead_score: lead.lead_score || 50,
      hub_id: lead.hub_id,
    });
  };

  const cancelEdit = () => {
    setEditingLead(null);
    setShowCreateLeadForm(false);
    resetLeadForm();
  };

  const fetchLeadActivities = async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from("lead_activities")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLeadActivities((prev) => ({
        ...prev,
        [leadId]: data || [],
      }));
    } catch (err) {
      console.error("Error fetching lead activities:", err);
    }
  };

  const toggleLeadExpansion = async (leadId: string) => {
    if (expandedLeadId === leadId) {
      setExpandedLeadId(null);
    } else {
      setExpandedLeadId(leadId);
      // Fetch activities if not already loaded
      if (!leadActivities[leadId]) {
        await fetchLeadActivities(leadId);
      }
    }
  };

  // Bulk selection handlers
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeadIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === recentLeads.length) {
      // Deselect all
      setSelectedLeadIds(new Set());
    } else {
      // Select all
      setSelectedLeadIds(new Set(recentLeads.map((lead) => lead.id)));
    }
  };

  const clearSelection = () => {
    setSelectedLeadIds(new Set());
  };

  // Bulk operations
  const bulkAddToEmailList = async () => {
    if (selectedLeadIds.size === 0) return;

    try {
      setCrudLoading(true);
      setError(null);

      const selectedLeads = recentLeads.filter((lead) => selectedLeadIds.has(lead.id));
      let successCount = 0;
      let skipCount = 0;
      let errorCount = 0;

      for (const lead of selectedLeads) {
        // Skip if already subscribed
        if (leadSubscriptionStatus[lead.id]?.isEmailSubscriber) {
          skipCount++;
          continue;
        }

        // Use subscriber service
        const result = await subscriberService.addLeadToEmailList({
          email: lead.email,
          name: lead.name,
          hubId: lead.hub_id,
          phone: lead.phone || lead.lead_phone_number,
          company: lead.company_name,
        });

        if (result.success) {
          successCount++;
          // Update subscription status
          setLeadSubscriptionStatus((prev) => ({
            ...prev,
            [lead.id]: {
              ...prev[lead.id],
              isEmailSubscriber: true,
            },
          }));
        } else {
          errorCount++;
        }
      }

      // Show results
      const messages = [];
      if (successCount > 0) messages.push(`✅ Added ${successCount} to email list`);
      if (skipCount > 0) messages.push(`⏭️ Skipped ${skipCount} (already subscribed)`);
      if (errorCount > 0) messages.push(`❌ Failed ${errorCount}`);

      setError(messages.join(" • "));
      clearSelection();
      await fetchDatabaseStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add leads to email list");
    } finally {
      setCrudLoading(false);
    }
  };

  const bulkAddToSmsList = async () => {
    if (selectedLeadIds.size === 0) return;

    try {
      setCrudLoading(true);
      setError(null);

      const selectedLeads = recentLeads.filter((lead) => selectedLeadIds.has(lead.id));
      let successCount = 0;
      let skipCount = 0;
      let errorCount = 0;

      for (const lead of selectedLeads) {
        // Skip if already subscribed
        if (leadSubscriptionStatus[lead.id]?.isSmsSubscriber) {
          skipCount++;
          continue;
        }

        const phoneNumber = lead.phone || lead.lead_phone_number;
        if (!phoneNumber) {
          skipCount++;
          continue;
        }

        // Use subscriber service
        const result = await subscriberService.addLeadToSmsList({
          phoneNumber,
          name: lead.name,
          hubId: lead.hub_id,
          email: lead.email,
          company: lead.company_name,
        });

        if (result.success) {
          successCount++;
          // Update subscription status
          setLeadSubscriptionStatus((prev) => ({
            ...prev,
            [lead.id]: {
              ...prev[lead.id],
              isSmsSubscriber: true,
            },
          }));
        } else {
          errorCount++;
        }
      }

      // Show results
      const messages = [];
      if (successCount > 0) messages.push(`✅ Added ${successCount} to SMS list`);
      if (skipCount > 0) messages.push(`⏭️ Skipped ${skipCount} (already subscribed or no phone)`);
      if (errorCount > 0) messages.push(`❌ Failed ${errorCount}`);

      setError(messages.join(" • "));
      clearSelection();
      await fetchDatabaseStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add leads to SMS list");
    } finally {
      setCrudLoading(false);
    }
  };

  const bulkDeleteLeads = async () => {
    if (selectedLeadIds.size === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedLeadIds.size} lead(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setCrudLoading(true);
      setError(null);

      const { error } = await supabase.from("leads").delete().in("id", Array.from(selectedLeadIds));

      if (error) {
        throw error;
      }

      setError(`✅ Deleted ${selectedLeadIds.size} lead(s)`);
      clearSelection();
      await fetchDatabaseStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete leads");
    } finally {
      setCrudLoading(false);
    }
  };

  const addLeadToEmailList = async (lead: Lead) => {
    try {
      setCrudLoading(true);
      setError(null);

      // eslint-disable-next-line no-console
      console.log("📧 Adding lead to email list:", lead.email, "hub_id:", lead.hub_id);

      // Use subscriber service
      const result = await subscriberService.addLeadToEmailList({
        email: lead.email,
        name: lead.name,
        hubId: lead.hub_id,
        phone: lead.phone || lead.lead_phone_number,
        company: lead.company_name,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to add to email list");
      }

      // eslint-disable-next-line no-console
      console.log("✅ Email subscriber added successfully");

      // Update subscription status for this lead
      setLeadSubscriptionStatus((prev) => ({
        ...prev,
        [lead.id]: {
          ...prev[lead.id],
          isEmailSubscriber: true,
        },
      }));

      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      console.error("❌ Full error:", err);
      setError(err instanceof Error ? err.message : "Failed to add to email list");
    } finally {
      setCrudLoading(false);
    }
  };

  const addLeadToSmsList = async (lead: Lead) => {
    try {
      setCrudLoading(true);
      setError(null);

      const phoneNumber = lead.phone || lead.lead_phone_number;
      if (!phoneNumber) {
        throw new Error("No phone number available for this lead");
      }

      // eslint-disable-next-line no-console
      console.log("📱 Adding lead to SMS list:", phoneNumber, "hub_id:", lead.hub_id);

      // Use subscriber service
      const result = await subscriberService.addLeadToSmsList({
        phoneNumber,
        name: lead.name,
        hubId: lead.hub_id,
        email: lead.email,
        company: lead.company_name,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to add to SMS list");
      }

      // eslint-disable-next-line no-console
      console.log("✅ SMS subscriber added successfully");

      // Update subscription status for this lead
      setLeadSubscriptionStatus((prev) => ({
        ...prev,
        [lead.id]: {
          ...prev[lead.id],
          isSmsSubscriber: true,
        },
      }));

      await fetchDatabaseStats(); // Refresh data
    } catch (err) {
      console.error("❌ Full error:", err);
      setError(err instanceof Error ? err.message : "Failed to add to SMS list");
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
                <div
                  className={`mx-auto w-12 h-12 ${hubColors.bgLight} rounded-full flex items-center justify-center mb-4`}
                >
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
                    onKeyPress={(e) => e.key === "Enter" && handleAdminAuth()}
                  />
                  <Button
                    onClick={handleAdminAuth}
                    className={`w-full ${hubColors.bg} text-white ${hubColors.bgHover}`}
                    disabled={!authCode.trim()}
                  >
                    Access Dashboard
                  </Button>
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
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
                  Sales Dashboard
                </h1>
                <p className="text-gray-300 mt-2">{getHubDisplayName(currentHub)} Hub Sales Data</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  variant="outline"
                  size="sm"
                  className="flex items-center bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50"
                >
                  {showSensitiveData ? (
                    <EyeOff className="w-4 h-4 mr-2" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  {showSensitiveData ? "Hide" : "Show"} Sensitive Data
                </Button>
                <Button
                  onClick={fetchDatabaseStats}
                  disabled={loading}
                  className={`flex items-center ${hubColors.bg} text-white ${hubColors.bgHover}`}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
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

          {/* Sales Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Leads</p>
                    <p className="text-2xl font-bold text-white">{totalLeadsCount}</p>
                  </div>
                  <MessageSquare className={`w-8 h-8 ${hubColors.text}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Email Subscribers</p>
                    <p className="text-2xl font-bold text-white">{totalEmailSubscribersCount}</p>
                  </div>
                  <Users className={`w-8 h-8 ${hubColors.text}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">SMS Subscribers</p>
                    <p className="text-2xl font-bold text-white">{totalSmsSubscribersCount}</p>
                  </div>
                  <MessageSquare className={`w-8 h-8 ${hubColors.text}`} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Conversion Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {totalLeadsCount > 0
                        ? Math.round(
                            (recentLeads.filter((lead) => lead.status === "converted").length /
                              totalLeadsCount) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <Database className={`w-8 h-8 ${hubColors.text}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leads - Main Focus */}
          <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800 hover:border-gray-700 transition-colors mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="flex items-center text-white text-xl">
                    <MessageSquare className="w-6 h-6 mr-3" />
                    {getHubDisplayName(currentHub)} Leads
                  </CardTitle>
                  <Button
                    onClick={() => setShowCreateLeadForm(true)}
                    className={`${hubColors.bg} ${hubColors.bgHover} text-white`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={leadsFilter}
                    onChange={(e) => setLeadsFilter(e.target.value as "recent" | "all")}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                  >
                    <option value="recent">Recent</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Bulk Actions Toolbar */}
              {selectedLeadIds.size > 0 && (
                <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-300">
                      {selectedLeadIds.size} lead{selectedLeadIds.size !== 1 ? "s" : ""} selected
                    </span>
                    <Button
                      onClick={clearSelection}
                      size="sm"
                      variant="outline"
                      className="h-8 bg-gray-800/50 border-gray-600 hover:bg-gray-700/50"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={bulkAddToEmailList}
                      disabled={crudLoading}
                      size="sm"
                      className="h-8 bg-green-900/50 border-green-700 hover:bg-green-800/50 text-green-300"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Add to Email List
                    </Button>
                    <Button
                      onClick={bulkAddToSmsList}
                      disabled={crudLoading}
                      size="sm"
                      className="h-8 bg-blue-900/50 border-blue-700 hover:bg-blue-800/50 text-blue-300"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Add to SMS List
                    </Button>
                    <Button
                      onClick={bulkDeleteLeads}
                      disabled={crudLoading}
                      size="sm"
                      variant="outline"
                      className="h-8 bg-red-900/50 border-red-700 hover:bg-red-800/50 text-red-300"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              {/* Select All Checkbox */}
              {recentLeads.length > 0 && (
                <div className="mb-3 flex items-center gap-2 p-2 bg-gray-800/30 rounded border border-gray-700/50">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {selectedLeadIds.size === recentLeads.length ? (
                      <CheckSquare className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <span className="text-sm text-gray-400">Select all ({recentLeads.length})</span>
                </div>
              )}

              <div className="space-y-3">
                {recentLeads.map((lead) => {
                  const isExpanded = expandedLeadId === lead.id;
                  const activities = leadActivities[lead.id] || [];
                  const isSelected = selectedLeadIds.has(lead.id);

                  return (
                    <div
                      key={lead.id}
                      className={`bg-gray-800/50 rounded-lg border transition-colors ${
                        isSelected
                          ? "border-blue-500/70 bg-blue-900/10"
                          : "border-gray-700/50 hover:border-gray-600/50"
                      }`}
                    >
                      {/* Lead Header */}
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleLeadSelection(lead.id)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-blue-400" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => toggleLeadExpansion(lead.id)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <span className="text-sm font-medium text-white">
                              {getDisplayName({
                                fullName: lead.name,
                                email: lead.email,
                                fallback: lead.company_name || "Unknown",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {lead.lead_score !== null && (
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    lead.lead_score >= 80
                                      ? "bg-green-900/50 text-green-300"
                                      : lead.lead_score >= 60
                                        ? "bg-yellow-900/50 text-yellow-300"
                                        : "bg-red-900/50 text-red-300"
                                  }`}
                                >
                                  Score: {lead.lead_score}
                                </span>
                              )}
                              {lead.status && (
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    lead.status === "converted"
                                      ? "bg-green-900/50 text-green-300"
                                      : lead.status === "qualified"
                                        ? "bg-blue-900/50 text-blue-300"
                                        : "bg-gray-800/50 text-gray-300"
                                  }`}
                                >
                                  {lead.status}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button
                                onClick={() => addLeadToEmailList(lead)}
                                size="sm"
                                variant="outline"
                                disabled={leadSubscriptionStatus[lead.id]?.isEmailSubscriber}
                                className={`h-6 w-6 p-0 ${
                                  leadSubscriptionStatus[lead.id]?.isEmailSubscriber
                                    ? "bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed"
                                    : "bg-green-900/50 border-green-700 hover:bg-green-800/50"
                                }`}
                                title={
                                  leadSubscriptionStatus[lead.id]?.isEmailSubscriber
                                    ? "Already on Email List"
                                    : "Add to Email List"
                                }
                              >
                                <Users
                                  className={`w-3 h-3 ${
                                    leadSubscriptionStatus[lead.id]?.isEmailSubscriber
                                      ? "text-gray-500"
                                      : "text-green-300"
                                  }`}
                                />
                              </Button>
                              <Button
                                onClick={() => addLeadToSmsList(lead)}
                                size="sm"
                                variant="outline"
                                disabled={leadSubscriptionStatus[lead.id]?.isSmsSubscriber}
                                className={`h-6 w-6 p-0 ${
                                  leadSubscriptionStatus[lead.id]?.isSmsSubscriber
                                    ? "bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed"
                                    : "bg-blue-900/50 border-blue-700 hover:bg-blue-800/50"
                                }`}
                                title={
                                  leadSubscriptionStatus[lead.id]?.isSmsSubscriber
                                    ? "Already on SMS List"
                                    : "Add to SMS List"
                                }
                              >
                                <MessageSquare
                                  className={`w-3 h-3 ${
                                    leadSubscriptionStatus[lead.id]?.isSmsSubscriber
                                      ? "text-gray-500"
                                      : "text-blue-300"
                                  }`}
                                />
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

                        {/* Basic Info - Always Visible */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Users className="w-3 h-3 text-gray-400" />
                            {showSensitiveData ? lead.email : "***@***.***"}
                          </div>
                          {(lead.phone || lead.lead_phone_number) && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {showSensitiveData
                                ? lead.phone || lead.lead_phone_number
                                : "***-***-****"}
                            </div>
                          )}
                          {lead.company_name && (
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Building className="w-3 h-3 text-gray-400" />
                              {lead.company_name}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            Last Activity:{" "}
                            {lead.last_interaction_at
                              ? new Date(lead.last_interaction_at).toLocaleString()
                              : lead.created_at
                                ? new Date(lead.created_at).toLocaleString()
                                : "N/A"}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>Source: {lead.source || "Unknown"}</span>
                          {lead.interaction_count && lead.interaction_count > 0 && (
                            <span>{lead.interaction_count} interactions</span>
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-700/50 p-3 space-y-3 bg-gray-800/30">
                          {/* Message */}
                          {lead.message && (
                            <div>
                              <p className="text-xs font-medium text-gray-400 mb-1">Message:</p>
                              <p className="text-sm text-gray-300 bg-gray-900/50 p-2 rounded">
                                {lead.message}
                              </p>
                            </div>
                          )}

                          {/* Lead Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {lead.platform_interest && (
                              <div>
                                <p className="text-xs font-medium text-gray-400">
                                  Platform Interest
                                </p>
                                <p className="text-sm text-gray-300">{lead.platform_interest}</p>
                              </div>
                            )}
                            {lead.budget_range && (
                              <div>
                                <p className="text-xs font-medium text-gray-400">Budget Range</p>
                                <p className="text-sm text-gray-300">{lead.budget_range}</p>
                              </div>
                            )}
                            {lead.timeline && (
                              <div>
                                <p className="text-xs font-medium text-gray-400">Timeline</p>
                                <p className="text-sm text-gray-300">{lead.timeline}</p>
                              </div>
                            )}
                            {lead.last_interaction_at && (
                              <div>
                                <p className="text-xs font-medium text-gray-400">
                                  Last Interaction
                                </p>
                                <p className="text-sm text-gray-300">
                                  {new Date(lead.last_interaction_at).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* UTM Parameters */}
                          {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
                            <div>
                              <p className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                Campaign Tracking
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {lead.utm_source && (
                                  <span className="text-gray-300">Source: {lead.utm_source}</span>
                                )}
                                {lead.utm_medium && (
                                  <span className="text-gray-300">Medium: {lead.utm_medium}</span>
                                )}
                                {lead.utm_campaign && (
                                  <span className="text-gray-300">
                                    Campaign: {lead.utm_campaign}
                                  </span>
                                )}
                                {lead.utm_term && (
                                  <span className="text-gray-300">Term: {lead.utm_term}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          {lead.tags && lead.tags.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                Tags
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {lead.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {lead.notes && (
                            <div>
                              <p className="text-xs font-medium text-gray-400 mb-1">Notes:</p>
                              <p className="text-sm text-gray-300 bg-gray-900/50 p-2 rounded">
                                {lead.notes}
                              </p>
                            </div>
                          )}

                          {/* Activities Timeline */}
                          <div>
                            <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              Activity Timeline ({activities.length})
                            </p>
                            {activities.length > 0 ? (
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {activities.map((activity) => (
                                  <div
                                    key={activity.id}
                                    className="flex items-start gap-2 p-2 bg-gray-900/50 rounded text-xs"
                                  >
                                    <div className="flex-shrink-0 w-2 h-2 mt-1 rounded-full bg-orange-500" />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-300 capitalize">
                                          {activity.activity_type.replace(/_/g, " ")}
                                        </span>
                                        <span className="text-gray-500">
                                          {new Date(activity.created_at).toLocaleString()}
                                        </span>
                                      </div>
                                      {Object.keys(activity.activity_data).length > 0 && (
                                        <p className="text-gray-400">
                                          {JSON.stringify(activity.activity_data)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 italic">No activities recorded</p>
                            )}
                          </div>

                          {/* Converted Info */}
                          {lead.converted_at && (
                            <div className="pt-2 border-t border-gray-700/50">
                              <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Converted: {new Date(lead.converted_at).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                    {getHubDisplayName(currentHub)} Email Subscribers
                  </CardTitle>
                  <select
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value as "recent" | "all")}
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
                    <div
                      key={subscriber.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {subscriber.first_name && subscriber.last_name
                            ? `${subscriber.first_name} ${subscriber.last_name}`
                            : subscriber.email}
                        </p>
                        <p className="text-sm text-gray-400">{subscriber.email}</p>
                        <p className="text-sm text-gray-400">
                          Created:{" "}
                          {subscriber.created_at
                            ? new Date(subscriber.created_at).toLocaleDateString()
                            : "N/A"}
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
                          Hub:{" "}
                          {hubs.find((h) => h.hub_number === subscriber.hub_id)?.name ||
                            subscriber.hub_id}
                        </p>
                        <p className="text-xs text-gray-400">
                          {showSensitiveData ? subscriber.email : "***@***.***"}
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
                    {getHubDisplayName(currentHub)} SMS Subscribers
                  </CardTitle>
                  <select
                    value={smsFilter}
                    onChange={(e) => setSmsFilter(e.target.value as "recent" | "all")}
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
                    <div
                      key={subscriber.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {subscriber.first_name && subscriber.last_name
                            ? `${subscriber.first_name} ${subscriber.last_name}`
                            : subscriber.phone}
                        </p>
                        <p className="text-sm text-gray-400">
                          {showSensitiveData ? subscriber.phone : "***-***-****"}
                        </p>
                        <p className="text-sm text-gray-400">
                          Created:{" "}
                          {subscriber.created_at
                            ? new Date(subscriber.created_at).toLocaleDateString()
                            : "N/A"}
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
                          Hub:{" "}
                          {hubs.find((h) => h.hub_number === subscriber.hub_id)?.name ||
                            subscriber.hub_id}
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
                      {editingLead ? "Edit Lead" : "Create New Lead"}
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                    <input
                      type="text"
                      value={leadFormData.name}
                      onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter lead name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      value={leadFormData.email}
                      onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
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
                      onChange={(e) =>
                        setLeadFormData({ ...leadFormData, company_name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Source</label>
                      <select
                        value={leadFormData.source}
                        onChange={(e) =>
                          setLeadFormData({ ...leadFormData, source: e.target.value })
                        }
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
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                      <select
                        value={leadFormData.status}
                        onChange={(e) =>
                          setLeadFormData({ ...leadFormData, status: e.target.value })
                        }
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
                      onChange={(e) =>
                        setLeadFormData({ ...leadFormData, lead_score: parseInt(e.target.value) })
                      }
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Hub</label>
                    <select
                      value={leadFormData.hub_id}
                      onChange={(e) =>
                        setLeadFormData({ ...leadFormData, hub_id: parseInt(e.target.value) })
                      }
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
                      className={`flex-1 ${hubColors.bg} ${hubColors.bgHover} text-white`}
                    >
                      {crudLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {editingLead ? "Update Lead" : "Create Lead"}
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

      {/* Floating Hub Switcher */}
      <FloatingHubSwitcher />
    </PageLayout>
  );
};

export default AdminDashboard;
