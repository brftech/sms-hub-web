import React, { createContext, useContext, useState, useEffect } from "react";

interface GlobalViewContextType {
  isGlobalView: boolean;
  setIsGlobalView: (value: boolean) => void;
}

const GlobalViewContext = createContext<GlobalViewContextType | undefined>(
  undefined
);

export const useGlobalView = () => {
  const context = useContext(GlobalViewContext);
  if (context === undefined) {
    throw new Error("useGlobalView must be used within a GlobalViewProvider");
  }
  return context;
};

interface GlobalViewProviderProps {
  children: React.ReactNode;
}

export const GlobalViewProvider: React.FC<GlobalViewProviderProps> = ({
  children,
}) => {
  const [isGlobalView, setIsGlobalView] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin-global-view");
      return saved === "true";
    }
    return false;
  });

  // Persist to localStorage whenever the value changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin-global-view", isGlobalView.toString());
    }
  }, [isGlobalView]);

  const value = {
    isGlobalView,
    setIsGlobalView,
  };

  return (
    <GlobalViewContext.Provider value={value}>
      {children}
    </GlobalViewContext.Provider>
  );
};
