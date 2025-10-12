import React from "react";
import { useNavigate } from "react-router-dom";
import { useHub } from "@sms-hub/ui/marketing";
import { getHubCTAContent } from "@sms-hub/hub-logic";
import { CONTACT_PATH } from "@/utils/routes";

export const CTASection: React.FC = () => {
  const { currentHub } = useHub();
  const navigate = useNavigate();

  const content = getHubCTAContent(currentHub);
  return (
    <div className="bg-black border-t border-gray-800/60 py-16 md:py-20 lg:py-24 relative">
      <div className="max-w-3xl mx-auto px-6 text-center relative">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
          {content.title}
          <span className="text-amber-500 block">{content.titleHighlight}</span>
        </h2>

        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          {content.description}{" "}
          <span className="text-amber-400 font-medium">{content.descriptionHighlight}</span>
        </p>

        <button
          onClick={() => navigate(CONTACT_PATH)}
          className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md transition-colors"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};
