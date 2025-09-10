import { getSupabaseClient } from "../lib/supabaseSingleton";
import type { SupabaseClient } from "@sms-hub/supabase";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  activeCompanies: number;
  totalLeads: number;
  pendingLeads: number;
  totalVerifications: number;
  pendingVerifications: number;
  totalMessages: number;
  messagesThisMonth: number;
  revenue: number;
  revenueGrowth: number;
  onboardingStages: OnboardingStageStats;
  hubBreakdown?: HubBreakdown[];
}

export interface HubBreakdown {
  hubId: number;
  hubName: string;
  companies: number;
  users: number;
  leads: number;
  verifications: number;
  pendingVerifications: number;
}

export interface OnboardingStageStats {
  authentication: number;
  payment: number;
  personalInfo: number;
  businessInfo: number;
  brandSubmission: number;
  privacySetup: number;
  campaignSubmission: number;
  gphoneProcurement: number;
  accountSetup: number;
  completed: number;
}

export interface CompanyOnboardingData {
  id: string;
  name: string;
  currentStage: string;
  stageProgress: number;
  lastActivity: string;
  status: "active" | "stuck" | "completed";
  nextAction: string;
}

export interface RecentActivity {
  id: string;
  type: "user_signup" | "company_created" | "lead_converted" | "message_sent";
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "error" | "success";
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface SystemHealth {
  apiStatus: "operational" | "degraded" | "down";
  databaseStatus: "operational" | "degraded" | "down";
  smsGatewayStatus: "operational" | "degraded" | "down";
  messageQueueStatus: "operational" | "degraded" | "down";
  overallHealth: number;
}

class DashboardService {
  private supabase: SupabaseClient;

  constructor() {
    // Use the singleton client
    this.supabase = getSupabaseClient();
  }

