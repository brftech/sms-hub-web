import { ArrowRight } from "lucide-react";
import { useHub } from "@sms-hub/ui/marketing";

export const PhoneDemo: React.FC = () => {
  const { currentHub } = useHub();

  return (
    <div className="phone-3d mx-auto mobile-phone-demo">
      <div className="phone-screen">
        {/* Phone Status Bar */}
        <div className="phone-status-bar">
          <span>9:41 AM</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-2 border border-white rounded-sm">
              <div className="w-3 h-1 bg-white rounded-sm"></div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="phone-messages-area">
          <div className="phone-messages">
            {/* Business Message */}
            <div className="flex mb-3">
              <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[200px]">
                <p className="text-sm text-gray-800">
                  {currentHub === "percymd"
                    ? "🏥 REMINDER: Your annual checkup is tomorrow at 2:30 PM. Please arrive 15 minutes early. Reply STOP to opt out."
                    : "🔥 EXCLUSIVE: Drew Estate Masterclass this Saturday 7PM! Only 15 spots left. Call to RSVP!"}
                </p>
                <span className="text-xs text-gray-300">
                  {currentHub === "percymd"
                    ? "PercyMD Health Center"
                    : "Premium Cigars & Co"}
                </span>
              </div>
            </div>

            {/* User Response */}
            <div className="flex justify-end mb-3">
              <div className="bg-blue-500 rounded-2xl rounded-br-sm px-4 py-2 max-w-[200px]">
                <p className="text-sm text-white">
                  {currentHub === "percymd"
                    ? "Thanks! See you tomorrow 👍"
                    : "Count me in! Can't wait 🎉"}
                </p>
              </div>
            </div>

            {/* Business Follow-up */}
            <div className="flex">
              <div className="bg-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[200px]">
                <p className="text-sm text-gray-800">
                  {currentHub === "percymd"
                    ? "Great! Don't forget to bring your insurance card and ID. See you soon!"
                    : "Perfect! See you Saturday. Age 21+ required at door."}
                </p>
                <span className="text-xs text-gray-300">
                  {currentHub === "percymd"
                    ? "PercyMD Health Center"
                    : "Premium Cigars & Co"}
                </span>
              </div>
            </div>
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
  );
};
