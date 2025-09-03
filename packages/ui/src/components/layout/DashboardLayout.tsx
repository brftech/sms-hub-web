import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { DevAdminBanner } from '../DevAdminBanner';
import type { NavigationItem, UserProfile, DashboardLayoutConfig } from './types';

export interface DashboardLayoutProps {
  config: DashboardLayoutConfig;
  navigationItems: NavigationItem[];
  userProfile?: UserProfile | null;
  children?: React.ReactNode;
  showDevBanner?: boolean;
  onLogout?: () => void | Promise<void>;
  navigationCounts?: Record<string, number>;
  onRefreshCounts?: () => void | Promise<void>;
  className?: string;
}

export function DashboardLayout({
  config,
  navigationItems,
  userProfile,
  children,
  showDevBanner = false,
  onLogout,
  navigationCounts = {},
  onRefreshCounts,
  className = '',
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {showDevBanner && <DevAdminBanner environment={{ isDevelopment: () => true }} />}
      
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navigationItems={navigationItems}
        navigationCounts={navigationCounts}
        userProfile={userProfile}
        onLogout={onLogout}
        config={config.sidebar}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <AppHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          config={config.header}
          onRefreshCounts={onRefreshCounts}
        />

        {/* Page content */}
        <main className={config.mainClassName || 'p-6 overflow-y-auto h-[calc(100vh-4rem)]'}>
          <div className="max-w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}