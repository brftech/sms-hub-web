import { useEffect, useRef, useState } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export const CloudflareTurnstile: React.FC<TurnstileProps> = ({
  siteKey,
  onVerify,
  onError,
  theme = "dark",
  size = "normal",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile && !widgetId) {
      // eslint-disable-next-line no-console
      console.log("🔒 Rendering Turnstile widget...");
      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => {
          // eslint-disable-next-line no-console
          console.log("✅ Turnstile verification successful");
          onVerify(token);
        },
        "error-callback": onError,
        theme,
        size,
      });
      setWidgetId(id);
      // eslint-disable-next-line no-console
      console.log("🔒 Turnstile widget rendered with ID:", id);
    }

    return () => {
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [isLoaded, siteKey, onVerify, onError, theme, size, widgetId]);

  return <div ref={containerRef} />;
};
