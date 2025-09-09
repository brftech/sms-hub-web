import { useState, useEffect } from "react";
import type { AuthState } from "../ProtectedRoute";

export interface UseAuthConfig {
  checkSession: () => Promise<{ session: any; user: any } | null>;
  getUserProfile?: (userId: string) => Promise<any>;
  onAuthStateChange?: (callback: (event: string, session: any) => void) => {
    unsubscribe: () => void;
  };
  devAuthOverride?: {
    isEnabled: boolean;
    user?: any;
    profile?: any;
  };
}

export function useAuth(config: UseAuthConfig): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    userProfile: null,
    session: null,
  });

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initAuth = async () => {
      try {
        // Check for dev auth override first
        if (config.devAuthOverride?.isEnabled) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: config.devAuthOverride.user,
            userProfile: config.devAuthOverride.profile,
            session: { user: config.devAuthOverride.user },
          });
          return;
        }

        // Check regular session
        const sessionData = await config.checkSession();

        if (sessionData?.session) {
          let profile = null;

          // Load user profile if available
          if (config.getUserProfile && sessionData.user?.id) {
            try {
              profile = await config.getUserProfile(sessionData.user.id);
            } catch (error) {
              console.error("Failed to load user profile:", error);
            }
          }

          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: sessionData.user,
            userProfile: profile,
            session: sessionData.session,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            userProfile: null,
            session: null,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          userProfile: null,
          session: null,
        });
      }
    };

    initAuth();

    // Subscribe to auth changes if available
    if (config.onAuthStateChange && !config.devAuthOverride?.isEnabled) {
      const subscription = config.onAuthStateChange((event, session) => {
        console.log("Auth state changed:", event, session);
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: !!session,
          session,
          user: session?.user || null,
        }));
      });
      unsubscribe = subscription.unsubscribe;
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [
    config.devAuthOverride?.isEnabled,
    config.devAuthOverride?.user,
    config.devAuthOverride?.profile,
  ]);

  return authState;
}
