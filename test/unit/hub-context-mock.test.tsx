/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { HubProvider, useHub } from "@sms-hub/ui";

// Mock environment adapter
const createMockEnvironment = (overrides = {}) => ({
  isDevelopment: () => true,
  isProduction: () => false,
  isStaging: () => false,
  getCurrent: () => "development",
  features: {
    hubSwitcher: () => true,
    debugMode: () => true,
    analytics: () => false,
    errorReporting: () => false,
  },
  ...overrides,
});

// Mock storage adapter
const createMockStorage = (initialData = {}) => {
  const storage = { ...initialData };
  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
  };
};

// Mock DOM adapter
const createMockDOM = () => {
  const mockDocument = {
    body: { setAttribute: vi.fn() },
    documentElement: {
      setAttribute: vi.fn(),
      style: { setProperty: vi.fn() },
    },
    title: "",
  };

  return {
    setBodyAttribute: (name: string, value: string) => {
      mockDocument.body.setAttribute(name, value);
    },
    setDocumentElementAttribute: (name: string, value: string) => {
      mockDocument.documentElement.setAttribute(name, value);
    },
    setDocumentTitle: (title: string) => {
      mockDocument.title = title;
    },
    setCSSVariable: (name: string, value: string) => {
      mockDocument.documentElement.style.setProperty(name, value);
    },
  };
};

// Test component that uses the hub context
const TestComponent = () => {
  const {
    currentHub,
    hubConfig,
    switchHub,
    isGnymble,
    isPercyTech,
    showHubSwitcher,
  } = useHub();

  return (
    <div>
      <div data-testid="current-hub">{currentHub}</div>
      <div data-testid="hub-name">{hubConfig.name}</div>
      <div data-testid="hub-color">{hubConfig.primaryColor}</div>
      <div data-testid="is-gnymble">{isGnymble.toString()}</div>
      <div data-testid="is-percytech">{isPercyTech.toString()}</div>
      <div data-testid="show-switcher">{showHubSwitcher.toString()}</div>
      <button
        data-testid="switch-to-percytech"
        onClick={() => switchHub("percytech")}
      >
        Switch to PercyTech
      </button>
      <button
        data-testid="switch-to-gnymble"
        onClick={() => switchHub("gnymble")}
      >
        Switch to Gnymble
      </button>
    </div>
  );
};

