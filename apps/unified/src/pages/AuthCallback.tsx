import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSupabaseClient } from "../lib/supabaseSingleton";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Setting up your session...");

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      const redirectPath = searchParams.get("redirect") || "/dashboard";

      if (!accessToken || !refreshToken) {
        console.error("No tokens in callback URL");
        setStatus("Error: No authentication tokens found");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      try {
        console.log("Setting session from callback...");
        setStatus("Setting up your session...");
        const supabase = getSupabaseClient();

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Failed to set session:", error);
          setStatus("Error: Failed to set up session");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        console.log("Session set successfully, redirecting to:", redirectPath);
        setStatus("Session established! Redirecting...");

        // Use navigate instead of window.location.href to avoid full page reload
        // This preserves the React state and auth context
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("Error: Authentication failed");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};
