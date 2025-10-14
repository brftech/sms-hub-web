import { Shield } from "lucide-react";
import { useHub } from "@sms-hub/ui/marketing";
import { getHubProblemSolutionContent } from "@sms-hub/hub-logic";

// Local helper type to allow optional shaftNote without using any
interface ProblemSolutionWithShaftNote {
  title: { prefix: string; highlight: string };
  description: string;
  deliver: { title: string; features: string[] };
  overlook: { title: string; items: string[] };
  badge: string;
  shaftNote?: string;
}

export const ProblemSolutionSection: React.FC = () => {
  const { currentHub } = useHub();
  const raw = getHubProblemSolutionContent(currentHub) as unknown as ProblemSolutionWithShaftNote;
  const content: ProblemSolutionWithShaftNote = raw;
  const isGnymble = currentHub === "gnymble";

  const deliverTitle = isGnymble ? "BUILT FOR SHAFT COMPLIANCE" : content.deliver.title;
  const overlookTitle = isGnymble ? "WHAT OTHERS WON'T DO" : content.overlook.title;
  const shaftNoteFallback =
    "SHAFT refers to Sex, Hate, Alcohol, Firearms, and Tobacco. To be clear: we specialize in the 'AFT' part—Alcohol, Firearms, and Tobacco businesses. We help legitimate retailers like craft breweries, cigar shops, and sporting goods stores navigate compliant messaging. We're not in the business of the other two letters.";

  return (
    <div className="bg-black py-16 md:py-20 lg:py-24 relative">
      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="text-center mb-10 md:mb:12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {content.title.prefix} <span className="text-amber-400">{content.title.highlight}</span>
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* What We Deliver */}
          <div className="space-y-6">
            <div className="border-l-2 border-gray-700 pl-5">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">{deliverTitle}</h3>
              <div className="space-y-3">
                {content.deliver.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-white">
                    <Shield className={`w-5 h-5 text-amber-500 mr-3 flex-shrink-0`} />
                    <span className="text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What Others Won't Do */}
          <div className="space-y-6">
            <div className="border-l-2 border-gray-700 pl-5">
              <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-3">
                {overlookTitle}
              </h3>
              <div className="space-y-3 text-white">
                {content.overlook.items.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-gray-400 text-lg mr-3 flex-shrink-0">✕</span>
                    <span className="text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {content.shaftNote || isGnymble ? (
          <div className="mt-10 md:mt-12 bg-gray-900/40 border border-gray-800 rounded-md p-4">
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              <span className="font-semibold text-amber-400">About SHAFT compliance: </span>
              {content.shaftNote || shaftNoteFallback}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
