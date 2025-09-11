import { useAuth } from "../hooks/useAuth";
import { useSearchParams } from "react-router-dom";

export function DebugAuth() {
  const auth = useAuth();
  const [searchParams] = useSearchParams();
  
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Auth Debug Page</h1>
      <h2>URL Params:</h2>
      <pre>{JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}</pre>
      
      <h2>Auth State:</h2>
      <pre>{JSON.stringify({
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        user: auth.user ? { email: auth.user.email, role: auth.user.role } : null,
        session: auth.session ? "Active" : "None"
      }, null, 2)}</pre>
      
      <h2>Local Storage:</h2>
      <pre>{JSON.stringify({
        dev_bypass: localStorage.getItem("dev_bypass"),
        supabase_auth: localStorage.getItem("sb-vgpovgpwqkjnpnrjelyg-auth-token") ? "Present" : "None"
      }, null, 2)}</pre>
      
      <h2>Environment:</h2>
      <pre>{JSON.stringify({
        MODE: import.meta.env.MODE,
        DEV: import.meta.env.DEV,
        devAuthToken: import.meta.env.VITE_DEV_AUTH_TOKEN ? "Configured" : "Missing"
      }, null, 2)}</pre>
    </div>
  );
}