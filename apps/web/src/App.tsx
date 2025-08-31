import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, SonnerToaster, TooltipProvider } from "@sms-hub/ui";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HubProvider, useHub } from "@sms-hub/ui";
import { ErrorBoundary } from "@sms-hub/ui";
import { webEnvironment } from "./config/webEnvironment";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

// AppRoutes component that uses the hub context
const AppRoutes = () => {
  const { currentHub } = useHub();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
      <Route path="/pricing" element={<Pricing />} />
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
        <HubProvider environment={webEnvironment} defaultHub="percytech">
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </HubProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
