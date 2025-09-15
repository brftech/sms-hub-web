import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, SonnerToaster, TooltipProvider } from "@sms-hub/ui";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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

// Import main pages directly (frequently accessed)
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Landing from "./pages/Landing";
import CigarLanding from "./pages/CigarLanding";
import FAQ from "./pages/FAQ";
import Demo from "./pages/Demo";

// Import auth pages
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { CheckEmail } from "./pages/CheckEmail";
import { VerifyAuth } from "./pages/VerifyAuth";
import { TestAuth } from "./pages/TestAuth";
import { DebugAuth } from "./pages/DebugAuth";

// Lazy load client pages (less frequently accessed)
const DonsBurlingame = lazy(() => import("./pages/clients/DonsBurlingame"));
const MichaelsTobacco = lazy(() => import("./pages/clients/MichaelsTobacco"));
const FirstRoundAmmo = lazy(() => import("./pages/clients/FirstRoundAmmo"));
const HarlemCigar = lazy(() => import("./pages/clients/HarlemCigar"));

const queryClient = new QueryClient();

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
  let DefaultComponent = Home;

  if (isCigarSubdomain) {
    DefaultComponent = CigarLanding;
  }

  return (
    <Routes>
      <Route path="/" element={<DefaultComponent />} />
      <Route
        path="/landing"
        element={
          <PageTransition>
            <Landing />
          </PageTransition>
        }
      />
      <Route
        path="/cigar"
        element={
          <PageTransition>
            <CigarLanding />
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
            <FAQ />
          </PageTransition>
        }
      />
      <Route
        path="/terms"
        element={
          <PageTransition>
            <Terms />
          </PageTransition>
        }
      />
      <Route
        path="/privacy"
        element={
          <PageTransition>
            <Privacy />
          </PageTransition>
        }
      />
      <Route
        path="/dons-burlingame"
        element={
          <PageTransition>
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-orange-500 text-xl">Loading...</div>
                </div>
              }
            >
              <DonsBurlingame />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/michaels-tobacco"
        element={
          <PageTransition>
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-orange-500 text-xl">Loading...</div>
                </div>
              }
            >
              <MichaelsTobacco />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/1st-round-ammo"
        element={
          <PageTransition>
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-orange-500 text-xl">Loading...</div>
                </div>
              }
            >
              <FirstRoundAmmo />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/harlem-cigar"
        element={
          <PageTransition>
            <Suspense
              fallback={
                <div className="min-h-screen bg-black flex items-center justify-center">
                  <div className="text-orange-500 text-xl">Loading...</div>
                </div>
              }
            >
              <HarlemCigar />
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/about"
        element={
          <PageTransition>
            <About />
          </PageTransition>
        }
      />
      <Route
        path="/pricing"
        element={
          <PageTransition>
            <Pricing />
          </PageTransition>
        }
      />
      <Route
        path="/demo"
        element={
          <PageTransition>
            <Demo />
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
        path="/login"
        element={
          <PageTransition>
            <Login />
          </PageTransition>
        }
      />
      <Route
        path="/signup"
        element={
          <PageTransition>
            <Signup />
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

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <SonnerToaster />
          <HubProvider environment={webEnvironment} defaultHub="gnymble">
            <HubThemeWrapper>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <AppRoutes />
              </BrowserRouter>
            </HubThemeWrapper>
          </HubProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
