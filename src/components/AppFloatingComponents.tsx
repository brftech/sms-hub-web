import React from "react";
import FloatingAdminButton from "./FloatingAdminButton";
import FloatingHubSwitcher from "./FloatingHubSwitcher";

/**
 * Component that renders floating UI elements that need router context
 * This is rendered inside the BrowserRouter so components can use navigation hooks
 */
export const AppFloatingComponents: React.FC = () => {
  return (
    <>
      {/* Floating Hub Switcher - shows in dev on all pages */}
      <FloatingHubSwitcher />

      {/* Floating Admin Button - shows in dev and production with auth */}
      <FloatingAdminButton />
    </>
  );
};

export default AppFloatingComponents;
