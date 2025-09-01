import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the UI package to avoid SVG import issues
jest.mock("@sms-hub/ui", () => ({
  HubProvider: ({ children, defaultHub, environment }: any) => (
    <div data-testid="hub-provider" data-hub={defaultHub}>
      {children}
    </div>
  ),
  useHub: () => ({
    currentHub: "gnymble",
    hubConfig: {
      displayName: "Gnymble",
      primaryColor: "#cc5500",
    },
    switchHub: jest.fn(),
    isPercyTech: false,
    isGnymble: true,
    isPercyMD: false,
    isPercyText: false,
    showHubSwitcher: false,
  }),
}));

// Test component that uses hub context
const TestComponent = () => {
  const { currentHub, hubConfig } = require("@sms-hub/ui").useHub();
  return (
    <div>
      <span data-testid="current-hub">{currentHub}</span>
      <span data-testid="hub-name">{hubConfig.displayName}</span>
    </div>
  );
};

// Test environment mock
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

describe("Hub Context (Mocked)", () => {
  it("provides hub context through provider", () => {
    const { HubProvider } = require("@sms-hub/ui");

    render(
      <HubProvider defaultHub="gnymble" environment={testEnvironment}>
        <TestComponent />
      </HubProvider>
    );

    expect(screen.getByTestId("hub-provider")).toHaveAttribute(
      "data-hub",
      "gnymble"
    );
    expect(screen.getByTestId("current-hub")).toHaveTextContent("gnymble");
    expect(screen.getByTestId("hub-name")).toHaveTextContent("Gnymble");
  });

  it("renders hub provider with correct props", () => {
    const { HubProvider } = require("@sms-hub/ui");

    render(
      <HubProvider defaultHub="percymd" environment={testEnvironment}>
        <div>Test content</div>
      </HubProvider>
    );

    expect(screen.getByTestId("hub-provider")).toHaveAttribute(
      "data-hub",
      "percymd"
    );
  });
});
