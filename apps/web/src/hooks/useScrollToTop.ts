import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll to top for better UX and no transition conflicts
    window.scrollTo(0, 0);
  }, [pathname]);
};
