import { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui";
import {
  MessageSquare,
  Users,
  TrendingUp,
  CheckCircle,
  Settings,
  Send,
  Phone,
  Building,
  ArrowRight,
  BarChart3,
  Plus,
  Upload,
  Zap,
} from "lucide-react";
import {
  useUserProfile,
  useOnboardingSubmission,
  useCurrentUserCompany,
  useCurrentUserCampaigns,
  useBrands,
  useCurrentUserPhoneNumbers,
} from "@sms-hub/supabase/react";
import { Campaign, Brand } from "@sms-hub/types";
import { Link } from "react-router-dom";
import { OnboardingTracker } from "../../components/OnboardingTracker";
import { InfoGatheringModal } from "../../components/InfoGatheringModal";
import {
  VerificationRecommendation,
  VerificationRecommendationCompact,
} from "../../components/VerificationRecommendation";
import { SubscriptionStatus } from "../../components/SubscriptionStatus";
import { useCustomerByCompany } from "@sms-hub/supabase";

export function Dashboard() {
  const { hubConfig, currentHub } = useHub();
  const { data: userProfile, refetch: refetchProfile } = useUserProfile();
  const { data: company, refetch: refetchCompany } = useCurrentUserCompany();
  const { data: customer } = useCustomerByCompany(company?.id || null);
  const { data: onboardingSubmission } = useOnboardingSubmission(
    company?.id || "",
    hubConfig.hubNumber
  );
  const { data: campaigns } = useCurrentUserCampaigns();
  const { data: brands } = useBrands(company?.id || "");
  const { data: phoneNumbers } = useCurrentUserPhoneNumbers();
  const [showInfoGathering, setShowInfoGathering] = useState(false);

  // Check if profile is complete (has name and company)
  const isProfileComplete = !!(
    userProfile?.first_name &&
    userProfile?.last_name &&
    userProfile?.company_id
  );

  // Show info gathering modal if profile is incomplete
  useEffect(() => {
    if (userProfile && !isProfileComplete) {
      setShowInfoGathering(true);
    }
  }, [userProfile, isProfileComplete]);

  // Check if onboarding is complete (all 10 steps)
  const isOnboardingComplete = !!(
    userProfile?.id && // Auth
    customer?.stripe_subscription_id &&
    customer?.subscription_status === "active" && // Payment
    isProfileComplete && // Personal Info
    company?.legal_name &&
    company?.ein && // Business Info
    brands?.some((b: Brand) => b.status === "approved") && // Brand
    company?.privacy_policy_accepted_at && // Privacy
    campaigns?.some((c: Campaign) => c.status === "approved") && // Campaign
    company?.phone_number_provisioned && // gPhone
    company?.account_setup_completed_at && // Account Setup
    company?.platform_access_granted // Platform Access
  );

  // Mock data for demonstration
  const stats = {
    totalMessages: 15420,
    messagesThisMonth: 2340,
    totalCampaigns: campaigns?.length || 0,
    activeCampaigns:
      campaigns?.filter((c: Campaign) => c.status === "active").length || 0,
    totalContacts: 1247,
    activeContacts: 1189,
    deliveryRate: 98.5,
    openRate: 67.2,
  };

  const recentActivity = [
    {
      id: 1,
      type: "campaign_sent",
      title: "Campaign sent",
      description: "Welcome campaign sent to 1,234 contacts",
      time: "2 minutes ago",
      icon: Send,
      color: "text-blue-600",
    },
    {
      id: 2,
      type: "contact_added",
      title: "Contacts imported",
      description: "500 new contacts imported from CSV",
      time: "15 minutes ago",
      icon: Users,
      color: "text-green-600",
    },
    {
      id: 3,
      type: "campaign_created",
      title: "Campaign created",
      description: "New promotional campaign created",
      time: "1 hour ago",
      icon: Plus,
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      name: "Create Campaign",
      description: "Start a new messaging campaign",
      icon: Plus,
      href: "/campaigns",
      color: "text-blue-600",
    },
    {
      name: "Import Contacts",
      description: "Upload contacts from CSV or Excel",
      icon: Upload,
      href: "/campaigns",
      color: "text-green-600",
    },
    {
      name: "View Analytics",
      description: "Check campaign performance",
      icon: BarChart3,
      href: "/campaigns",
      color: "text-purple-600",
    },
    {
      name: "Manage Settings",
      description: "Update account preferences",
      icon: Settings,
      href: "/settings",
      color: "text-orange-600",
    },
  ];

  const handleInfoGatheringComplete = () => {
    setShowInfoGathering(false);
    // Refetch profile and company data
    refetchProfile();
    refetchCompany();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Info Gathering Modal */}
      {userProfile && (
        <InfoGatheringModal
          isOpen={showInfoGathering}
          onComplete={handleInfoGatheringComplete}
          userProfile={userProfile}
          signupType={
            (userProfile?.signup_type as "new_company" | "invited_user") ||
            "new_company"
          }
        />
      )}
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isOnboardingComplete
            ? "Dashboard"
            : "Welcome to " + currentHub + "!"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isOnboardingComplete
            ? `Welcome back${userProfile?.first_name ? ", " + userProfile.first_name : ""}! Here's what's happening with your ${currentHub} account.`
            : `Hi${userProfile?.first_name ? " " + userProfile.first_name : ""}, let's get your account set up and ready to send messages.`}
        </p>
      </div>

      {/* Verification Recommendation for Legacy Users */}
      {userProfile && !userProfile.verification_setup_completed && (
        <VerificationRecommendation
          userProfile={userProfile}
          onDismiss={() => refetchProfile()}
        />
      )}

      {/* Onboarding Tracker - Show prominently if not complete */}
      {!isOnboardingComplete && (
        <OnboardingTracker
          userProfile={userProfile}
          company={company}
          campaigns={campaigns}
          brands={brands}
        />
      )}

      {/* Statistics Cards - Show if onboarding is complete or partially complete */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-status-info rounded-lg">
              <MessageSquare className="w-6 h-6 text-status-info" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Messages Sent
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalMessages.toLocaleString()}
              </p>
              <p className="text-xs text-status-info mt-1">
                {stats.messagesThisMonth.toLocaleString()} this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-status-success rounded-lg">
              <Zap className="w-6 h-6 text-status-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Campaigns
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalCampaigns}
              </p>
              <p className="text-xs text-status-success mt-1">
                {stats.activeCampaigns} active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-status-warning rounded-lg">
              <Users className="w-6 h-6 text-status-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Contacts
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalContacts.toLocaleString()}
              </p>
              <p className="text-xs text-status-warning mt-1">
                {stats.activeContacts} active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-status-error rounded-lg">
              <TrendingUp className="w-6 h-6 text-status-error" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Delivery Rate
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.deliveryRate}%
              </p>
              <p className="text-xs text-status-error mt-1">
                {stats.openRate}% open rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Phone Numbers
              </p>
              <p className="text-2xl font-bold text-foreground">
                {phoneNumbers?.length || 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Active SMS numbers
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Brands
              </p>
              <p className="text-2xl font-bold text-foreground">
                {brands?.length || 0}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Registered brands
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Onboarding
              </p>
              <p className="text-2xl font-bold text-green-600">
                {onboardingSubmission ? "Complete" : "Pending"}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {onboardingSubmission ? "Account verified" : "Complete setup"}
          </p>
        </div>
      </div>

      {/* Subscription Status - Show for all users */}
      {company && <SubscriptionStatus />}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-foreground">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}
                  >
                    <activity.icon className="w-4 h-4" />
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
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-foreground">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-gray-100 ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {action.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Company Info */}
      {company && isOnboardingComplete && (
        <div className="bg-card rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Company Name
              </p>
              <p className="text-lg text-gray-900">{company.public_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Account Number
              </p>
              <p className="text-lg font-mono text-gray-900">
                {company.company_account_number}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Billing Email
              </p>
              <p className="text-lg text-gray-900">{company.billing_email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  company.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {company.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Show compact onboarding tracker at bottom if complete */}
      {isOnboardingComplete && (
        <>
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Onboarding complete! You have full access to all platform
                  features.
                </p>
              </div>
            </div>
          </div>

          {/* Compact verification recommendation for users who dismissed the main one */}
          {userProfile && (
            <VerificationRecommendationCompact userProfile={userProfile} />
          )}
        </>
      )}
    </div>
  );
}
