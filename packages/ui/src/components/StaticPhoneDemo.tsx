import React from "react";
import { ArrowRight } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "business" | "user";
  businessName?: string;
}

interface StaticPhoneDemoProps {
  messages: Message[];
  time?: string;
  className?: string;
}

export const StaticPhoneDemo: React.FC<StaticPhoneDemoProps> = ({
  messages,
  time = "9:41 AM",
  className = "",
}) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="phone-3d">
        <div className="phone-screen">
          {/* Phone Status Bar */}
          <div className="phone-status-bar">
            <span>{time}</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="phone-messages-area">
            <div className="phone-messages">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} ${
                    index < messages.length - 1 ? "mb-3" : ""
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[85%] ${
                      message.sender === "user"
                        ? "bg-blue-500 rounded-br-sm"
                        : "bg-gray-200 rounded-bl-sm"
                    }`}
                  >
                    <p
                      className={`text-sm text-left ${
                        message.sender === "user" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {message.text}
                    </p>
                    {message.sender === "business" && message.businessName && (
                      <div className="text-xs text-gray-300 mt-1 text-left">
                        {message.businessName}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input Area */}
          <div className="phone-input-area">
            <div className="phone-input-field flex items-center justify-center text-gray-400 text-sm">
              Message...
            </div>
            <div className="phone-send-button">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticPhoneDemo;
