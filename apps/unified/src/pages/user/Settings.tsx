import { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui";
import {
  User,
  Building,
  Phone,
  CreditCard,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useUserProfile,
  useCurrentUserCompany,
  useCurrentUserPhoneNumbers,
  // useBrands,
  // useCurrentUserCampaigns,
} from "@sms-hub/supabase/react";
import { PhoneNumber } from "@sms-hub/types";

type SettingsTab =
  | "profile"
  | "company"
  | "billing"
  | "notifications"
  | "security"
  | "phone-numbers";

export function Settings() {
  const { currentHub } = useHub();
  const { data: userProfile } = useUserProfile();
  const { data: company } = useCurrentUserCompany();
  const { data: phoneNumbers = [] } = useCurrentUserPhoneNumbers();
  // const { data: brands = [] } = useBrands(company?.id || "");
  // const { data: campaigns = [] } = useCurrentUserCampaigns();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showPassword, setShowPassword] = useState(false);

  // Form state for profile tab
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  // Form state for company tab
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    billingEmail: "",
  });

  // Form state for security tab
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Update form state when user profile data loads
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.first_name || "",
        lastName: userProfile.last_name || "",
        email: userProfile.email || "",
        phoneNumber: userProfile.mobile_phone_number || "",
      });
    }
  }, [userProfile]);

  // Update company form state when company data loads
  useEffect(() => {
    if (company) {
      setCompanyForm({
        companyName: company.public_name || "",
        billingEmail: company.billing_email || "",
      });
    }
  }, [company]);

  // Clear password fields when security tab is accessed
  useEffect(() => {
    if (activeTab === "security") {
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
      });
      setShowPassword(false);
    }
  }, [activeTab]);

  const navigation = [
    {
      id: "profile",
      name: "Profile",
      icon: User,
      description: "Personal information",
    },
    {
      id: "company",
      name: "Company",
      icon: Building,
      description: "Company details",
    },
    {
      id: "billing",
      name: "Billing",
      icon: CreditCard,
      description: "Payment methods",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      description: "Alert preferences",
    },
    {
      id: "security",
      name: "Security",
      icon: Shield,
      description: "Password & 2FA",
    },
    {
      id: "phone-numbers",
      name: "Phone Numbers",
      icon: Phone,
      description: "SMS numbers",
    },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">
          Personal Information
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal details and contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profileForm.firstName}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profileForm.lastName}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={profileForm.phoneNumber}
            onChange={(e) =>
              setProfileForm((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderCompanyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">
          Company Information
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your company details and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={companyForm.companyName}
            onChange={(e) =>
              setCompanyForm((prev) => ({
                ...prev,
                companyName: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <input
            type="text"
            value={company?.company_account_number || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Email
          </label>
          <input
            type="email"
            value={companyForm.billingEmail}
            onChange={(e) =>
              setCompanyForm((prev) => ({
                ...prev,
                billingEmail: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              company?.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {company?.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">
          Billing Information
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your payment methods and billing preferences.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Current Plan
            </h4>
            <p className="text-sm text-gray-500">Professional Plan</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  •••• •••• •••• 4242
                </p>
                <p className="text-xs text-gray-500">Expires 12/25</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Address
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter billing address..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Save className="w-4 h-4 mr-2" />
          Update Billing
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">
          Notification Preferences
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you want to be notified about important events.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Campaign Notifications
            </h4>
            <p className="text-sm text-gray-500">
              Get notified when campaigns are sent or completed
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Billing Alerts
            </h4>
            <p className="text-sm text-gray-500">
              Receive notifications about billing and payments
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-foreground">
              Security Alerts
            </h4>
            <p className="text-sm text-gray-500">
              Get notified about account security events
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">
          Security Settings
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your password and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={securityForm.currentPassword}
              onChange={(e) =>
                setSecurityForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={securityForm.newPassword}
            onChange={(e) =>
              setSecurityForm((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your new password"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Save className="w-4 h-4 mr-2" />
          Update Password
        </button>
      </div>
    </div>
  );

  const renderPhoneNumbersTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">Phone Numbers</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your SMS phone numbers and their settings.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">
            Active Phone Numbers
          </h4>
        </div>

        <div className="divide-y divide-gray-200">
          {phoneNumbers.length > 0 ? (
            phoneNumbers.map((phone: PhoneNumber) => (
              <div key={phone.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {phone.phone_number}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {phone.id.slice(0, 8)}...
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <Phone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No phone numbers
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding your first phone number.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Phone className="w-4 h-4 mr-2" />
          Add Phone Number
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "company":
        return renderCompanyTab();
      case "billing":
        return renderBillingTab();
      case "notifications":
        return renderNotificationsTab();
      case "security":
        return renderSecurityTab();
      case "phone-numbers":
        return renderPhoneNumbersTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences in {currentHub} hub
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as SettingsTab)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <div>{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
