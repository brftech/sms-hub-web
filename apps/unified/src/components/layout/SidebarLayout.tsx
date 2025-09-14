import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@sms-hub/auth";
import { useSupabase } from "../../providers/SupabaseProvider";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import { useHub, HubSwitcher } from "@sms-hub/ui";
import { ThemeToggle } from "../ThemeToggle";
import { DevAdminBanner } from "../DevAdminBanner";
import { getUserDisplayName } from "@sms-hub/auth";
import {
  getRoleDisplayName,
  getRoleColor,
  hasAnyRole,
} from "../../utils/roleUtils";
import { UserRole } from "../../types/roles";
import {
  Users,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Zap,
  Globe,
  CheckCircle,
  BarChart3,
  Shield,
} from "lucide-react";

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuthContext();
  const isAuthenticated = !!user;
  const { hubConfig } = useHub();
  const { isGlobalView, setIsGlobalView } = useGlobalView();
  const supabase = useSupabase();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine user's primary role and permissions
  const isAdmin =
    user && hasAnyRole(user as any, [UserRole.ADMIN, UserRole.SUPERADMIN]);
  const isSuperAdmin = user?.role === UserRole.SUPERADMIN;
  const isOnboarded =
    user &&
    hasAnyRole(user as any, [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN]);

  // Get display information
  const userDisplayName = user ? getUserDisplayName(user) : "";
  const roleDisplayName = user?.role ? getRoleDisplayName(user.role as UserRole) : "";
  const roleColor = user?.role ? getRoleColor(user.role as UserRole) : "gray";
  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";

  // Build navigation items based on role - matching Gnymble production structure
  const navigationItems = React.useMemo(() => {
    if (!user) return [];

    const items = [];

    // Main navigation items for all users (matching Gnymble production)
    items.push({
      name: "Conversations",
      href: "/conversations",
      icon: MessageSquare,
      showCount: false,
    });

    items.push({
      name: "Broadcasts",
      href: "/broadcasts",
      icon: Zap,
      showCount: false,
    });

    items.push({
      name: "Statistics",
      href: "/statistics",
      icon: BarChart3,
      showCount: false,
    });

    items.push({
      name: "Persons",
      href: "/persons",
      icon: Users,
      showCount: false,
    });

    // Check if user is still onboarding
    const onboardingComplete = user.onboarding_completed || false;
    if (!onboardingComplete) {
      items.push({
        name: "Onboarding",
        href: "/onboarding-progress",
        icon: CheckCircle,
        showCount: false,
        showProgress: true,
      });
    }

    return items;
  }, [user, isOnboarded]);

  // Fetch navigation counts for admin users
  useEffect(() => {
    if (!isAdmin) return;

    // TODO: Implement navigation counts functionality
  }, [isAdmin, hubConfig, isGlobalView]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("dev_bypass");
    window.location.href = "http://localhost:3000/login";
  };

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard")
      return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path))
      return true;
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Dev Admin Banner */}
      {isSuperAdmin && <DevAdminBanner />}
      
      <div className="flex-1 flex overflow-hidden">

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

          {/* Global View Toggle for SuperAdmin */}
          {isSuperAdmin && (
            <div className="px-4 py-3 border-b border-border">
              <button
                onClick={() => setIsGlobalView(!isGlobalView)}
                className={`
                  flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-colors
                  ${
                    isGlobalView
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                `}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {isGlobalView ? "Global View Active" : "Enable Global View"}
                </span>
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              const count = 0; // Counts removed for simplified navigation

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      active
                        ? isAdmin
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-foreground hover:bg-accent hover:translate-x-1"
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? "" : "text-muted-foreground"}`}
                  />
                  <span className="font-medium text-base flex-1">
                    {item.name}
                    {item.showCount && count > 0 && (
                      <span
                        className={`ml-2 text-sm ${active ? "text-white/80" : "text-muted-foreground"}`}
                      >
                        ({count})
                      </span>
                    )}
                    {item.showProgress && (
                      <span className="ml-2 text-xs text-orange-600 font-medium">
                        In Progress
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Bottom navigation for admin users - matching Gnymble production structure */}
            {isAdmin && (
              <>
                <div className="my-4 mx-3 border-t border-border" />

                {/* Settings (gear) - for users with inbox access */}
                <Link
                  to="/settings"
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive("/settings")
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-foreground hover:bg-accent hover:translate-x-1"
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium text-base">Settings</span>
                </Link>

                {/* Admin Dashboard (shield) - for admin users */}
                <Link
                  to="/admin/dashboard"
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive("/admin/dashboard")
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-foreground hover:bg-accent hover:translate-x-1"
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Shield className="h-5 w-5" />
                  <span className="font-medium text-base">Admin Dashboard</span>
                </Link>

                {/* Company Users (person) - for users with full company admin access */}
                <Link
                  to="/admin/users"
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive("/admin/users")
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-foreground hover:bg-accent hover:translate-x-1"
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium text-base">Company Users</span>
                </Link>

                {/* Superadmin (globe) - for superadmin view */}
                {isSuperAdmin && (
                  <Link
                    to="/admin"
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${
                        isActive("/admin")
                          ? "bg-orange-500 text-white shadow-md"
                          : "text-foreground hover:bg-accent hover:translate-x-1"
                      }
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Globe className="h-5 w-5" />
                    <span className="font-medium text-base">Superadmin</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Bottom section - User Profile */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isAdmin ? "bg-orange-600" : "bg-blue-600"
                  }`}
                >
                  <span className="text-sm font-medium text-white">
                    {initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {userDisplayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.account_number || user.email}
                  </p>
                  {isAdmin && (
                    <p
                      className={`text-xs font-medium mt-0.5 text-${roleColor}-600`}
                    >
                      {roleDisplayName}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 bg-card border-b border-border backdrop-blur-sm bg-opacity-95">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Page Title with appropriate icon */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  Gnymble
                  {location.pathname.startsWith("/admin") && (
                    <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-medium">
                      SUPERADMIN
                    </span>
                  )}
                  {isGlobalView && (
                    <span className="ml-2 text-sm text-purple-600 font-normal">
                      (Global View)
                    </span>
                  )}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="relative hidden sm:block"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isAdmin
                      ? "Search users, companies, messages..."
                      : "Search campaigns, messages..."
                  }
                  className="w-64 lg:w-96 pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </form>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
