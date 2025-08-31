import React, { useState } from "react";
import { LeadDashboard, MessageDashboard } from "@/components";
import { PageLayout } from "@/components/layout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"leads" | "messages">("leads");

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8">
                <Button
                  variant={activeTab === "leads" ? "default" : "ghost"}
                  onClick={() => setActiveTab("leads")}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Leads
                </Button>
                <Button
                  variant={activeTab === "messages" ? "default" : "ghost"}
                  onClick={() => setActiveTab("messages")}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "leads" ? <LeadDashboard /> : <MessageDashboard />}
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default Admin;
