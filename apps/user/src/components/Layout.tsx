import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useHub, HubLogo, HubSwitcher, Button } from '@sms-hub/ui'
import { Badge, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@sms-hub/ui'
import { Home, MessageSquare, Settings, Zap, LogOut, User, Bell } from 'lucide-react'
import { useUserProfile } from '@sms-hub/supabase/react'
import { createSupabaseClient } from '@sms-hub/supabase'
import styled from 'styled-components'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Campaigns', href: '/campaigns', icon: Zap },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const MainContainer = styled.div`
  background: #ffffff;
  min-height: 100vh;
`;

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

export function Layout() {
  const { hubConfig, currentHub } = useHub()
  const { data: userProfile } = useUserProfile()
  const location = useLocation()
  const navigate = useNavigate()
  
  const supabase = createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }
  
  const initials = userProfile
    ? `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}`.toUpperCase() || 'U'
    : 'U'

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4 border-b">
              <HubLogo hubType={currentHub} variant="full" size="md" />
              {/* <HubSwitcher className="mt-2" /> */}
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
                  <div className="flex items-center gap-3">
                    <UserAvatar>{initials}</UserAvatar>
                    <div>
                      <p className="text-sm font-medium">
                        {userProfile.first_name} {userProfile.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userProfile.account_number || userProfile.email}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </SidebarContent>
        </Sidebar>

        <MainContainer className="flex-1">
          <HeaderContainer className="sticky top-0 z-40">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
                <UserSection>
                  <UserAvatar>{initials}</UserAvatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {userProfile?.first_name} {userProfile?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hubConfig.displayName}
                    </p>
                  </div>
                </UserSection>
              </div>
            </div>
          </HeaderContainer>

          <main className="flex-1">
            <Outlet />
          </main>
        </MainContainer>
      </div>
    </SidebarProvider>
  )
}