describe("Hub Context Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide default hub configuration", () => {
    const environment = createMockEnvironment();
    const storage = createMockStorage();
    const dom = createMockDOM();

    render(
      <HubProvider environment={environment} storage={storage} dom={dom}>
        <TestComponent />
      </HubProvider>
    );

    expect(screen.getByTestId("current-hub")).toHaveTextContent("gnymble");
    expect(screen.getByTestId("hub-name")).toHaveTextContent("Gnymble");
    expect(screen.getByTestId("hub-color")).toHaveTextContent("#FF6B35");
    expect(screen.getByTestId("is-gnymble")).toHaveTextContent("true");
    expect(screen.getByTestId("is-percytech")).toHaveTextContent("false");
  });

  it("should switch hubs correctly", async () => {
    const environment = createMockEnvironment();
    const storage = createMockStorage();
    const dom = createMockDOM();

    render(
      <HubProvider environment={environment} storage={storage} dom={dom}>
        <TestComponent />
      </HubProvider>
    );

    // Initially Gnymble
    expect(screen.getByTestId("current-hub")).toHaveTextContent("gnymble");
    expect(screen.getByTestId("is-gnymble")).toHaveTextContent("true");

    // Switch to PercyTech
    await act(async () => {
      screen.getByTestId("switch-to-percytech").click();
    });

    expect(screen.getByTestId("current-hub")).toHaveTextContent("percytech");
    expect(screen.getByTestId("hub-name")).toHaveTextContent("PercyTech");
    expect(screen.getByTestId("hub-color")).toHaveTextContent("#007AFF");
    expect(screen.getByTestId("is-gnymble")).toHaveTextContent("false");
    expect(screen.getByTestId("is-percytech")).toHaveTextContent("true");
  });

  it("should restore hub from storage", () => {
    const environment = createMockEnvironment();
    const storage = createMockStorage({ preferredHub: "percymd" });
    const dom = createMockDOM();

    render(
      <HubProvider environment={environment} storage={storage} dom={dom}>
        <TestComponent />
      </HubProvider>
    );

    expect(screen.getByTestId("current-hub")).toHaveTextContent("percymd");
    expect(screen.getByTestId("hub-name")).toHaveTextContent("PercyMD");
  });

  it("should apply DOM changes when hub changes", async () => {
    const environment = createMockEnvironment();
    const storage = createMockStorage();
    const dom = createMockDOM();

    render(
      <HubProvider environment={environment} storage={storage} dom={dom}>
        <TestComponent />
      </HubProvider>
    );

    // Switch hub
    await act(async () => {
      screen.getByTestId("switch-to-percytech").click();
    });

    // Check DOM operations
    expect(dom.setBodyAttribute).toHaveBeenCalledWith("data-hub", "percytech");
    expect(dom.setDocumentElementAttribute).toHaveBeenCalledWith(
      "data-hub",
      "percytech"
    );
    expect(dom.setDocumentTitle).toHaveBeenCalledWith("PercyTech");
    expect(dom.setCSSVariable).toHaveBeenCalledWith("--hub-primary", "#007AFF");
    expect(dom.setCSSVariable).toHaveBeenCalledWith(
      "--hub-secondary",
      "#5AC8FA"
    );
    expect(dom.setCSSVariable).toHaveBeenCalledWith("--hub-accent", "#FF3B30");
  });

  it("should save hub preference to storage", async () => {
    const environment = createMockEnvironment();
    const storage = createMockStorage();
    const dom = createMockDOM();

    render(
      <HubProvider environment={environment} storage={storage} dom={dom}>
        <TestComponent />
      </HubProvider>
    );

    // Switch hub
    await act(async () => {
      screen.getByTestId("switch-to-percytech").click();
    });

    // Check storage was updated
    expect(storage.setItem).toHaveBeenCalledWith("preferredHub", "percytech");
  });

  it("should show hub switcher based on environment", () => {
    const environment = createMockEnvironment({
      features: {
        hubSwitcher: () => false,
        debugMode: () => true,
        analytics: () => false,
        errorReporting: () => false,
      },
    });
    const storage = createMockStorage();
    const dom = createMockDOM();

    render(
      <HubProvider environment={environment} storage={storage} dom={dom}>
        <TestComponent />
      </HubProvider>
    );

    expect(screen.getByTestId("show-switcher")).toHaveTextContent("false");
  });

  it("should throw error when useHub is used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useHub must be used within a HubProvider");

    consoleSpy.mockRestore();
  });

  it("should handle all hub types correctly", () => {
    const environment = createMockEnvironment();
    const storage = createMockStorage();
    const dom = createMockDOM();

    const TestAllHubs = () => {
      const { currentHub, isGnymble, isPercyTech, isPercyMD, isPercyText } =
        useHub();

      return (
        <div>
          <div data-testid="current-hub">{currentHub}</div>
          <div data-testid="flags">
            {isGnymble ? "G" : ""}
            {isPercyTech ? "PT" : ""}
            {isPercyMD ? "PM" : ""}
            {isPercyText ? "PTX" : ""}
          </div>
        </div>
      );
    };

    const { rerender } = render(
      <HubProvider
        environment={environment}
        storage={storage}
        dom={dom}
        defaultHub="gnymble"
      >
        <TestAllHubs />
      </HubProvider>
    );

    expect(screen.getByTestId("flags")).toHaveTextContent("G");

    // Test PercyTech
    rerender(
      <HubProvider
        environment={environment}
        storage={storage}
        dom={dom}
        defaultHub="percytech"
      >
        <TestAllHubs />
      </HubProvider>
    );
    expect(screen.getByTestId("flags")).toHaveTextContent("PT");

    // Test PercyMD
    rerender(
      <HubProvider
        environment={environment}
        storage={storage}
        dom={dom}
        defaultHub="percymd"
      >
        <TestAllHubs />
      </HubProvider>
    );
    expect(screen.getByTestId("flags")).toHaveTextContent("PM");

    // Test PercyText
    rerender(
      <HubProvider
        environment={environment}
        storage={storage}
        dom={dom}
        defaultHub="percytext"
      >
        <TestAllHubs />
      </HubProvider>
    );
    expect(screen.getByTestId("flags")).toHaveTextContent("PTX");
  });
});
