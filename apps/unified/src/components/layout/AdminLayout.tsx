import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSupabase } from "../../providers/SupabaseProvider";
import { useGlobalView } from "../../contexts/GlobalViewContext";
import { useHub, HubSwitcher } from "@sms-hub/ui";
import { ThemeToggle } from "../ThemeToggle";
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
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Filter,
  Plus,
  MoreVertical,
  Globe,
  User,
  Shield,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isSuperAdmin, logout } = useAuth();
  const { isGlobalView, toggleGlobalView } = useGlobalView();
  const { hubConfig } = useHub();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Gnymble</h1>
                <p className="text-sm text-slate-400">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Global View Toggle */}
          <div className="p-4 border-b border-slate-700">
            <button
              onClick={toggleGlobalView}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isGlobalView
                  ? "bg-orange-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">
                {isGlobalView ? "Global View Active" : "Enable Global View"}
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {adminNavigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
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

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {getInitials(user?.first_name, user?.last_name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {formatUserRole(user?.role)}
                </p>
                {isSuperAdmin && (
                  <p className="text-xs text-orange-400 font-medium">
                    Super Administrator
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="mt-2 bg-slate-800 rounded-lg p-2 space-y-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
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
                  Gnymble Admin
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
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search accounts, users, phone numbers..."
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
