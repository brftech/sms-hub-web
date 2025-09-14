import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@sms-hub/auth";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import { useHub, HubSwitcher, HubLogo } from "@sms-hub/ui";
import { useCompany } from "../../hooks/useCompany";
import { DevAdminBanner } from "../DevAdminBanner";
import { UserRole } from "../../types/roles";
import {
  hasAnyRole,
  getUserDisplayName,
  getInitials,
  formatUserRole,
} from "@sms-hub/auth";
import {
  MessageSquare,
  Megaphone,
  BarChart3,
  Users,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Globe,
  Shield,
} from "lucide-react";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { user, signOut: logout } = useAuthContext();
  const { isGlobalView, toggleGlobalView } = useGlobalView();
  const { currentHub } = useHub();
  const { company } = useCompany();

  // Check if user is admin
  const isAdmin = hasAnyRole(user?.role, [UserRole.ADMIN, UserRole.SUPERADMIN]);
  const isSuperAdmin = hasAnyRole(user?.role, [UserRole.SUPERADMIN]);

  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // Sidebar is always minimized now
  const isSidebarExpanded = false;

  // User navigation items
  const userNavigationItems = [
    {
      name: "Conversations",
      href: "/conversations",
      icon: MessageSquare,
      description: "View and manage conversations",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      name: "Broadcasts",
      href: "/broadcasts",
      icon: Megaphone,
      description: "Create and manage campaigns",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      name: "Persons",
      href: "/persons",
      icon: Users,
      description: "Manage your contacts",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      name: "Statistics",
      href: "/statistics",
      icon: BarChart3,
      description: "View analytics and reports",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  // Admin navigation items (for bottom nav)
  const adminNavigationItems = [
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Account and app settings",
      color: "text-gray-500",
      bgColor: "bg-gray-100",
    },
    {
      name: "Superadmin",
      href: "/admin",
      icon: Shield,
      description: "System administration",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 h-[73px] flex items-center fixed top-0 left-16 right-0 z-30 lg:left-16">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Company Name */}
            {company && (
              <div className="hidden lg:block">
                <h3 className="text-lg font-semibold text-gray-900">
                  {company.public_name}
                </h3>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations, contacts..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user?.first_name, user?.last_name)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {getUserDisplayName(user)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatUserRole(user?.role)}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName(user)}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                  {/* Hub Switcher - only show if user has appropriate permissions */}
                  {(isAdmin || isSuperAdmin) && (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Hub Selection
                        </p>
                        <HubSwitcher />
                      </div>
                      <button
                        onClick={() => {
                          toggleGlobalView();
                          setIsProfileOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 transition-colors ${
                          isGlobalView
                            ? "bg-purple-100 text-purple-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">
                          {isGlobalView ? "Global View (All Hubs)" : "Hub View"}
                        </span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Full height */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white text-gray-900 border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isSidebarExpanded ? "w-80" : "w-16"}`}
      >
        <div className="flex flex-col h-full">
          {/* Hub Logo - Links to Conversations */}
          <div className="flex items-center justify-center h-[73px] border-b border-gray-200">
            <Link
              to="/conversations"
              className="flex items-center justify-center w-full group"
              title="Go to Conversations"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <HubLogo
                  hubType={currentHub}
                  variant="icon"
                  size="sm"
                  className="w-full h-full"
                />
              </div>
            </Link>
          </div>

          {/* Mobile close button */}
          <div className="lg:hidden absolute top-4 right-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {userNavigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 relative"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                  )}

                  <div
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-orange-100 scale-110"
                        : "hover:bg-gray-100 hover:scale-105"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        active ? "text-orange-600" : item.color
                      }`}
                    />
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Admin Navigation (Bottom) - Only for admin users */}
          {isAdmin && (
            <div className="p-4 border-t border-gray-200">
              {isSidebarExpanded && (
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Administration
                </div>
              )}
              <nav className="space-y-1">
                {adminNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="group flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 relative"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {/* Active indicator bar */}
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                      )}

                      <div
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          active
                            ? "bg-orange-100 scale-110"
                            : "hover:bg-gray-100 hover:scale-105"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-colors duration-200 ${
                            active ? "text-orange-600" : item.color
                          }`}
                        />
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-16 pt-[73px]">
        {/* Page Content */}
        <main className="p-6">
          <DevAdminBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
