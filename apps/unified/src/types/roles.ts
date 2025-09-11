// User Roles and Permissions
export enum UserRole {
  GUEST = "guest", // Not authenticated
  USER = "user", // Authenticated, not onboarded
  ONBOARDED = "onboarded", // Authenticated, onboarded, can use texting
  ADMIN = "admin", // Staff member, can access admin features
  SUPERADMIN = "superadmin", // Full platform access
}

export interface UserPermissions {
  can_access_all_apps?: boolean;
  can_manage_users?: boolean;
  can_manage_companies?: boolean;
  can_manage_campaigns?: boolean;
  can_view_analytics?: boolean;
  can_manage_billing?: boolean;
  can_access_admin_panel?: boolean;
  can_manage_system_settings?: boolean;
  can_manage_system?: boolean;
  can_send_sms?: boolean;
  can_create_campaigns?: boolean;
  can_view_reports?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile_phone_number?: string;
  role: UserRole;
  signup_type: string;
  company_admin: boolean | null;
  verification_setup_completed: boolean | null;
  payment_status: string | null;
  onboarding_completed?: boolean;
  permissions?: UserPermissions;
  company_id?: string | null;
  hub_id?: number | null;
  created_at: string;
  updated_at: string;
  // Additional fields that might exist in the database
  account_number?: string;
  account_onboarding_step?: string | null;
  account_setup_completed_at?: string | null;
  company_admin_since?: string | null;
  subscription_status?: string | null;
  platform_onboarding_step?: string | null;
  verification_setup_completed_at?: string | null;
  last_login_method?: string | null;
  verification_id?: string | null;
  invited_by_user_id?: string | null;
  invitation_accepted_at?: string | null;
}

export interface RoutePermission {
  path: string;
  roles: UserRole[];
  description: string;
}

// Route access matrix
export const routePermissions: RoutePermission[] = [
  // User routes
  {
    path: "/onboarding",
    roles: [
      UserRole.USER,
      UserRole.ONBOARDED,
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
    ],
    description: "User onboarding process",
  },
  {
    path: "/account-details",
    roles: [
      UserRole.USER,
      UserRole.ONBOARDED,
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
    ],
    description: "Account management",
  },
  {
    path: "/dashboard",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Main dashboard",
  },
  {
    path: "/campaigns",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Campaign management",
  },
  {
    path: "/messages",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Message management",
  },
  {
    path: "/settings",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "User settings",
  },
  {
    path: "/payment-required",
    roles: [
      UserRole.USER,
      UserRole.ONBOARDED,
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
    ],
    description: "Payment required page",
  },
  {
    path: "/payment-success",
    roles: [
      UserRole.USER,
      UserRole.ONBOARDED,
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
    ],
    description: "Payment success page",
  },
  {
    path: "/verify",
    roles: [
      UserRole.USER,
      UserRole.ONBOARDED,
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
    ],
    description: "Verification page",
  },
  // Texting routes
  {
    path: "/texting",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "SMS texting features",
  },
  {
    path: "/texting/campaigns",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Texting campaign management",
  },
  {
    path: "/texting/messages",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Texting message management",
  },
  {
    path: "/texting/settings",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Texting settings",
  },
  // Admin routes
  {
    path: "/admin",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Admin panel",
  },
  {
    path: "/admin/users",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "User management",
  },
  {
    path: "/admin/companies",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Company management",
  },
  {
    path: "/admin/leads",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Lead management",
  },
  {
    path: "/admin/verifications",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Verification management",
  },
  {
    path: "/admin/testing",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Testing tools",
  },
  {
    path: "/admin/settings",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Admin settings",
  },
  {
    path: "/admin/analytics",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Analytics dashboard",
  },
  {
    path: "/admin/messages",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Admin message management",
  },
];

// Navigation items based on role
export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  roles: UserRole[];
  description: string;
}

export const navigationItems: NavigationItem[] = [
  // User navigation
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "📊",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Main dashboard",
  },
  {
    label: "Campaigns",
    path: "/campaigns",
    icon: "📈",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Campaign management",
  },
  {
    label: "Messages",
    path: "/messages",
    icon: "💬",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Message management",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: "⚙️",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "User settings",
  },
  // Texting navigation
  {
    label: "Texting",
    path: "/texting",
    icon: "📱",
    roles: [UserRole.ONBOARDED, UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "SMS campaigns and messaging",
  },
  // Admin navigation
  {
    label: "Admin",
    path: "/admin",
    icon: "🔧",
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    description: "Administrative functions",
  },
];
