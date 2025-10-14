import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useHub, HubLogo } from "@sms-hub/ui/marketing";
import { Menu, X, MessageSquare, Users, HelpCircle, CreditCard } from "lucide-react";
import { getHubColors } from "@sms-hub/hub-logic";
import { handleDirectCheckout, handleDirectLogin } from "../utils/checkout";
import {
  HOME_PATH,
  PRICING_PATH,
  ABOUT_PATH,
  FAQ_PATH,
  DEMO_PATH,
  CONTACT_PATH,
  ADMIN_PATH,
} from "../utils/routes";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentHub } = useHub();
  const hubColors = getHubColors(currentHub).tailwind;

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
    { path: HOME_PATH, label: "Home", icon: null },
    { path: PRICING_PATH, label: "Pricing", icon: CreditCard },
    { path: ABOUT_PATH, label: "About", icon: Users },
    { path: FAQ_PATH, label: "FAQ", icon: HelpCircle },
    { path: DEMO_PATH, label: "Demo", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Text links (Desktop), Logo only on Mobile */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => handleDesktopNavClick(HOME_PATH)}
              className="hover:opacity-80 transition-opacity duration-300"
              aria-label="Home"
            >
              {getLogo()}
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleDesktopNavClick(PRICING_PATH)}
                className={`transition-colors text-sm font-medium ${
                  location.pathname === PRICING_PATH
                    ? `${hubColors.text} hub-text-primary`
                    : "text-white hover:text-gray-300"
                }`}
              >
                Pricing
              </button>

              <button
                onClick={() => handleDesktopNavClick(ABOUT_PATH)}
                className={`transition-colors text-sm font-medium ${
                  location.pathname === ABOUT_PATH
                    ? `${hubColors.text} hub-text-primary`
                    : "text-white hover:text-gray-300"
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleDesktopNavClick(FAQ_PATH)}
                className={`transition-colors text-sm font-medium ${
                  location.pathname === FAQ_PATH
                    ? `${hubColors.text} hub-text-primary`
                    : "text-white hover:text-gray-300"
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => handleDesktopNavClick(DEMO_PATH)}
                className={`transition-colors text-sm font-medium ${
                  location.pathname === DEMO_PATH
                    ? `${hubColors.text} hub-text-primary`
                    : "text-white hover:text-gray-300"
                }`}
              >
                Demo
              </button>
            </div>
          </div>

          {/* Right side - CTAs */}
          <div className="flex items-center space-x-3">
            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => handleDesktopNavClick(CONTACT_PATH)}
                className={`transition-all duration-300 px-6 py-2 text-sm rounded-md font-medium ${hubColors.contactButton} min-w-[80px]`}
              >
                Contact
              </button>
              {import.meta.env.DEV && (
                <button
                  onClick={() => handleDirectCheckout()}
                  className={`transition-all duration-300 px-6 py-2 text-sm rounded-md font-medium ${hubColors.contactButton} min-w-[80px]`}
                >
                  SignUp
                </button>
              )}
              <button
                onClick={handleDirectLogin}
                className={`transition-all duration-300 px-6 py-2 text-sm rounded-md font-medium ${hubColors.contactButton} min-w-[80px]`}
              >
                LogIn
              </button>
            </div>

            {/* Mobile menu button + Login on the right */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => {
                  window.location.href = ADMIN_PATH;
                }}
                className={`transition-all duration-300 px-3 py-1.5 text-xs rounded-md font-medium ${hubColors.contactButton}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gray-300 transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div
              className="px-4 pt-4 pb-6 space-y-2 bg-black/95 backdrop-blur-md border-t"
              style={{
                borderTopColor: `${getHubColors(currentHub).primary}33`,
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
                        : "text-white hover:text-gray-300 hover:bg:white/5"
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5 mr-3 flex-shrink-0" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile-specific CTAs */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavClick(CONTACT_PATH);
                  }}
                  className={`w-full rounded-md ${hubColors.contactButton} font-medium py-3 text-sm h-12`}
                >
                  Contact
                </button>
                {import.meta.env.DEV && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleDirectCheckout();
                    }}
                    className={`w-full rounded-md ${hubColors.contactButton} font-semibold py-3 text-sm h-12`}
                  >
                    SignUp
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDirectLogin();
                  }}
                  className={`w-full rounded-md ${hubColors.contactButton} font-medium py-3 text-sm h-12`}
                >
                  LogIn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
