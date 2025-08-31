import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { HubType, getHubConfig } from '@sms-hub/types';
import { environment } from "@/config/environment";

interface HubContextType {
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

interface HubProviderProps {
  children: ReactNode;
  defaultHub?: HubType;
}

export const HubProvider: React.FC<HubProviderProps> = ({ children, defaultHub = 'gnymble' }) => {
  const [currentHub, setCurrentHub] = useState<HubType>(defaultHub);
  const hubConfig = getHubConfig(currentHub);

  const switchHub = (hub: HubType) => {
    setCurrentHub(hub);
    localStorage.setItem("preferredHub", hub);
  };

  useEffect(() => {
    const savedHub = localStorage.getItem("preferredHub") as HubType;
    const validHubs: HubType[] = ['percytech', 'gnymble', 'percymd', 'percytext'];
    if (savedHub && validHubs.includes(savedHub)) {
      setCurrentHub(savedHub);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("preferredHub", currentHub);

    // Apply hub attribute to document body for CSS targeting
    document.body.setAttribute("data-hub", currentHub);
    document.documentElement.setAttribute("data-hub", currentHub);

    // Update document title
    document.title = hubConfig.displayName;
    
    // Apply hub CSS variables
    const root = document.documentElement;
    root.style.setProperty('--hub-primary', hubConfig.primaryColor);
    root.style.setProperty('--hub-secondary', hubConfig.secondaryColor);
    root.style.setProperty('--hub-accent', hubConfig.accentColor);
  }, [currentHub, hubConfig]);

  const value: HubContextType = {
    currentHub,
    hubConfig,
    switchHub,
    isPercyTech: currentHub === 'percytech',
    isGnymble: currentHub === 'gnymble',
    isPercyMD: currentHub === 'percymd',
    isPercyText: currentHub === 'percytext',
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