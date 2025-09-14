import React, { createContext, useContext } from "react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { useAuth } from "../hooks/useAuth";
import type { AuthContextValue, AuthConfig } from "../types";

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
  supabase: SupabaseClient;
  config?: AuthConfig;
  onAuthStateChange?: (event: string, session: Session | null) => void;
}

export function AuthProvider({
  children,
  supabase,
  config,
  onAuthStateChange,
}: AuthProviderProps) {
  const auth = useAuth({
    supabase,
    config,
    onAuthStateChange,
  });

  const contextValue: AuthContextValue = {
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    error: auth.error,
    signOut: auth.signOut,
    refreshUser: auth.refreshUser,
    updateUser: auth.updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  
  return context;
}

// Export the context for advanced use cases
export { AuthContext };