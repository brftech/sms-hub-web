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
  verifications: number;        // verifications table records
  userAuth: number;             // Supabase Auth users
  userProfiles: number;         // user_profiles table records
  companies: number;            // companies table records
  customers: number;            // customers table records
  memberships: number;          // memberships table records
  onboardingSubmissions: number; // onboarding_submissions table records
  brandSubmission: number;      // Brand submitted for TCR approval
  privacySetup: number;         // Privacy settings configured
  campaignSubmission: number;   // Campaign submitted for TCR approval
  gphoneProcurement: number;    // gPhone numbers procured
  accountSetup: number;         // Account fully configured
  onboardingComplete: number;   // Full onboarding done
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
          .select("id, verification_sent_at, verification_completed_at, created_at")
          .eq("hub_id", hubId);

      if (verificationsError) throw verificationsError;

      const totalVerifications = verificationsData?.length || 0;
      // Count verifications that haven't been completed (no verification_completed_at)
      const pendingVerifications =
        verificationsData?.filter(
          (verification) => !verification.verification_completed_at
        ).length || 0;

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
          .select("id, verification_sent_at, verification_completed_at, created_at, hub_id");

      if (verificationsError) throw verificationsError;

      const totalVerifications = allVerificationsData?.length || 0;
      const pendingVerifications =
        allVerificationsData?.filter(
          (verification) => !verification.verification_completed_at
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
            time: user.created_at
              ? this.getTimeAgo(user.created_at)
              : "Unknown",
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
            time: company.created_at
              ? this.getTimeAgo(company.created_at)
              : "Unknown",
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
              time: lead.created_at
                ? this.getTimeAgo(lead.created_at)
                : "Unknown",
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

      // Check for pending verifications (those without verification_completed_at)
      const { data: pendingVerifications, error: pendingError } =
        await this.supabase
          .from("verifications")
          .select("id")
          .eq("hub_id", hubId)
          .is("verification_completed_at", null);

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
      // Get verifications table count
      const { count: verificationsCount, error: verificationsError } = await this.supabase
        .from("verifications")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId);

      if (verificationsError) throw verificationsError;

      // Get user_profiles table count
      const { count: userProfilesCount, error: userProfilesError } = await this.supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId);

      if (userProfilesError) throw userProfilesError;

      // Get companies table count
      const { count: companiesCount, error: companiesError } = await this.supabase
        .from("companies")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId);

      if (companiesError) throw companiesError;

      // Get customers table count
      const { count: customersCount, error: customersError } = await this.supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId);

      if (customersError) throw customersError;

      // Get memberships table count
      const { count: membershipsCount, error: membershipsError } = await this.supabase
        .from("memberships")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId);

      if (membershipsError) throw membershipsError;

      // Get onboarding_submissions table count
      const { count: onboardingSubmissionsCount, error: onboardingError } = await this.supabase
        .from("onboarding_submissions")
        .select("*", { count: "exact", head: true })
        .eq("hub_id", hubId);

      if (onboardingError) throw onboardingError;

      // Get onboarding submissions to track actual progress
      const { data: onboardingSubmissions, error: onboardingDataError } = await this.supabase
        .from("onboarding_submissions")
        .select("id, current_step, stripe_status, created_at, updated_at")
        .eq("hub_id", hubId);

      if (onboardingDataError) throw onboardingDataError;

      const stageCounts = {
        verifications: verificationsCount || 0,
        userAuth: userProfilesCount || 0, // Use user_profiles count as proxy for auth users
        userProfiles: userProfilesCount || 0,
        companies: companiesCount || 0,
        customers: customersCount || 0,
        memberships: membershipsCount || 0,
        onboardingSubmissions: onboardingSubmissionsCount || 0,
        brandSubmission: 0,
        privacySetup: 0,
        campaignSubmission: 0,
        gphoneProcurement: 0,
        accountSetup: 0,
        onboardingComplete: 0,
      };

      // Count onboarding stages based on actual onboarding_submissions data
      onboardingSubmissions?.forEach((submission) => {
        const currentStep = submission.current_step;
        const stripeStatus = submission.stripe_status;

        // Only count if payment is completed (stripe_status = "completed")
        if (stripeStatus === "completed") {
          switch (currentStep) {
            case "brand":
              stageCounts.brandSubmission++;
              break;
            case "privacy":
              stageCounts.privacySetup++;
              break;
            case "campaign":
              stageCounts.campaignSubmission++;
              break;
            case "gphone":
              stageCounts.gphoneProcurement++;
              break;
            case "account":
              stageCounts.accountSetup++;
              break;
            case "complete":
              stageCounts.onboardingComplete++;
              break;
          }
        }
      });

      return stageCounts;
    } catch (error) {
      console.error("Error fetching onboarding stage stats:", error);
      // Return default values if there's an error
      return {
        verifications: 0,
        userAuth: 0,
        userProfiles: 0,
        companies: 0,
        customers: 0,
        memberships: 0,
        onboardingSubmissions: 0,
        brandSubmission: 0,
        privacySetup: 0,
        campaignSubmission: 0,
        gphoneProcurement: 0,
        accountSetup: 0,
        onboardingComplete: 0,
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
          created_at,
          updated_at,
          customers!inner(
            payment_status
          ),
          onboarding_submissions(
            current_step,
            stripe_status,
            updated_at
          )
        `
        )
        .eq("hub_id", hubId)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return (
        companies?.map((company) => {
          const paymentStatus = (company.customers as any)?.[0]?.payment_status;
          const onboardingSubmission = company.onboarding_submissions?.[0];
          
          let stage = "accountCreated"; // Default to account created since company exists
          
          // Determine stage based on payment status and onboarding progress
          if (paymentStatus === "pending") {
            stage = "paymentPending";
          } else if (paymentStatus === "completed") {
            if (onboardingSubmission?.stripe_status === "completed") {
              // Use actual onboarding step from database
              switch (onboardingSubmission.current_step) {
                case "brand":
                  stage = "brandSubmission";
                  break;
                case "privacy":
                  stage = "privacySetup";
                  break;
                case "campaign":
                  stage = "campaignSubmission";
                  break;
                case "gphone":
                  stage = "gphoneProcurement";
                  break;
                case "account":
                  stage = "accountSetup";
                  break;
                case "complete":
                  stage = "onboardingComplete";
                  break;
                default:
                  stage = "paymentCompleted"; // Payment done but no onboarding step yet
              }
            } else {
              stage = "paymentCompleted";
            }
          }
          
          const stageOrder = [
            "verification", 
            "verified",
            "accountCreated",
            "paymentPending",
            "paymentCompleted",
            "brandSubmission",
            "privacySetup",
            "campaignSubmission",
            "gphoneProcurement",
            "accountSetup",
            "onboardingComplete",
          ];
          const stageIndex = stageOrder.indexOf(stage);
          const progress =
            stageIndex >= 0 ? ((stageIndex + 1) / stageOrder.length) * 100 : 0;

          // Determine status and next action
          let status: "active" | "stuck" | "completed" = "active";
          let nextAction = "Continue onboarding";

          if (stage === "onboardingComplete") {
            status = "completed";
            nextAction = "Onboarding complete";
          } else if (stage === "accountCreated") {
            nextAction = "Initiate payment";
          } else if (stage === "paymentPending") {
            nextAction = "Complete payment";
          } else if (stage === "paymentCompleted") {
            nextAction = "Continue with brand submission";
          } else if (stage === "brandSubmission") {
            nextAction = "Submit brand for TCR approval";
          } else if (stage === "privacySetup") {
            nextAction = "Configure privacy settings";
          } else if (stage === "campaignSubmission") {
            nextAction = "Submit campaign for TCR approval";
          } else if (stage === "gphoneProcurement") {
            nextAction = "Set up gPhone numbers";
          } else if (stage === "accountSetup") {
            nextAction = "Complete account configuration";
          }

          return {
            id: company.id,
            name: company.public_name || "Unnamed Company",
            currentStage: stage,
            stageProgress: progress,
            lastActivity:
              onboardingSubmission?.updated_at || company.updated_at || company.created_at
                ? this.getTimeAgo(onboardingSubmission?.updated_at || company.updated_at || company.created_at!)
                : "Unknown",
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
          created_at,
          updated_at,
          hub_id,
          customers!inner(
            payment_status
          ),
          onboarding_submissions(
            current_step,
            stripe_status,
            updated_at
          )
        `
        )
        .order("updated_at", { ascending: false })
        .limit(50); // Show more companies in global view

      if (error) throw error;

      return (
        companies?.map((company) => {
          const paymentStatus = (company.customers as any)?.[0]?.payment_status;
          const onboardingSubmission = company.onboarding_submissions?.[0];
          
          let stage = "accountCreated"; // Default to account created since company exists
          
          // Determine stage based on payment status and onboarding progress
          if (paymentStatus === "pending") {
            stage = "paymentPending";
          } else if (paymentStatus === "completed") {
            if (onboardingSubmission?.stripe_status === "completed") {
              // Use actual onboarding step from database
              switch (onboardingSubmission.current_step) {
                case "brand":
                  stage = "brandSubmission";
                  break;
                case "privacy":
                  stage = "privacySetup";
                  break;
                case "campaign":
                  stage = "campaignSubmission";
                  break;
                case "gphone":
                  stage = "gphoneProcurement";
                  break;
                case "account":
                  stage = "accountSetup";
                  break;
                case "complete":
                  stage = "onboardingComplete";
                  break;
                default:
                  stage = "paymentCompleted"; // Payment done but no onboarding step yet
              }
            } else {
              stage = "paymentCompleted";
            }
          }
          
          const stageOrder = [
            "verification", 
            "verified",
            "accountCreated",
            "paymentPending",
            "paymentCompleted",
            "brandSubmission",
            "privacySetup",
            "campaignSubmission",
            "gphoneProcurement",
            "accountSetup",
            "onboardingComplete",
          ];
          const stageIndex = stageOrder.indexOf(stage);
          const progress =
            stageIndex >= 0 ? ((stageIndex + 1) / stageOrder.length) * 100 : 0;

          // Determine status and next action
          let status: "active" | "stuck" | "completed" = "active";
          let nextAction = "Continue onboarding";

          if (stage === "onboardingComplete") {
            status = "completed";
            nextAction = "Onboarding complete";
          } else if (stage === "accountCreated") {
            nextAction = "Initiate payment";
          } else if (stage === "paymentPending") {
            nextAction = "Complete payment";
          } else if (stage === "paymentCompleted") {
            nextAction = "Continue with brand submission";
          } else if (stage === "brandSubmission") {
            nextAction = "Submit brand for TCR approval";
          } else if (stage === "privacySetup") {
            nextAction = "Configure privacy settings";
          } else if (stage === "campaignSubmission") {
            nextAction = "Submit campaign for TCR approval";
          } else if (stage === "gphoneProcurement") {
            nextAction = "Set up gPhone numbers";
          } else if (stage === "accountSetup") {
            nextAction = "Complete account configuration";
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
            lastActivity:
              onboardingSubmission?.updated_at || company.updated_at || company.created_at
                ? this.getTimeAgo(onboardingSubmission?.updated_at || company.updated_at || company.created_at!)
                : "Unknown",
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
      // Get verifications table count across all hubs
      const { count: verificationsCount, error: verificationsError } = await this.supabase
        .from("verifications")
        .select("*", { count: "exact", head: true });

      if (verificationsError) throw verificationsError;

      // Get user_profiles table count across all hubs
      const { count: userProfilesCount, error: userProfilesError } = await this.supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true });

      if (userProfilesError) throw userProfilesError;

      // Get companies table count across all hubs
      const { count: companiesCount, error: companiesError } = await this.supabase
        .from("companies")
        .select("*", { count: "exact", head: true });

      if (companiesError) throw companiesError;

      // Get customers table count across all hubs
      const { count: customersCount, error: customersError } = await this.supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      if (customersError) throw customersError;

      // Get memberships table count across all hubs
      const { count: membershipsCount, error: membershipsError } = await this.supabase
        .from("memberships")
        .select("*", { count: "exact", head: true });

      if (membershipsError) throw membershipsError;

      // Get onboarding_submissions table count across all hubs
      const { count: onboardingSubmissionsCount, error: onboardingError } = await this.supabase
        .from("onboarding_submissions")
        .select("*", { count: "exact", head: true });

      if (onboardingError) throw onboardingError;

      // Get onboarding submissions to track actual progress
      const { data: onboardingSubmissions, error: onboardingDataError } = await this.supabase
        .from("onboarding_submissions")
        .select("id, current_step, stripe_status, created_at, updated_at, hub_id");

      if (onboardingDataError) throw onboardingDataError;

      const stageCounts = {
        verifications: verificationsCount || 0,
        userAuth: userProfilesCount || 0, // Use user_profiles count as proxy for auth users
        userProfiles: userProfilesCount || 0,
        companies: companiesCount || 0,
        customers: customersCount || 0,
        memberships: membershipsCount || 0,
        onboardingSubmissions: onboardingSubmissionsCount || 0,
        brandSubmission: 0,
        privacySetup: 0,
        campaignSubmission: 0,
        gphoneProcurement: 0,
        accountSetup: 0,
        onboardingComplete: 0,
      };

      // Count onboarding stages based on actual onboarding_submissions data
      onboardingSubmissions?.forEach((submission) => {
        const currentStep = submission.current_step;
        const stripeStatus = submission.stripe_status;

        // Only count if payment is completed (stripe_status = "completed")
        if (stripeStatus === "completed") {
          switch (currentStep) {
            case "brand":
              stageCounts.brandSubmission++;
              break;
            case "privacy":
              stageCounts.privacySetup++;
              break;
            case "campaign":
              stageCounts.campaignSubmission++;
              break;
            case "gphone":
              stageCounts.gphoneProcurement++;
              break;
            case "account":
              stageCounts.accountSetup++;
              break;
            case "complete":
              stageCounts.onboardingComplete++;
              break;
          }
        }
      });

      return stageCounts;
    } catch (error) {
      console.error("Error fetching global onboarding stage stats:", error);
      // Return default values if there's an error
      return {
        verifications: 0,
        userAuth: 0,
        userProfiles: 0,
        companies: 0,
        customers: 0,
        memberships: 0,
        onboardingSubmissions: 0,
        brandSubmission: 0,
        privacySetup: 0,
        campaignSubmission: 0,
        gphoneProcurement: 0,
        accountSetup: 0,
        onboardingComplete: 0,
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
        await this.supabase
          .from("verifications")
          .select("hub_id, verification_sent_at, verification_completed_at");

      if (!verificationsError && verificationsData) {
        verificationsData.forEach((verification) => {
          const hub = hubMap.get(verification.hub_id);
          if (hub) {
            hub.verifications++;
            if (!verification.verification_completed_at) hub.pendingVerifications++;
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
  },
};
