import { useState } from "react";
// import { useNavigate } from 'react-router-dom'
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
import {
  CheckCircle,
  Shield,
  AlertCircle,
  Zap,
  MessageSquare,
  Phone,
  Headphones,
} from "lucide-react";
import { useUserProfile, useCurrentUserCompany } from "@sms-hub/supabase/react";
import { getHubContent } from "@sms-hub/hub-logic";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: var(--hub-background, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ContentCard = styled(Card)`
  max-width: 600px;
  width: 100%;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #4b5563;
`;

const PriceSection = styled.div`
  text-align: center;
  padding: 2rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  margin: 1.5rem 0;
`;

const Price = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;

  span {
    font-size: 1.25rem;
    color: #6b7280;
    font-weight: normal;
  }
`;

const CTAButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: 1.1rem;
  font-weight: 600;
  background: var(--hub-primary, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: var(--hub-primary-dark, #2563eb);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  transition: all 0.2s ease;
`;

export function PaymentRequired() {
  const { hubConfig, currentHub } = useHub();
  // const navigate = useNavigate()
  const { data: userProfile } = useUserProfile();
  const { data: company } = useCurrentUserCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get hub-specific content
  const hubContent = getHubContent(currentHub);

  // Hub-specific features based on Gnymble pricing page
  const setupFeatures = [
    "Complete business setup & training",
    "Compliance consultation & setup",
    "Dedicated onboarding specialist",
    "First month of chosen plan included",
  ];
  
  const everyPlanIncludes = [
    { icon: Shield, text: "Full compliance & regulatory expertise" },
    { icon: MessageSquare, text: "Professional SMS delivery platform" },
    { icon: Phone, text: "Dedicated phone number included" },
    { icon: Headphones, text: "Expert customer support" },
  ];

  const handleStartPayment = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Create Stripe checkout session
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: userProfile?.email,
            userId: userProfile?.id,
            companyId: company?.id,
            hubId: hubConfig.hubNumber,
            successUrl: `http://localhost:3001/payment-success`,
            cancelUrl: `http://localhost:3001/payment-required`,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to start payment process");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ContentCard>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <HubLogo
              hubType={currentHub}
              variant="icon"
              size="lg"
              className="w-16 h-16 mx-auto"
            />
          </div>
          <CardTitle className="text-2xl">Complete Your Setup</CardTitle>
          <CardDescription>
            Welcome to {hubConfig.displayName}! {hubContent.cta.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {userProfile && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Account</p>
              <p className="font-medium">
                {userProfile.first_name} {userProfile.last_name}
              </p>
              <p className="text-sm text-gray-500">{userProfile.email}</p>
            </div>
          )}

          <PriceSection>
            <p className="text-sm text-gray-600 mb-2">Get Started Package</p>
            <Price>
              $179<span> one-time setup</span>
            </Price>
            <p className="text-sm text-gray-500 mt-2">
              {hubContent.cta.guaranteeText || "8-day setup guarantee"}
            </p>
          </PriceSection>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">
              Your setup includes:
            </h3>
            <FeatureList>
              {setupFeatures.map((feature, index) => (
                <FeatureItem key={index}>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {feature}
                </FeatureItem>
              ))}
            </FeatureList>
            
            <h3 className="font-semibold mb-3 mt-6">
              Every plan includes:
            </h3>
            <FeatureList>
              {everyPlanIncludes.map((item, index) => {
                const Icon = item.icon;
                return (
                  <FeatureItem key={index}>
                    <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    {item.text}
                  </FeatureItem>
                );
              })}
            </FeatureList>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <CTAButton onClick={handleStartPayment} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                {hubContent.cta.ctaText || "🚀 GET STARTED NOW"}
              </>
            )}
          </CTAButton>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure payment powered by Stripe</span>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              <strong>After setup:</strong> Choose from our monthly plans starting at $79/month
            </p>
          </div>
        </CardContent>
      </ContentCard>
    </Container>
  );
}
