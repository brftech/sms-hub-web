import { useEffect, useState } from "react";
import { HubLogo } from "@sms-hub/ui";
import { useHub } from "@sms-hub/ui";
import { getSupabaseClient } from "../lib/supabaseSingleton";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const { hubConfig } = useHub();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      
      // Check if this is a magic link callback (has auth token in URL)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        console.log("Magic link detected, processing auth...");
        // Wait longer for magic link to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Give Supabase time to check existing session
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is authenticated - check if they've paid
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, onboarding_completed, payment_status')
          .eq('id', session.user.id)
          .single();
          
        // Check payment status first
        if (profile && profile.payment_status !== 'paid') {
          // No payment yet - send to Stripe
          navigate('/payment-required');
        } else if (profile && !profile.onboarding_completed) {
          // Paid but not onboarded
          navigate('/onboarding');
        } else {
          // Paid and onboarded
          navigate('/dashboard');
        }
      } else {
        // No session - redirect to login
        window.location.href = "http://localhost:3000/login";
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <HubLogo
          hubType={hubConfig.id}
          variant="icon"
          size="lg"
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Welcome to {hubConfig.displayName}
        </h1>
        <p className="text-muted-foreground mb-6">
          Please log in to access your dashboard.
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        <div className="mt-4">
          <a
            href="http://localhost:3000/login"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
};
