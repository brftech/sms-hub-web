// GlobalViewContext for Unified App
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalViewContextType {
  isGlobalView: boolean;
  setIsGlobalView: (value: boolean) => void;
  toggleGlobalView: () => void;
}

const GlobalViewContext = createContext<GlobalViewContextType | undefined>(
  undefined
);

export const GlobalViewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isGlobalView, setIsGlobalView] = useState(true);

  const toggleGlobalView = () => {
    setIsGlobalView(!isGlobalView);
  };

  return (
    <GlobalViewContext.Provider
      value={{ isGlobalView, setIsGlobalView, toggleGlobalView }}
    >
      {children}
    </GlobalViewContext.Provider>
  );
};

export const useGlobalView = () => {
  const context = useContext(GlobalViewContext);
  if (!context) {
    throw new Error("useGlobalView must be used within a GlobalViewProvider");
  }
  return context;
};
