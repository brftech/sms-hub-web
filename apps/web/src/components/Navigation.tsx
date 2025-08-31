import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useHub } from "@/contexts/HubContext";
import { Menu, X } from "lucide-react";
import HubSelector from "./HubSelector";
import GnymbleLogo from "./GnymbleLogo";
import PercyTechLogo from "./PercyTechLogo";
import { useHubColors } from "@/utils/hubColors";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hubColors = useHubColors();
  const { currentHub, hubConfig, switchHub, showHubSwitcher } = useHub();

  const getLogo = () => {
    if (currentHub === "percytech") {
      return <PercyTechLogo size="lg" variant="icon-logo" />;
    } else {
      return <GnymbleLogo size="lg" variant="icon" />;
    }
  };

  const isContactPage = location.pathname === "/contact";
  const isSignUpPage = location.pathname === "/signup";
  const isLoginPage = location.pathname === "/login";

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Text links (Desktop only) */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className="hover:opacity-80 transition-opacity duration-300"
            >
              {getLogo()}
            </button>
            <button
              onClick={() => navigate("/solutions")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/solutions"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Solutions
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/pricing"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/testimonials")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/testimonials"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              Testimonials
            </button>
            <button
              onClick={() => navigate("/about")}
              className={`transition-colors text-sm font-medium ${
                location.pathname === "/about"
                  ? `${hubColors.text} hub-text-primary`
                  : "text-white hover:text-gray-300"
              }`}
            >
              About
            </button>
          </div>

          {/* Mobile header with logo, contact button, and hamburger */}
          <div className="md:hidden flex items-center justify-between w-full">
            <button
              onClick={() => navigate("/")}
              className="hover:opacity-80 transition-opacity duration-300"
            >
              {getLogo()}
            </button>
            <div className="flex items-center space-x-3">
              {/* Hub Selector - Only visible in development */}
              {showHubSwitcher && <HubSelector />}

              <Button
                onClick={() => navigate("/contact")}
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
            <HubSelector />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/contact")}
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
