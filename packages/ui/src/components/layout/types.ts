import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  external?: boolean;
  className?: string;
  activeClassName?: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  account_number?: string;
  company_id?: string;
  role?: 'user' | 'admin' | 'superadmin';
  avatar_url?: string;
}

export interface SidebarConfig {
  showHubSwitcher?: boolean;
  bottomSection?: React.ReactNode;
  className?: string;
  logoSection?: React.ReactNode;
  settingsItem?: NavigationItem;
  adminPortalLink?: {
    show: boolean;
    href: string;
    label?: string;
  };
}

export interface HeaderConfig {
  title: string;
  titleIcon?: LucideIcon;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showNotifications?: boolean;
  showGlobalViewToggle?: boolean;
  isGlobalView?: boolean;
  onGlobalViewChange?: (isGlobal: boolean) => void;
  customActions?: React.ReactNode;
}

export interface DashboardLayoutConfig {
  sidebar: SidebarConfig;
  header: HeaderConfig;
  mainClassName?: string;
}