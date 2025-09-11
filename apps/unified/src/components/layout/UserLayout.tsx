import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import { useHub, HubSwitcher } from "@sms-hub/ui";
import { ThemeToggle } from "../ThemeToggle";
import { DevAdminBanner } from "../DevAdminBanner";
import { UserRole } from "../../types/roles";
import {
  getUserDisplayName,
  getInitials,
  formatUserRole,
} from "../../utils/userUtils";
import {
  MessageSquare,
  Megaphone,
  BarChart3,
  Users,
  Search,
  Bell,
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
  const { user, logout } = useAuth();
  const { isGlobalView, toggleGlobalView } = useGlobalView();
  const {} = useHub();

  // Check if user is admin
  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;
  const isSuperAdmin = user?.role === UserRole.SUPERADMIN;

  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
      name: "Company Users",
      href: "/admin/users",
      icon: Users,
      description: "Manage company users",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
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
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-y-0 left-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white text-gray-900 border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Gnymble</h1>
                <p className="text-sm text-gray-500">User Portal</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Global View Toggle */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={toggleGlobalView}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isGlobalView
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">
                {isGlobalView ? "Global View Active" : "Enable Global View"}
              </span>
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
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div
                    className={`p-2 rounded-lg ${active ? "bg-white/20" : item.bgColor}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${active ? "text-white" : item.color}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Admin Navigation (Bottom) - Only for admin users */}
          {isAdmin && (
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Administration
              </div>
              <nav className="space-y-1">
                {adminNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {getInitials(user?.first_name, user?.last_name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {formatUserRole(user?.role)}
                </p>
                {isSuperAdmin && (
                  <p className="text-xs text-orange-500 font-medium">
                    Super Administrator
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="mt-2 bg-white rounded-lg border border-gray-200 p-2 space-y-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Gnymble
                  {isGlobalView && (
                    <span className="ml-2 text-sm text-purple-600 font-normal">
                      (Global View)
                    </span>
                  )}
                  {location.pathname.startsWith("/admin") && (
                    <span className="ml-2 text-sm text-orange-600 font-normal">
                      (Superadmin View)
                    </span>
                  )}
                </h2>
              </div>
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

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Hub Switcher */}
              <HubSwitcher />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <DevAdminBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
