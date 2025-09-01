import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useHub, Button, HubSwitcher } from "@sms-hub/ui";
import {
  Home,
  Users,
  Building,
  MessageSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Shield,
  UserPlus,
  Clock,
  Zap,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { useGlobalView } from "../contexts/GlobalViewContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Users", href: "/users", icon: Users },
  { name: "Companies", href: "/companies", icon: Building },
  { name: "Leads", href: "/leads", icon: UserPlus },
  { name: "Verifications", href: "/verifications", icon: Clock },
  { name: "Testing", href: "/testing", icon: Zap },
  // { name: 'Messages', href: '/messages', icon: MessageSquare },
  // { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout() {
  const { hubConfig, currentHub } = useHub();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isGlobalView, setIsGlobalView } = useGlobalView();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">
          {/* Hub Switcher in Logo area */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <HubSwitcher />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
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
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon
                    className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {item.name === "Messages" && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">
                    admin@{currentHub}.com
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/login")}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Admin Portal Title */}
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Admin Portal
                  </h2>
                  <p className="text-xs text-gray-500">
                    {hubConfig.displayName}
                  </p>
                </div>
              </div>

              {/* Global View Toggle */}
              <div className="flex items-center space-x-2 ml-6">
                <button
                  onClick={() => setIsGlobalView(!isGlobalView)}
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                    isGlobalView
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Globe className="w-4 h-4 mr-1.5" />
                  {isGlobalView ? "Global" : "Hub"}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative w-64 lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users, companies, messages..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100">
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
