// Optimized export for marketing website - only essential components

// Core UI components actually used
export { Button, buttonVariants } from "./components/button";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/card";
export { Input } from "./components/input";
export { Label } from "./components/label";
export { Textarea } from "./components/textarea";
export { Alert, AlertDescription } from "./components/alert";

// Form components
export * from "./components/forms";

// Layout components
export * from "./components/page-layout";
export { default as SEO } from "./components/seo";
export { default as PageTransition } from "./components/page-transition";
export * from "./components/error-boundary";

// Hub components
export { HubLogo } from "./components/hub-logo";
export { useHub, HubProvider, type EnvironmentAdapter } from "./contexts/HubContext";
export { LiveMessagingProvider, useLiveMessaging } from "./contexts/LiveMessagingContext";

// Toast system
export { Toaster } from "./components/toaster";
export { SonnerToaster } from "./components/sonner";
export { useToast, useToastFunction as toast } from "./hooks/use-toast";

// Provider components
export { TooltipProvider } from "./components/tooltip";

// Phone demo components
export { default as PhoneInteractive } from "./components/PhoneInteractive";
export { default as PlatformDemo } from "./components/PlatformDemo";

// Type exports needed
export type { Hub, HubConfig } from "./types";