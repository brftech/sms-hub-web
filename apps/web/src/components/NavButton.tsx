import React from "react";
import { useLocation } from "react-router-dom";
import { useHub } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isMobile?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  to, 
  children, 
  onClick, 
  className = "",
  isMobile = false 
}) => {
  const location = useLocation();
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);
  
  const isActive = location.pathname === to;
  
  const baseClasses = isMobile 
    ? "block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors"
    : "transition-colors text-sm font-medium";
    
  const activeClasses = isActive 
    ? `${hubColors.text} hub-text-primary`
    : "text-white hover:text-gray-300";
    
  const mobileActiveClasses = isActive
    ? `${hubColors.bg} hub-bg-primary text-white`
    : "text-gray-300 hover:text-white hover:bg-gray-700";

  const finalClasses = isMobile 
    ? `${baseClasses} ${mobileActiveClasses} ${className}`
    : `${baseClasses} ${activeClasses} ${className}`;

  return (
    <button
      onClick={onClick}
      className={finalClasses}
    >
      {children}
    </button>
  );
};

export default NavButton;
