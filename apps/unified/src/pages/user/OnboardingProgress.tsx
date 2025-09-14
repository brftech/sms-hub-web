import { useNavigate } from "react-router-dom";
import { useHub } from "@sms-hub/ui";
import {
  useCurrentUserCompany,
  useBrands,
  useCurrentUserCampaigns,
  useUserProfile,
} from "@sms-hub/supabase/react";
import { useCustomerByCompany } from "@sms-hub/supabase";
import { useDevAuth } from "@sms-hub/dev-auth";
import { userEnvironment } from "../../config/userEnvironment";
import {
  CheckCircle2,
  CreditCard,
  Building,
  Shield,
  Megaphone,
  Phone,
  Rocket,
  User,
  Briefcase,
  Settings,
  UserCheck,
  Star,
  Trophy,
  Target,
  Clock,
  ChevronRight,
} from "lucide-react";
import styled from "styled-components";

const PageContainer = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  min-height: calc(100vh - 6rem);
  padding: 1.5rem;
  border-radius: 16px;
  color: #f1f5f9;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(241, 245, 249, 0.8);
  margin-bottom: 2rem;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  min-width: 120px;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(148, 163, 184, 0.9);
`;

const ProgressSection = styled.div`
  background: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(71, 85, 105, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProgressTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${(props) => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, #64748b, #94a3b8);
  border-radius: 6px;
  transition: width 0.8s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(241, 245, 249, 0.2),
      transparent
    );
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const StepCard = styled.div<{ $completed: boolean; $current: boolean }>`
  background: ${(props) =>
    props.$completed
      ? "rgba(71, 85, 105, 0.25)"
      : props.$current
        ? "rgba(71, 85, 105, 0.2)"
        : "rgba(15, 23, 42, 0.15)"};
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(props) =>
      props.$completed
        ? "rgba(148, 163, 184, 0.3)"
        : props.$current
          ? "rgba(148, 163, 184, 0.25)"
          : "rgba(71, 85, 105, 0.2)"};
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    border-color: ${(props) =>
      props.$completed
        ? "rgba(148, 163, 184, 0.4)"
        : "rgba(148, 163, 184, 0.3)"};
  }

  ${(props) =>
    props.$current &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #64748b, #94a3b8);
      animation: pulse 3s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 0.3; }
    }
  `}
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StepIcon = styled.div<{ $completed: boolean; $current: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) =>
    props.$completed
      ? "linear-gradient(135deg, #475569, #64748b)"
      : props.$current
        ? "linear-gradient(135deg, #64748b, #94a3b8)"
        : "rgba(71, 85, 105, 0.3)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$completed || props.$current ? "#f8fafc" : "#cbd5e1"};
  box-shadow: ${(props) =>
    props.$completed || props.$current ? "0 6px 12px rgba(0,0,0,0.3)" : "none"};
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const StepDescription = styled.p`
  font-size: 0.875rem;
  color: rgba(203, 213, 225, 0.9);
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const StepAction = styled.button<{ $primary?: boolean }>`
  background: ${(props) =>
    props.$primary
      ? "linear-gradient(135deg, #64748b, #94a3b8)"
      : "rgba(71, 85, 105, 0.2)"};
  border: 1px solid
    ${(props) =>
      props.$primary ? "rgba(100, 116, 139, 0.4)" : "rgba(71, 85, 105, 0.3)"};
  color: ${(props) => (props.$primary ? "#f8fafc" : "#cbd5e1")};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: ${(props) =>
      props.$primary
        ? "linear-gradient(135deg, #475569, #64748b)"
        : "rgba(71, 85, 105, 0.3)"};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const CompletionCelebration = styled.div`
  text-align: center;
  background: rgba(71, 85, 105, 0.2);
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 16px;
  padding: 3rem;
  margin-top: 2rem;
`;

const CelebrationIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #64748b, #94a3b8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  animation: float 4s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-6px);
    }
  }
