import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, useHub, HubLogo } from "@sms-hub/ui";
import {
  Menu,
  X,
  MessageSquare,
  Users,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { getHubColorClasses } from "@sms-hub/utils";

// Direct Stripe checkout helper
const handleDirectCheckout = async () => {
  try {
    // Redirect directly to Stripe Payment Link
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    console.log("🔗 Payment link from env:", paymentLink);
    console.log("🌍 Environment:", import.meta.env.MODE);
    console.log("🔧 All env vars:", import.meta.env);

    if (!paymentLink) {
      console.error(
        "❌ Payment link not configured. Available env vars:",
        Object.keys(import.meta.env)
      );
      throw new Error(
        "Payment link not configured. Please check environment variables."
      );
    }

    console.log("🚀 Redirecting to:", paymentLink);
    window.location.href = paymentLink;
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Failed to start checkout. Please try again.");
  }
};

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const getLogo = () => {
    return <HubLogo hubType={currentHub} variant="icon" size="lg" />;
  };

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleDesktopNavClick = (path: string) => {
    navigate(path);
  };

  // Mobile menu items with icons
  const mobileMenuItems = [
    { path: "/", label: "Home", icon: null },
    { path: "/pricing", label: "Pricing", icon: CreditCard },
    { path: "/about", label: "About", icon: Users },
    { path: "/faq", label: "FAQ", icon: HelpCircle },
    { path: "/demo", label: "Demo", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Logo and Text links (Desktop only) */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleDesktopNavClick("/")}
              className="hover:opacity-80 transition-opacity duration-300"
            >
              {getLogo()}
            </button>

            <button
              onClick={() => handleDesktopNavClick("/pricing")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/pricing"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Pricing
            </button>

            <button
              onClick={() => handleDesktopNavClick("/about")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/about"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleDesktopNavClick("/faq")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/faq"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => handleDesktopNavClick("/demo")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/demo"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Demo
            </button>
          </div>

          {/* Right side - CTAs (Desktop only) */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDesktopNavClick("/contact")}
              className="transition-all duration-300 backdrop-blur-sm px-6 py-2 text-sm bg-black/50 text-white border border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-400 min-w-[80px]"
            >
              Contact
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDirectCheckout()}
              className="transition-all duration-300 backdrop-blur-sm px-6 py-2 text-sm bg-black/50 text-white border border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-400 min-w-[80px]"
            >
              SignUp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Navigate to login page on port 3001
                window.location.href = "http://localhost:3001/login";
              }}
              className="transition-all duration-300 backdrop-blur-sm px-6 py-2 text-sm bg-black/50 text-white border border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-400 min-w-[80px]"
            >
              LogIn
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Navigate to admin dashboard (now part of this app)
                window.location.href = "/admin";
              }}
              className="transition-all duration-300 backdrop-blur-sm px-3 py-1.5 text-xs bg-black/50 text-white border border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-400"
            >
              Login
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div
              className="px-4 pt-4 pb-6 space-y-2 bg-black/95 backdrop-blur-md border-t border-orange-500/20"
              style={{
                borderTopColor:
                  currentHub === "percytech" ? "#8B000020" : "#EA580C20",
              }}
            >
              {mobileMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? `${hubColors.bgLight} ${hubColors.text} shadow-lg`
                        : "text-white hover:text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5 mr-3 flex-shrink-0" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile-specific CTAs */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavClick("/contact");
                  }}
                  className="w-full bg-black/50 text-white border border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-400 font-medium py-3 text-sm h-12"
                >
                  Contact
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDirectCheckout();
                  }}
                  className={`w-full ${hubColors.bg} hover:${hubColors.bgHover} text-white font-semibold py-3 text-sm h-12`}
                >
                  SignUp
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // Navigate to login page on port 3001
                    window.location.href = "http://localhost:3001/login";
                  }}
                  className="w-full bg-black/50 text-white border border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-400 font-medium py-3 text-sm h-12"
                >
                  LogIn
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
