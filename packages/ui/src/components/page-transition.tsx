import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <div className={`page-content ${className}`}>
      {children}
    </div>
  );
}

export default PageTransition;
