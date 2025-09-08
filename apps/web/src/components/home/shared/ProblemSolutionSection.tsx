import { Shield, Zap, Users, Clock } from "lucide-react";
import { PhoneDemo } from "../PhoneDemo";
import { useHub } from "@sms-hub/ui";
import { gnymbleProblemSolution } from "../Gnymble/problemSolution";
import { percymdProblemSolution } from "../PercyMD/problemSolution";

export const ProblemSolutionSection: React.FC = () => {
  const { currentHub } = useHub();
  const content =
    currentHub === "percymd" ? percymdProblemSolution : gnymbleProblemSolution;

  // Get the appropriate Tailwind color class based on hub
  const getPrimaryColorClass = () => {
    switch (currentHub) {
      case "percymd":
        return "text-blue-500"; // PercyMD blue
      case "gnymble":
        return "text-orange-600"; // Gnymble orange (matching button color)
      default:
        return "text-orange-600";
    }
  };

  const getPrimaryBorderClass = () => {
    switch (currentHub) {
      case "percymd":
        return "border-blue-500";
      case "gnymble":
        return "border-amber-600";
      default:
        return "border-amber-600";
    }
  };

  const getPrimaryIconClass = () => {
    switch (currentHub) {
      case "percymd":
        return "text-blue-500";
      case "gnymble":
        return "text-amber-600";
      default:
        return "text-amber-600";
    }
  };

  const getPrimaryGlowClass = () => {
    switch (currentHub) {
      case "percymd":
        return "bg-blue-500/20";
      case "gnymble":
        return "bg-amber-500/20";
      default:
        return "bg-amber-500/20";
    }
  };

  const getPrimaryBadgeClass = () => {
    switch (currentHub) {
      case "percymd":
        return "bg-blue-500";
      case "gnymble":
        return "bg-amber-600";
      default:
        return "bg-amber-600";
    }
  };

  return (
    <div className="bg-black py-16 md:py-24 lg:py-32 relative">
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            {content.title.prefix}{" "}
            <span className={getPrimaryColorClass()}>
              {content.title.highlight}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Left: The Hard Truth */}
          <div className="space-y-8 md:space-y-12">
            {/* What We Deliver */}
            <div
              className={`border-l-4 ${getPrimaryBorderClass()} pl-6 md:pl-8`}
            >
              <h3 className="text-xl md:text-2xl font-bold text-amber-400 mb-3 md:mb-4">
                {content.deliver.title}
              </h3>
              <div className="space-y-3 md:space-y-4">
                {content.deliver.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-white">
                    <Shield
                      className={`w-5 h-5 ${getPrimaryIconClass()} mr-3 flex-shrink-0`}
                    />
                    <span className="font-medium text-sm md:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What Others Miss */}
            <div className="border-l-4 border-gray-600 pl-6 md:pl-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-3 md:mb-4">
                {content.overlook.title}
              </h3>
              <div className="space-y-3 md:space-y-4 text-white">
                {content.overlook.items.map((item, index) => (
                  <div key={index} className="flex items-center text-white">
                    <span className="text-gray-500 text-lg mr-3 flex-shrink-0">
                      ✕
                    </span>
                    <span className="text-base md:text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Enhanced Phone Demo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 ${getPrimaryGlowClass()} blur-3xl rounded-full scale-150`}
              ></div>
              <PhoneDemo />
              {/* Badge overlay */}
              <div
                className={`absolute -bottom-4 -right-4 ${getPrimaryBadgeClass()} text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
              >
                {content.badge}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
