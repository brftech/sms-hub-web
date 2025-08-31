import { PageLayout } from "@/components/layout";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  MessageSquare,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const Solutions = () => {
  const solutions = [
    {
      icon: ShieldCheck,
      title: "Compliant",
      description: "Purpose-built for cigar businesses with carrier approval.",
      points: [
        "Tobacco-friendly language won't get blocked",
        "Built-in age verification (21+) and compliance",
        "Industry-specific solutions for premium businesses",
      ],
    },
    {
      icon: MessageSquare,
      title: "Simple",
      description: "No training required. Works like your phone.",
      points: [
        "Send messages exactly like normal texting",
        "Access anywhere - web, mobile, or tablet",
        "Staff can use it instantly",
      ],
    },
    {
      icon: Users,
      title: "Smart",
      description: "Organize by location, VIP status, or preferences.",
      points: [
        "Target specific customer groups",
        "Track delivery and manage replies in one place",
        "Analytics to optimize engagement",
      ],
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Three Core Solutions That Set{" "}
              <span className="font-inter font-bold text-transparent bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text">
                gnymble
              </span>{" "}
              Apart
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Purpose-built for the cigar industry with compliance, simplicity,
              and smart customer management at its core.
            </p>
          </div>

          {/* Solutions Sections */}
          <div className="space-y-8">
            {solutions.map((solution, index) => (
              <section
                key={index}
                className="min-h-screen flex items-center justify-center"
              >
                <div className="w-full max-w-4xl">
                  <Card className="bg-black border-gray-700 hover:bg-gray-900 transition-all duration-300">
                    <CardContent className="p-12">
                      <div className="text-center mb-8">
                        <div className="bg-orange-500/10 rounded-lg w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                          <solution.icon className="h-10 w-10 text-orange-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">
                          {solution.title}
                        </h3>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                          {solution.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {solution.points.map((point, pointIndex) => (
                          <div
                            key={pointIndex}
                            className="bg-gray-900/50 rounded-lg p-6 border border-gray-700"
                          >
                            <div className="flex items-start">
                              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                              <span className="text-gray-200 text-base">
                                {point}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Solutions;
