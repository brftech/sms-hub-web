import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HubProvider } from "@sms-hub/ui";
import { userEnvironment } from "./config/userEnvironment";
import { SupabaseProvider, useSupabase } from "./providers/SupabaseProvider";
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

// Wrapper component to set up Supabase client for queries
function AppWithSupabase() {
  const supabase = useSupabase();
  
  useEffect(() => {
    // Set the supabase client globally for queries
    (window as any).__supabaseClient = supabase;
  }, [supabase]);

  return (
    <HubProvider defaultHub="gnymble" environment={userEnvironment}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HubProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <AppWithSupabase />
      </SupabaseProvider>
    </QueryClientProvider>
  </StrictMode>
);