`;

export function OnboardingProgress() {
  const navigate = useNavigate();
  const { hubConfig } = useHub();
  const { data: userProfile } = useUserProfile();
  const { data: company } = useCurrentUserCompany();
  const { data: brands } = useBrands(company?.id || "");
  const { data: campaigns } = useCurrentUserCampaigns();
  const { data: customer } = useCustomerByCompany(company?.id || null);
  const devAuth = useDevAuth(userEnvironment);

  // Check completion status (matching OnboardingTracker logic)
  const isProfileComplete = !!(
    userProfile?.first_name &&
    userProfile?.last_name &&
    userProfile?.company_id
  );

  const isBusinessInfoComplete = !!(
    company?.legal_name &&
    company?.legal_form &&
    company?.vertical_type &&
    company?.ein &&
    company?.address &&
    company?.city &&
    company?.state_region &&
    company?.postal_code
  );

  const steps = [
    {
      id: "auth",
      title: "Account Setup",
      description: devAuth.isSuperadmin
        ? "Using development superadmin account for testing."
        : !!userProfile?.id
          ? "Your account has been created and is ready for setup."
          : "Create your account and verify your email/phone number.",
      icon: <UserCheck />,
      completed: !!userProfile?.id || devAuth.isSuperadmin,
      route: "/login",
      action: devAuth.isSuperadmin
        ? "Dev Mode"
        : !!userProfile?.id
          ? "Account Ready"
          : "Create Account",
    },
    {
      id: "payment",
      title: "Payment Setup",
      description:
        customer?.stripe_customer_id && !customer?.stripe_subscription_id
          ? "Complete your subscription to activate your account."
          : "Set up billing and subscription for your SMS platform.",
      icon: <CreditCard />,
      completed:
        !!customer?.stripe_subscription_id &&
        customer?.subscription_status === "active",
      route: "/onboarding",
      action:
        customer?.stripe_customer_id && !customer?.stripe_subscription_id
          ? "Complete Payment"
          : "Setup Payment",
    },
    {
      id: "personal",
      title: "Personal Information",
      description: "Complete your profile and create your company account.",
      icon: <User />,
      completed: isProfileComplete,
      route: "/dashboard",
      action: "Complete Profile",
    },
    {
      id: "business",
      title: "Business Details",
      description: "Provide business information required for TCR compliance.",
      icon: <Briefcase />,
      completed: isBusinessInfoComplete,
      route: "/onboarding/business",
      action: "Enter Business Info",
    },
    {
      id: "brand",
      title: "Brand Registration",
      description:
        "Register your brand with The Campaign Registry for better deliverability.",
      icon: <Building />,
      completed: brands?.some((b: any) => b.status === "approved"),
      route: "/onboarding/brand",
      action: "Register Brand",
    },
    {
      id: "privacy",
      title: "Privacy & Compliance",
      description: "Accept privacy policies and compliance terms.",
      icon: <Shield />,
      completed: !!company?.privacy_policy_accepted_at,
      route: "/onboarding/privacy",
      action: "Accept Terms",
    },
    {
      id: "campaign",
      title: "First Campaign",
      description: "Create and submit your first SMS campaign for approval.",
      icon: <Megaphone />,
      completed: campaigns?.some((c: any) => c.status === "approved"),
      route: "/onboarding/campaign",
      action: "Create Campaign",
    },
    {
      id: "phone",
      title: "Phone Number",
      description: "Get your dedicated phone number for sending SMS messages.",
      icon: <Phone />,
      completed: !!company?.phone_number_provisioned,
      route: "/onboarding/phone",
      action: "Get Phone Number",
    },
    {
      id: "setup",
      title: "Platform Setup",
      description: "Configure your account settings and messaging preferences.",
      icon: <Settings />,
      completed: !!company?.account_setup_completed_at,
      route: "/onboarding/setup",
      action: "Configure Settings",
    },
    {
      id: "activation",
      title: "Go Live!",
      description: "Activate your SMS platform and start sending messages.",
      icon: <Rocket />,
      completed: !!company?.platform_access_granted,
      route: "/onboarding/platform",
      action: "Activate Platform",
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const currentStepIndex = steps.findIndex((s) => !s.completed);
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;
  const progressPercentage = (completedSteps / steps.length) * 100;
  const isComplete = completedSteps === steps.length;

  const handleStepClick = (step: (typeof steps)[0]) => {
    if (step.completed || step === currentStep) {
      navigate(step.route);
    }
  };

  if (isComplete) {
    return (
      <PageContainer>
        <CompletionCelebration>
          <CelebrationIcon>
            <Trophy size={40} />
          </CelebrationIcon>
          <Title style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            🎉 Congratulations!
          </Title>
          <Subtitle style={{ fontSize: "1.125rem", marginBottom: "2rem" }}>
            You've completed your {hubConfig.displayName} onboarding! Your SMS
            platform is ready to use.
          </Subtitle>
          <StepAction $primary onClick={() => navigate("/campaigns")}>
            <Rocket size={20} />
            Start Messaging
          </StepAction>
        </CompletionCelebration>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderSection>
        <Title>Welcome to {hubConfig.displayName}</Title>
        <Subtitle>
          Complete your setup to unlock powerful SMS messaging capabilities
        </Subtitle>

        <StatsContainer>
          <StatCard>
            <StatNumber>{completedSteps}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{steps.length - completedSteps}</StatNumber>
            <StatLabel>Remaining</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{Math.round(progressPercentage)}%</StatNumber>
            <StatLabel>Progress</StatLabel>
          </StatCard>
        </StatsContainer>
      </HeaderSection>

      <ProgressSection>
        <ProgressHeader>
          <ProgressTitle>
            <Target />
            Setup Progress
          </ProgressTitle>
          {currentStep && (
            <div
              style={{
                background: "rgba(71, 85, 105, 0.3)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid rgba(100, 116, 139, 0.4)",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              <Clock
                size={16}
                style={{ display: "inline", marginRight: "0.5rem" }}
              />
              Next: {currentStep.title}
            </div>
          )}
        </ProgressHeader>

        <ProgressBar>
          <ProgressFill $progress={progressPercentage} />
        </ProgressBar>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.875rem",
            color: "rgba(203, 213, 225, 0.8)",
          }}
        >
          <span>
            Step {completedSteps + 1} of {steps.length}
          </span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
      </ProgressSection>

      <StepsGrid>
        {steps.map((step, index) => {
          const isCurrent = step === currentStep;
          const isUpcoming = index > currentStepIndex && currentStepIndex >= 0;

          return (
            <StepCard
              key={step.id}
              $completed={step.completed || false}
              $current={isCurrent}
              onClick={() => handleStepClick(step)}
              style={{
                cursor: step.completed || isCurrent ? "pointer" : "default",
              }}
            >
              <StepHeader>
                <StepIcon $completed={step.completed || false} $current={isCurrent}>
                  {step.completed ? <CheckCircle2 size={24} /> : step.icon}
                </StepIcon>
                <div style={{ flex: 1 }}>
                  <StepTitle>{step.title}</StepTitle>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.75rem",
                      color: "rgba(148, 163, 184, 0.8)",
                    }}
                  >
                    <span>Step {index + 1}</span>
                    {step.completed && (
                      <>
                        <span>•</span>
                        <span style={{ color: "#94a3b8", fontWeight: "600" }}>
                          Completed
                        </span>
                      </>
                    )}
                    {isCurrent && (
                      <>
                        <span>•</span>
                        <span style={{ color: "#cbd5e1", fontWeight: "600" }}>
                          Current
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {step.completed && (
                  <Star size={20} style={{ color: "#94a3b8" }} />
                )}
              </StepHeader>

              <StepDescription>{step.description}</StepDescription>

              {(step.completed || isCurrent) && (
                <StepAction
                  $primary={isCurrent}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(step.route);
                  }}
                  disabled={isUpcoming}
                >
                  {step.completed ? (
                    <>
                      <CheckCircle2 size={16} />
                      Review
                    </>
                  ) : isCurrent ? (
                    <>
                      {step.action}
                      <ChevronRight size={16} />
                    </>
                  ) : (
                    <>
                      {step.action}
                      <ChevronRight size={16} />
                    </>
                  )}
                </StepAction>
              )}

              {isUpcoming && (
                <div
                  style={{
                    background: "rgba(15, 23, 42, 0.3)",
                    border: "1px solid rgba(71, 85, 105, 0.3)",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    color: "rgba(148, 163, 184, 0.7)",
                  }}
                >
                  Complete previous steps first
                </div>
              )}
            </StepCard>
          );
        })}
      </StepsGrid>
    </PageContainer>
  );
}
