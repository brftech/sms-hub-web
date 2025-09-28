import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, SonnerToaster, TooltipProvider } from "@sms-hub/ui";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import {
  HubProvider,
  ErrorBoundary,
  PageTransition,
  useHub,
} from "@sms-hub/ui";
import { useScrollToTop } from "@sms-hub/utils";
import { webEnvironment } from "./config/webEnvironment";
import { useEffect } from "react";

// Import critical pages directly (frequently accessed)
import Home from "./pages/Home";
import Contact from "./pages/Contact";

// Lazy load larger pages for better performance
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Landing = lazy(() => import("./pages/Landing"));
const CigarLanding = lazy(() => import("./pages/CigarLanding"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Demo = lazy(() => import("./pages/Demo"));

// Import auth pages
import { CheckEmail } from "./pages/CheckEmail";
import { VerifyAuth } from "./pages/VerifyAuth";
import { TestAuth } from "./pages/TestAuth";
import { DebugAuth } from "./pages/DebugAuth";
import PaymentSuccess from "./pages/PaymentSuccess";

// Lazy load client pages (less frequently accessed)
const ClientPage = lazy(() => import("./pages/clients/ClientPage"));
const ClientPrivacy = lazy(() => import("./pages/clients/ClientPrivacy"));
const ClientTerms = lazy(() => import("./pages/clients/ClientTerms"));

const queryClient = new QueryClient();

// Enhanced loading component for better UX
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-white">Loading...</p>
    </div>
  </div>
);

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

  // Check if we're on the cigar subdomain
  const isCigarSubdomain =
    window.location.hostname.includes("cigar.") ||
    window.location.hostname === "cigar.gnymble.com";

  // Show Home page as default; Landing page is available at /landing
  // But if we're on cigar subdomain, always show CigarLanding
  const DefaultComponent = isCigarSubdomain ? CigarLanding : Home;

  return (
    <Routes>
      <Route path="/" element={<DefaultComponent />} />
      <Route
        path="/landing"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Landing />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/cigar"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <CigarLanding />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/home"
        element={
          <PageTransition>
            <Home />
          </PageTransition>
        }
      />
      <Route
        path="/contact"
        element={
          <PageTransition>
            <Contact />
          </PageTransition>
        }
      />

      <Route
        path="/faq"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <FAQ />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/terms"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Terms />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/privacy"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Privacy />
            </Suspense>
          </PageTransition>
        }
      />
      {/* Dynamic Client Routes */}
      <Route
        path="/donsbt"
        element={
          <PageTransition>
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-orange-500 text-xl">Loading...</div>
                </div>
              }
            >
              <ClientPage />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/clients/:clientId"
        element={
          <PageTransition>
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-orange-500 text-xl">Loading...</div>
                </div>
              }
            >
              <ClientPage />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/clients/:clientId/privacy"
        element={
          <PageTransition>
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-orange-500 text-xl">Loading...</div>
                </div>
              }
            >
              <ClientPrivacy />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/clients/:clientId/terms"
        element={
          <PageTransition>
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-orange-500 text-xl">Loading...</div>
                </div>
              }
            >
              <ClientTerms />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/about"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/pricing"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Pricing />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/demo"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoader />}>
              <Demo />
            </Suspense>
          </PageTransition>
        }
      />

      {/* Auth routes - Dev only */}
      {import.meta.env.MODE === "development" && (
        <Route
          path="/test-auth"
          element={
            <PageTransition>
              <TestAuth />
            </PageTransition>
          }
        />
      )}
      {import.meta.env.MODE === "development" && (
        <Route
          path="/debug-auth"
          element={
            <PageTransition>
              <DebugAuth />
            </PageTransition>
          }
        />
      )}
      <Route
        path="/payment-success"
        element={
          <PageTransition>
            <PaymentSuccess />
          </PageTransition>
        }
      />
      <Route
        path="/check-email"
        element={
          <PageTransition>
            <CheckEmail />
          </PageTransition>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <PageTransition>
            <VerifyAuth />
          </PageTransition>
        }
      />
      <Route
        path="/verify"
        element={
          <PageTransition>
            <VerifyAuth />
          </PageTransition>
        }
      />

      <Route
        path="*"
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
  // Debug environment detection
  useEffect(() => {
    console.log('App component mounted');
    webEnvironment.debug();
  }, []);

  return (
    <ErrorBoundary>
      <div>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <SonnerToaster />
            <HubProvider environment={webEnvironment} defaultHub="gnymble">
              <HubThemeWrapper>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </HubThemeWrapper>
            </HubProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    </ErrorBoundary>
  );
};

export default App;
