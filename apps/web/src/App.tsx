import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HubProvider, useHub } from "@/contexts/HubContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import Home from "./pages/Home";
import Solutions from "./pages/Solutions";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import SMSPrivacyTerms from "./pages/SMSPrivacyTerms";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";
import SMSComplianceLanding from "./pages/SMSComplianceLanding";
import Admin from "./pages/Admin";
import AdminTest from "./pages/AdminTest";
import HubDemo from "./pages/HubDemo";
import Demo from "./pages/Demo";

const queryClient = new QueryClient();

// AppRoutes component that uses the hub context
const AppRoutes = () => {
  const { currentHub } = useHub();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/privacy-terms" element={<SMSPrivacyTerms />} />
      <Route path="/about" element={<About />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/sms-compliance-demo" element={<SMSComplianceLanding />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin-test" element={<AdminTest />} />
      <Route path="/hub-demo" element={<HubDemo />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HubProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </HubProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
