import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useHubColors } from "@/utils/hubColors";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hubColors = useHubColors();

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-gray-300 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-4">
              <button
                onClick={() => handleNavClick("/")}
                className={`block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                  location.pathname === "/"
                    ? `${hubColors.bg} text-white`
                    : "text-white hover:text-gray-300"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("/solutions")}
                className={`block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                  location.pathname === "/solutions"
                    ? `${hubColors.bg} text-white`
                    : "text-white hover:text-gray-300"
                }`}
              >
                Solutions
              </button>
              <button
                onClick={() => handleNavClick("/pricing")}
                className={`block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                  location.pathname === "/pricing"
                    ? `${hubColors.bg} text-white`
                    : "text-white hover:text-gray-300"
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavClick("/testimonials")}
                className={`block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                  location.pathname === "/testimonials"
                    ? `${hubColors.bg} text-white`
                    : "text-white hover:text-gray-300"
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => handleNavClick("/about")}
                className={`block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                  location.pathname === "/about"
                    ? `${hubColors.bg} text-white`
                    : "text-white hover:text-gray-300"
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick("/contact")}
                className={`block w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                  location.pathname === "/contact"
                    ? `${hubColors.bg} text-white`
                    : "text-white hover:text-gray-300"
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/20">
              <Button
                onClick={() => handleNavClick("/contact")}
                className={`w-full ${hubColors.bg} hover:${hubColors.bgHover} text-white font-semibold py-3`}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
