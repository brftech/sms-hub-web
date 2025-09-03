import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Users, Building, UserPlus, Clock, Zap, Settings, Shield, 
  CheckCircle, MessageSquare, BarChart3, ArrowRight, Info
} from 'lucide-react';
import { 
  DashboardLayout, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge,
  Alert,
  AlertDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@sms-hub/ui';
import type { NavigationItem, DashboardLayoutConfig } from '@sms-hub/ui';

export function LayoutDemo() {
  const navigate = useNavigate();
  const [isGlobalView, setIsGlobalView] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<'admin' | 'user'>('user');

  // Admin navigation items
  const adminNavigationItems: NavigationItem[] = [
    { name: "Dashboard", href: "#dashboard", icon: Home },
    { name: "Companies", href: "#companies", icon: Building },
    { name: "Users", href: "#users", icon: Users },
    { name: "Verifications", href: "#verifications", icon: Clock },
    { name: "Leads", href: "#leads", icon: UserPlus },
    { name: "Testing", href: "#testing", icon: Zap },
  ];

  // User navigation items  
  const userNavigationItems: NavigationItem[] = [
    { 
      name: "Onboarding", 
      href: "#onboarding", 
      icon: CheckCircle,
      badge: "7/10"
    },
    { name: "Dashboard", href: "#dashboard", icon: Home },
    { name: "Campaigns", href: "#campaigns", icon: Zap },
    { name: "Messages", href: "#messages", icon: MessageSquare },
    { name: "Settings", href: "#settings", icon: Settings },
  ];

  // Navigation counts for admin
  const navigationCounts = {
    companies: 42,
    users: 156,
    verifications: 23,
    leads: 89
  };

  // Admin layout configuration
  const adminLayoutConfig: DashboardLayoutConfig = {
    sidebar: {
      showHubSwitcher: true,
      settingsItem: { name: 'Settings', href: '#settings', icon: Settings }
    },
    header: {
      title: 'Admin Portal',
      titleIcon: Shield,
      showSearch: true,
      searchPlaceholder: 'Search users, companies, messages...',
      showNotifications: true,
      showGlobalViewToggle: true,
      isGlobalView,
      onGlobalViewChange: setIsGlobalView,
    },
    mainClassName: 'p-6 overflow-y-auto h-[calc(100vh-4rem)]'
  };

  // User layout configuration
  const userLayoutConfig: DashboardLayoutConfig = {
    sidebar: {
      showHubSwitcher: true,
      adminPortalLink: {
        show: true,
        href: '#admin',
        label: 'Admin Portal'
      }
    },
    header: {
      title: 'User Portal',
      titleIcon: Shield,
      showSearch: true,
      searchPlaceholder: 'Search campaigns, messages...',
      showNotifications: true,
      showGlobalViewToggle: false,
    },
    mainClassName: 'p-6 overflow-y-auto h-[calc(100vh-4rem)]'
  };

  const mockUserProfile = {
    id: '1',
    email: 'demo@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: selectedLayout === 'admin' ? 'admin' as const : 'user' as const
  };

  const currentConfig = selectedLayout === 'admin' ? adminLayoutConfig : userLayoutConfig;
  const currentNavItems = selectedLayout === 'admin' ? adminNavigationItems : userNavigationItems;
  const currentCounts = selectedLayout === 'admin' ? navigationCounts : {};

  return (
    <DashboardLayout
      config={currentConfig}
      navigationItems={currentNavItems}
      userProfile={mockUserProfile}
      showDevBanner={true}
      onLogout={() => alert('Logout clicked')}
      navigationCounts={currentCounts}
      onRefreshCounts={() => console.log('Refresh counts')}
    >
      <div className="w-full">
        {/* Exit button */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Exit Demo
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Layout Switcher */}
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Shared Layout Component Demo
            </CardTitle>
            <CardDescription>
              This demonstrates the new unified layout components that can be used across all apps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                variant={selectedLayout === 'user' ? 'default' : 'outline'}
                onClick={() => setSelectedLayout('user')}
              >
                User Layout
              </Button>
              <Button
                variant={selectedLayout === 'admin' ? 'default' : 'outline'}
                onClick={() => setSelectedLayout('admin')}
              >
                Admin Layout
              </Button>
            </div>
            <Alert>
              <AlertDescription>
                Currently viewing: <strong>{selectedLayout === 'admin' ? 'Admin Portal' : 'User Portal'}</strong> layout.
                {selectedLayout === 'admin' && ' Notice the global/hub view toggle and navigation counts.'}
                {selectedLayout === 'user' && ' Notice the onboarding tab and admin portal link.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

          {/* Feature Showcase */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sidebar Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Hub Switcher</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">User Profile</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Navigation Counts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Mobile Responsive</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Header Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Search Bar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Portal Branding</span>
              </div>
              {selectedLayout === 'admin' && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Global View Toggle</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shared Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">TypeScript Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Consistent UX</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Easy Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Code Reusability</span>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Code Example */}
          <Card>
          <CardHeader>
            <CardTitle>Implementation Example</CardTitle>
            <CardDescription>
              How to use the shared DashboardLayout component in your app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="config" className="w-full">
              <TabsList>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="types">Types</TabsTrigger>
              </TabsList>
              <TabsContent value="config" className="mt-4">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`const layoutConfig: DashboardLayoutConfig = {
  sidebar: {
    showHubSwitcher: true,
    settingsItem: { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings 
    },
    adminPortalLink: {
      show: isAdmin,
      href: '/admin',
      label: 'Admin Portal'
    }
  },
  header: {
    title: '${selectedLayout === 'admin' ? 'Admin' : 'User'} Portal',
    titleIcon: Shield,
    showSearch: true,
    searchPlaceholder: 'Search...',
    showNotifications: true,
    showGlobalViewToggle: ${selectedLayout === 'admin'},
  }
};`}</code>
                </pre>
              </TabsContent>
              <TabsContent value="usage" className="mt-4">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import { DashboardLayout } from '@sms-hub/ui';

function App() {
  return (
    <DashboardLayout
      config={layoutConfig}
      navigationItems={navigationItems}
      userProfile={userProfile}
      showDevBanner={isDevelopment}
      onLogout={handleLogout}
      navigationCounts={counts}
    >
      <Routes>
        {/* Your app routes */}
      </Routes>
    </DashboardLayout>
  );
}`}</code>
                </pre>
              </TabsContent>
              <TabsContent value="types" className="mt-4">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  external?: boolean;
}

interface UserProfile {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'user' | 'admin' | 'superadmin';
}`}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

          {/* Interactive Elements */}
          <Card>
          <CardHeader>
            <CardTitle>Try It Out</CardTitle>
            <CardDescription>
              Interact with the layout components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Click the hamburger menu on mobile</Badge>
              <Badge>Switch between Admin and User layouts above</Badge>
              <Badge>Try the hub switcher in the sidebar</Badge>
              {selectedLayout === 'admin' && (
                <Badge>Toggle between Global and Hub views</Badge>
              )}
              <Badge>Check the logout button in user profile</Badge>
            </div>
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> This is a demo page. Navigation links and some features are mocked for demonstration purposes.
                The actual implementation in your apps will connect to real data and routing.
              </AlertDescription>
            </Alert>
          </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}