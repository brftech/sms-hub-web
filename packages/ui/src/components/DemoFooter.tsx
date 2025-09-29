import React from "react";
import { Button } from "./button";
import { HubLogo } from "./hub-logo";
import { useHub } from "../contexts/HubContext";
import { getHubColorClasses } from "@sms-hub/utils";
import { MessageSquare, Phone, Users, Zap, ArrowRight, Github, Mail, Globe } from "lucide-react";

interface DemoFooterProps {
  onNavigate?: (url: string) => void;
}

export default function DemoFooter({ onNavigate }: DemoFooterProps) {
  const { currentHub } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      // Fallback to window.location if no navigation function provided
      window.location.href = url;
    }
  };

  const quickLinks = [
    {
      label: "Phone Demo",
      description: "Customer experience",
      icon: <Phone className="h-5 w-5" />,
      url: "/phone-demo",
      color: "text-blue-400",
    },
    {
      label: "Platform Demo",
      description: "Business dashboard",
      icon: <Users className="h-5 w-5" />,
      url: "/platform-demo",
      color: "text-green-400",
    },
    {
      label: "Solutions",
      description: "What we offer",
      icon: <Zap className="h-5 w-5" />,
      url: "/solutions",
      color: "text-orange-400",
    },
    {
      label: "Contact",
      description: "Get in touch",
      icon: <Mail className="h-5 w-5" />,
      url: "/contact",
      color: "text-purple-400",
    },
  ];

  return (
    <footer className="bg-black/90 border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <HubLogo hubType={currentHub} variant="icon" size="lg" />
              <div>
                <h3 className="text-white font-bold text-lg">SMS Hub</h3>
                <p className="text-gray-400 text-sm">Business SMS Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Professional SMS solutions for businesses. Engage customers, automate responses, 
              and grow your business with our powerful platform.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => window.open('https://github.com/brftech/sms-hub-monorepo', '_blank')}
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => window.open('https://sms-hub.com', '_blank')}
              >
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => handleNavigate(link.url)}
                >
                  <span className={link.color}>{link.icon}</span>
                  <div className="ml-3 text-left">
                    <div className="text-white text-sm font-medium">{link.label}</div>
                    <div className="text-gray-300 text-xs">{link.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-semibold mb-4">Platform Features</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MessageSquare className="h-4 w-4 text-green-400" />
                <span className="text-sm">Two-way SMS</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm">AI Automation</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Users className="h-4 w-4 text-orange-400" />
                <span className="text-sm">Contact Management</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4 text-purple-400" />
                <span className="text-sm">Phone Verification</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-semibold mb-4">Ready to Start?</h4>
            <p className="text-gray-400 text-sm mb-4">
              Experience the full power of our SMS platform with these interactive demos.
            </p>
            <Button
              className={`w-full ${hubColors.bg} ${hubColors.text} hover:${hubColors.bgHover}`}
              onClick={() => handleNavigate("/contact")}
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 SMS Hub. All rights reserved.</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-0 h-auto"
                onClick={() => handleNavigate("/privacy")}
              >
                Privacy Policy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-0 h-auto"
                onClick={() => handleNavigate("/terms")}
              >
                Terms of Service
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Demo Environment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
