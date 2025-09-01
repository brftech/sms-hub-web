import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HubProvider } from "@sms-hub/ui";

// Test environment configuration
const testEnvironment = {
  isDevelopment: () => false,
  isProduction: () => false,
  isStaging: () => false,
  getCurrent: () => "test",
  features: {
    hubSwitcher: () => false,
    debugMode: () => false,
    analytics: () => false,
    errorReporting: () => false,
  },
};

// Test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  hub?: string;
  route?: string;
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    hub = "gnymble",
    route = "/",
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = options;

  // Set up initial route
  window.history.pushState({}, "Test page", route);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <HubProvider defaultHub={hub} environment={testEnvironment}>
        <BrowserRouter>{children}</BrowserRouter>
      </HubProvider>
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { renderWithProviders as render };
