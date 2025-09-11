import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useHub,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HubLogo,
} from "@sms-hub/ui";
import { Input, Label, Alert, AlertDescription } from "@sms-hub/ui";
import { Shield, Lock, AlertCircle } from "lucide-react";
import styled from "styled-components";
import { createSupabaseClient } from "@sms-hub/supabase";

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #e2e8f0;
  font-size: 0.875rem;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 36px;
  font-size: 0.875rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: #3b82f6;
  }
`;

export function SuperadminLogin() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const [email, setEmail] = useState("superadmin@sms-hub.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const supabase = createSupabaseClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          // Check if user is superadmin
          supabase
            .from("user_profiles")
            .select("role")
            .eq("id", user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile?.role === "SUPERADMIN") {
                navigate("/admin");
              }
            });
        }
      });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Use the superadmin-auth function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/superadmin-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Authentication failed");
      }

      setSuccess(true);

      // Store superadmin session
      sessionStorage.setItem(
        "superadmin_session",
        JSON.stringify({
          user: result.user,
          token: result.token,
          authenticated_at: new Date().toISOString(),
        })
      );

      // Redirect to admin app
      setTimeout(() => {
        window.location.href = "http://localhost:3003/";
      }, 1500);
    } catch (err: unknown) {
      console.error("Superadmin login error:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <LoginContainer>
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Superadmin Authenticated!
            </h2>
            <p className="text-gray-600 mb-4">
              You now have access to all platform features
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to admin panel...
            </p>
          </CardContent>
        </Card>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <div className="text-center mb-6">
            <HubLogo
              hubType={hubConfig.id}
              variant="icon"
              size="md"
              className="mx-auto mb-4"
            />
            <CardTitle className="text-2xl text-white">
              Superadmin Access
            </CardTitle>
            <CardDescription className="text-gray-300">
              Platform administration and management
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormGroup>
              <StyledLabel htmlFor="email">Superadmin Email</StyledLabel>
              <StyledInput
                id="email"
                type="email"
                placeholder="superadmin@sms-hub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </FormGroup>

            <FormGroup>
              <StyledLabel htmlFor="password">Password</StyledLabel>
              <StyledInput
                id="password"
                type="password"
                placeholder="Enter superadmin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </FormGroup>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-700"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
            >
              {isLoading ? "Authenticating..." : "Access Platform"}
              <Lock className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Superadmin access provides full platform control
            </p>
            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <p>• Access to all user accounts and data</p>
              <p>• Platform configuration and settings</p>
              <p>• System monitoring and analytics</p>
              <p>• User management and permissions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </LoginContainer>
  );
}
