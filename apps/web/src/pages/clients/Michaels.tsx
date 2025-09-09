import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@sms-hub/ui";
import { Link } from "react-router-dom";
import {
  Phone,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Cigarette,
} from "lucide-react";

export default function Michaels() {
  return (
    <>
      <Helmet>
        <title>Michaels - Premium Cigar & Tobacco SMS Marketing</title>
        <meta
          name="description"
          content="Join Michaels SMS marketing for exclusive cigar releases, tobacco products, and premium lifestyle updates. Luxury communication for discerning connoisseurs."
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-black border-b border-orange-500">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/" className="flex items-center space-x-3">
                  <img
                    src="/packages/ui/src/assets/gnymble-icon-logo.svg"
                    alt="Gnymble"
                    className="w-8 h-8"
                  />
                  <span className="text-orange-500 font-bold text-lg">
                    Gnymble
                  </span>
                </Link>
                <div className="h-6 w-px bg-orange-500"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Cigarette className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Michaels</h1>
                    <p className="text-sm text-orange-300">
                      Premium Cigar & Tobacco
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <Link
                  to="/privacy"
                  className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <img
                    src="/packages/ui/src/assets/michaels-logo.png"
                    alt="Michaels Logo"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <h1 className="text-5xl font-bold text-white mb-6">
                  Join Our Exclusive SMS Community
                </h1>
                <p className="text-xl text-orange-200 mb-8">
                  Stay connected with Michaels for premium cigar releases,
                  exclusive tobacco products, and luxury lifestyle updates
                  delivered directly to your phone.
                </p>
              </div>

              <div className="bg-orange-500/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-500/30">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Get Started Today
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl font-mono bg-orange-500 text-black px-4 py-2 rounded-lg">
                      JOIN MICHAELS
                    </span>
                    <span className="text-orange-300">to</span>
                    <span className="text-2xl font-mono bg-orange-500 text-black px-4 py-2 rounded-lg">
                      555-123-MIKE
                    </span>
                  </div>
                  <p className="text-sm text-orange-300">
                    Or scan the QR code below with your phone camera
                  </p>
                  <div className="w-32 h-32 mx-auto bg-white/10 rounded-lg flex items-center justify-center border border-orange-500/30">
                    <span className="text-orange-300 text-sm">QR Code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-orange-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                What You'll Receive
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-black" />
                    </div>
                    <CardTitle className="text-white">
                      Exclusive Releases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200">
                      Get first access to limited edition cigars, rare tobacco
                      products, and exclusive merchandise.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-black" />
                    </div>
                    <CardTitle className="text-white">Tasting Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200">
                      Be the first to know about cigar tastings, private events,
                      and exclusive gatherings.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-black" />
                    </div>
                    <CardTitle className="text-white">
                      Secure & Private
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200">
                      Your privacy is protected. Easy opt-out anytime. No spam,
                      just premium content.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Why Choose Our SMS Service
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Instant Delivery
                    </h3>
                    <p className="text-orange-200">
                      Receive time-sensitive offers and updates immediately on
                      your phone.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Exclusive Content
                    </h3>
                    <p className="text-orange-200">
                      Access to member-only content, early releases, and special
                      events.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Expert Curation
                    </h3>
                    <p className="text-orange-200">
                      Hand-picked selections by our tobacco experts and cigar
                      masters.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Premium Experience
                    </h3>
                    <p className="text-orange-200">
                      Curated content for discerning cigar enthusiasts and
                      tobacco connoisseurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories Section */}
        <section className="py-16 bg-orange-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Our Premium Collections
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      Premium Cigars
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200 text-sm">
                      Hand-rolled cigars from the world's finest tobacco regions
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      Tobacco Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200 text-sm">
                      Pipe tobacco, snuff, and other premium tobacco products
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      Accessories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200 text-sm">
                      Cutters, lighters, humidors, and cigar accessories
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      Lifestyle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-200 text-sm">
                      Whiskey, spirits, and luxury lifestyle products
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-8">
                Visit Our Location
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-center justify-center space-x-3">
                  <MapPin className="w-6 h-6 text-orange-500" />
                  <div className="text-left">
                    <p className="font-semibold text-white">Address</p>
                    <p className="text-orange-200">
                      456 Tobacco Row
                      <br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Clock className="w-6 h-6 text-orange-500" />
                  <div className="text-left">
                    <p className="font-semibold text-white">Hours</p>
                    <p className="text-orange-200">
                      Mon-Sat: 9AM-9PM
                      <br />
                      Sun: 11AM-7PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="w-6 h-6 text-orange-500" />
                  <div className="text-left">
                    <p className="font-semibold text-white">Phone</p>
                    <p className="text-orange-200">(415) 555-0123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Section */}
        <section className="py-12 bg-black/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Privacy & Legal
              </h2>
              <p className="text-orange-200 mb-6">
                We respect your privacy and comply with all applicable laws.
                Your information is secure and will never be shared with third
                parties.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/privacy"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-orange-400 hover:text-orange-300 underline"
                >
                  Terms & Conditions
                </Link>
                <span className="text-orange-500">•</span>
                <span className="text-orange-200">Reply STOP to opt out</span>
                <span className="text-orange-500">•</span>
                <span className="text-orange-200">Reply HELP for help</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-orange-500 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Link to="/" className="flex items-center space-x-3">
                  <img
                    src="/packages/ui/src/assets/gnymble-icon-logo.svg"
                    alt="Gnymble"
                    className="w-8 h-8"
                  />
                  <span className="text-orange-500 font-bold text-lg">
                    Gnymble
                  </span>
                </Link>
                <div className="h-6 w-px bg-orange-500"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Cigarette className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold text-white">Michaels</span>
                </div>
              </div>
              <p className="text-orange-300 text-sm">
                Premium Cigar & Tobacco • Est. 2024
              </p>
              <p className="text-orange-500 text-xs mt-2">
                Powered by Gnymble SMS Marketing Platform
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
