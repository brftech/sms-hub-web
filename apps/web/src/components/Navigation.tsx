import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, useHub, HubLogo } from "@sms-hub/ui";
import { Menu, X, Shield } from "lucide-react";
// import { HubSwitcher } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";
import { isAdminAccessible } from "../utils/environment";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const getLogo = () => {
    return <HubLogo hubType={currentHub} variant="icon" size="lg" />;
  };

  const isContactPage = location.pathname === "/contact";
  const showAdminLink = isAdminAccessible();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
    scrollToTop();
  };

  const handleDesktopNavClick = (path: string) => {
    navigate(path);
    scrollToTop();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Text links (Desktop only) */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleDesktopNavClick("/")}
              className="hover:opacity-80 transition-opacity duration-300"
            >
              {getLogo()}
            </button>
            <button
              onClick={() => handleDesktopNavClick("/solutions")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/solutions"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Solutions
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
              onClick={() => handleDesktopNavClick("/testimonials")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/testimonials"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Testimonials
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
              onClick={() => handleDesktopNavClick("/phone-demo")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/phone-demo"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Phone Demo
            </button>
            <button
              onClick={() => handleDesktopNavClick("/platform-demo")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/platform-demo"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Platform Demo
            </button>
            {showAdminLink && (
              <button
                onClick={() => handleDesktopNavClick("/admin")}
                className={`transition-colors text-sm font-medium ${
                  location.pathname === "/admin"
                    ? `${hubColors.text} hub-text-primary`
                    : "text-white hover:text-gray-300"
                }`}
              >
                <Shield className="w-4 h-4 inline mr-1" />
                Admin
              </button>
            )}
          </div>

          {/* Mobile header with logo, contact button, and hamburger */}
          <div className="md:hidden flex items-center justify-between w-full">
            <button
              onClick={() => handleDesktopNavClick("/")}
              className="hover:opacity-80 transition-opacity duration-300"
            >
              {getLogo()}
            </button>
            <div className="flex items-center space-x-3">
              {/* Hub Selector - Hidden for now */}
              {/* {showHubSwitcher && <HubSwitcher />} */}

              <Button
                onClick={() => handleDesktopNavClick("/contact")}
                className={`px-4 py-2 transition-all duration-300 ${hubColors.contactButton}`}
              >
                Contact Us
              </Button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Right side - Navigation buttons (Desktop only) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Hub Selector - Hidden for now */}
            {/* <HubSwitcher /> */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDesktopNavClick("/contact")}
              className={`transition-all duration-300 backdrop-blur-sm px-4 text-xs w-24 ${
                isContactPage
                  ? `${hubColors.bgLight} ${hubColors.text} ${hubColors.border}`
                  : "bg-black/50 text-white border border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-400"
              }`}
            >
              Contact Us
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div
              className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-sm border-t border-orange-500/20"
              style={{
                borderTopColor:
                  currentHub === "percytech" ? "#8B000020" : "#EA580C20",
              }}
            >
              <button
                onClick={() => handleNavClick("/solutions")}
                className={`block w-full text-left px-3 py-2 text-base font-medium text-white hover:${
                  hubColors.textHover
                } hover:${hubColors.bgLight} transition-colors ${
                  location.pathname === "/solutions"
                    ? `${hubColors.text} ${hubColors.bgLight}`
                    : ""
                }`}
              >
                Solutions
              </button>
              <button
                onClick={() => handleNavClick("/pricing")}
                className={`block w-full text-left px-3 py-2 text-base font-medium text-white hover:${
                  hubColors.textHover
                } hover:${hubColors.bgLight} transition-colors ${
                  location.pathname === "/pricing"
                    ? `${hubColors.text} ${hubColors.bgLight}`
                    : ""
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavClick("/testimonials")}
                className={`block w-full text-left px-3 py-2 text-base font-medium text-white hover:${
                  hubColors.textHover
                } hover:${hubColors.bgLight} transition-colors ${
                  location.pathname === "/testimonials"
                    ? `${hubColors.text} ${hubColors.bgLight}`
                    : ""
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => handleNavClick("/about")}
                className={`block w-full text-left px-3 py-2 text-base font-medium text-white hover:${
                  hubColors.textHover
                } hover:${hubColors.bgLight} transition-colors ${
                  location.pathname === "/about"
                    ? `${hubColors.text} ${hubColors.bgLight}`
                    : ""
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick("/faq")}
                className={`block w-full text-left px-3 py-2 text-base font-medium text-white hover:${
                  hubColors.textHover
                } hover:${hubColors.bgLight} transition-colors ${
                  location.pathname === "/faq"
                    ? `${hubColors.text} ${hubColors.bgLight}`
                    : ""
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => handleNavClick("/phone-demo")}
                className={`block w-full text-left px-3 py-2 text-base font-medium text-white hover:${
                  hubColors.textHover
                } hover:${hubColors.bgLight} transition-colors ${
                  location.pathname === "/phone-demo"
                    ? `${hubColors.text} ${hubColors.bgLight}`
                    : ""
                }`}
              >
                Phone Demo
              </button>
              <button
                onClick={() => handleNavClick("/platform-demo")}
                className={`block w-full text-left px-3 py-2 text-base font-medium text-white hover:${
                  hubColors.textHover
                } hover:${hubColors.bgLight} transition-colors ${
                  location.pathname === "/platform-demo"
                    ? `${hubColors.text} ${hubColors.bgLight}`
                    : ""
                }`}
              >
                Platform Demo
              </button>
              {showAdminLink && (
                <button
                  onClick={() => handleNavClick("/admin")}
                  className={`block w-full text-left px-3 py-2 text-base font-medium text-white hover:${
                    hubColors.textHover
                  } hover:${hubColors.bgLight} transition-colors ${
                    location.pathname === "/admin"
                      ? `${hubColors.text} ${hubColors.bgLight}`
                      : ""
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Admin
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
