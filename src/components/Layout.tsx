import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  useHub, 
  HubLogo, 
  Button, 
  HubSwitcher,
  Badge,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@sms-hub/ui";
import { Home, MessageSquare, Settings, Zap, LogOut } from "lucide-react";
import { useUserProfile } from "@sms-hub/supabase";
// ... existing code ...

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Campaigns", href: "/campaigns", icon: Zap },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout() {
  const { hubConfig, currentHub } = useHub();
  const { data: userProfile } = useUserProfile();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4 border-b">
              <HubLogo hubType={currentHub} variant="main" size="md" />
              <HubSwitcher className="mt-2" />
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.href} className="flex items-center">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {userProfile && (
              <div className="mt-auto p-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {userProfile.first_name} {userProfile.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile.email}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {userProfile.role}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </SidebarContent>
        </Sidebar>

        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {hubConfig.name}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
