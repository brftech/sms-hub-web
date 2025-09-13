import { useEffect } from "react";
import { HubLogo } from "@sms-hub/ui";
import { useHub } from "@sms-hub/ui";

export const Landing = () => {
  const { hubConfig } = useHub();

  useEffect(() => {
    // Redirect to web app login after a short delay
    const timer = setTimeout(() => {
      window.location.href = "http://localhost:3000/login";
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <HubLogo
          hubType={hubConfig.id}
          variant="icon"
          size="lg"
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Welcome to {hubConfig.displayName}
        </h1>
        <p className="text-muted-foreground mb-6">
          Please log in to access your dashboard.
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        <div className="mt-4">
          <a
            href="http://localhost:3000/login"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
};
