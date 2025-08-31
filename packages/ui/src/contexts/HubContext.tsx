import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { HubType, getHubConfig } from "@sms-hub/types";

// Abstract interface for environment-specific functionality
export interface EnvironmentAdapter {
  isDevelopment(): boolean;
  isProduction(): boolean;
  isStaging(): boolean;
  getCurrent(): string;
  features: {
    hubSwitcher(): boolean;
    debugMode(): boolean;
    analytics(): boolean;
    errorReporting(): boolean;
  };
}

// Abstract interface for storage operations
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

// Abstract interface for DOM operations
export interface DOMAdapter {
  setBodyAttribute(name: string, value: string): void;
  setDocumentElementAttribute(name: string, value: string): void;
  setDocumentTitle(title: string): void;
  setCSSVariable(name: string, value: string): void;
}

export interface HubContextType {
  currentHub: HubType;
  hubConfig: ReturnType<typeof getHubConfig>;
  switchHub: (hub: HubType) => void;
  isPercyTech: boolean;
  isGnymble: boolean;
  isPercyMD: boolean;
  isPercyText: boolean;
  showHubSwitcher: boolean;
}

const HubContext = createContext<HubContextType | undefined>(undefined);

export interface HubProviderProps {
  children: ReactNode;
  defaultHub?: HubType;
  environment: EnvironmentAdapter;
  storage?: StorageAdapter;
  dom?: DOMAdapter;
}

// Default implementations for web environments
const defaultStorageAdapter: StorageAdapter = {
  getItem: (key: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
};

const defaultDOMAdapter: DOMAdapter = {
  setBodyAttribute: (name: string, value: string) => {
    if (typeof document !== "undefined" && document.body) {
      document.body.setAttribute(name, value);
    }
  },
  setDocumentElementAttribute: (name: string, value: string) => {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute(name, value);
    }
  },
  setDocumentTitle: (title: string) => {
    if (typeof document !== "undefined") {
      document.title = title;
    }
  },
  setCSSVariable: (name: string, value: string) => {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.style.setProperty(name, value);
    }
  },
};

export const HubProvider: React.FC<HubProviderProps> = ({
  children,
  defaultHub = "gnymble",
  environment,
  storage = defaultStorageAdapter,
  dom = defaultDOMAdapter,
}) => {
  const [currentHub, setCurrentHub] = useState<HubType>(defaultHub);
  const hubConfig = getHubConfig(currentHub);

  const switchHub = (hub: HubType) => {
    setCurrentHub(hub);
    storage.setItem("preferredHub", hub);
  };

  useEffect(() => {
    const savedHub = storage.getItem("preferredHub") as HubType;
    const validHubs: HubType[] = [
      "percytech",
      "gnymble",
      "percymd",
      "percytext",
    ];
    if (savedHub && validHubs.includes(savedHub)) {
      setCurrentHub(savedHub);
    }
  }, [storage]);

  useEffect(() => {
    storage.setItem("preferredHub", currentHub);

    // Apply hub attribute to document body for CSS targeting
    dom.setBodyAttribute("data-hub", currentHub);
    dom.setDocumentElementAttribute("data-hub", currentHub);

    // Update document title
    dom.setDocumentTitle(hubConfig.displayName);

    // Apply hub CSS variables
    dom.setCSSVariable("--hub-primary", hubConfig.primaryColor);
    dom.setCSSVariable("--hub-secondary", hubConfig.secondaryColor);
    dom.setCSSVariable("--hub-accent", hubConfig.accentColor);
  }, [currentHub, hubConfig, storage, dom]);

  const value: HubContextType = {
    currentHub,
    hubConfig,
    switchHub,
    isPercyTech: currentHub === "percytech",
    isGnymble: currentHub === "gnymble",
    isPercyMD: currentHub === "percymd",
    isPercyText: currentHub === "percytext",
    showHubSwitcher: environment.features.hubSwitcher(),
  };

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
};

export const useHub = (): HubContextType => {
  const context = useContext(HubContext);
  if (context === undefined) {
    throw new Error("useHub must be used within a HubProvider");
  }
  return context;
};

// Re-export HubType for convenience
export type { HubType };
