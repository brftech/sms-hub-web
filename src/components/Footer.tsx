import { Link } from "react-router-dom";
import { useHub, HubLogo } from "@sms-hub/ui/marketing";
import { getHubSEO } from "@sms-hub/hub-logic";
import { PRICING_PATH, ABOUT_PATH, CONTACT_PATH, PRIVACY_PATH, TERMS_PATH } from "@/utils/routes";

const Footer = () => {
  const { currentHub } = useHub();
  const seo = getHubSEO(currentHub);

  const getLogo = () => {
    return <HubLogo hubType={currentHub} variant="main" size="lg" />;
  };

  return (
    <footer className="bg-black text:white py-8 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-3 flex justify-start">{getLogo()}</div>
            <p className="text-gray-400 mb-4 max-w-md text-sm">{seo.footerDescription}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to={PRICING_PATH}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to={ABOUT_PATH}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to={CONTACT_PATH}
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
                  to={PRIVACY_PATH}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to={TERMS_PATH}
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
            <p className="text-gray-400 text-sm">© 2025 PercyTech LLC. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
