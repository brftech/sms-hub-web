import { useState, useEffect, useCallback } from "react";
import { UserProfile, UserRole } from "../types/roles";
import { useSupabase } from "../providers/SupabaseProvider";
import { useSearchParams } from "react-router-dom";
import { logger } from "../utils/logger";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  session: any;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    session: null,
    logout: async () => {},
  });

  const supabase = useSupabase();
  const [searchParams] = useSearchParams();
  const superadminParam = searchParams.get("superadmin");

  const logout = useCallback(async () => {
    try {
      // Clear dev bypass if it exists
      localStorage.removeItem("dev_bypass");

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Reset auth state
      setAuthState((prevState) => ({
        ...prevState,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
      }));
    } catch (error) {
      logger.error("Logout error:", error);
    }
  }, [supabase]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isDevelopment = import.meta.env.MODE === "development";

        // Check for dev bypass only in development
        if (isDevelopment) {
          // Quick hardcoded check for immediate use
          const devBypass =
            superadminParam || localStorage.getItem("dev_bypass");

          // Accept either the old dev123 or the new secure token
          if (
            devBypass === "dev123" ||
            devBypass === "ZT6LyVWLAWNSSqJgkaqTKj/orJ0i9pZHNm7d0qyL3l"
          ) {
            logger.auth("Dev superadmin bypass activated");

            // Store in localStorage for persistence
            localStorage.setItem("dev_bypass", devBypass);

            // Create mock superadmin user
            const mockSuperadmin: UserProfile = {
              id: "00000000-0000-0000-0000-000000000001",
              email: "superadmin@sms-hub.com",
              mobile_phone_number: "+15551234567",
              first_name: "Super",
              last_name: "Admin",
              company_id: "00000000-0000-0000-0000-000000000002",
              // company_name: "SMS Hub System", // Not in UserProfile interface
              company_admin: true,
              hub_id: 1, // PercyTech
              payment_status: "completed",
              onboarding_completed: true,
              verification_setup_completed: true,
              role: UserRole.SUPERADMIN,
              account_number: "PERCY-SA001",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              signup_type: "email",
              permissions: {
                can_manage_users: true,
                can_manage_companies: true,
                can_manage_billing: true,
                can_view_analytics: true,
                can_manage_system: true,
              },
            };

            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              user: mockSuperadmin,
              session: {
                user: {
                  id: mockSuperadmin.id,
                  email: mockSuperadmin.email,
                },
                access_token: "dev-superadmin-token",
              },
              logout,
            });
            return;
          }
        }

        // Check Supabase session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          logger.error("Error getting session:", sessionError);
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            session: null,
            logout,
          });
          return;
        }

        if (!session) {
          logger.auth("No active session found");
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            session: null,
            logout,
          });
          return;
        }

        logger.auth("Session found", { email: session.user.email });

        // Load user profile from database
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          logger.error("Error loading user profile:", profileError);
          // Even if profile fails, user is authenticated
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: {
              id: session.user.id,
              email: session.user.email || "",
              first_name: "",
              last_name: "",
              role: UserRole.USER,
              signup_type: "email",
              permissions: {},
            } as UserProfile,
            session,
            logout,
          });
          return;
        }

        logger.auth("User profile loaded", { email: profile.email });

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: profile as UserProfile,
          session,
          logout,
        });
      } catch (error) {
        logger.error("Auth check error:", error);
        setAuthState((prevState) => ({
          ...prevState,
          isAuthenticated: false,
          isLoading: false,
          user: null,
          session: null,
        }));
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      logger.auth("Auth state changed", { event });

      if (event === "SIGNED_IN" && session) {
        // Reload user profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setAuthState((prevState) => ({
          ...prevState,
          isAuthenticated: true,
          isLoading: false,
          user:
            (profile as UserProfile) ||
            ({
              id: session.user.id,
              email: session.user.email || "",
              first_name: "",
              last_name: "",
              role: UserRole.USER,
              signup_type: "email",
              permissions: {},
            } as UserProfile),
          session,
        }));
      } else if (event === "SIGNED_OUT") {
        setAuthState((prevState) => ({
          ...prevState,
          isAuthenticated: false,
          isLoading: false,
          user: null,
          session: null,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, superadminParam]);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    session: authState.session,
    logout,
  };
};
