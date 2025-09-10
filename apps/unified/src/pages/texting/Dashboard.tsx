// import { useState, useEffect } from "react";
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
  Smartphone,
  Clock,
} from "lucide-react";
import {
  useUserProfile,
  useCurrentUserCompany,
  useCurrentUserCampaigns,
  useBrands,
  useCurrentUserPhoneNumbers,
} from "@sms-hub/supabase/react";
import { Campaign } from "@sms-hub/types";
import { Link } from "react-router-dom";
import { SubscriptionStatus } from "../../components/SubscriptionStatus";
import { useCustomerByCompany } from "@sms-hub/supabase";

export function Dashboard() {
  const { } = useHub();
  const { data: userProfile } = useUserProfile();
  const { data: company } = useCurrentUserCompany();
  const { data: customer } = useCustomerByCompany(company?.id || null);
  const { data: campaigns } = useCurrentUserCampaigns();
  const { data: brands } = useBrands(company?.id || "");
  const { data: phoneNumbers } = useCurrentUserPhoneNumbers();

  // Check if user is properly onboarded (should be done before accessing texting app)
  const isOnboarded = !!(
    userProfile?.id &&
    customer?.stripe_subscription_id &&
    customer?.subscription_status === "active" &&
    company?.legal_name &&
    company?.phone_number_provisioned
  );

  // SMS-focused stats
  const stats = {
    totalMessages: 15420,
    messagesThisMonth: 2340,
    totalCampaigns: campaigns?.length || 0,
    activeCampaigns:
      campaigns?.filter((c: Campaign) => c.status === "active").length || 0,
    totalContacts: 1247,
    activeContacts: 1189,
    deliveryRate: 98.5,
    responseRate: 67.2,
    phoneNumbers: phoneNumbers?.length || 0,
    verifiedNumbers: phoneNumbers?.filter((p: any) => p.status === 'verified').length || 0,
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
      name: "Send SMS",
      description: "Send a quick message to contacts",
      icon: Send,
      href: "/messages",
      color: "text-blue-600",
    },
    {
      name: "Create Campaign",
      description: "Start a new messaging campaign",
      icon: Plus,
      href: "/campaigns",
      color: "text-green-600",
    },
    {
      name: "Import Contacts",
      description: "Upload contacts from CSV or Excel",
      icon: Upload,
      href: "/campaigns",
      color: "text-purple-600",
    },
    {
      name: "View Analytics",
      description: "Check campaign performance",
      icon: BarChart3,
      href: "/campaigns",
      color: "text-orange-600",
    },
    {
      name: "Manage Settings",
      description: "Update account preferences",
      icon: Settings,
      href: "/settings",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          SMS Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {`Welcome back${userProfile?.first_name ? ", " + userProfile.first_name : ""}! Manage your SMS campaigns and messaging.`}
        </p>
      </div>

      {/* Onboarding Check - Redirect if not onboarded */}
      {!isOnboarded && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Onboarding Required
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please complete your onboarding in the User app before accessing SMS features.
              </p>
              <a 
                href="http://localhost:3001/onboarding" 
                className="text-sm text-yellow-800 underline hover:text-yellow-900 mt-1 inline-block"
              >
                Complete Onboarding →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SMS Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Messages Sent
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalMessages.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {stats.messagesThisMonth.toLocaleString()} this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Campaigns
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalCampaigns}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {stats.activeCampaigns} active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Phone Numbers
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.phoneNumbers}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {stats.verifiedNumbers} verified
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Response Rate
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.responseRate}%
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {stats.deliveryRate}% delivered
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
                Complete
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Account verified
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
      {company && isOnboarded && (
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
      {isOnboarded && (
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

          {/* Verification complete */}
        </>
      )}
    </div>
  );
}
