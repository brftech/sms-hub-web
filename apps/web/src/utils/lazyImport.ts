import { lazy } from "react";

// Utility for lazy loading components with proper error boundaries
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}

// Preload function for critical components
export function preloadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return () => {
    const Component = lazy(importFunc);
    return Component;
  };
}

// Route-based lazy loading
export const lazyRoutes = {
  About: lazy(() => import("@/pages/About")),
  Contact: lazy(() => import("@/pages/Contact")),
  Solutions: lazy(() => import("@/pages/Solutions")),
  Pricing: lazy(() => import("@/pages/Pricing")),
  Privacy: lazy(() => import("@/pages/Privacy")),
  SMSComplianceLanding: lazy(() => import("@/pages/SMSComplianceLanding")),
  SMSPrivacyTerms: lazy(() => import("@/pages/SMSPrivacyTerms")),
  Terms: lazy(() => import("@/pages/Terms")),
  Testimonials: lazy(() => import("@/pages/Testimonials")),
};
