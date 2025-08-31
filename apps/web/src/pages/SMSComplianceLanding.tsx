import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Shield,
  Users,
  Clock,
  Award,
  Quote,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import GnymbleLogo from "@/components/GnymbleLogo";

const SMSComplianceLanding = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your business email");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(
        "Exclusive blueprint secured! Check your email in 2 minutes."
      );
      setEmail("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Logo */}
      <div className="px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center mb-8">
            <Link to="/">
              <GnymbleLogo size="lg" variant="default" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-6 pb-16 text-center">
        <div className="mx-auto max-w-4xl">
          {/* Trust Badges */}
          <div className="mb-8 flex justify-center space-x-4">
            <Badge
              variant="outline"
              className="bg-primary/10 border-primary/20"
            >
              <Shield className="mr-1 h-3 w-3" />
              Fully Compliant Platform
            </Badge>
            <Badge
              variant="outline"
              className="bg-primary/10 border-primary/20"
            >
              <Award className="mr-1 h-3 w-3" />
              Industry Certified
            </Badge>
            <Badge
              variant="outline"
              className="bg-primary/10 border-primary/20"
            >
              <Users className="mr-1 h-3 w-3" />
              Dozens of Premium Retailers
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Compliant SMS Marketing for Premium Tobacco Retailers
            <span className="block text-primary">
              Built for Sophistication & Compliance
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            The exclusive SMS platform trusted by dozens of luxury tobacco
            retailers for sophisticated customer engagement.
          </p>

          {/* Lead Magnet Form */}
          <Card className="mx-auto max-w-lg border-primary/20 bg-white/5 backdrop-blur">
            <CardContent className="p-8">
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Exclusive Compliance Mastery Guide
              </h3>
              <p className="mb-6 text-muted-foreground">
                The Essential Regulatory Compliance Blueprint for Premium
                Tobacco Retailers (2025 Edition)
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg"
                  required
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Securing..." : "Secure My Exclusive Guide"}
                </Button>
              </form>

              <p className="mt-4 text-sm text-muted-foreground">
                No spam. Trusted by dozens of premium tobacco retailers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Trusted by Industry Leaders
          </h2>

          <div className="grid gap-8 md:grid-cols-1 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="border-primary/10">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <Quote className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-bold text-foreground">
                      Anstead's Premium Tobacco
                    </h3>
                  </div>
                </div>
                <blockquote className="text-muted-foreground leading-relaxed">
                  "As a premium tobacco lounge, promoting exclusive events and
                  handcrafted selections was challenging. Email engagement was
                  poor and social media reached was limited. Other SMS platforms
                  rejected us due to regulatory concerns — Gnymble understood
                  our industry needs."
                </blockquote>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-primary/10">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <Quote className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-bold text-foreground">
                      Latitude Fine Tobacco
                    </h3>
                  </div>
                </div>
                <blockquote className="text-muted-foreground leading-relaxed">
                  "Exceptional results from day one. Our initial message to VIP
                  members generated a 70% positive response within 90 minutes —
                  unprecedented engagement for our premium tobacco offerings.
                  The platform delivers sophisticated communication that matches
                  our brand standards."
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            Three Core Solutions That Set Gnymble Apart
          </h2>
          <p className="mb-12 text-xl text-muted-foreground">
            Purpose-built for premium tobacco retail with compliance,
            sophistication, and intelligent customer management at its core.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                Industry-Compliant Messaging
              </h3>
              <p className="text-sm text-muted-foreground">
                Purpose-built for luxury tobacco retailers with carrier approval
                and integrated age verification (21+).
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                Effortlessly Sophisticated
              </h3>
              <p className="text-sm text-muted-foreground">
                Intuitive interface that mirrors premium communication
                standards. Access anywhere - web, mobile, or tablet.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">
                Intelligent Customer Curation
              </h3>
              <p className="text-sm text-muted-foreground">
                Sophisticated segmentation by location, VIP status, and
                preferences with analytics to maximize engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-16 bg-primary/5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            Protect Your Premium Business with Proven Compliance
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Secure the regulatory blueprint that dozens of luxury tobacco
            retailers trust for protection
          </p>

          <Card className="mx-auto max-w-lg border-primary/20">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg"
                  required
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Securing..."
                    : "Secure My Exclusive Blueprint"}
                </Button>
              </form>

              <p className="mt-4 text-sm text-muted-foreground">
                Exclusive Access: Limited to 50 premium retailers this month
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-muted-foreground">
        <p>
          © 2025 Gnymble. All rights reserved. | Terms of Service | Privacy
          Policy
        </p>
        <p className="mt-2">
          This platform is designed for licensed tobacco retailers and complies
          with current federal regulations.
        </p>
      </footer>
    </div>
  );
};

export default SMSComplianceLanding;
