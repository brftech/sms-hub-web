import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
  className?: string;
  navigation?: React.ReactNode;
  footer?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showNavigation = false,
  showFooter = false,
  className = "",
  navigation,
  footer,
}) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {showNavigation && navigation}

      <main className="flex-1">{children}</main>

      {showFooter && footer}
    </div>
  );
};
