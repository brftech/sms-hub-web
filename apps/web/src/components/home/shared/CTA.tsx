import React from "react";
import { useNavigate } from "react-router-dom";
import { useHub } from "@sms-hub/ui";
import { getHubCTAContent } from "@sms-hub/hub-logic";

export const CTASection: React.FC = () => {
  const { currentHub, hubConfig } = useHub();
  const navigate = useNavigate();

  const content = getHubCTAContent(currentHub);
  return (
    <div className="bg-black py-16 md:py-24 lg:py-32 relative">
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
          {content.title}
          <span className="text-amber-500 block">{content.titleHighlight}</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-300 mb-10 md:mb-12 max-w-3xl mx-auto">
          {content.description}
          <br />
          <span className="text-amber-400 font-medium">
            {content.descriptionHighlight}
          </span>
        </p>

        {/* Your path to SMS success */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {content.steps.map((step, index) => (
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
        <div
          className="p-8 rounded-lg mb-12"
          style={{
            background: `linear-gradient(135deg, ${hubConfig.primaryColor} 0%, ${hubConfig.accentColor} 100%)`,
          }}
        >
          <h3 className="text-white text-2xl font-bold mb-4">
            Choose {currentHub === "percymd" ? "Security" : "Excellence"} Over
            Compromise
          </h3>
          <p className="text-white/90 text-lg mb-6">
            {currentHub === "percymd"
              ? "Join the SMS platform that protects your patients and improves your practice outcomes."
              : "Join the SMS platform that champions your success and amplifies your growth."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/contact")}
              className="px-10 py-4 bg-white hub-text-primary font-bold rounded-sm hover:bg-gray-100 transition-all duration-300 text-sm tracking-wide uppercase shadow-lg"
            >
              Contact Us
            </button>
            {/* <button
              onClick={() => (window.location.href = "/phone-demo")}
              className="px-10 py-4 border-2 border-black text-black font-bold rounded-sm hover:bg-black hover:text-amber-400 transition-all duration-300 text-sm tracking-wide uppercase"
            >
              {content.ctaSubtext}
            </button> */}
          </div>
        </div>

        {/* <p className="text-gray-500 text-sm mb-8">
          <span className="text-amber-400">💯 Guarantee:</span>{" "}
          {content.guaranteeText}
        </p>

        {content.badge && (
          <div className="flex justify-center">{content.badge}</div>
        )} */}
      </div>
    </div>
  );
};
