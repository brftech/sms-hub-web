import { Routes, Route, Navigate } from "react-router-dom";
import { HubProvider, ErrorBoundary } from "@sms-hub/ui";
import { unifiedEnvironment } from "./config/unifiedEnvironment";
import { environmentConfig } from "./config/environment";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";
import { hasAnyRole, useAuthContext } from "@sms-hub/auth";
import { ProtectedRoute } from "./components/auth/ProtectedRouteWrapper";
import { UserRole } from "./types/roles";
import AuthCallback from "./pages/AuthCallback";
import { lazy, Suspense } from "react";
// import DevLogin from './pages/DevLogin'
import { GlobalViewProvider } from "./contexts/GlobalViewContext";
import { DynamicFavicon } from "./components/DynamicFavicon";

// Dashboard Router Component
const DashboardRouter = () => {
  // Show appropriate dashboard based on user role
  const { user } = useAuthContext();
  console.log("[DashboardRouter] User:", user);
  console.log("[DashboardRouter] User role:", user?.role);

  // Note: Payment status should be checked from customer records, not user profile
  // For now, we'll skip this check and handle it in the components

  // Check if user needs onboarding
  if (user && !user.onboarding_completed) {
    console.log("[DashboardRouter] User needs onboarding");
    return <Navigate to="/onboarding" replace />;
  }

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

// Lazy load user pages for better performance
const UserCampaigns = lazy(() =>
  import("./pages/user/Campaigns").then((m) => ({ default: m.Campaigns }))
);
const UserMessages = lazy(() =>
  import("./pages/user/Messages").then((m) => ({ default: m.Messages }))
);
const UserConversations = lazy(() =>
  import("./pages/user/Conversations").then((m) => ({
    default: m.Conversations,
  }))
);
const UserBroadcasts = lazy(() =>
  import("./pages/user/Broadcasts").then((m) => ({ default: m.Broadcasts }))
);
const UserPersons = lazy(() =>
  import("./pages/user/Persons").then((m) => ({ default: m.Persons }))
);
const UserStatistics = lazy(() =>
  import("./pages/user/Statistics").then((m) => ({ default: m.Statistics }))
);
const UserSettings = lazy(() =>
  import("./pages/user/Settings").then((m) => ({ default: m.Settings }))
);
const UserAccountDetails = lazy(() =>
  import("./pages/user/AccountDetails").then((m) => ({
    default: m.AccountDetails,
  }))
);
const UserOnboarding = lazy(() =>
  import("./pages/user/Onboarding").then((m) => ({ default: m.Onboarding }))
);
const UserOnboardingProgress = lazy(() =>
  import("./pages/user/OnboardingProgress").then((m) => ({
    default: m.OnboardingProgress,
  }))
);
const UserPaymentRequired = lazy(() =>
  import("./pages/user/PaymentRequired").then((m) => ({
    default: m.PaymentRequired,
  }))
);
const UserPaymentSuccess = lazy(() =>
  import("./pages/user/PaymentSuccess").then((m) => ({
    default: m.PaymentSuccess,
  }))
);
const UserVerify = lazy(() =>
  import("./pages/user/Verify").then((m) => ({ default: m.Verify }))
);
const SmsVerification = lazy(() =>
  import("./pages/user/SmsVerification").then((m) => ({
    default: m.SmsVerification,
  }))
);

// Lazy load texting pages
const TextingDashboard = lazy(() =>
  import("./pages/texting/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const TextingCampaigns = lazy(() =>
  import("./pages/texting/Campaigns").then((m) => ({ default: m.Campaigns }))
);
const TextingMessages = lazy(() =>
  import("./pages/texting/Messages").then((m) => ({ default: m.Messages }))
);
const TextingSettings = lazy(() =>
  import("./pages/texting/Settings").then((m) => ({ default: m.Settings }))
);

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminCompanies = lazy(() => import("./pages/admin/Companies"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminAnalytics = lazy(() =>
  import("./pages/admin/Analytics").then((m) => ({ default: m.Analytics }))
);
const AdminMessages = lazy(() =>
  import("./pages/admin/Messages").then((m) => ({ default: m.Messages }))
);
const AdminAccounts = lazy(() =>
  import("./pages/admin/Accounts").then((m) => ({ default: m.Accounts }))
);
const AdminPhoneNumbers = lazy(() =>
  import("./pages/admin/PhoneNumbers").then((m) => ({
    default: m.PhoneNumbers,
  }))
);
const AdminVoice = lazy(() =>
  import("./pages/admin/Voice").then((m) => ({ default: m.Voice }))
);
const AdminStatistics = lazy(() =>
  import("./pages/admin/AdminStatistics").then((m) => ({
    default: m.AdminStatistics,
  }))
);

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes - accessible without authentication */}
              {/* Root redirect - redirect to web app for login */}
              <Route
                path="/"
                element={<Navigate to={environmentConfig.webAppUrl} replace />}
              />

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
          </Suspense>
        </GlobalViewProvider>
      </HubProvider>
    </ErrorBoundary>
  );
}

export default App;
