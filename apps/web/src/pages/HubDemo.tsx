import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHub } from "@/contexts/HubContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Users,
  Building2,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { PhoneInteractive } from "@/components";
import { LiveMessagingProvider } from "@/contexts/LiveMessagingContext";
import { getHubScenarios } from "@/config/hubDemoScenarios";
import PlatformInteractive from "@/components/PlatformInteractive";
import gnymbleTextLogo from "@/assets/gnymble-text-logo.svg";
import percytechTextLogo from "@/assets/percytech-text-logo.svg";
import gnymbleIconLogo from "@/assets/gnymble-icon-logo.svg";
import percytechIconLogo from "@/assets/percytech-icon-logo.svg";

const HubDemo: React.FC = () => {
  const navigate = useNavigate();
  const { currentHub, hubConfig, switchHub } = useHub();
  const [showFontText, setShowFontText] = useState(false);
  const [isLiveDemoMode, setIsLiveDemoMode] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);

  const handleLiveDemoToggle = () => {
    setIsLiveDemoMode(!isLiveDemoMode);
    setIsDemoActive(false); // Reset demo state when toggling modes
  };

  const handleDemoStateChange = (isActive: boolean) => {
    setIsDemoActive(isActive);
  };

  if (!hubConfig) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const getHubGradient = () => {
    if (currentHub === "percytech") {
      return "from-red-800 to-blue-600";
    } else {
      return "from-orange-500 to-red-600";
    }
  };

  const getHubIcon = () => {
    if (currentHub === "percytech") {
      return (
        <img src={percytechIconLogo} alt="PercyTech" className="w-16 h-16" />
      );
    } else {
      return <img src={gnymbleIconLogo} alt="Gnymble" className="w-16 h-16" />;
    }
  };

  const getHubTextLogo = () => {
    if (currentHub === "percytech") {
      return (
        <div className="flex justify-center">
          <img
            src={percytechTextLogo}
            alt="PercyTech"
            className="w-64 h-auto"
          />
        </div>
      );
    } else {
      return (
        <div className="flex justify-center">
          <img src={gnymbleTextLogo} alt="Gnymble" className="w-64 h-auto" />
        </div>
      );
    }
  };

  const getHubFontText = () => {
    if (currentHub === "percytech") {
      return (
        <span
          className="text-4xl font-black bg-gradient-to-r from-red-800 to-blue-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          percytech
        </span>
      );
    } else {
      return (
        <span
          className="text-4xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          gnymble
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Hub Demo</h1>
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            Home
          </Button>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="pt-20 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <button
              onClick={() => navigate("/")}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-white">Hub Demo</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            {getHubTextLogo()}
          </h1>

          {/* Sub-headline */}
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            {hubConfig.content.heroSubtitle}
          </p>

          {/* Hub Switcher */}
          <div className="flex justify-center space-x-4 mb-12">
            <Button
              onClick={() => switchHub("percytech")}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                currentHub === "percytech"
                  ? "bg-gradient-to-r from-red-800 to-blue-600 text-white shadow-lg shadow-red-800/25"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="w-6 h-6 mr-2 bg-white/20 rounded p-1">
                <img
                  src={percytechIconLogo}
                  alt="PercyTech"
                  className="w-full h-full"
                />
              </div>
              PercyTech
            </Button>
            <Button
              onClick={() => switchHub("gnymble")}
              className={`px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                currentHub === "gnymble"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              <div className="w-6 h-6 mr-2 bg-white/20 rounded p-1">
                <img
                  src={gnymbleIconLogo}
                  alt="Gnymble"
                  className="w-full h-full"
                />
              </div>
              Gnymble
            </Button>
          </div>

          {/* CTA Button */}
          <Button
            className={`px-8 py-4 text-lg font-semibold bg-gradient-to-r ${getHubGradient()} text-white shadow-lg transition-all duration-300 hover:scale-105`}
          >
            {hubConfig.content.ctaText}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            {currentHub === "percytech"
              ? "Enterprise Features"
              : "Platform Features"}
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {hubConfig.content.features &&
              hubConfig.content.features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getHubGradient()} flex items-center justify-center mb-4`}
                    >
                      {index === 0 && <Shield className="w-6 h-6 text-white" />}
                      {index === 1 && <Zap className="w-6 h-6 text-white" />}
                      {index === 2 && <Users className="w-6 h-6 text-white" />}
                      {index === 3 && (
                        <Building2 className="w-6 h-6 text-white" />
                      )}
                      {index === 4 && <Globe className="w-6 h-6 text-white" />}
                    </div>
                    <CardTitle className="text-xl text-white">
                      {feature}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      {currentHub === "percytech"
                        ? `Enterprise-grade ${feature.toLowerCase()} solution designed for scalability and reliability.`
                        : `Premium ${feature.toLowerCase()} capabilities built specifically for luxury retail environments.`}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Hub Info Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Hub Configuration</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Current Hub</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getHubGradient()} flex items-center justify-center`}
                    style={{
                      fontFamily:
                        currentHub === "percytech"
                          ? "Inter, sans-serif"
                          : "inherit",
                    }}
                  >
                    {currentHub === "percytech" ? (
                      <img
                        src={percytechIconLogo}
                        alt="PercyTech"
                        className="w-4 h-4"
                      />
                    ) : (
                      <img
                        src={gnymbleIconLogo}
                        alt="Gnymble"
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-medium text-white"
                      style={{
                        fontFamily:
                          currentHub === "percytech"
                            ? "Inter, sans-serif"
                            : "inherit",
                      }}
                    >
                      {hubConfig.name}
                    </div>
                    <div className="text-xs text-white/60">
                      {currentHub === "percytech"
                        ? "Enterprise Technology"
                        : "SMS Platform"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Theme Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Primary:</span>
                  <div className="flex space-x-2">
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: hubConfig.primaryColor }}
                    ></div>
                    <span className="text-white font-mono text-sm">
                      {hubConfig.primaryColor}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Secondary:</span>
                  <div className="flex space-x-2">
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: hubConfig.secondaryColor }}
                    ></div>
                    <span className="text-white font-mono text-sm">
                      {hubConfig.secondaryColor}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Accent:</span>
                  <div className="flex space-x-2">
                    <div
                      className="w-6 h-6 rounded border border-white/20"
                      style={{ backgroundColor: hubConfig.accentColor }}
                    ></div>
                    <span className="text-white font-mono text-sm">
                      {hubConfig.accentColor}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Logo Comparison Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-white">
            Logo Comparison
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mb-8">
            {/* SVG Logo */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <img
                    src={
                      currentHub === "percytech"
                        ? percytechIconLogo
                        : gnymbleIconLogo
                    }
                    alt="Icon"
                    className="w-6 h-6 mr-2"
                  />
                  SVG Logo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {getHubTextLogo()}
                <p className="text-gray-400 mt-4 text-sm">
                  Rendered from SVG file with exact font specifications
                </p>
              </CardContent>
            </Card>

            {/* Font Text */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-6 h-6 mr-2" />
                  Font Text
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="py-8">{getHubFontText()}</div>
                <p className="text-gray-400 mt-4 text-sm">
                  Rendered with CSS using Inter font family
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setShowFontText(!showFontText)}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {showFontText ? "Hide" : "Show"} Font Details
            </Button>

            {showFontText && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Font Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <strong>Font Family:</strong> Inter, sans-serif
                  </div>
                  <div>
                    <strong>Font Weight:</strong> 900 (Extra Bold)
                  </div>
                  <div>
                    <strong>Font Size:</strong> 2.25rem (36px)
                  </div>
                  <div>
                    <strong>Letter Spacing:</strong> Normal
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Phone Demo Section */}
      <div className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Interactive Phone Demo
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Experience {hubConfig.name}'s messaging scenarios in action
            </p>

            {/* Live Demo Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className="text-gray-300">Static Demo</span>
              <Button
                onClick={handleLiveDemoToggle}
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
              >
                {isLiveDemoMode ? (
                  <ToggleRight className="w-8 h-8 text-green-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500" />
                )}
              </Button>
              <span className="text-gray-300">Live Demo</span>
            </div>

            <div className="text-center mb-6">
              <Badge
                variant={isLiveDemoMode ? "default" : "secondary"}
                className={`text-sm px-4 py-2 ${
                  isLiveDemoMode
                    ? isDemoActive
                      ? "bg-emerald-600 text-white"
                      : "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-200"
                }`}
              >
                {isLiveDemoMode
                  ? isDemoActive
                    ? "Live Demo Active"
                    : "Live Interactive Mode"
                  : "Static Cycling Demo"}
              </Badge>
            </div>

            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              {isLiveDemoMode
                ? "Interactive mode: Send real messages and get AI responses"
                : `Static mode: Watch ${hubConfig.name}-specific scenarios cycle automatically`}
            </p>
          </div>

          <div className="flex justify-center">
            {isLiveDemoMode ? (
              <LiveMessagingProvider>
                <PhoneInteractive
                  isInteractive={true}
                  customScenarios={getHubScenarios(currentHub)}
                  onDemoStateChange={handleDemoStateChange}
                />
              </LiveMessagingProvider>
            ) : (
              <PhoneInteractive
                isInteractive={false}
                customScenarios={getHubScenarios(currentHub)}
                onDemoStateChange={handleDemoStateChange}
              />
            )}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gray-900 border-gray-700 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {hubConfig.name} Demo Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-300 text-sm space-y-2">
                  {getHubScenarios(currentHub).map((scenario, index) => (
                    <div
                      key={scenario.id}
                      className="flex justify-between items-center"
                    >
                      <span>
                        Scenario {index + 1}: {scenario.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {scenario.messages.length} messages
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Business Platform Demo Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Business Owner Platform
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Experience the {hubConfig.name} platform from the business owner's
              perspective
            </p>

            <div className="text-center mb-6">
              <Badge
                variant="default"
                className="text-sm px-4 py-2 bg-purple-600 text-white"
              >
                Platform Demo - Send Broadcasts & Manage Conversations
              </Badge>
            </div>

            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              This is what business owners see when managing customer
              communications. Send broadcast messages to all customers or have
              1:1 conversations.
            </p>
          </div>

          <div className="flex justify-center">
            <PlatformInteractive
              onMessageToPlatform={(message) => {
                console.log("Message sent from platform:", message);
              }}
              onBroadcastMessage={(message, customerIds) => {
                console.log(
                  "Broadcast sent:",
                  message,
                  "to customers:",
                  customerIds
                );
              }}
            />
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-white border-gray-200 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center justify-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Platform Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700 text-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span>✉️ 1:1 Customer Conversations</span>
                    <Badge variant="outline" className="text-xs">
                      Real-time
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>📢 Broadcast Messaging</span>
                    <Badge variant="outline" className="text-xs">
                      Bulk send
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>👥 Customer Management</span>
                    <Badge variant="outline" className="text-xs">
                      Contact lists
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>📊 Delivery Tracking</span>
                    <Badge variant="outline" className="text-xs">
                      Read receipts
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubDemo;
