import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../providers/SupabaseProvider";
import { redirectToWebApp, getWebAppUrl } from "@sms-hub/utils";

export function CheckoutRedirect() {
  const navigate = useNavigate();
  const supabase = useSupabase();

  useEffect(() => {
    const handleCheckout = async () => {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No session found after login");
        redirectToWebApp('/login');
        return;
      }

      // Get pending checkout data
      const checkoutDataStr = sessionStorage.getItem('pending_checkout');
      if (!checkoutDataStr) {
        console.log("No pending checkout, going to dashboard");
        navigate("/");
        return;
      }

      const checkoutData = JSON.parse(checkoutDataStr);
      sessionStorage.removeItem('pending_checkout');

      try {
        // Create checkout session
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email: checkoutData.email,
            userId: checkoutData.userId,
            companyId: checkoutData.companyId,
            hubId: checkoutData.hubId,
            customerType: checkoutData.customerType,
            successUrl: `${window.location.origin}/payment-callback?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: getWebAppUrl('/')
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout session");
        }

        // Redirect to Stripe
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err: any) {
        console.error("Checkout error:", err);
        // If checkout fails, still let them into the app
        navigate("/");
      }
    };

    handleCheckout();
  }, [supabase, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">Redirecting to checkout...</p>
      </div>
    </div>
  );
}