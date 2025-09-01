import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useHub, HubSwitcher, Button } from '@sms-hub/ui'
import { Home, MessageSquare, Settings, Zap, LogOut, Bell, Search, Shield } from 'lucide-react'
import { useUserProfile } from '@sms-hub/supabase/react'
import { createSupabaseClient } from '@sms-hub/supabase'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Campaigns', href: '/campaigns', icon: Zap },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
]

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

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200">
        <div className="flex h-full flex-col">
          {/* Hub Switcher in Logo area */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <HubSwitcher />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                    ${active 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-base">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom section - User Profile */}
          {userProfile && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile.first_name} {userProfile.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userProfile.account_number || userProfile.email}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              {/* User Portal Title */}
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">User Portal</h2>
                  <p className="text-xs text-gray-500">{hubConfig.displayName}</p>
                </div>
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
  )
}