import { useState, useEffect, useCallback } from "react";
import { UserProfile, UserRole } from "../types/roles";
import { useSupabase } from "../providers/SupabaseProvider";
import { logger } from "../utils/logger";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  session: any;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const supabase = useSupabase();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
    } catch (error) {
      logger.error("Logout error:", error);
    }
  }, [supabase]);

  useEffect(() => {
    console.log("[useAuth] Initializing...");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("[useAuth] Initial session check:", { hasSession: !!session, error });
      
      if (error) {
        console.error("[useAuth] Session error:", error);
        setIsLoading(false);
        return;
      }

      if (session) {
        console.log("[useAuth] Session found, loading profile...");
        
        // Load user profile
        supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile, error: profileError }) => {
            console.log("[useAuth] Profile loaded:", { hasProfile: !!profile, error: profileError });
            
            if (profile) {
              setUser(profile as UserProfile);
              setSession(session);
              setIsAuthenticated(true);
              setIsLoading(false);
              console.log("[useAuth] Auth state set - authenticated with profile");
            } else {
              // Create minimal user if profile doesn't exist
              const minimalUser = {
                id: session.user.id,
                email: session.user.email || "",
                first_name: "",
                last_name: "",
                role: UserRole.USER,
                signup_type: "email",
                permissions: {},
              } as UserProfile;
              setUser(minimalUser);
              setSession(session);
              setIsAuthenticated(true);
              setIsLoading(false);
              console.log("[useAuth] Auth state set - authenticated with minimal user");
            }
          })
          .catch(error => {
            console.error("[useAuth] Error loading profile:", error);
            setIsLoading(false);
          });
      } else {
        console.log("[useAuth] No session found");
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[useAuth] Auth state changed:", event, !!session);
      
      if (event === "SIGNED_IN" && session) {
        setSession(session);
        setIsAuthenticated(true);
        
        // Reload profile
        supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser(profile as UserProfile);
            }
          });
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    isAuthenticated,
    isLoading,
    user,
    session,
    logout,
  };
};