import { Outlet, Link, useLocation } from 'react-router-dom'
import { useHub, HubLogo, HubSwitcher, Button } from '@sms-hub/ui'
import { Badge, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@sms-hub/ui'
import { Home, Users, Building, MessageSquare, BarChart3, Settings, LogOut, Shield } from 'lucide-react'
import { useUserProfile } from '@sms-hub/supabase'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Companies', href: '/companies', icon: Building },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Layout() {
  const { hubConfig, currentHub } = useHub()
  const { data: userProfile } = useUserProfile()
  const location = useLocation()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 hub-text-primary" />
                <span className="font-bold hub-text-primary">Admin Portal</span>
              </div>
              <HubSwitcher className="mt-2" />
            </div>
            
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.href} className="flex items-center">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
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
                      {userProfile.account_number}
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
                <Badge variant="outline" className="hub-border-primary">
                  {hubConfig.displayName} Admin
                </Badge>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}