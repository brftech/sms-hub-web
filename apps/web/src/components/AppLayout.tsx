import React from "react";
import { PageLayout } from "@sms-hub/ui";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showNavigation = true, 
  showFooter = true 
}) => {
  return (
    <PageLayout
      showNavigation={showNavigation}
      showFooter={showFooter}
      navigation={showNavigation ? <Navigation /> : undefined}
      footer={showFooter ? <Footer /> : undefined}
    >
      {children}
    </PageLayout>
  );
};

export default AppLayout;
