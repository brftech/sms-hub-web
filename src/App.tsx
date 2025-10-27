import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Toaster,
  SonnerToaster,
  TooltipProvider,
  HubProvider,
  ErrorBoundary,
  PageTransition,
  useHub,
} from "@sms-hub/ui/marketing";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useScrollToTop } from "@sms-hub/utils";
import { webEnvironment, detectHubFromHostname } from "./config/environment";
import { EnvironmentDebug } from "./components/EnvironmentDebug";
import AppFloatingComponents from "./components/AppFloatingComponents";
import { performanceMonitor } from "./services/performanceMonitoringService";
import { getHubColors } from "@sms-hub/hub-logic";
import {
  HOME_PATH,
  HOME_ALIAS_PATH,
  CONTACT_PATH,
  FAQ_PATH,
  TERMS_PATH,
  PRIVACY_PATH,
  CLIENT_PAGE_STATIC_PATH,
  CLIENTS_PATH,
  CLIENTS_PRIVACY_PATH,
  CLIENTS_TERMS_PATH,
  ABOUT_PATH,
  PRICING_PATH,
  DEMO_PATH,
  ADMIN_PATH,
  ADMIN_PERFORMANCE_PATH,
  TEST_AUTH_PATH,
  DEBUG_AUTH_PATH,
  PAYMENT_SUCCESS_PATH,
  CHECK_EMAIL_PATH,
  VERIFY_OTP_PATH,
  VERIFY_PATH,
  NOT_FOUND_PATH,
} from "./utils/routes";

// Import critical pages directly (frequently accessed)
import Home from "./pages/Home";
import Contact from "./pages/Contact";

// Lazy load larger pages for better performance
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Demo = lazy(() => import("./pages/Demo"));

// Lazy load auth pages (not frequently accessed)
const CheckEmail = lazy(() =>
  import("./pages/CheckEmail").then((m) => ({ default: m.CheckEmail }))
);
const VerifyAuth = lazy(() =>
  import("./pages/VerifyAuth").then((m) => ({ default: m.VerifyAuth }))
);
const TestAuth = lazy(() => import("./pages/TestAuth").then((m) => ({ default: m.TestAuth })));
const DebugAuth = lazy(() => import("./pages/DebugAuth").then((m) => ({ default: m.DebugAuth })));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));

// Lazy load client pages (less frequently accessed)
const ClientPage = lazy(() => import("./pages/clients/ClientPage"));
const ClientPrivacy = lazy(() => import("./pages/clients/ClientPrivacy"));
const ClientTerms = lazy(() => import("./pages/clients/ClientTerms"));

// Lazy load admin dashboard
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminPerformanceDashboard = lazy(() => import("./pages/AdminPerformanceDashboard"));

const queryClient = new QueryClient();

// Enhanced loading component for better UX
const PageLoader = () => {
  const { currentHub } = useHub();
  const colors = getHubColors(currentHub);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style={{ borderBottomColor: colors.primary }}
        ></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  );
};

// Component to set data-hub attribute on body
const HubThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentHub } = useHub();

  useEffect(() => {
    document.body.setAttribute("data-hub", currentHub);
    return () => {
      document.body.removeAttribute("data-hub");
    };
  }, [currentHub]);

  return <>{children}</>;
};

// AppRoutes component that uses the hub context and scroll-to-top
const AppRoutes = () => {
  // Apply scroll-to-top on route changes
  useScrollToTop();

  // Track page load performance
  const location = useLocation();

  useEffect(() => {
    const startTime = performance.now();

    // Track page load after component is mounted
    const timer = setTimeout(() => {
      const duration = performance.now() - startTime;
      performanceMonitor.trackPageLoad(location.pathname, duration);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show Home page as default
  const DefaultComponent = Home;

  return (
    <Routes>
      <Route path={HOME_PATH} element={<DefaultComponent />} />
      <Route
        path={HOME_ALIAS_PATH}
        element={
          <PageTransition>
            <Home />
          </PageTransition>
        }
      />
      <Route
        path={CONTACT_PATH}
        element={
          <PageTransition>
            <Contact />
          </PageTransition>
        }
      />

      <Route
        path={FAQ_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <FAQ />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={TERMS_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Terms />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={PRIVACY_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Privacy />
            </Suspense>
          </PageTransition>
        }
      />
      {/* Legacy Client Route Redirect - Temporary backward compatibility */}
      <Route path={CLIENT_PAGE_STATIC_PATH} element={<Navigate to="/clients/donsbt" replace />} />

      {/* Dynamic Client Routes */}
      <Route
        path={CLIENTS_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <ClientPage />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={CLIENTS_PRIVACY_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <ClientPrivacy />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={CLIENTS_TERMS_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <ClientTerms />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={ABOUT_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={PRICING_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Pricing />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={DEMO_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Demo />
            </Suspense>
          </PageTransition>
        }
      />

      {/* Admin Dashboard - Accessible in all environments with auth */}
      <Route
        path={ADMIN_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </PageTransition>
        }
      />

      {/* Admin Performance Dashboard - Dev only */}
      {import.meta.env.MODE === "development" && (
        <Route
          path={ADMIN_PERFORMANCE_PATH}
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <AdminPerformanceDashboard />
              </Suspense>
            </PageTransition>
          }
        />
      )}

      {/* Auth routes - Dev only */}
      {import.meta.env.MODE === "development" && (
        <Route
          path={TEST_AUTH_PATH}
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <TestAuth />
              </Suspense>
            </PageTransition>
          }
        />
      )}
      {import.meta.env.MODE === "development" && (
        <Route
          path={DEBUG_AUTH_PATH}
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <DebugAuth />
              </Suspense>
            </PageTransition>
          }
        />
      )}
      <Route
        path={PAYMENT_SUCCESS_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <PaymentSuccess />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={CHECK_EMAIL_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <CheckEmail />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={VERIFY_OTP_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <VerifyAuth />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path={VERIFY_PATH}
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <VerifyAuth />
            </Suspense>
          </PageTransition>
        }
      />

      <Route
        path={NOT_FOUND_PATH}
        element={
          <PageTransition>
            <Home />
          </PageTransition>
        }
      />
    </Routes>
  );
};

const App = () => {
  // Detect hub from hostname (for multi-domain deployment)
  const defaultHub = detectHubFromHostname();

  // Environment detection
  useEffect(() => {
    // Environment is detected and configured via webEnvironment
    // Hub detection happens automatically via detectHubFromHostname()
  }, [defaultHub]);

  return (
    <ErrorBoundary>
      <div>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <SonnerToaster />
            <HubProvider environment={webEnvironment} defaultHub={defaultHub}>
              <HubThemeWrapper>
                <BrowserRouter>
                  <AppRoutes />
                  <AppFloatingComponents />
                </BrowserRouter>
              </HubThemeWrapper>
            </HubProvider>
          </TooltipProvider>
        </QueryClientProvider>
        {/* Environment Debug - shows on preview/staging for debugging */}
        <EnvironmentDebug
          show={import.meta.env.MODE === "development" || window.location.hostname === "localhost"}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
