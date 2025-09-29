import { Link, useLocation } from 'react-router-dom';
import { X, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { HubSwitcher } from '../hub-switcher';
import { Button } from '../button';
import { useHub } from '../../contexts/HubContext';
import type { NavigationItem, UserProfile, SidebarConfig } from './types';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  navigationCounts?: Record<string, number>;
  userProfile?: UserProfile | null;
  onLogout?: () => void | Promise<void>;
  config?: SidebarConfig;
}

export function AppSidebar({
  isOpen,
  onClose,
  navigationItems,
  navigationCounts = {},
  userProfile,
  onLogout,
  config = {},
}: AppSidebarProps) {
  const location = useLocation();
  const { currentHub } = useHub();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getUserInitials = () => {
    if (!userProfile) return 'U';
    const first = userProfile.first_name?.[0] || '';
    const last = userProfile.last_name?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getUserDisplayEmail = () => {
    return userProfile?.email || userProfile?.account_number || `user@${currentHub}.com`;
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${config.className || ''}
      `}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Hub Switcher area */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {config.logoSection || (
            config.showHubSwitcher !== false && <HubSwitcher />
          )}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-300 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            const count = navigationCounts[item.name.toLowerCase()];
            
            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={item.className || `
                    flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                    text-gray-700 hover:bg-gray-50 group
                  `}
                >
                  <item.icon className="h-5 w-5 text-gray-400 group-hover:text-orange-500" />
                  <span className="font-medium text-base flex-1">
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 text-xs text-orange-600 font-medium">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <svg className="h-4 w-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              );
            }
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={
                  item.activeClassName && active 
                    ? item.activeClassName 
                    : item.className || `
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                      ${active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `
                }
                onClick={onClose}
              >
                <item.icon
                  className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`}
                />
                <span className="font-medium text-base flex-1">
                  {item.name}
                  {count !== undefined && count > 0 && (
                    <span className="ml-1 text-gray-300">({count})</span>
                  )}
                  {item.badge && (
                    <span className={`ml-2 text-xs ${active ? 'text-blue-600' : 'text-orange-600'} font-medium`}>
                      {item.badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}

          {/* Admin Portal Link */}
          {config.adminPortalLink?.show && (
            <>
              <div className="my-4 mx-3 border-t border-gray-200" />
              <a
                href={config.adminPortalLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-50 group"
              >
                <ShieldCheck className="h-5 w-5 text-gray-400 group-hover:text-orange-500" />
                <span className="font-medium text-base">
                  {config.adminPortalLink.label || 'Admin Portal'}
                </span>
                <svg className="h-4 w-4 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              {userProfile?.role === 'superadmin' && (
                <div className="px-3 mt-1">
                  <span className="text-xs text-orange-600 font-medium">SUPERADMIN ACCESS</span>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Settings Link */}
        {config.settingsItem && (
          <div className="border-t border-gray-200 p-3">
            <Link
              to={config.settingsItem.href}
              className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                ${location.pathname === config.settingsItem.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              onClick={onClose}
            >
              <Settings className={`h-5 w-5 ${
                location.pathname === config.settingsItem.href ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className="font-medium">{config.settingsItem.name}</span>
            </Link>
          </div>
        )}

        {/* Custom bottom section or default user profile */}
        {config.bottomSection || (
          userProfile && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-8 w-8 rounded-full ${
                    userProfile.role === 'admin' || userProfile.role === 'superadmin'
                      ? 'bg-orange-600' 
                      : 'bg-blue-600'
                  } flex items-center justify-center`}>
                    <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile.first_name} {userProfile.last_name}
                    </p>
                    <p className="text-xs text-gray-300">
                      {getUserDisplayEmail()}
                    </p>
                    {userProfile.role && userProfile.role !== 'user' && (
                      <p className="text-xs text-orange-600 font-medium mt-0.5">
                        {userProfile.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                      </p>
                    )}
                  </div>
                </div>
                {onLogout && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </aside>
  );
}