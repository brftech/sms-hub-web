import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, SonnerToaster, TooltipProvider } from "@sms-hub/ui";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { HubProvider, ErrorBoundary, PageTransition } from "@sms-hub/ui";
import { useScrollToTop } from "@sms-hub/utils";
import { webEnvironment } from "./config/webEnvironment";

// Import all pages directly - no lazy loading
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

const queryClient = new QueryClient();

// AppRoutes component that uses the hub context and scroll-to-top
const AppRoutes = () => {
  // Apply scroll-to-top on route changes
  useScrollToTop();

  // Check if we're on the cigar subdomain
  const isCigarSubdomain =
    window.location.hostname.includes("cigar.") ||
    window.location.hostname === "cigar.gnymble.com";

  // In production, show Landing page publicly; in dev, show Home page for development
  // But if we're on cigar subdomain, always show CigarLanding
  const isProduction = import.meta.env.PROD;
  let DefaultComponent = isProduction ? Landing : Home;

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
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </HubProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
