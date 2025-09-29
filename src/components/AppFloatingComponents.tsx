import React from 'react';
import FloatingAdminButton from './FloatingAdminButton';

/**
 * Component that renders floating UI elements that need router context
 * This is rendered inside the BrowserRouter so components can use navigation hooks
 */
export const AppFloatingComponents: React.FC = () => {
  return (
    <>
      {/* Floating Admin Button - shows in dev and production with auth */}
      <FloatingAdminButton />
    </>
  );
};

export default AppFloatingComponents;
