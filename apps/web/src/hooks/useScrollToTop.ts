import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Custom hook to scroll to top on route changes
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
};
