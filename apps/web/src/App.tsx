import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, SonnerToaster, TooltipProvider } from "@sms-hub/ui";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HubProvider } from "@sms-hub/ui";
import { ErrorBoundary } from "@sms-hub/ui";
import { webEnvironment } from "./config/webEnvironment";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Solutions from "./pages/Solutions";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import PhoneDemo from "./pages/PhoneDemo";
import PlatformDemo from "./pages/PlatformDemo";
import Admin from "./pages/Admin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { useScrollToTop } from "./hooks/useScrollToTop";

const queryClient = new QueryClient();

// AppRoutes component that uses the hub context and scroll-to-top
const AppRoutes = () => {
  // Apply scroll-to-top on route changes
  useScrollToTop();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/phone-demo" element={<PhoneDemo />} />
      <Route path="/platform-demo" element={<PlatformDemo />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedAdminRoute>
            <Admin />
          </ProtectedAdminRoute>
        } 
      />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default App;
