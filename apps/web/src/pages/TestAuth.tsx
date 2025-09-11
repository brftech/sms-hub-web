import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabaseSingleton";

export function TestAuth() {
  const [status, setStatus] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseClient();

        // Check environment
        const envStatus = {
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL
            ? "✓ Configured"
            : "✗ Missing",
          supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY
            ? "✓ Configured"
            : "✗ Missing",
          devAuthToken: import.meta.env.VITE_DEV_AUTH_TOKEN
            ? "✓ Configured"
            : "✗ Missing",
          environment: import.meta.env.MODE,
        };

        // Test connection
        const { data: session, error: sessionError } =
          await supabase.auth.getSession();

        // Test auth
        const testEmail = "superadmin@gnymble.com";
        const testPassword = "SuperAdmin123!";

        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
          });

        setStatus({
          environment: envStatus,
          session: session ? "Active session" : "No session",
          sessionError: sessionError?.message || null,
          authTest: authData ? "Success" : "Failed",
          authError: authError?.message || null,
          supabaseConnected: !sessionError,
        });

        // Sign out if we signed in for testing
        if (authData) {
          await supabase.auth.signOut();
        }
      } catch (error: unknown) {
        setStatus({
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Auth Test Page</h1>
      <pre>{JSON.stringify(status, null, 2)}</pre>
      <div>
        <h3>Test URLs:</h3>
        <ul>
          <li>
            Dev Auth:{" "}
            <a
              href={`http://localhost:3001/?superadmin=${import.meta.env.VITE_DEV_AUTH_TOKEN}`}
            >
              Test Dev Auth
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
