import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { HubType, HubConfig, HUB_CONFIGS } from "@sms-hub/types";
import {
  detectHubFromDomain,
  detectHubFromPath,
  detectHubFromPort,
} from "@sms-hub/utils";

interface HubContextType {
  currentHub: HubType;
  hubConfig: HubConfig;
  switchHub: (hub: HubType) => void;
  isPercyTech: boolean;
  isGnymble: boolean;
  isPercyMD: boolean;
  isPercyText: boolean;
  showHubSwitcher: boolean;
}

const HubContext = createContext<HubContextType | undefined>(undefined);

interface HubProviderProps {
  children: ReactNode;
  defaultHub?: HubType;
  enableHubSwitcher?: boolean;
}

export const HubProvider: React.FC<HubProviderProps> = ({
  children,
  defaultHub,
  enableHubSwitcher = true,
}) => {
  const [currentHub, setCurrentHub] = useState<HubType>(() => {
    // If defaultHub is explicitly set, use it
    if (defaultHub) {
      return defaultHub;
    }

    // Try to detect hub from URL in browser environment
    if (typeof window !== "undefined") {
      const hubFromDomain = detectHubFromDomain(window.location.hostname);
      const hubFromPath = detectHubFromPath(window.location.pathname);
      const hubFromPort = detectHubFromPort(
        parseInt(window.location.port) || 3000
      );
      const hubFromQuery = new URLSearchParams(window.location.search).get(
        "hub"
      ) as HubType;

      return (
        hubFromQuery ||
        hubFromPath ||
        hubFromDomain ||
        hubFromPort ||
        "percytech"
      );
    }

    return "percytech";
  });

  const switchHub = (hub: HubType) => {
    setCurrentHub(hub);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredHub", hub);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHub = localStorage.getItem("preferredHub") as HubType;
      if (savedHub && HUB_CONFIGS[savedHub]) {
        setCurrentHub(savedHub);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredHub", currentHub);

      // Apply hub attribute to document for CSS targeting
      document.body.setAttribute("data-hub", currentHub);
      document.documentElement.setAttribute("data-hub", currentHub);

      // Update document title and favicon
      document.title = HUB_CONFIGS[currentHub].displayName;
      updateFavicon(HUB_CONFIGS[currentHub].favicon);

      // Inject hub-specific CSS custom properties
      injectHubStyles(currentHub);
    }
  }, [currentHub]);

  const injectHubStyles = (hub: HubType) => {
    if (typeof window === "undefined") return;

    // Remove existing hub styles
    const existingStyle = document.getElementById("hub-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement("style");
    style.id = "hub-styles";

    const config = HUB_CONFIGS[hub];
    const css = `
      :root {
        --hub-primary: ${config.primaryColor} !important;
        --hub-secondary: ${config.secondaryColor} !important;
        --hub-accent: ${config.accentColor} !important;
        --hub-primary-rgb: ${hexToRgb(config.primaryColor)} !important;
        --hub-secondary-rgb: ${hexToRgb(config.secondaryColor)} !important;
        --hub-accent-rgb: ${hexToRgb(config.accentColor)} !important;
      }
    `;

    style.textContent = css;
    document.head.appendChild(style);
  };

  const updateFavicon = (faviconPath: string) => {
    if (typeof window === "undefined") return;

    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = faviconPath;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = faviconPath;
      document.head.appendChild(newLink);
    }
  };

  const value: HubContextType = {
    currentHub,
    hubConfig: HUB_CONFIGS[currentHub],
    switchHub,
    isPercyTech: currentHub === "percytech",
    isGnymble: currentHub === "gnymble",
    isPercyMD: currentHub === "percymd",
    isPercyText: currentHub === "percytext",
    showHubSwitcher: enableHubSwitcher,
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

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ].join(", ");
};