  async getDashboardStats(hubId: number): Promise<DashboardStats> {
    try {
      // Get users stats
      const { data: usersData, error: usersError } = await this.supabase
        .from("user_profiles")
        .select("id, is_active, created_at")
        .eq("hub_id", hubId);

      if (usersError) throw usersError;

      const totalUsers = usersData?.length || 0;
      const activeUsers =
        usersData?.filter((user) => user.is_active).length || 0;

      // Get companies stats
      const { data: companiesData, error: companiesError } = await this.supabase
        .from("companies")
        .select("id, is_active, created_at")
        .eq("hub_id", hubId);

      if (companiesError) throw companiesError;

      const totalCompanies = companiesData?.length || 0;
      const activeCompanies =
        companiesData?.filter((company) => company.is_active).length || 0;

      // Get leads stats
      const { data: leadsData, error: leadsError } = await this.supabase
        .from("leads")
        .select("id, status, created_at")
        .eq("hub_id", hubId);

      if (leadsError) throw leadsError;

      const totalLeads = leadsData?.length || 0;
      const pendingLeads =
        leadsData?.filter((lead) => lead.status === "pending").length || 0;

      // Get verification stats
      const { data: verificationsData, error: verificationsError } =
        await this.supabase
          .from("verifications")
          .select("id, is_verified, created_at")
          .eq("hub_id", hubId);

      if (verificationsError) throw verificationsError;

      const totalVerifications = verificationsData?.length || 0;
      const pendingVerifications =
        verificationsData?.filter((verification) => !verification.is_verified)
          .length || 0;

      // Get messages stats (mock for now since we don't have a messages table)
      const totalMessages = 15420; // Mock data
      const messagesThisMonth = 2340; // Mock data

      // Get revenue stats (mock for now since we don't have a revenue table)
      const revenue = 45600; // Mock data
      const revenueGrowth = 12.5; // Mock data

      // Get onboarding stage stats
      const onboardingStages = await this.getOnboardingStageStats(hubId);

      return {
        totalUsers,
        activeUsers,
        totalCompanies,
        activeCompanies,
        totalLeads,
        pendingLeads,
        totalVerifications,
        pendingVerifications,
        totalMessages,
        messagesThisMonth,
        revenue,
        revenueGrowth,
        onboardingStages,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard stats");
    }
  }

  async getGlobalDashboardStats(): Promise<DashboardStats> {
    try {
      // Get all users stats across all hubs
      const { data: allUsersData, error: usersError } = await this.supabase
        .from("user_profiles")
        .select("id, is_active, created_at, hub_id");

      if (usersError) throw usersError;

      const totalUsers = allUsersData?.length || 0;
      const activeUsers =
        allUsersData?.filter((user) => user.is_active).length || 0;

      // Get all companies stats across all hubs
      const { data: allCompaniesData, error: companiesError } =
        await this.supabase
          .from("companies")
          .select("id, is_active, created_at, hub_id");

      if (companiesError) throw companiesError;

      const totalCompanies = allCompaniesData?.length || 0;
      const activeCompanies =
        allCompaniesData?.filter((company) => company.is_active).length || 0;

      // Get all leads stats across all hubs
      const { data: allLeadsData, error: leadsError } = await this.supabase
        .from("leads")
        .select("id, status, created_at, hub_id");

      if (leadsError) throw leadsError;

      const totalLeads = allLeadsData?.length || 0;
      const pendingLeads =
        allLeadsData?.filter((lead) => lead.status === "pending").length || 0;

      // Get all verification stats across all hubs
      const { data: allVerificationsData, error: verificationsError } =
        await this.supabase
          .from("verifications")
          .select("id, is_verified, created_at, hub_id");

      if (verificationsError) throw verificationsError;

      const totalVerifications = allVerificationsData?.length || 0;
      const pendingVerifications =
        allVerificationsData?.filter(
          (verification) => !verification.is_verified
        ).length || 0;

      // Get revenue stats (mock for now since we don't have a revenue table)
      const revenue = 45600 * 4; // Mock data for all hubs
      const revenueGrowth = 12.5; // Mock data

      // Get global onboarding stage stats
      const globalOnboardingStages = await this.getGlobalOnboardingStageStats();

      // Get hub breakdown
      const hubBreakdown = await this.getHubBreakdown();

      return {
        totalUsers,
        activeUsers,
        totalCompanies,
        activeCompanies,
        totalLeads,
        pendingLeads,
        totalVerifications,
        pendingVerifications,
        totalMessages: 15420 * 4, // Mock data for all hubs
        messagesThisMonth: 2340 * 4, // Mock data for all hubs
        revenue,
        revenueGrowth,
        onboardingStages: globalOnboardingStages,
        hubBreakdown,
      };
    } catch (error) {
      console.error("Error fetching global dashboard stats:", error);
      throw new Error("Failed to fetch global dashboard stats");
    }
  }

  async getRecentActivity(hubId: number): Promise<RecentActivity[]> {
    try {
      const activities: RecentActivity[] = [];

      // Get recent user signups
      const { data: recentUsers, error: usersError } = await this.supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email, created_at")
        .eq("hub_id", hubId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!usersError && recentUsers) {
        recentUsers.forEach((user) => {
          activities.push({
            id: user.id,
            type: "user_signup",
            title: "New user signed up",
            description: `${user.first_name || "User"} ${user.last_name || ""} joined the platform`,
            time: this.getTimeAgo(user.created_at),
            icon: "UserPlus",
            color: "text-blue-600",
          });
        });
      }

      // Get recent companies
      const { data: recentCompanies, error: companiesError } =
        await this.supabase
          .from("companies")
          .select("id, public_name, created_at")
          .eq("hub_id", hubId)
          .order("created_at", { ascending: false })
          .limit(3);

      if (!companiesError && recentCompanies) {
        recentCompanies.forEach((company) => {
          activities.push({
            id: company.id,
            type: "company_created",
            title: "New company created",
            description: `${company.public_name} was added`,
            time: this.getTimeAgo(company.created_at),
            icon: "Building",
            color: "text-green-600",
          });
        });
      }

      // Get recent leads
      const { data: recentLeads, error: leadsError } = await this.supabase
        .from("leads")
        .select("id, first_name, last_name, status, created_at")
        .eq("hub_id", hubId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!leadsError && recentLeads) {
        recentLeads.forEach((lead) => {
          if (lead.status === "converted") {
            activities.push({
              id: lead.id,
              type: "lead_converted",
              title: "Lead converted",
              description: `Lead ${lead.first_name} ${lead.last_name} converted to user`,
              time: this.getTimeAgo(lead.created_at),
              icon: "CheckCircle",
              color: "text-purple-600",
            });
          }
        });
      }

      // Sort by time and return top 5
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      return [];
    }
  }

  async getAlerts(hubId: number): Promise<Alert[]> {
    try {
      const alerts: Alert[] = [];

      // Check for high verification volume
      const { data: verifications, error: verificationsError } =
        await this.supabase
          .from("verifications")
          .select("id, created_at")
          .eq("hub_id", hubId)
          .gte(
            "created_at",
            new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          ); // Last 24 hours

      if (!verificationsError && verifications && verifications.length > 50) {
        alerts.push({
          id: "high-verifications",
          type: "warning",
          title: "High verification volume",
          description: `${verifications.length} new verifications in the last 24 hours`,
          icon: "AlertTriangle",
          color: "text-yellow-600",
        });
      }

      // Check for pending verifications
      const { data: pendingVerifications, error: pendingError } =
        await this.supabase
          .from("verifications")
          .select("id")
          .eq("hub_id", hubId)
          .eq("is_verified", false);

      if (
        !pendingError &&
        pendingVerifications &&
        pendingVerifications.length > 20
      ) {
        alerts.push({
          id: "pending-verifications",
          type: "info",
          title: "Pending verifications",
          description: `${pendingVerifications.length} signups awaiting verification`,
          icon: "Clock",
          color: "text-blue-600",
        });
      }

      // Check for inactive companies
      const { data: inactiveCompanies, error: inactiveError } =
        await this.supabase
          .from("companies")
          .select("id")
          .eq("hub_id", hubId)
          .eq("is_active", false);

      if (
        !inactiveError &&
        inactiveCompanies &&
        inactiveCompanies.length > 10
      ) {
        alerts.push({
          id: "inactive-companies",
          type: "warning",
          title: "Inactive companies",
          description: `${inactiveCompanies.length} companies are currently inactive`,
          icon: "AlertTriangle",
          color: "text-yellow-600",
        });
      }

      return alerts;
    } catch (error) {
      console.error("Error fetching alerts:", error);
      return [];
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    try {
      // Test database connection
      const { error: dbError } = await this.supabase
        .from("user_profiles")
        .select("id")
        .limit(1);

      const databaseStatus = dbError ? "down" : "operational";

      // Mock other statuses for now
      const apiStatus = "operational";
      const smsGatewayStatus = "operational";
      const messageQueueStatus = "operational";

      // Calculate overall health
      const statuses = [
        apiStatus,
        databaseStatus,
        smsGatewayStatus,
        messageQueueStatus,
      ];
      const operationalCount = statuses.filter(
        (status) => status === "operational"
      ).length;
      const overallHealth = (operationalCount / statuses.length) * 100;

      return {
        apiStatus,
        databaseStatus,
        smsGatewayStatus,
        messageQueueStatus,
        overallHealth,
      };
    } catch (error) {
      console.error("Error checking system health:", error);
      return {
        apiStatus: "down",
        databaseStatus: "down",
        smsGatewayStatus: "down",
        messageQueueStatus: "down",
        overallHealth: 0,
      };
    }
  }

  private getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  }

  async getOnboardingStageStats(hubId: number): Promise<OnboardingStageStats> {
    try {
      const { data: companies, error } = await this.supabase
        .from("companies")
        .select("id, account_onboarding_step, created_at")
        .eq("hub_id", hubId);

      if (error) throw error;

      const stageCounts = {
        authentication: 0,
        payment: 0,
        personalInfo: 0,
        businessInfo: 0,
        brandSubmission: 0,
        privacySetup: 0,
        campaignSubmission: 0,
        gphoneProcurement: 0,
        accountSetup: 0,
        completed: 0,
      };

      companies?.forEach((company) => {
        const stage = company.account_onboarding_step || "authentication";
        
        // For migration scenario: if company is in authentication stage and was created before today,
        // consider it as "migrated" rather than "pending verification"
        if (stage === "authentication") {
          const companyCreated = new Date(company.created_at || Date.now());
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (companyCreated < today) {
            // This is a migrated company, count it as "completed" for now
            stageCounts.completed++;
          } else {
            // This is a new company that needs verification
            stageCounts.authentication++;
          }
        } else if (stageCounts.hasOwnProperty(stage)) {
          stageCounts[stage as keyof OnboardingStageStats]++;
        }
      });

      return stageCounts;
    } catch (error) {
      console.error("Error fetching onboarding stage stats:", error);
      // Return default values if there's an error
      return {
        authentication: 0,
        payment: 0,
        personalInfo: 0,
        businessInfo: 0,
        brandSubmission: 0,
        privacySetup: 0,
        campaignSubmission: 0,
        gphoneProcurement: 0,
        accountSetup: 0,
        completed: 0,
      };
    }
  }

  async getCompanyOnboardingData(
    hubId: number
  ): Promise<CompanyOnboardingData[]> {
    try {
      const { data: companies, error } = await this.supabase
        .from("companies")
        .select(
          `
          id, 
          public_name, 
          account_onboarding_step, 
          created_at,
          updated_at
        `
        )
        .eq("hub_id", hubId)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return (
        companies?.map((company) => {
          const stage = company.account_onboarding_step || "authentication";
          const stageOrder = [
            "authentication",
            "payment",
            "personalInfo",
            "businessInfo",
            "brandSubmission",
            "privacySetup",
            "campaignSubmission",
            "gphoneProcurement",
            "accountSetup",
            "completed",
          ];
          const stageIndex = stageOrder.indexOf(stage);
          const progress =
            stageIndex >= 0 ? ((stageIndex + 1) / stageOrder.length) * 100 : 0;

          // Determine status and next action
          let status: "active" | "stuck" | "completed" = "active";
          let nextAction = "Continue onboarding";

          if (stage === "completed") {
            status = "completed";
            nextAction = "Onboarding complete";
          } else if (stage === "authentication") {
            nextAction = "Complete verification";
          } else if (stage === "payment") {
            nextAction = "Complete payment setup";
          } else if (stage === "brandSubmission") {
            nextAction = "Submit brand for TCR approval";
          } else if (stage === "campaignSubmission") {
            nextAction = "Submit campaign for TCR approval";
          }

          return {
            id: company.id,
            name: company.public_name || "Unnamed Company",
            currentStage: stage,
            stageProgress: progress,
            lastActivity: this.getTimeAgo(
              company.updated_at || company.created_at
            ),
            status,
            nextAction,
          };
        }) || []
      );
    } catch (error) {
      console.error("Error fetching company onboarding data:", error);
      return [];
    }
  }

  async getGlobalCompanyOnboardingData(): Promise<CompanyOnboardingData[]> {
    try {
      const { data: companies, error } = await this.supabase
        .from("companies")
        .select(
          `
          id, 
          public_name, 
          account_onboarding_step, 
          created_at,
          updated_at,
          hub_id
        `
        )
        .order("updated_at", { ascending: false })
        .limit(50); // Show more companies in global view

      if (error) throw error;

      return (
        companies?.map((company) => {
          const stage = company.account_onboarding_step || "authentication";
          const stageOrder = [
            "authentication",
            "payment",
            "personalInfo",
            "businessInfo",
            "brandSubmission",
            "privacySetup",
            "campaignSubmission",
            "gphoneProcurement",
            "accountSetup",
            "completed",
          ];
          const stageIndex = stageOrder.indexOf(stage);
          const progress =
            stageIndex >= 0 ? ((stageIndex + 1) / stageOrder.length) * 100 : 0;

          // Determine status and next action
          let status: "active" | "stuck" | "completed" = "active";
          let nextAction = "Continue onboarding";

          if (stage === "completed") {
            status = "completed";
            nextAction = "Onboarding complete";
          } else if (stage === "authentication") {
            nextAction = "Complete verification";
          } else if (stage === "payment") {
            nextAction = "Complete payment setup";
          } else if (stage === "brandSubmission") {
            nextAction = "Submit brand for TCR approval";
          } else if (stage === "campaignSubmission") {
            nextAction = "Submit campaign for TCR approval";
          }

          // Get hub name for display
          const hubNames: { [key: number]: string } = {
            0: "PercyTech",
            1: "Gnymble",
            2: "PercyMD",
            3: "PercyText",
          };
          const hubName = hubNames[company.hub_id as number] || "Unknown";

          return {
            id: company.id,
            name: `${company.public_name || "Unnamed Company"} (${hubName})`,
            currentStage: stage,
            stageProgress: progress,
            lastActivity: this.getTimeAgo(
              company.updated_at || company.created_at
            ),
            status,
            nextAction,
          };
        }) || []
      );
    } catch (error) {
      console.error("Error fetching global company onboarding data:", error);
      return [];
    }
  }

  async getGlobalOnboardingStageStats(): Promise<OnboardingStageStats> {
    try {
      const { data: companies, error } = await this.supabase
        .from("companies")
        .select("id, account_onboarding_step, created_at");

      if (error) throw error;

      const stageCounts = {
        authentication: 0,
        payment: 0,
        personalInfo: 0,
        businessInfo: 0,
        brandSubmission: 0,
        privacySetup: 0,
        campaignSubmission: 0,
        gphoneProcurement: 0,
        accountSetup: 0,
        completed: 0,
      };

      companies?.forEach((company) => {
        const stage = company.account_onboarding_step || "authentication";
        if (stageCounts.hasOwnProperty(stage)) {
          stageCounts[stage as keyof OnboardingStageStats]++;
        }
      });

      return stageCounts;
    } catch (error) {
      console.error("Error fetching global onboarding stage stats:", error);
      // Return default values if there's an error
      return {
        authentication: 0,
        payment: 0,
        personalInfo: 0,
        businessInfo: 0,
        brandSubmission: 0,
        privacySetup: 0,
        campaignSubmission: 0,
        gphoneProcurement: 0,
        accountSetup: 0,
        completed: 0,
      };
    }
  }

  async getHubBreakdown(): Promise<HubBreakdown[]> {
    try {
      const hubMap = new Map<number, HubBreakdown>();

      // Initialize hub breakdown for all known hubs
      const hubConfigs = [
        { id: 0, name: "PercyTech" },
        { id: 1, name: "Gnymble" },
        { id: 2, name: "PercyMD" },
        { id: 3, name: "PercyText" },
      ];

      hubConfigs.forEach((hub) => {
        hubMap.set(hub.id, {
          hubId: hub.id,
          hubName: hub.name,
          companies: 0,
          users: 0,
          leads: 0,
          verifications: 0,
          pendingVerifications: 0,
        });
      });

      // Get companies count by hub
      const { data: companiesData, error: companiesError } = await this.supabase
        .from("companies")
        .select("hub_id");

      if (!companiesError && companiesData) {
        companiesData.forEach((company) => {
          const hub = hubMap.get(company.hub_id);
          if (hub) hub.companies++;
        });
      }

      // Get users count by hub
      const { data: usersData, error: usersError } = await this.supabase
        .from("user_profiles")
        .select("hub_id");

      if (!usersError && usersData) {
        usersData.forEach((user) => {
          const hub = hubMap.get(user.hub_id);
          if (hub) hub.users++;
        });
      }

      // Get leads count by hub
      const { data: leadsData, error: leadsError } = await this.supabase
        .from("leads")
        .select("hub_id");

      if (!leadsError && leadsData) {
        leadsData.forEach((lead) => {
          const hub = hubMap.get(lead.hub_id);
          if (hub) hub.leads++;
        });
      }

      // Get verifications count by hub
      const { data: verificationsData, error: verificationsError } =
        await this.supabase.from("verifications").select("hub_id, is_verified");

      if (!verificationsError && verificationsData) {
        verificationsData.forEach((verification) => {
          const hub = hubMap.get(verification.hub_id);
          if (hub) {
            hub.verifications++;
            if (!verification.is_verified) hub.pendingVerifications++;
          }
        });
      }

      return Array.from(hubMap.values());
    } catch (error) {
      console.error("Error fetching hub breakdown:", error);
      return [];
    }
  }
}

// Lazy-loaded service instance
let _dashboardService: DashboardService | null = null;

export const dashboardService = {
  get instance() {
    if (!_dashboardService) {
      _dashboardService = new DashboardService();
    }
    return _dashboardService;
  }
};
