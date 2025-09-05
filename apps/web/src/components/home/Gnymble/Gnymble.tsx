import { HeroSection } from "../shared/HeroSection";
import { ProblemSolutionSection } from "../shared/ProblemSolutionSection";
import { TestimonialsSection } from "../shared/TestimonialsSection";
import { StatsSection } from "../shared/StatsSection";
import { CTASection } from "../shared/CTA";
import { gnymbleHero } from "./hero";

interface GnymbleProps {
  businessTypes: string[];
}

export const Gnymble: React.FC<GnymbleProps> = ({ businessTypes }) => {
  return (
    <>
      <HeroSection businessTypes={businessTypes} content={gnymbleHero} />
      <ProblemSolutionSection />
      <TestimonialsSection />
      <div className="bg-black py-16 md:py-24 lg:py-32 border-t border-amber-900/30 relative">
        <div className="max-w-6xl mx-auto px-6 relative">
          <StatsSection />
        </div>
      </div>
      <CTASection />
    </>
  );
};
