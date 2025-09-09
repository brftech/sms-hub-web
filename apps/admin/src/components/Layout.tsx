import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useHub, Button, HubSwitcher, ThemeToggle } from "@sms-hub/ui";
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
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGlobalView } from "../contexts/GlobalViewContext";
import { DevAdminBanner } from "./DevAdminBanner";
import {
  navigationCountsService,
  NavigationCounts,
} from "../services/navigationCountsService";

// Export for use in Dashboard
export { navigationCountsService };

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Companies", href: "/companies", icon: Building },
  { name: "Users", href: "/users", icon: Users },
  { name: "Verifications", href: "/verifications", icon: Clock },
  { name: "Leads", href: "/leads", icon: UserPlus },
  { name: "Testing", href: "/testing", icon: Zap },
  // { name: 'Messages', href: '/messages', icon: MessageSquare },
  // { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Layout() {
  const { hubConfig, currentHub } = useHub();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isGlobalView, setIsGlobalView } = useGlobalView();
  const [counts, setCounts] = useState<NavigationCounts>({
    companies: 0,
    users: 0,
    verifications: 0,
    leads: 0,
  });

  const [isRefreshingCounts, setIsRefreshingCounts] = useState(false);

  const fetchCounts = async () => {
    const hubId =
      currentHub === "gnymble"
        ? 1
        : currentHub === "percymd"
          ? 2
          : currentHub === "percytext"
            ? 3
            : currentHub === "percytech"
              ? 0
              : 1;

    const newCounts = await navigationCountsService.getCounts(
      hubId,
      isGlobalView
    );
    setCounts(newCounts);
  };

  const handleRefreshCounts = async () => {
    setIsRefreshingCounts(true);
    await fetchCounts();
    setIsRefreshingCounts(false);
  };

  // Initial fetch of counts
  useEffect(() => {
    fetchCounts();
  }, []);

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
          fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300
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
              className="lg:hidden text-muted-foreground hover:text-foreground"
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
                        : "text-foreground hover:bg-accent"
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon
                    className={`h-5 w-5 ${active ? "text-blue-600" : "text-muted-foreground"}`}
                  />
                  <span className="font-medium text-base flex-1">
                    {item.name}
                    {item.name === "Companies" && counts.companies > 0 && (
                      <span className="ml-1 text-muted-foreground">
                        ({counts.companies})
                      </span>
                    )}
                    {item.name === "Users" && counts.users > 0 && (
                      <span className="ml-1 text-muted-foreground">
                        ({counts.users})
                      </span>
                    )}
                    {item.name === "Verifications" &&
                      counts.verifications > 0 && (
                        <span className="ml-1 text-muted-foreground">
                          ({counts.verifications})
                        </span>
                      )}
                    {item.name === "Leads" && counts.leads > 0 && (
                      <span className="ml-1 text-muted-foreground">
                        ({counts.leads})
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Client Websites Section */}
          <div className="border-t border-border p-3">
            <div className="mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Client Websites
              </h3>
            </div>
            <div className="space-y-1">
              <a
                href="http://localhost:3000/dons-burlingame"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>Don's Burlingame</span>
              </a>
              <a
                href="http://localhost:3000/michaels-tobacco"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>Michaels Tobacco</span>
              </a>
              <a
                href="http://localhost:3000/1st-round-ammo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>1st Round Ammo</span>
              </a>
            </div>
          </div>

          {/* Settings Link - positioned above user profile */}
          <div className="border-t border-gray-200 p-3">
            <Link
              to="/settings"
              className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                ${
                  location.pathname === "/settings"
                    ? "bg-blue-50 text-blue-600"
                    : "text-foreground hover:bg-accent"
                }
              `}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Settings
                className={`h-5 w-5 ${location.pathname === "/settings" ? "text-blue-600" : "text-muted-foreground"}`}
              />
              <span className="font-medium">Settings</span>
            </Link>
          </div>

          {/* Bottom section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Admin User
                  </p>
                  <p className="text-xs text-muted-foreground">
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
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Admin Portal Title */}
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-foreground">
                  Admin Portal
                </h2>
              </div>

              {/* Global View Toggle */}
              <div className="flex items-center space-x-2 ml-6">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    View:
                  </span>
                  <div className="flex bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setIsGlobalView(true)}
                      title="View data from all hubs combined"
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                        isGlobalView
                          ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                          : "text-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Globe className="w-4 h-4 mr-1.5" />
                      Global
                    </button>
                    <button
                      onClick={() => setIsGlobalView(false)}
                      title="View data from current hub only"
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                        !isGlobalView
                          ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                          : "text-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Building className="w-4 h-4 mr-1.5" />
                      Hub
                    </button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground max-w-xs">
                  {isGlobalView ? "All hubs combined" : "Current hub only"}
                </div>
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
        <main className="p-6 h-[calc(100vh-4rem)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
