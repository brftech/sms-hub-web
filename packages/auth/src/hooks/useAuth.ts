import { useState, useEffect, useCallback, useRef } from "react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { logger } from "@sms-hub/logger";
import type { AuthState, AuthUser, AuthConfig } from "../types";

export interface UseAuthOptions {
  supabase: SupabaseClient;
  config?: AuthConfig;
  onAuthStateChange?: (event: string, session: Session | null) => void;
}

export function useAuth({
  supabase,
  config: _config = {}, // Prefixed with _ to indicate it's intentionally unused
  onAuthStateChange,
}: UseAuthOptions): AuthState & {
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const isMountedRef = useRef(true);
  const isInitialMount = useRef(true);

  // Load user profile from database
  const loadUserProfile = useCallback(
    async (userId: string): Promise<AuthUser | null> => {
      try {
        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          logger.error("[loadUserProfile] Failed to load user profile", error, {
            userId,
          });
          return null;
        }

        return profile as AuthUser;
      } catch (error) {
        logger.error(
          "[loadUserProfile] Error loading user profile",
          error as Error,
          { userId }
        );
        return null;
      }
    },
    [supabase]
  );

  // Sign out user
  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await supabase.auth.signOut();

      if (isMountedRef.current) {
        setState({
          user: null,
          session: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      logger.error("Sign out error", error as Error);
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
      }
    }
  }, [supabase]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const profile = await loadUserProfile(session.user.id);
      if (isMountedRef.current) {
        setState((prev) => ({
          ...prev,
          user: profile,
          session,
        }));
      }
    }
  }, [supabase, loadUserProfile]);

  // Update user profile
  const updateUser = useCallback(
    async (updates: Partial<AuthUser>) => {
      if (!state.user) {
        throw new Error("No user to update");
      }

      try {
        const { error } = await supabase
          .from("user_profiles")
          .update(updates)
          .eq("id", state.user.id);

        if (error) throw error;

        // Refresh user data
        await refreshUser();
      } catch (error) {
        logger.error("Failed to update user", error as Error);
        throw error;
      }
    },
    [supabase, state.user, refreshUser]
  );

  // Initialize auth state
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        logger.debug("[useAuth] Initializing auth state");
        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        logger.debug("[useAuth] Session check", {
          hasSession: !!session,
          error,
        });

        if (error) {
          logger.error("Session initialization error", error);
          setState({
            user: null,
            session: null,
            loading: false,
            error,
          });
          return;
        }

        // Load user profile if session exists
        let user: AuthUser | null = null;
        if (session?.user) {
          logger.debug("[useAuth] Loading user profile for", {
            userId: session.user.id,
          });
          user = await loadUserProfile(session.user.id);
          logger.debug("[useAuth] User profile loaded", { hasUser: !!user });

          // If no profile exists, user remains null
          // The app should handle this case by redirecting to onboarding
        }

        // For initial mount, always set state regardless of mount status
        // This handles React StrictMode double-mounting in development
        logger.debug("[useAuth] Setting state with user", {
          hasUser: !!user,
          hasSession: !!session,
        });
        setState({
          user,
          session,
          loading: false,
          error: null,
        });
        isInitialMount.current = false;

        // Set up auth state listener
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            logger.debug("Auth state changed", {
              event,
              hasSession: !!session,
            });

            // Call external handler if provided
            onAuthStateChange?.(event, session);

            if (!isMountedRef.current) return;

            switch (event) {
              case "SIGNED_IN":
              case "TOKEN_REFRESHED":
                if (session?.user) {
                  const profile = await loadUserProfile(session.user.id);
                  setState({
                    user: profile,
                    session,
                    loading: false,
                    error: null,
                  });
                }
                break;

              case "SIGNED_OUT":
                setState({
                  user: null,
                  session: null,
                  loading: false,
                  error: null,
                });
                break;

              case "USER_UPDATED":
                if (session?.user) {
                  const profile = await loadUserProfile(session.user.id);
                  setState((prev) => ({
                    ...prev,
                    user: profile,
                    session,
                  }));
                }
                break;
            }
          }
        );

        subscription = data.subscription;
      } catch (error) {
        logger.error("Auth initialization error", error as Error);
        if (isMountedRef.current) {
          setState({
            user: null,
            session: null,
            loading: false,
            error: error as Error,
          });
        }
      }
    };

    logger.debug("[useAuth] Starting initializeAuth");
    initializeAuth();

    return () => {
      isMountedRef.current = false;
      subscription?.unsubscribe();
    };
  }, [supabase, loadUserProfile, onAuthStateChange]);

  // Log current state for debugging
  useEffect(() => {
    logger.debug("[useAuth] Current state", {
      hasUser: !!state.user,
      hasSession: !!state.session,
      loading: state.loading,
      userId: state.user?.id,
    });
  }, [state]);

  return {
    ...state,
    signOut,
    refreshUser,
    updateUser,
  };
}
