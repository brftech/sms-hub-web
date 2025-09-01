import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Onboarding } from "./pages/onboarding/Onboarding";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { VerifyCode } from "./pages/VerifyCode";
import { VerifyOtp } from "./pages/VerifyOtp";
import { Campaigns } from "./pages/Campaigns";
import { Messages } from "./pages/Messages";
import { Settings } from "./pages/Settings";
import { PaymentRequired } from "./pages/PaymentRequired";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment-required" element={<PaymentRequired />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/onboarding" element={<Onboarding />} />
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
