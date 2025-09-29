import React from "react";
import { useHub } from "@sms-hub/ui";

interface CTAStep {
  number: string;
  title: string;
  description: string;
}

interface CTAContent {
  title: string;
  titleHighlight: string;
  description: string;
  descriptionHighlight: string;
  steps: CTAStep[];
  ctaText: string;
  ctaSubtext: string;
  guaranteeText: string;
  badge?: React.ReactNode;
}

interface CTASectionProps {
  content?: CTAContent;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryActionPath?: string;
  secondaryActionPath?: string;
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  content,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionPath = "/contact",
  secondaryActionPath = "/demo",
  className = "",
}) => {
  const { currentHub } = useHub();

  // Default content if none provided
  const defaultContent: CTAContent = {
    title: "Ready to Find Your",
    titleHighlight: "SMS Home?",
    description:
      "Experience the platform built for businesses that dare to be different.",
    descriptionHighlight: "Your success demands SMS that delivers results.",
    steps: [
      {
        number: "01",
        title: "REACH OUT",
        description: "Share your vision. We craft the perfect SMS solution.",
      },
      {
        number: "02",
        title: "GET SET UP",
        description:
          "Lightning-fast 8-day deployment. Master-level compliance included.",
      },
      {
        number: "03",
        title: "GROW YOUR BUSINESS",
        description:
          "Connect powerfully with customers, employees, and stakeholders.",
      },
    ],
    ctaText: "🚀 GET STARTED NOW",
    ctaSubtext: "📱 SEE IT IN ACTION",
    guaranteeText:
      "If we can't get you set up in 8 days, your $179 onboarding is free.",
  };

  const ctaContent = content || defaultContent;

  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      window.location.href = primaryActionPath;
    }
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      window.location.href = secondaryActionPath;
    }
  };

  return (
    <div className={`bg-black py-16 md:py-24 lg:py-32 relative ${className}`}>
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
          {ctaContent.title}
          <span className="text-amber-500 block">
            {ctaContent.titleHighlight}
          </span>
        </h2>

        <p className="text-lg md:text-xl text-gray-300 mb-10 md:mb-12 max-w-3xl mx-auto">
          {ctaContent.description}
          <br />
          <span className="text-amber-400 font-medium">
            {ctaContent.descriptionHighlight}
          </span>
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {ctaContent.steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-900/50 border border-amber-900/30 rounded-lg p-6"
            >
              <div className="text-amber-500 text-4xl font-bold mb-2">
                {step.number}
              </div>
              <h3 className="text-white font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* The decision */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-8 rounded-lg mb-12">
          <h3 className="text-black text-2xl font-bold mb-4">
            Choose {currentHub === "percymd" ? "Security" : "Excellence"} Over
            Compromise
          </h3>
          <p className="text-black/80 text-lg mb-6">
            {currentHub === "percymd"
              ? "Join the SMS platform that protects your patients and improves your practice outcomes."
              : "Join the SMS platform that champions your success and amplifies your growth."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePrimaryAction}
              className="px-10 py-4 bg-black text-amber-400 font-bold rounded-sm hover:bg-gray-900 transition-all duration-300 text-sm tracking-wide uppercase shadow-lg"
            >
              {ctaContent.ctaText}
            </button>
            <button
              onClick={handleSecondaryAction}
              className="px-10 py-4 border-2 border-black text-black font-bold rounded-sm hover:bg-black hover:text-amber-400 transition-all duration-300 text-sm tracking-wide uppercase"
            >
              {ctaContent.ctaSubtext}
            </button>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-8">
          <span className="text-amber-400">💯 Guarantee:</span>{" "}
          {ctaContent.guaranteeText}
        </p>

        {ctaContent.badge && (
          <div className="flex justify-center">{ctaContent.badge}</div>
        )}
      </div>
    </div>
  );
};

export default CTASection;
