import { Routes, Route, Navigate } from "react-router-dom";
import { HubProvider, ErrorBoundary } from "@sms-hub/ui";
import { unifiedEnvironment } from "./config/unifiedEnvironment";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";
import { hasAnyRole, useAuthContext } from "@sms-hub/auth";
import { ProtectedRoute } from "./components/auth/ProtectedRouteWrapper";
import { UserRole } from "./types/roles";
import { Landing } from "./pages/Landing";
import AuthCallback from "./pages/AuthCallback";
// import DevLogin from './pages/DevLogin'
import { GlobalViewProvider } from "./contexts/GlobalViewContext";
import { DynamicFavicon } from "./components/DynamicFavicon";

// Dashboard Router Component
const DashboardRouter = () => {
  // Show appropriate dashboard based on user role
  const { user } = useAuthContext();
  console.log("[DashboardRouter] User:", user);
  console.log("[DashboardRouter] User role:", user?.role);
  console.log("[DashboardRouter] User role type:", typeof user?.role);
  console.log("[DashboardRouter] User role string:", String(user?.role));
  console.log(
    "[DashboardRouter] User role uppercase:",
    String(user?.role).toUpperCase()
  );
  console.log(
    "[DashboardRouter] Is admin?",
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN
  );
  console.log(
    "[DashboardRouter] hasAnyRole ADMIN check:",
    hasAnyRole(user?.role, ["ADMIN"])
  );
  console.log(
    "[DashboardRouter] hasAnyRole SUPERADMIN check:",
    hasAnyRole(user?.role, ["SUPERADMIN"])
  );
  console.log(
    "[DashboardRouter] hasAnyRole ADMIN,SUPERADMIN check:",
    hasAnyRole(user?.role, ["ADMIN", "SUPERADMIN"])
  );

  if (hasAnyRole(user?.role, ["ADMIN", "SUPERADMIN"])) {
    console.log("[DashboardRouter] Rendering AdminLayout for Admin/Superadmin");
    // Admin and Superadmin users see admin dashboard
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    );
  } else {
    console.log("[DashboardRouter] Rendering UserLayout for regular user");
    // Regular users see conversations as the default user view
    return (
      <UserLayout>
        <UserConversations />
      </UserLayout>
    );
  }
};

// Import user pages
// import { Dashboard as UserDashboard } from "./pages/user/Dashboard";
import { Campaigns as UserCampaigns } from "./pages/user/Campaigns";
import { Messages as UserMessages } from "./pages/user/Messages";
import { Conversations as UserConversations } from "./pages/user/Conversations";
import { Broadcasts as UserBroadcasts } from "./pages/user/Broadcasts";
import { Persons as UserPersons } from "./pages/user/Persons";
import { Statistics as UserStatistics } from "./pages/user/Statistics";
import { Settings as UserSettings } from "./pages/user/Settings";
import { AccountDetails as UserAccountDetails } from "./pages/user/AccountDetails";
import { Onboarding as UserOnboarding } from "./pages/user/Onboarding";
import { OnboardingProgress as UserOnboardingProgress } from "./pages/user/OnboardingProgress";
import { PaymentRequired as UserPaymentRequired } from "./pages/user/PaymentRequired";
import { PaymentSuccess as UserPaymentSuccess } from "./pages/user/PaymentSuccess";
import { Verify as UserVerify } from "./pages/user/Verify";
import { SmsVerification } from "./pages/user/SmsVerification";

// Import texting pages
import { Dashboard as TextingDashboard } from "./pages/texting/Dashboard";
import { Campaigns as TextingCampaigns } from "./pages/texting/Campaigns";
import { Messages as TextingMessages } from "./pages/texting/Messages";
import { Settings as TextingSettings } from "./pages/texting/Settings";

// Import admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCompanies from "./pages/admin/Companies";
import AdminLeads from "./pages/admin/Leads";
import AdminSettings from "./pages/admin/Settings";
import { Analytics as AdminAnalytics } from "./pages/admin/Analytics";
import { Messages as AdminMessages } from "./pages/admin/Messages";
import { Accounts as AdminAccounts } from "./pages/admin/Accounts";
import { PhoneNumbers as AdminPhoneNumbers } from "./pages/admin/PhoneNumbers";
import { Voice as AdminVoice } from "./pages/admin/Voice";
import { AdminStatistics } from "./pages/admin/AdminStatistics";

// Unauthorized page
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">Access Denied</h3>
      <p className="mt-2 text-sm text-gray-500">
        You don't have permission to access this page.
      </p>
      <div className="mt-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

function App() {
  console.log("[App] Rendering App component");

  return (
    <ErrorBoundary>
      <HubProvider environment={unifiedEnvironment} defaultHub="percytech">
        <DynamicFavicon />
        <GlobalViewProvider>
          <Routes>
            {/* Public routes - accessible without authentication */}
            {/* Landing page for unauthenticated users */}
            <Route path="/" element={<Landing />} />

            {/* Auth callback route for handling redirects from web app */}
            <Route path="/auth-callback" element={<AuthCallback />} />

            {/* Redirect old signup route to landing */}
            <Route path="/signup" element={<Navigate to="/" replace />} />

            {/* Dashboard Route - show different dashboards based on role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.USER,
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* User View Route - forces UserLayout regardless of role */}
            <Route
              path="/user-view"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.USER,
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserLayout>
                    <UserConversations />
                  </UserLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/campaigns"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserCampaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserMessages />
                </ProtectedRoute>
              }
            />

            {/* New User View Routes */}
            <Route
              path="/conversations"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserLayout>
                    <UserConversations />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/broadcasts"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserLayout>
                    <UserBroadcasts />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/persons"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserLayout>
                    <UserPersons />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserLayout>
                    <UserStatistics />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserLayout>
                    <UserSettings />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/account-details"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserLayout>
                    <UserAccountDetails />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.USER,
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding-progress"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.USER,
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserOnboardingProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-required"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.USER,
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserPaymentRequired />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.USER,
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserPaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sms-verification"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.USER,
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <SmsVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.USER,
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <UserVerify />
                </ProtectedRoute>
              }
            />

            {/* Texting Routes - accessible to onboarded users and above */}
            <Route
              path="/texting"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <TextingDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/texting/campaigns"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <TextingCampaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/texting/messages"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <TextingMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/texting/settings"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    UserRole.ONBOARDED,
                    UserRole.ADMIN,
                    UserRole.SUPERADMIN,
                  ]}
                >
                  <TextingSettings />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes - accessible to admin users and above */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <Navigate to="/admin/dashboard" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/companies"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminCompanies />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminLeads />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* New Admin Routes */}
            <Route
              path="/admin/accounts"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminAccounts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/phone-numbers"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminPhoneNumbers />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/voice"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminVoice />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/statistics"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminStatistics />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminAnalytics />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute
                  requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
                >
                  <AdminLayout>
                    <AdminMessages />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </GlobalViewProvider>
      </HubProvider>
    </ErrorBoundary>
  );
}

export default App;
