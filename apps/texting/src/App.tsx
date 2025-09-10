import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";
import { Campaigns } from "./pages/Campaigns";
import { Messages } from "./pages/Messages";
import { Settings } from "./pages/Settings";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { getWebAppUrl, getUserAppUrl } from "@sms-hub/utils";

// Redirect components that use window.location.href for cross-app redirects
const WebAppRedirect = ({ path }: { path: string }) => {
  useEffect(() => {
    window.location.href = getWebAppUrl(path);
  }, [path]);
  return null;
};

const UserAppRedirect = ({ path }: { path: string }) => {
  useEffect(() => {
    window.location.href = getUserAppUrl(path);
  }, [path]);
  return null;
};

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Redirect auth routes to web app */}
        <Route path="/signup" element={<WebAppRedirect path="/signup" />} />
        <Route path="/verify" element={<WebAppRedirect path="/verify" />} />
        <Route path="/verify-otp" element={<WebAppRedirect path="/verify-otp" />} />
        <Route path="/login" element={<WebAppRedirect path="/login" />} />
        
        {/* Redirect onboarding to user app */}
        <Route path="/onboarding" element={<UserAppRedirect path="/onboarding" />} />
        <Route path="/onboarding-progress" element={<UserAppRedirect path="/onboarding-progress" />} />
        <Route path="/account-details" element={<UserAppRedirect path="/account-details" />} />
        <Route path="/payment-required" element={<UserAppRedirect path="/payment-required" />} />
        <Route path="/payment-success" element={<UserAppRedirect path="/payment-success" />} />
        
        {/* SMS-focused routes for onboarded users */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
