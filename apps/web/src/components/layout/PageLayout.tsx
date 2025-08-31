import React from "react";
import { Navigation, MobileMenu, Footer } from "@/components";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showNavigation?: boolean;
  showMobileMenu?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  showNavigation = true,
  showMobileMenu = true,
}) => {
  return (
    <div className="min-h-screen bg-black">
      {showNavigation && <Navigation />}
      {showMobileMenu && <MobileMenu />}

      <main className={cn("pt-16", className)}>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
