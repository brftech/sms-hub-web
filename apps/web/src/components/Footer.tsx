import { Link } from "react-router-dom";
import { useHub } from "@/contexts/HubContext";
import { useHubColors } from "@/utils/hubColors";
import GnymbleLogo from "./GnymbleLogo";
import PercyTechLogo from "./PercyTechLogo";

const Footer = () => {
  const { currentHub } = useHub();
  const hubColors = useHubColors();

  const getLogo = () => {
    if (currentHub === "percytech") {
      return <PercyTechLogo size="4xl" variant="text-logo" />;
    } else {
      return <GnymbleLogo size="4xl" variant="default" />;
    }
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex justify-start">{getLogo()}</div>
            <p className="text-gray-400 mb-4 max-w-md">
              {currentHub === "percytech"
                ? "Enterprise technology solutions and platforms for modern businesses."
                : "Compliant SMS marketing platform designed for premium retailers and sophisticated customer engagement."}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`${hubColors.text} hover:${hubColors.textHover} transition-colors`}
              >
                Twitter
              </a>
              <a
                href="#"
                className={`${hubColors.text} hover:${hubColors.textHover} transition-colors`}
              >
                LinkedIn
              </a>
              <a
                href="#"
                className={`${hubColors.text} hover:${hubColors.textHover} transition-colors`}
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/solutions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/sms-privacy-terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  SMS Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 {currentHub === "percytech" ? "PercyTech" : "Gnymble"}. All
            rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
