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

import FAQ from "./pages/FAQ";
import PhoneDemo from "./pages/PhoneDemo";
import PlatformDemo from "./pages/PlatformDemo";

const queryClient = new QueryClient();

// AppRoutes component that uses the hub context and scroll-to-top
const AppRoutes = () => {
  // Apply scroll-to-top on route changes
  useScrollToTop();

  // In production, show Landing page by default; in dev, show Home page
  const isProduction = import.meta.env.PROD;
  const DefaultComponent = isProduction ? Landing : Home;

  return (
    <Routes>
      <Route path="/" element={<PageTransition><DefaultComponent /></PageTransition>} />
      <Route path="/landing" element={<PageTransition><Landing /></PageTransition>} />
      <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />


      <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
      <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
      <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
      <Route path="/about" element={<PageTransition><About /></PageTransition>} />
      <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
      <Route path="/phone-demo" element={<PageTransition><PhoneDemo /></PageTransition>} />
      <Route path="/platform-demo" element={<PageTransition><PlatformDemo /></PageTransition>} />
      <Route path="*" element={<PageTransition><Home /></PageTransition>} />
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
