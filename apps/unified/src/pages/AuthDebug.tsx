import { useAuthContext } from "@sms-hub/auth";

export const AuthDebug = () => {
  const { user, session, loading } = useAuthContext();
  const isAuthenticated = !!user;
  const isLoading = loading;
  
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Auth Debug Info</h1>
      <pre style={{ background: "#f0f0f0", padding: "10px", overflow: "auto" }}>
        {JSON.stringify({
          isAuthenticated,
          isLoading,
          hasUser: !!user,
          hasSession: !!session,
          user: user ? {
            id: user.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            hub_id: user.hub_id,
          } : null,
          sessionUser: session?.user?.email,
        }, null, 2)}
      </pre>
    </div>
  );
};