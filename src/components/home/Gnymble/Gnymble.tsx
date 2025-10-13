import { HeroSection } from "../shared/HeroSection";
import { ProblemSolutionSection } from "../shared/ProblemSolutionSection";
import { StatsSection } from "../shared/StatsSection";
import { CTASection } from "../shared/CTA";

interface GnymbleProps {
  businessTypes: string[];
}

export const Gnymble: React.FC<GnymbleProps> = ({ businessTypes }) => {
  return (
    <>
      <HeroSection businessTypes={businessTypes} />
      <div className="py-8 md:py-12 lg:py-16">
        <ProblemSolutionSection />
      </div>
      {/* <TestimonialsSection /> */}
      <div className="bg-black py-20 md:py-28 lg:py-36 relative">
        <div className="max-w-6xl mx-auto px-6 relative">
          <StatsSection />
        </div>
      </div>
      <div className="py-8 md:py-12 lg:py-16">
        <CTASection />
      </div>
    </>
  );
};
