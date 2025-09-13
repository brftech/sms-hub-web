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
// Removed dev auth imports - using real Supabase authentication

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
  color: var(--foreground);
`;

// Removed StyledInput - using Input directly from UI package

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

export function Login() {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  // Removed devAuth - using real Supabase authentication
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Dev auth removed - using real Supabase authentication

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== LOGIN FORM SUBMITTED ===");
    console.log("Email:", formData.email);
    console.log("Environment:", {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_UNIFIED_APP_URL: import.meta.env.VITE_UNIFIED_APP_URL,
    });

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
      console.log("Full result object:", JSON.stringify(result, null, 2));

      if (!response.ok) {
        throw new Error(result.error || "Failed to log in");
      }

      console.log("Response is OK, checking session...");
      console.log("Session exists?", !!result.session);
      console.log("Access token exists?", !!result.session?.access_token);

      // Set the session in the Supabase client
      if (result.session) {
        console.log("Setting session in Supabase client...");
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        });

        if (sessionError) {
          console.error("Failed to set session:", sessionError);
          throw new Error("Failed to establish session");
        }
        console.log("Session set successfully!");
      } else {
        console.error("No session in response!");
      }

      // Store user data for the app
      console.log("Storing user data in sessionStorage...");
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

      // Always redirect to dashboard after successful login
      const unifiedAppUrl =
        import.meta.env.VITE_UNIFIED_APP_URL || "http://localhost:3001";
      const redirectPath = result.redirect_to || "/dashboard";

      console.log("About to redirect...");
      console.log("Unified app URL:", unifiedAppUrl);
      console.log("Redirect path:", redirectPath);
      console.log("Full redirect URL:", `${unifiedAppUrl}${redirectPath}`);

      // Add a small delay to ensure everything is saved
      setTimeout(() => {
        console.log("Executing redirect now!");
        // Pass the session tokens in the URL so the unified app can set them
        const params = new URLSearchParams({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
          redirect: redirectPath,
        });

        // Use window.location.assign instead of window.location.href for better control
        window.location.assign(
          `${unifiedAppUrl}/auth-callback?${params.toString()}`
        );
      }, 100);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      {/* Dev auth toggle removed - using real Supabase authentication */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center mb-6">
            <HubLogo
              hubType={hubConfig.id}
              variant="icon"
              size="md"
              className="mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
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
              <Input
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
              <Input
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
            <p className="text-sm text-muted-foreground">
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
              className="text-muted-foreground hover:text-foreground"
            >
              Superadmin Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </LoginContainer>
  );
}
