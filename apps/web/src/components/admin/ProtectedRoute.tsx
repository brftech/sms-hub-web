import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Simple password check - you can change this to whatever you want
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "gnymble2024";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      // Store in session storage so it persists during the session
      sessionStorage.setItem("admin_authenticated", "true");
    } else {
      setError("Invalid password");
    }
  };

  // Check if already authenticated from session storage
  React.useEffect(() => {
    const authenticated = sessionStorage.getItem("admin_authenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Admin Access Required</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            This area is restricted to authorized personnel only.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Admin Password
            </label>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="mt-1"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Access Admin Panel
          </Button>

          <div className="text-xs text-gray-500 text-center">
            <p>Contact your system administrator for access credentials.</p>
            <p className="mt-1">Environment: {import.meta.env.MODE}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtectedRoute;
