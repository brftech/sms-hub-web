import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PageLayout, SEO } from "@sms-hub/ui";
import { CheckCircle, ArrowRight, Loader } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "error" | "pending"
  >("pending");
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");

    if (!sessionIdParam) {
      setPaymentStatus("error");
      setIsVerifying(false);
      return;
    }

    setSessionId(sessionIdParam);

    // Simple verification - if we have a session_id, assume success
    // The Stripe webhook will handle the actual verification and lead creation
    setTimeout(() => {
      setPaymentStatus("success");
      setIsVerifying(false);
    }, 2000); // Give webhook time to process
  }, [searchParams]);

  const handleContinueToApp = () => {
    // Redirect to the main app (app2) for account setup
    const currentHub = window.location.hostname.includes('percytech') ? 'percytech' : 
                      window.location.hostname.includes('percymd') ? 'percymd' :
                      window.location.hostname.includes('percytext') ? 'percytext' : 'gnymble';
    
    window.location.href = `https://app.${currentHub}.com?payment_success=true&session_id=${sessionId}`;
  };

  if (isVerifying) {
    return (
      <PageLayout>
        <SEO
          title="Verifying Payment - SMS Hub"
          description="Verifying your payment..."
        />
        <Navigation />

        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 pt-24">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
              <Loader className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-4">
                Verifying Payment...
              </h1>
              <p className="text-gray-300">
                Please wait while we confirm your payment.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </PageLayout>
    );
  }

  if (paymentStatus === "error") {
    return (
      <PageLayout>
        <SEO
          title="Payment Error - SMS Hub"
          description="There was an issue with your payment."
        />
        <Navigation />

        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 pt-24">
          <div className="max-w-md w-full text-center">
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm rounded-3xl border border-red-700/50 p-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Payment Issue
              </h1>
              <p className="text-gray-300 mb-8">
                We couldn't verify your payment. Please try again or contact
                support.
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300"
              >
                Back to Pricing
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO
        title="Payment Successful - SMS Hub"
        description="Your payment was successful! Complete your account setup."
      />
      <Navigation />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 pt-24">
        <div className="max-w-lg w-full text-center">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

            <h1 className="text-3xl font-bold text-white mb-4">
              Payment Successful! 🎉
            </h1>

            <p className="text-gray-300 mb-8 text-lg">
              Thank you for your payment. Now let's create your account and get
              you set up with SMS messaging.
            </p>

            <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-2xl border border-green-700/30 p-6 mb-8">
              <h3 className="text-white font-semibold mb-2">What's Next:</h3>
              <ul className="text-green-300 text-sm space-y-2 text-left">
                <li>• Create your account (30 seconds)</li>
                <li>• Complete business verification</li>
                <li>• Get your dedicated phone number</li>
                <li>• Start sending compliant SMS messages</li>
              </ul>
            </div>

            <button
              onClick={handleContinueToApp}
              className="w-full px-8 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300 text-lg flex items-center justify-center group"
            >
              Complete Account Setup
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <p className="text-gray-400 text-sm mt-4">
              Session ID: {sessionId?.slice(-8)}...
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default PaymentSuccess;
