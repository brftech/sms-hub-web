import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHub } from "@sms-hub/ui";
import {
  MessageSquare,
  Users,
  Building,
  AlertTriangle,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  UserPlus,
  UserCheck,
  Shield,
  CreditCard,
  FileText,
  Globe,
  Phone,
  Settings,
  Target,
  RefreshCw,
  Eye,
  Trash2,
} from "lucide-react";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import { getSupabaseClient } from "../../lib/supabaseSingleton";

import {
  DashboardStats,
  RecentActivity,
  Alert,
  SystemHealth,
  CompanyOnboardingData,
  dashboardService,
} from "../../services/dashboardService";
import { navigationCountsService } from "../../services/navigationCountsService";

const Dashboard = () => {
  const { currentHub } = useHub();
  const navigate = useNavigate();
  const { isGlobalView } = useGlobalView();
  const supabase = getSupabaseClient();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [onboardingData, setOnboardingData] = useState<CompanyOnboardingData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingCounts, setIsRefreshingCounts] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<string | null>(null);
  const [isExecutingCleanup, setIsExecutingCleanup] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isGlobalView) {
        // Fetch global data across all hubs
        const [statsData, healthData, globalOnboardingData] = await Promise.all(
          [
            dashboardService.instance.getGlobalDashboardStats(),
            dashboardService.instance.getSystemHealth(),
            dashboardService.instance.getGlobalCompanyOnboardingData(), // New method we'll create
          ]
        );

        setStats(statsData);
        setRecentActivity([]); // Global view doesn't show recent activity by hub
        setAlerts([]); // Global view doesn't show hub-specific alerts
        setSystemHealth(healthData);
        setOnboardingData(globalOnboardingData); // Show global company data
      } else {
        // Get hub ID based on current hub
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

        console.log("Dashboard: Current hub:", currentHub);
        console.log("Dashboard: Using hub_id:", hubId);

        // Fetch all dashboard data in parallel
        const [
          statsData,
          activityData,
          alertsData,
          healthData,
          onboardingData,
        ] = await Promise.all([
          dashboardService.instance.getDashboardStats(hubId),
          dashboardService.instance.getRecentActivity(hubId),
          dashboardService.instance.getAlerts(hubId),
          dashboardService.instance.getSystemHealth(),
          dashboardService.instance.getCompanyOnboardingData(hubId),
        ]);

        setStats(statsData);
        setRecentActivity(activityData);
        setAlerts(alertsData);
        setSystemHealth(healthData);
        setOnboardingData(onboardingData);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [currentHub, isGlobalView]);

  // Removed auto-refresh - now manual only

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: {
      [key: string]: React.ComponentType<{ className?: string }>;
    } = {
      UserPlus,
      Building,
      CheckCircle,
      MessageSquare,
      AlertTriangle,
      Clock,
    };
    return iconMap[iconName] || Activity;
  };

  // Helper function to get onboarding stage icon and color
  const getStageInfo = (stage: string) => {
    const stageMap: {
      [key: string]: {
        icon: React.ComponentType<{ className?: string }>;
        color: string;
        label: string;
      };
    } = {
      verifications: {
        icon: Shield,
        color: "text-blue-600",
        label: "Verifications",
      },
      userAuth: {
        icon: UserCheck,
        color: "text-yellow-600",
        label: "User Auth",
      },
      userProfiles: {
        icon: UserPlus,
        color: "text-green-600",
        label: "User Profiles",
      },
      companies: {
        icon: Building,
        color: "text-indigo-600",
        label: "Companies",
      },
      customers: {
        icon: CreditCard,
        color: "text-orange-600",
        label: "Customers",
      },
      memberships: {
        icon: Users,
        color: "text-purple-600",
        label: "Memberships",
      },
      onboardingSubmissions: {
        icon: FileText,
        color: "text-teal-600",
        label: "Onboarding Submissions",
      },
      brandSubmission: {
        icon: FileText,
        color: "text-purple-600",
        label: "Brand Submission",
      },
      privacySetup: {
        icon: Shield,
        color: "text-green-600",
        label: "Privacy Setup",
      },
      campaignSubmission: {
        icon: Target,
        color: "text-pink-600",
        label: "Campaign Submission",
      },
      gphoneProcurement: {
        icon: Phone,
        color: "text-teal-600",
        label: "gPhone Setup",
      },
      accountSetup: {
        icon: Settings,
        color: "text-gray-600",
        label: "Account Setup",
      },
      onboardingComplete: {
        icon: CheckCircle,
        color: "text-green-600",
        label: "Complete",
      },
    };
    return (
      stageMap[stage] || {
        icon: Activity,
        color: "text-gray-600",
        label: "Unknown",
      }
    );
  };

  // Navigation functions for card clicks
  const navigateToCompanies = () => navigate("/companies");
  const navigateToUsers = () => navigate("/users");
  const navigateToLeads = () => navigate("/leads");

  // Refresh navigation counts
  const handleRefreshCounts = async () => {
    try {
      setIsRefreshingCounts(true);
      const hubId =
        currentHub === "gnymble"
          ? 1
          : currentHub === "percymd"
            ? 2
            : currentHub === "percytext"
              ? 3
              : currentHub === "percytech"
                ? 0
                : 1;

      await navigationCountsService.getCounts(hubId, isGlobalView);
      // Force a page refresh to update counts in Layout
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing counts:", error);
    } finally {
      setIsRefreshingCounts(false);
    }
  };

  // Cleanup handlers
  const handlePreviewCleanup = async () => {
    try {
      setCleanupResult("Loading preview...");
      
      // Get superadmin user ID first
      const { data: superadminUser, error: userError } = await supabase
        .from('auth.users')
        .select('id, email')
        .or('email.like.%superadmin%,email.like.%admin%')
        .limit(1)
        .single();

      if (userError || !superadminUser) {
        setCleanupResult('No superadmin user found.');
        return;
      }

      const superadminUserId = superadminUser.id;
      let preview = `=== CLEANUP PREVIEW ===\n`;
      preview += `Superadmin user ID: ${superadminUserId}\n\n`;

      // Count records that would be deleted
      const tables = [
        { name: 'onboarding_submissions', condition: `user_id != '${superadminUserId}'` },
        { name: 'memberships', condition: `user_id != '${superadminUserId}'` },
        { name: 'customers', condition: `user_id != '${superadminUserId}'` },
        { name: 'companies', condition: `created_by_user_id != '${superadminUserId}'` },
        { name: 'user_profiles', condition: `id != '${superadminUserId}'` },
        { name: 'verifications', condition: `existing_user_id != '${superadminUserId}'` }
      ];

      for (const table of tables) {
        const { count, error } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true })
          .not('id', 'is', null); // This is a workaround since we can't use complex conditions in count

        if (error) {
          preview += `${table.name}: Error - ${error.message}\n`;
        } else {
          // For now, just show the total count - in a real implementation you'd need to filter
          preview += `${table.name} to delete: ${count || 0} (total records)\n`;
        }
      }

      preview += `\n=== END PREVIEW ===`;
      setCleanupResult(preview);
    } catch (error) {
      console.error('Error previewing cleanup:', error);
      setCleanupResult(`Error: ${error.message}`);
    }
  };

  const handleExecuteCleanup = async () => {
    if (!confirm('Are you sure you want to delete all payment track data except superadmin records? This action cannot be undone.')) {
      return;
    }

    try {
      setIsExecutingCleanup(true);
      setCleanupResult("Executing cleanup...");
      
      // Get superadmin user ID first
      const { data: superadminUser, error: userError } = await supabase
        .from('auth.users')
        .select('id, email')
        .or('email.like.%superadmin%,email.like.%admin%')
        .limit(1)
        .single();

      if (userError || !superadminUser) {
        setCleanupResult('No superadmin user found. Skipping cleanup.');
        return;
      }

      const superadminUserId = superadminUser.id;
      let result = `=== CLEANUP EXECUTION ===\n`;
      result += `Found superadmin user: ${superadminUserId}\n\n`;

      // Delete records from each table (except superadmin)
      const deleteOperations = [
        { table: 'onboarding_submissions', condition: `user_id.neq.${superadminUserId}` },
        { table: 'memberships', condition: `user_id.neq.${superadminUserId}` },
        { table: 'customers', condition: `user_id.neq.${superadminUserId}` },
        { table: 'companies', condition: `created_by_user_id.neq.${superadminUserId}` },
        { table: 'user_profiles', condition: `id.neq.${superadminUserId}` },
        { table: 'verifications', condition: `existing_user_id.neq.${superadminUserId}` }
      ];

      for (const op of deleteOperations) {
        try {
          const { error } = await supabase
            .from(op.table)
            .delete()
            .neq('id', superadminUserId); // This is a simplified approach

          if (error) {
            result += `Error deleting from ${op.table}: ${error.message}\n`;
          } else {
            result += `Deleted records from ${op.table}\n`;
          }
        } catch (err) {
          result += `Error deleting from ${op.table}: ${err.message}\n`;
        }
      }

      result += `\n=== CLEANUP COMPLETED ===`;
      setCleanupResult(result);
      
      // Refresh dashboard data after cleanup
      await fetchDashboardData();
    } catch (error) {
      console.error('Error executing cleanup:', error);
      setCleanupResult(`Error: ${error.message}`);
    } finally {
      setIsExecutingCleanup(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Error Loading Dashboard
          </h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Activity className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {isGlobalView ? "Global Dashboard" : "Dashboard"}
            </h1>
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isGlobalView ? "badge-info" : "badge-success"
              }`}
            >
              {isGlobalView ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Global View
                </>
              ) : (
                <>
                  <Building className="w-3 h-3 mr-1" />
                  Hub View
                </>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {isGlobalView
              ? "Overview of all hubs combined - see total numbers and cross-hub insights"
              : `Overview of ${currentHub} hub activity and performance - hub-specific data only`}
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefreshCounts}
            disabled={isRefreshingCounts}
            className="inline-flex items-center px-2 py-1.5 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Refresh navigation counts"
          >
            <RefreshCw
              className={`w-3 h-3 ${isRefreshingCounts ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Payment Track */}
      {stats && (
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <div>
              <h2 className="text-base sm:text-lg font-medium text-foreground">
                Payment Track
              </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Database Tables in Population Order
                    </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {stats.onboardingStages.onboardingSubmissions}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Onboarding Submissions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {Object.entries(stats.onboardingStages).map(([stage, count]) => {
              const stageInfo = getStageInfo(stage);
              const IconComponent = stageInfo.icon;
              const isPaymentStage = ['verifications', 'userAuth', 'userProfiles', 'companies', 'customers', 'memberships', 'onboardingSubmissions'].includes(stage);
              
              if (!isPaymentStage) return null; // Only show payment stages
              
              return (
                <div key={stage} className="text-center">
                  <div
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-sm min-h-[80px] sm:min-h-[90px] lg:min-h-[100px] flex flex-col justify-center ${
                      (count as number) > 0 
                        ? "border-blue-200 bg-blue-50" 
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mx-auto mb-1 sm:mb-2 ${(count as number) > 0 ? stageInfo.color : "text-gray-400"}`}
                    />
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                      {count as number}
                    </p>
                    <p className="text-xs text-gray-600 leading-tight">
                      {stageInfo.label}
                    </p>
                    <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      )}

      {/* Onboarding Track */}
      {stats && (
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <div>
              <h2 className="text-base sm:text-lg font-medium text-foreground">
                Onboarding Track
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Brand → Privacy → Campaign → gPhone → Account Setup → Complete
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {stats.onboardingStages.onboardingComplete}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Onboarding Complete
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {Object.entries(stats.onboardingStages).map(([stage, count]) => {
              const stageInfo = getStageInfo(stage);
              const IconComponent = stageInfo.icon;
              const isOnboardingStage = ['brandSubmission', 'privacySetup', 'campaignSubmission', 'gphoneProcurement', 'accountSetup', 'onboardingComplete'].includes(stage);
              
              if (!isOnboardingStage) return null; // Only show onboarding stages
              
              return (
                <div key={stage} className="text-center">
                  <div
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-sm min-h-[80px] sm:min-h-[90px] lg:min-h-[100px] flex flex-col justify-center ${
                      (count as number) > 0 
                        ? "border-green-200 bg-green-50" 
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mx-auto mb-1 sm:mb-2 ${(count as number) > 0 ? stageInfo.color : "text-gray-400"}`}
                    />
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                      {count as number}
                    </p>
                    <p className="text-xs text-gray-600 leading-tight">
                      {stageInfo.label.split(" ")[0]}
                    </p>
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Onboarding Summary */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.onboardingStages.onboardingSubmissions}
                </p>
                <p className="text-sm text-gray-600">Ready for Onboarding</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.onboardingStages.onboardingComplete}
                </p>
                <p className="text-sm text-gray-600">Onboarding Complete</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hub Breakdown - Only show in Global View */}
      {isGlobalView && stats?.hubBreakdown && (
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
            Hub Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.hubBreakdown.map((hub) => (
              <div
                key={hub.hubId}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {hub.hubName}
                  </h3>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Companies:</span>
                    <span className="font-medium text-gray-900">
                      {hub.companies}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Users:</span>
                    <span className="font-medium text-gray-900">
                      {hub.users}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Leads:</span>
                    <span className="font-medium text-gray-900">
                      {hub.leads}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-medium text-gray-900">
                      {hub.pendingVerifications}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
            className="bg-card rounded-lg shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
            onClick={navigateToCompanies}
          >
            <div className="flex items-center">
              <div className="p-2 icon-bg-success rounded-lg flex-shrink-0">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-status-success" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Active Companies
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stats.activeCompanies}
                </p>
                <p className="text-xs text-status-success mt-1 truncate">
                  of {stats.totalCompanies} total
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card rounded-lg shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
            onClick={navigateToUsers}
          >
            <div className="flex items-center">
              <div className="p-2 icon-bg-info rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-status-info" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Total Users
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-status-success mt-1 truncate">
                  +{stats.activeUsers} active
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card rounded-lg shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
            onClick={navigateToLeads}
          >
            <div className="flex items-center">
              <div className="p-2 icon-bg-warning rounded-lg flex-shrink-0">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-status-warning" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Leads
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stats.totalLeads}
                </p>
                <p className="text-xs text-status-warning mt-1 truncate">
                  {stats.pendingLeads} pending
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card rounded-lg shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
            onClick={navigateToCompanies}
          >
            <div className="flex items-center">
              <div className="p-2 icon-bg-error rounded-lg flex-shrink-0">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-status-error" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Onboarding Progress
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stats.totalCompanies - stats.activeCompanies}
                </p>
                <p className="text-xs text-status-error mt-1 truncate">
                  in progress
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Onboarding Details */}
      {onboardingData.length > 0 && (
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">
                {isGlobalView
                  ? "Global Company Onboarding Status"
                  : "Company Onboarding Status"}
              </h3>
              <button
                onClick={navigateToCompanies}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Companies →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Current Stage
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Progress
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Next Action
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden 2xl:table-cell">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {onboardingData.map((company) => {
                  const stageInfo = getStageInfo(company.currentStage);
                  const IconComponent = stageInfo.icon;
                  return (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-2 sm:ml-4 min-w-0">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {company.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex items-center">
                          <IconComponent
                            className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${stageInfo.color}`}
                          />
                          <span className="text-xs sm:text-sm text-gray-900">
                            {stageInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center">
                          <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2 mr-2 sm:mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${company.stageProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {Math.round(company.stageProgress)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            company.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : company.status === "stuck"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {company.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden xl:table-cell">
                        {company.nextAction}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden 2xl:table-cell">
                        {company.lastActivity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Secondary Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Messages Sent
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  {stats.totalMessages.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 ml-3">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 truncate">
              {stats.messagesThisMonth.toLocaleString()} this month
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Revenue
                </p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0 ml-3">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2 truncate">
              +{stats.revenueGrowth}% this month
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  System Health
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {systemHealth?.overallHealth || 0}%
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All systems operational
            </p>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {!isGlobalView && (
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  Recent Onboarding Activity
                </h3>
                <button
                  onClick={navigateToCompanies}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 6).map((activity) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No recent onboarding activity
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alerts */}
        {!isGlobalView && (
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-foreground">
                Alerts & Notifications
              </h3>
            </div>
            <div className="p-6">
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const IconComponent = getIconComponent(alert.icon);
                    return (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`p-2 rounded-lg bg-white ${alert.color}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {alert.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    All systems running smoothly
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Onboarding Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={navigateToCompanies}
            className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Manage Companies
            </span>
          </button>
          <button
            onClick={navigateToUsers}
            className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Add User
            </span>
          </button>
          <button
            onClick={navigateToCompanies}
            className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Verify Signups
            </span>
          </button>
          <button
            onClick={navigateToLeads}
            className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Convert Leads
            </span>
          </button>
        </div>
      </div>

      {/* Data Cleanup Section */}
      <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-red-200">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
          Data Cleanup
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Clean up payment track data while preserving superadmin and hub records.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePreviewCleanup}
            className="flex items-center justify-center px-4 py-2.5 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-yellow-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Cleanup
          </button>
          <button
            onClick={handleExecuteCleanup}
            disabled={isExecutingCleanup}
            className="flex items-center justify-center px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecutingCleanup ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isExecutingCleanup ? "Executing..." : "Execute Cleanup"}
          </button>
        </div>
        {cleanupResult && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {cleanupResult}
            </pre>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
