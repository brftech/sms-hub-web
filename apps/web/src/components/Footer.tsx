import { Link } from "react-router-dom";
import { useHub, HubLogo } from "@sms-hub/ui";
import { getHubColorClasses } from "@sms-hub/utils";

const Footer = () => {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const getLogo = () => {
    return <HubLogo hubType={currentHub} variant="text" size="lg" />;
  };

  return (
    <footer className="bg-black text-white py-8 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-3 flex justify-start">{getLogo()}</div>
            <p className="text-gray-400 mb-4 max-w-md text-sm">
              {currentHub === "percytech"
                ? "Enterprise technology solutions and platforms for modern businesses."
                : "Compliant SMS marketing platform designed for premium retailers and sophisticated customer engagement."}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`${hubColors.text} hover:${hubColors.textHover} transition-colors text-sm`}
              >
                Twitter
              </a>
              <a
                href="#"
                className={`${hubColors.text} hover:${hubColors.textHover} transition-colors text-sm`}
              >
                LinkedIn
              </a>
              <a
                href="#"
                className={`${hubColors.text} hover:${hubColors.textHover} transition-colors text-sm`}
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1">

              <li>
                <Link
                  to="/pricing"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-semibold mb-3">Legal</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 pt-6 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 {currentHub === "percytech" ? "PercyTech" : "SMS Hub"}. All rights reserved.
            </p>
            <div className="mt-2 md:mt-0">
              <p className="text-gray-500 text-xs">
                Built with ❤️ for premium venues
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
