import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useHub,
  HubLogo,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sms-hub/ui";
import { Progress } from "@sms-hub/ui";
import {
  useAuth,
  useOnboardingSubmission,
  useCreateOnboardingSubmission,
  useUpdateOnboardingSubmission,
  useCreateCompany,
} from "@sms-hub/supabase/react";
import { ONBOARDING_STEPS, OnboardingStepName } from "@sms-hub/types";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useDevAuth } from "../../hooks/useDevAuth";
import { DevAdminBanner } from "../../components/DevAdminBanner";

// Import step components (to be created)
import { PaymentStep } from "./steps/PaymentStep";
import { BrandStep } from "./steps/BrandStep";
import { PrivacyTermsStep } from "./steps/PrivacyTermsStep";
import { CampaignStep } from "./steps/CampaignStep";
import { BandwidthStep } from "./steps/BandwidthStep";
import { ActivationStep } from "./steps/ActivationStep";

export function Onboarding() {
  const { hubConfig, currentHub } = useHub();
  const navigate = useNavigate();
  const devAuth = useDevAuth();
  const { data: user, isLoading: userLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStepName>("payment");
  const [companyId, setCompanyId] = useState<string>("");

  const createCompany = useCreateCompany();
  const createSubmission = useCreateOnboardingSubmission();
  const updateSubmission = useUpdateOnboardingSubmission();

  const { data: submission, isLoading: submissionLoading } =
    useOnboardingSubmission(companyId, hubConfig.hubNumber);

  // Redirect if not authenticated (but allow dev superadmin)
  useEffect(() => {
    if (!userLoading && !user && !devAuth.isSuperadmin) {
      navigate("/signup");
    }
  }, [user, userLoading, navigate, devAuth.isSuperadmin]);

  // Initialize company and submission
  useEffect(() => {
    if (user && !companyId) {
      // Check if user already has a company
      const existingCompanyId = user.company_id;
      if (existingCompanyId) {
        setCompanyId(existingCompanyId);
      } else {
        // Only initialize if user doesn't have pending checkout
        const pendingCheckout = sessionStorage.getItem("pending_checkout");
        if (!pendingCheckout) {
          initializeOnboarding();
        }
      }
    }
  }, [user, companyId]);

  // Set initial step based on pending checkout status - CONSOLIDATED BELOW
  // useEffect(() => {
  //   const pendingCheckout = sessionStorage.getItem('pending_checkout')
  //   console.log('🎯 Setting initial step - Pending checkout:', !!pendingCheckout, 'User:', !!user)
  //
  //   if (pendingCheckout && user) {
  //     // If payment complete, start at brand step
  //     console.log('✅ Payment complete, starting at brand step')
  //     setCurrentStep('brand')
  //   } else if (!pendingCheckout && user) {
  //     // If no pending checkout, start at payment step
  //     console.log('💳 No payment, starting at payment step')
  //     setCurrentStep('payment')
  //   }
  // }, [user])

  // Set current step from submission or check payment status
  useEffect(() => {
    console.log(
      "🎯 useEffect - Submission:",
      !!submission,
      "CompanyId:",
      !!companyId,
      "User:",
      !!user
    );
    console.log(
      "📊 Submission details:",
      submission
        ? {
            id: submission.id,
            current_step: submission.current_step,
            stripe_status: submission.stripe_status,
            created_at: submission.created_at,
          }
        : "No submission"
    );

    if (submission) {
      console.log("📋 Using submission step:", submission.current_step);
      setCurrentStep(submission.current_step as OnboardingStepName);
    } else if (companyId && user) {
      // Check if user has already completed payment by looking at the submission
      // The webhook should have created/updated this after payment
      if (submission?.stripe_status === "completed") {
        // Payment is complete, start at brand step
        console.log(
          "✅ Payment complete (from submission), starting at brand step"
        );
        setCurrentStep("brand");
      } else {
        // No payment completed, start at payment step
        console.log("💳 No payment completed, starting at payment step");
        setCurrentStep("payment");
      }
    }
  }, [submission, companyId, user, createSubmission, hubConfig.hubNumber]);

  const initializeOnboarding = async () => {
    if (!user) return;

    try {
      // Create company
      const company = await createCompany.mutateAsync({
        hub_id: hubConfig.hubNumber,
        public_name: user.first_name
          ? `${user.first_name}'s Company`
          : "New Company",
        billing_email: user.email || "",
        created_by_profile_id: user.id,
      });

      setCompanyId(company.id);

      // Create onboarding submission starting at payment step
      // The webhook will update this to 'brand' step after payment is complete
      await createSubmission.mutateAsync({
        company_id: company.id,
        hub_id: hubConfig.hubNumber,
        user_id: user?.id || "",
        current_step: "payment",
        step_data: {},
      });
    } catch (error) {
      console.error("Onboarding initialization error:", error);
      toast.error("Failed to initialize onboarding");
    }
  };

  const handleStepComplete = async (stepData: Record<string, any>) => {
    if (!submission) return;

    try {
      const stepNames = Object.keys(ONBOARDING_STEPS) as OnboardingStepName[];
      const currentStepIndex = stepNames.indexOf(currentStep);
      const nextStep = stepNames[currentStepIndex + 1];

      await updateSubmission.mutateAsync({
        id: submission.id,
        current_step: nextStep || "activation",
        step_data: {
          ...((submission.step_data as Record<string, any>) || {}),
          [currentStep]: stepData,
        },
      });

      if (nextStep) {
        setCurrentStep(nextStep);
      } else {
        // Onboarding complete
        toast.success("Onboarding complete! Welcome to the platform.");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Step completion error:", error);
      toast.error("Failed to save progress");
    }
  };

  const handleStepBack = () => {
    const stepNames = Object.keys(ONBOARDING_STEPS) as OnboardingStepName[];
    const currentStepIndex = stepNames.indexOf(currentStep);
    const prevStep = stepNames[currentStepIndex - 1];

    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  if ((userLoading || submissionLoading || !user) && !devAuth.isSuperadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HubLogo hubType={currentHub} variant="full" size="lg" />
          <p className="mt-4 text-muted-foreground">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  // If no submission exists and we have a company, create one for payment step
  if (!submission && companyId && currentStep === "payment") {
    // User has company but no onboarding submission - they need to complete payment
  }

  // Check if user should skip payment step based on database state
  if (submission?.stripe_status === "completed" && currentStep === "payment") {
    console.log(
      "🔄 Payment already completed, redirecting from payment to brand step"
    );
    setCurrentStep("brand");
    return null;
  }

  console.log(
    "🔍 Current step:",
    currentStep,
    "Submission stripe status:",
    submission?.stripe_status
  );

  const stepConfig = ONBOARDING_STEPS[currentStep];
  const stepNames = Object.keys(ONBOARDING_STEPS) as OnboardingStepName[];
  const currentStepIndex = stepNames.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / stepNames.length) * 100;

  const renderStepComponent = () => {
    console.log("🎭 Rendering step component for:", currentStep);

    const stepProps = {
      hubId: hubConfig.hubNumber,
      companyId,
      userId: user?.id || "",
      submission: submission || {
        id: "",
        company_id: companyId,
        hub_id: hubConfig.hubNumber,
        user_id: user?.id || "",
        current_step: currentStep,
        step_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assigned_phone_number: null,
        stripe_status: null,
        tcr_brand_id: null,
        tcr_campaign_id: null,
      },
      onComplete: handleStepComplete,
      onBack: currentStepIndex > 0 ? handleStepBack : undefined,
    };

    switch (currentStep) {
      case "payment":
        console.log("💳 Rendering PaymentStep");
        return <PaymentStep {...stepProps} />;
      case "brand":
        console.log("🏢 Rendering BrandStep");
        return <BrandStep {...stepProps} />;
      case "privacy_terms":
        console.log("📋 Rendering PrivacyTermsStep");
        return <PrivacyTermsStep {...stepProps} />;
      case "campaign":
        console.log("📢 Rendering CampaignStep");
        return <CampaignStep {...stepProps} />;
      case "bandwidth":
        console.log("📱 Rendering BandwidthStep");
        return <BandwidthStep {...stepProps} />;
      case "activation":
        console.log("🚀 Rendering ActivationStep");
        return <ActivationStep {...stepProps} />;
      default:
        console.log("❌ Unknown step:", currentStep);
        return <div>Step not found: {currentStep}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <DevAdminBanner />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <HubLogo hubType={currentHub} variant="full" size="lg" />
          <h1 className="mt-4 text-3xl font-bold hub-text-primary">
            {hubConfig.displayName} Setup
          </h1>
          <p className="text-muted-foreground">
            Complete these steps to activate your SMS platform
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{stepConfig.title}</CardTitle>
                <CardDescription>{stepConfig.description}</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {stepNames.length}
              </div>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Step Content */}
        <div className="mb-8">{renderStepComponent()}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          {currentStepIndex > 0 ? (
            <Button variant="outline" onClick={handleStepBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="text-sm text-muted-foreground">
            Need help? Contact support
          </div>
        </div>
      </div>
    </div>
  );
}
