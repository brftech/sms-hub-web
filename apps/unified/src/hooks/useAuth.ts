import { useState, useEffect } from "react";
import { UserProfile, UserRole } from "../types/roles";
import { useSupabase } from "../providers/SupabaseProvider";
import { useSearchParams } from "react-router-dom";

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

  const logout = async () => {
    try {
      // Clear dev bypass if it exists
      localStorage.removeItem("dev_bypass");

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Reset auth state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        logout,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for dev bypass first - also check localStorage for persistence
        const devBypass =
          searchParams.get("superadmin") || localStorage.getItem("dev_bypass");

        if (devBypass === "dev123") {
          // Store in localStorage so it persists across navigation
          localStorage.setItem("dev_bypass", "dev123");
          console.log("Dev superadmin bypass activated");

          // Create mock superadmin user
          const mockSuperadmin: UserProfile = {
            id: "00000000-0000-0000-0000-000000000001",
            email: "superadmin@sms-hub.com",
            mobile_phone_number: "+15551234567",
            first_name: "Super",
            last_name: "Admin",
            company_id: "00000000-0000-0000-0000-000000000002",
            // company_name: "SMS Hub System", // Not in UserProfile interface
            customer_id: "00000000-0000-0000-0000-000000000003",
            hub_id: 1, // PercyTech
            payment_status: "completed",
            onboarding_completed: true,
            verification_setup_completed: true,
            is_active: true,
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

        // Check Supabase session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting session:", sessionError);
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
          console.log("No active session found");
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            session: null,
            logout,
          });
          return;
        }

        console.log("Session found:", session.user.email);

        // Load user profile from database
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error loading user profile:", profileError);
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

        console.log("User profile loaded:", profile.email);

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: profile as UserProfile,
          session,
          logout,
        });
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          session: null,
          logout,
        });
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log("Auth state changed:", event);

      if (event === "SIGNED_IN" && session) {
        // Reload user profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setAuthState({
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
          logout,
        });
      } else if (event === "SIGNED_OUT") {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          session: null,
          logout,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, searchParams]);

  return {
    ...authState,
    logout,
  };
};
