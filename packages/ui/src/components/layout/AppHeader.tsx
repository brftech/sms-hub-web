import { Menu, Bell, Search, Shield, Globe, Building, RefreshCw } from 'lucide-react';
import type { HeaderConfig } from './types';

interface AppHeaderProps {
  onMenuClick: () => void;
  config: HeaderConfig;
  onRefreshCounts?: () => void | Promise<void>;
  isRefreshingCounts?: boolean;
}

export function AppHeader({
  onMenuClick,
  config,
  onRefreshCounts,
  isRefreshingCounts = false,
}: AppHeaderProps) {
  const Icon = config.titleIcon || Shield;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Portal Title */}
          <div className="flex items-center space-x-2">
            <Icon className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {config.title}
            </h2>
          </div>

          {/* Global View Toggle */}
          {config.showGlobalViewToggle && (
            <div className="flex items-center ml-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => config.onGlobalViewChange?.(true)}
                  title="View data from all hubs combined"
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    config.isGlobalView
                      ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Globe className="w-4 h-4 mr-1.5" />
                  Global
                </button>
                <button
                  onClick={() => config.onGlobalViewChange?.(false)}
                  title="View data from current hub only"
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    !config.isGlobalView
                      ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Building className="w-4 h-4 mr-1.5" />
                  Hub
                </button>
              </div>
              {onRefreshCounts && (
                <button
                  onClick={onRefreshCounts}
                  className={`ml-2 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors ${
                    isRefreshingCounts ? 'animate-spin' : ''
                  }`}
                  title="Refresh counts"
                  disabled={isRefreshingCounts}
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Custom Actions */}
          {config.customActions}
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          {config.showSearch !== false && (
            <div className="relative w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={config.searchPlaceholder || "Search..."}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Notifications */}
          {config.showNotifications !== false && (
            <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}