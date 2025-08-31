import React from "react";
import { PageLayout } from "@/components/layout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

const AdminTest: React.FC = () => {
  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Admin Test Page
            </h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-4">
                If you can see this page, the admin protection is working
                correctly!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Status</h3>
                  <p className="text-blue-700">Protected Route Working</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">
                    Authentication
                  </h3>
                  <p className="text-green-700">Password Verified</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Access</h3>
                  <p className="text-purple-700">Admin Panel Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default AdminTest;
