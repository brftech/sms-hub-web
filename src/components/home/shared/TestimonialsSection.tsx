import { useHub } from "@sms-hub/ui";
import { getHubTestimonialsContent } from "@sms-hub/hub-logic";

export const TestimonialsSection: React.FC = () => {
  const { currentHub } = useHub();
  const content = getHubTestimonialsContent(currentHub);

  return (
    <div className="bg-black py-16 md:py-24 lg:py-32 border-t border-amber-900/30 relative">
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            <span className="text-amber-500">{content.title.highlight}</span>{" "}
            {content.title.suffix}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16 lg:mb-20">
          {content.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-900/50 p-8 rounded-lg border border-amber-900/30 hover:border-amber-600/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="text-amber-500 text-2xl mr-2">★★★★★</div>
                <span className="text-amber-400 font-bold text-sm">
                  {testimonial.category}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-gray-700 pt-4">
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-amber-400 text-sm">
                  {testimonial.company}
                </div>
                <div className="text-gray-500 text-xs">
                  {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
