/**
 * Generic Home Page Layout
 * Used by all hubs - layout differences handled via props
 */

import { HeroSection } from "./HeroSection";
import { ProblemSolutionSection } from "./ProblemSolutionSection";
import { StatsSection } from "./StatsSection";
import { CTASection } from "./CTA";

interface HomeLayoutProps {
  businessTypes: string[];
  variant?: "default" | "compact"; // Different spacing variants
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ businessTypes, variant = "default" }) => {
  const spacing =
    variant === "compact"
      ? {
          problemSolution: "",
          stats: "py-16 md:py-24 lg:py-32",
          cta: "",
        }
      : {
          problemSolution: "py-8 md:py-12 lg:py-16",
          stats: "py-20 md:py-28 lg:py-36",
          cta: "py-8 md:py-12 lg:py-16",
        };

  return (
    <>
      <HeroSection businessTypes={businessTypes} />
      {spacing.problemSolution && (
        <div className={spacing.problemSolution}>
          <ProblemSolutionSection />
        </div>
      )}
      {!spacing.problemSolution && <ProblemSolutionSection />}
      {/* <TestimonialsSection /> */}
      <div className={`bg-black ${spacing.stats} relative`}>
        <div className="max-w-6xl mx-auto px-6 relative">
          <StatsSection />
        </div>
      </div>
      {spacing.cta && (
        <div className={spacing.cta}>
          <CTASection />
        </div>
      )}
      {!spacing.cta && <CTASection />}
    </>
  );
};
