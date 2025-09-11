import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import { useHub, HubSwitcher, HubLogo } from "@sms-hub/ui";
import { useCompany } from "../../hooks/useCompany";
import { DevAdminBanner } from "../DevAdminBanner";
import {
  getUserDisplayName,
  getInitials,
  formatUserRole,
} from "../../utils/userUtils";
import {
  Building2,
  Users,
  Phone,
  Mic,
  BarChart3,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Globe,
  ArrowLeft,
  LayoutDashboard,
  Shield,
  UserPlus,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { isGlobalView, toggleGlobalView } = useGlobalView();
  const { currentHub } = useHub();
  const { company } = useCompany();

  // Check if user is super admin (currently unused but may be needed for future features)
  // const isSuperAdmin = user?.role === UserRole.SUPERADMIN;
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // Sidebar is always minimized now
  const isSidebarExpanded = false;

  // Admin navigation items
  const adminNavigationItems = [
    {
      name: "Accounts",
      href: "/admin/accounts",
      icon: Building2,
      description: "Manage customers and companies",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      description: "Global user management",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      name: "gPhone Numbers",
      href: "/admin/phone-numbers",
      icon: Phone,
      description: "Manage phone number inventory",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      name: "Verifications",
      href: "/admin/verifications",
      icon: Shield,
      description: "Manage user verifications",
      color: "text-cyan-500",
      bgColor: "bg-cyan-100",
    },
    {
      name: "Leads",
      href: "/admin/leads",
      icon: UserPlus,
      description: "Manage sales leads",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
    },
    {
      name: "Voice",
      href: "/admin/voice",
      icon: Mic,
      description: "Voice application management",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      name: "Statistics",
      href: "/admin/statistics",
      icon: BarChart3,
      description: "System-wide analytics",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
    },
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      description: "Admin overview dashboard",
      color: "text-pink-500",
      bgColor: "bg-pink-100",
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
                placeholder="Search accounts, users, phone numbers..."
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
                  {/* Hub Switcher - always show for admin users */}
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
        className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-900 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isSidebarExpanded ? "w-80" : "w-16"}`}
      >
        <div className="flex flex-col h-full">
          {/* Hub Logo - Links to Accounts */}
          <div className="flex items-center justify-center h-[73px] border-b border-slate-700">
            <Link
              to="/admin/accounts"
              className="flex items-center justify-center w-full group"
              title="Go to Accounts"
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
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full animate-pulse" />
                  )}

                  <div
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-orange-500/20 scale-110"
                        : "bg-slate-800 hover:bg-slate-700 hover:scale-105"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        active ? "text-orange-400" : "text-slate-400"
                      }`}
                    />
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Back to User View */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={() => navigate("/dashboard")}
              className="relative w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 group"
            >
              <div className="p-2 rounded-xl bg-slate-800 transition-all duration-200 hover:bg-orange-500/20 hover:scale-105">
                <ArrowLeft className="w-6 h-6 text-slate-300 group-hover:text-orange-400 transition-colors duration-200" />
              </div>

              {/* Tooltip on hover */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Back to User View
              </div>
            </button>
          </div>
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
