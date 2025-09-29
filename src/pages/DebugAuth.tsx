import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui";

export function DebugAuth() {
  const [searchParams] = useSearchParams();

  const allParams = Object.fromEntries(searchParams.entries());

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Auth Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Current URL:</h3>
                <p className="text-sm bg-gray-100 p-2 rounded font-mono">
                  {window.location.href}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">URL Parameters:</h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(allParams, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Environment Variables:</h3>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(
                    {
                      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
                      VITE_ADMIN_URL: "/admin",
                      NODE_ENV: import.meta.env.NODE_ENV,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
