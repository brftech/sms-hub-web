import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HubProvider } from "@sms-hub/ui";
import { userEnvironment } from "./config/userEnvironment";
import App from "./App.tsx";

// Import local CSS for testing
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HubProvider defaultHub="gnymble" environment={userEnvironment}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HubProvider>
    </QueryClientProvider>
  </StrictMode>
);
