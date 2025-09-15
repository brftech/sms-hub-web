import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSupabaseClient } from "../lib/supabaseSingleton";
import { logger } from "@sms-hub/logger";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        logger.info("[AuthCallback] Processing auth callback...");

        // Get tokens from URL params
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const redirectPath = searchParams.get("redirect") || "/dashboard";

        logger.info("[AuthCallback] Params:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          redirectPath,
        });

        if (!accessToken || !refreshToken) {
          throw new Error("Missing authentication tokens");
        }

        // Set the session in Supabase
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          logger.error("[AuthCallback] Error setting session:", error);
          throw error;
        }

        if (!data.session) {
          throw new Error("Failed to establish session");
        }

        logger.info("[AuthCallback] Session set successfully:", {
          userId: data.session.user.id,
          email: data.session.user.email,
        });

        // Check if this is a signup flow and create business records
        const type = searchParams.get("type");
        if (type === "signup") {
          logger.info("[AuthCallback] Processing signup completion...");

          try {
            // Get user metadata from session
            const userMetadata = data.session.user.user_metadata || {};

            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signup-native`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  email: data.session.user.email,
                  password: "dummy", // Not used for business records creation
                  phone_number: userMetadata.phone_number || "",
                  first_name: userMetadata.first_name || "",
                  last_name: userMetadata.last_name || "",
                  company_name: userMetadata.company_name || "Unknown Company",
                  hub_id: userMetadata.hub_id || 1,
                  signup_type: userMetadata.signup_type || "new_company",
                  customer_type: userMetadata.customer_type || "company",
                  create_business_records: true,
                }),
              }
            );

            const result = await response.json();

            if (!response.ok) {
              logger.warn(
                "[AuthCallback] Business records creation failed (non-critical):",
                result.error
              );
            } else {
              logger.info(
                "[AuthCallback] Business records created successfully:",
                result
              );
            }
          } catch (signupError) {
            logger.warn(
              "[AuthCallback] Business records creation error (non-critical):",
              {
                error:
                  signupError instanceof Error
                    ? signupError.message
                    : String(signupError),
              }
            );
          }
        }

        logger.info(
          "[AuthCallback] Session established, redirecting to dashboard"
        );

        // Session is set, redirect to the intended path
        logger.info(`[AuthCallback] Redirecting to ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      } catch (err) {
        logger.error("[AuthCallback] Error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");

        // Redirect to landing page after a delay
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, supabase.auth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Completing authentication...
        </h2>
        <p className="text-gray-600 mt-2">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
