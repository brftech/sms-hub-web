import { useState, useEffect } from "react";
import type { AuthState } from "../ProtectedRoute";

export interface UseAuthConfig {
  checkSession: () => Promise<{ session: unknown; user: unknown } | null>;
  getUserProfile?: (userId: string) => Promise<unknown>;
  onAuthStateChange?: (callback: (event: string, session: unknown) => void) => {
    unsubscribe: () => void;
  };
  devAuthOverride?: {
    isEnabled: boolean;
    user?: unknown;
    profile?: unknown;
  };
}

export function useAuth(config: UseAuthConfig): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: undefined,
    userProfile: undefined,
    session: undefined,
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
            user: config.devAuthOverride.user as {
              id: string;
              email?: string;
              [key: string]: unknown;
            },
            userProfile: config.devAuthOverride.profile as {
              id: string;
              email: string;
              first_name?: string;
              last_name?: string;
              [key: string]: unknown;
            },
            session: { user: config.devAuthOverride.user } as {
              access_token?: string;
              refresh_token?: string;
              [key: string]: unknown;
            },
          });
          return;
        }

        // Check regular session
        const sessionData = await config.checkSession();

        if (sessionData?.session) {
          let profile = null;

          // Load user profile if available
          if (
            config.getUserProfile &&
            (sessionData.user as { id?: string })?.id
          ) {
            try {
              profile = await config.getUserProfile(
                (sessionData.user as { id: string }).id
              );
            } catch (error) {
              console.error("Failed to load user profile:", error);
            }
          }

          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: sessionData.user as {
              id: string;
              email?: string;
              [key: string]: unknown;
            },
            userProfile: profile as {
              id: string;
              email: string;
              first_name?: string;
              last_name?: string;
              [key: string]: unknown;
            },
            session: sessionData.session as {
              access_token?: string;
              refresh_token?: string;
              [key: string]: unknown;
            },
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: undefined,
            userProfile: undefined,
            session: undefined,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: undefined,
          userProfile: undefined,
          session: undefined,
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
          session: session as {
            access_token?: string;
            refresh_token?: string;
            [key: string]: unknown;
          },
          user:
            (
              session as {
                user?: { id: string; email?: string; [key: string]: unknown };
              }
            )?.user || undefined,
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
