import { useAuthContext } from "@sms-hub/auth";
import { getSupabaseClient } from "../lib/supabaseSingleton";
import { useEffect, useState } from "react";

export function AuthStateDebug() {
  const auth = useAuthContext();
  const [sessionData, setSessionData] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      setSessionData(data);
      
      // Check if we can manually load the user profile
      if (data.session?.user?.id) {
        try {
          const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();
            
          setLogs(prev => [...prev, `Manual profile query: ${error ? `Error: ${error.message}` : `Success: ${profile?.email}`}`]);
        } catch (e) {
          setLogs(prev => [...prev, `Manual profile query failed: ${e}`]);
        }
      }
    };
    checkSession();
  }, []);
  
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Auth State Debug</h1>
      
      <h2>Auth Context State:</h2>
      <pre>{JSON.stringify({
        user: auth.user ? { 
          id: auth.user.id, 
          email: auth.user.email, 
          role: auth.user.role 
        } : null,
        loading: auth.loading,
        error: auth.error,
        hasSession: !!auth.session
      }, null, 2)}</pre>
      
      <h2>Direct Supabase Session:</h2>
      <pre>{JSON.stringify({
        session: sessionData?.session ? {
          user: {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email
          },
          expires_at: sessionData.session.expires_at
        } : null
      }, null, 2)}</pre>
      
      <h2>Actions:</h2>
      <button 
        onClick={() => auth.refreshUser()}
        style={{ padding: "10px", marginRight: "10px" }}
      >
        Refresh User
      </button>
      <button 
        onClick={() => window.location.reload()}
        style={{ padding: "10px" }}
      >
        Reload Page
      </button>
      
      <h2>Debug Logs:</h2>
      <pre>{logs.join('\n')}</pre>
    </div>
  );
}