import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useHub, HubSwitcher, Button } from "@sms-hub/ui";
import { ThemeToggle } from "./ThemeToggle";
import {
  Home,
  MessageSquare,
  Settings,
  Zap,
  LogOut,
  Bell,
  Search,
  Shield,
  ShieldCheck,
  Menu,
  X,
  CheckCircle,
} from "lucide-react";
import {
  useUserProfile,
  useCurrentUserCompany,
  useBrands,
  useCurrentUserCampaigns,
} from "@sms-hub/supabase/react";
import { createSupabaseClient } from "@sms-hub/supabase";
import { DevAdminBanner } from "./DevAdminBanner";
import { useDevAuth } from "../hooks/useDevAuth";
import { useIsAdmin, getAdminDashboardUrl } from "../hooks/useIsAdmin";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Campaigns", href: "/campaigns", icon: Zap },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout() {
  const { hubConfig } = useHub();
  const { data: userProfile } = useUserProfile();
  const { data: company } = useCurrentUserCompany();
  const { data: brands } = useBrands(company?.id || "");
  const { data: campaigns } = useCurrentUserCampaigns();
  const location = useLocation();
  const navigate = useNavigate();
  const devAuth = useDevAuth();
  const { isAdmin, isSuperAdmin } = useIsAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const supabase = createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  // Use dev profile if in superadmin mode
  const displayProfile = devAuth.isSuperadmin
    ? devAuth.devUserProfile
    : userProfile;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const initials = displayProfile
    ? `${displayProfile.first_name?.[0] || ""}${displayProfile.last_name?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";

  // Check if onboarding is complete based on OnboardingTracker logic
  const isProfileComplete = !!(
    userProfile?.first_name &&
    userProfile?.last_name &&
    userProfile?.company_id
  );

  const isBusinessInfoComplete = !!(
    company?.legal_name &&
    company?.legal_form &&
    company?.vertical_type &&
    company?.ein &&
    company?.address &&
    company?.city &&
    company?.state_region &&
    company?.postal_code
  );

  // Determine onboarding completion status (matching OnboardingTracker logic)
  const onboardingSteps = [
    !!userProfile?.id, // auth
    !!company?.stripe_subscription_id &&
      company?.subscription_status === "active", // payment
    isProfileComplete, // personal
    isBusinessInfoComplete, // business
    brands?.some((b) => b.status === "approved"), // brand
    !!company?.privacy_policy_accepted_at, // privacy
    campaigns?.some((c) => c.status === "approved"), // campaign
    !!company?.phone_number_provisioned, // gphone
    !!company?.account_setup_completed_at, // setup
    !!company?.platform_access_granted, // platform
  ];

  const completedSteps = onboardingSteps.filter(Boolean).length;
  const isOnboardingComplete = completedSteps === onboardingSteps.length;

  // Build dynamic navigation - include Onboarding tab only if not complete
  const dynamicNavigation = [
    ...(isOnboardingComplete
      ? []
      : [
          {
            name: "Onboarding",
            href: "/onboarding-progress",
            icon: CheckCircle,
          },
        ]),
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Campaigns", href: "/campaigns", icon: Zap },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dev Admin Banner */}
      <DevAdminBanner />

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="flex h-full flex-col">
          {/* Hub Switcher in Logo area */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <HubSwitcher />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {dynamicNavigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                    ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-foreground hover:bg-accent"
                    }
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 ${active ? "text-blue-600" : "text-muted-foreground"}`}
                  />
                  <span className="font-medium text-base">
                    {item.name}
                    {item.name === "Onboarding" && (
                      <span className="ml-2 text-xs text-orange-600 font-medium">
                        {completedSteps}/{onboardingSteps.length}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Admin Portal Link - Show for admin users */}
            {isAdmin && (
              <>
                <div className="my-4 mx-3 border-t border-border" />
                <a
                  href={getAdminDashboardUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-foreground hover:bg-accent group"
                >
                  <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-orange-500" />
                  <span className="font-medium text-base">Admin Portal</span>
                  <svg
                    className="h-4 w-4 text-muted-foreground ml-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                {isSuperAdmin && (
                  <div className="px-3 mt-1">
                    <span className="text-xs text-orange-600 font-medium">
                      SUPERADMIN ACCESS
                    </span>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Bottom section - User Profile */}
          {displayProfile && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {displayProfile.first_name} {displayProfile.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {displayProfile.account_number || displayProfile.email}
                    </p>
                    {isAdmin && (
                      <p className="text-xs text-orange-600 font-medium mt-0.5">
                        {isSuperAdmin ? "Superadmin" : "Admin"}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* User Portal Title */}
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-foreground">
                  User Portal
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative w-64 lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users, companies, messages..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
