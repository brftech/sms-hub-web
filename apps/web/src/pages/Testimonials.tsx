import { PageLayout } from "@/components/layout";

import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      company: "Anstead's Cigars",
      content:
        "As a growing premium cigar lounge, it's tough to promote events and new products. Email often gets ignored and social media is limited. Other SMS platforms wouldn't support us because of tobacco — but Gnymble did.",
    },
    {
      company: "Latitude Cigars",
      content:
        "All good so far. Sent out the initial post to the member group and received an almost 70% excited yes response within the first 90 minutes. I feel that is a fantastic response.",
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              See how premium cigar lounges are transforming their customer
              communication with Gnymble
            </p>
          </div>

          {/* Single column layout for better readability */}
          <div className="space-y-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm"
              >
                <CardContent className="p-8 lg:p-12">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex items-center lg:items-start gap-4 lg:gap-6">
                      <Quote className="h-12 w-12 lg:h-16 lg:w-16 text-orange-500 flex-shrink-0" />
                      <div className="lg:hidden">
                        <h3 className="text-xl font-bold text-white">
                          {testimonial.company}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="hidden lg:block mb-6">
                        <h3 className="text-2xl font-bold text-white">
                          {testimonial.company}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                        {testimonial.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 lg:p-12 rounded-2xl backdrop-blur-sm">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Ready to Transform Your Customer Communication?
              </h3>
              <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
                Join these successful cigar lounges and start connecting with
                your customers like never before.
              </p>
              {/* Get Started Today Button - Hidden
              <button
                onClick={() => window.location.href = "https://preview--gnymble-platform.lovable.app/signup"}
                className="bg-white text-orange-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg"
              >
                Get Started Today
              </button>
              */}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Testimonials;
