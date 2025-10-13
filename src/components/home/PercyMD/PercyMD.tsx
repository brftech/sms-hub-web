import { HeroSection } from "../shared/HeroSection";
import { ProblemSolutionSection } from "../shared/ProblemSolutionSection";
import { StatsSection } from "../shared/StatsSection";
import { CTASection } from "../shared/CTA";

interface PercyMDProps {
  businessTypes: string[];
}

export const PercyMD: React.FC<PercyMDProps> = ({ businessTypes }) => {
  return (
    <>
      <HeroSection businessTypes={businessTypes} />
      <ProblemSolutionSection />
      {/* <TestimonialsSection /> */}
      <div className="bg-black py-16 md:py-24 lg:py-32 relative">
        <div className="max-w-6xl mx-auto px-6 relative">
          <StatsSection />
        </div>
      </div>
      <CTASection />
    </>
  );
};
