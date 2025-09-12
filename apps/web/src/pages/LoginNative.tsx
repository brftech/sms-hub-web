import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Mail, Key, LogIn } from "lucide-react";
import styled from "styled-components";
import { getSupabaseClient } from "../lib/supabaseSingleton";
import { useDevAuth, activateDevAuth } from "../hooks/useDevAuth";
import { DevAuthToggle } from "@sms-hub/ui";
import { webEnvironment } from "../config/webEnvironment";

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b1b 0%, #4a2c2c 50%, #3d2424 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 40px;
`;

const ForgotPasswordLink = styled(Link)`
  display: inline-block;
  text-align: right;
  font-size: 0.875rem;
  color: var(--hub-primary);
  margin-top: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`;

const supabase = getSupabaseClient();

export function LoginNative() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const devAuth = useDevAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Check for dev superadmin mode
  useEffect(() => {
    if (devAuth.isInitialized && devAuth.isSuperadmin) {
      console.log("Dev superadmin mode active - redirecting from login");
      navigate("/", { replace: true });
    }
  }, [devAuth.isInitialized, devAuth.isSuperadmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Call the login-native Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/login-native`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();
      console.log("Login response:", response.status, result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to log in");
      }

      // Set the session in the Supabase client
      if (result.session) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        });

        if (sessionError) {
          console.error("Failed to set session:", sessionError);
          throw new Error("Failed to establish session");
        }
      }

      // Store user data for the app
      sessionStorage.setItem(
        "user_data",
        JSON.stringify({
          user_id: result.user.id,
          email: result.user.email,
          hub_id: result.user.hub_id,
          role: result.user.role,
          company_id: result.user.company_id,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
        })
      );

      // Redirect based on user status
      const unifiedAppUrl = import.meta.env.VITE_UNIFIED_APP_URL || "http://localhost:3001";
      
      if (result.needs_payment) {
        window.location.href = `${unifiedAppUrl}/payment-setup`;
      } else if (result.needs_sms_verification) {
        window.location.href = `${unifiedAppUrl}/sms-verification`;
      } else if (result.needs_onboarding) {
        window.location.href = `${unifiedAppUrl}/onboarding`;
      } else {
        window.location.href = `${unifiedAppUrl}/dashboard`;
      }

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <DevAuthToggle
        environment={
          webEnvironment as unknown as {
            isDevelopment?: () => boolean;
            [key: string]: unknown;
          }
        }
        onActivate={() => activateDevAuth()}
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center mb-6">
            <HubLogo
              hubType={hubConfig.id}
              variant="icon"
              size="md"
              className="mx-auto mb-4"
            />
            <CardTitle className="text-2xl text-gray-900 font-bold">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-700">
              Log in to your {hubConfig.displayName} account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <StyledLabel htmlFor="email">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </StyledLabel>
              <StyledInput
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@company.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <StyledLabel htmlFor="password">
                <Key className="w-4 h-4 inline mr-1" />
                Password
              </StyledLabel>
              <StyledInput
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <ForgotPasswordLink to="/forgot-password">
                Forgot your password?
              </ForgotPasswordLink>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full hub-bg-primary hover:hub-bg-primary/90"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
              <LogIn className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-sm text-gray-700">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="hub-text-primary hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/superadmin-login")}
              className="text-gray-500 hover:text-gray-700"
            >
              Superadmin Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </LoginContainer>
  );
}