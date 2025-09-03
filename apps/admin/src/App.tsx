import React from "react";
import { Routes, Route } from "react-router-dom";
import { useHub } from "@sms-hub/ui";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Companies from "./pages/Companies";
// import { Messages } from './pages/Messages'
// import { Analytics } from './pages/Analytics'
import Settings from "./pages/Settings";
import { Login } from "./pages/Login";
import Leads from "./pages/Leads";
import Verifications from "./pages/Verifications";
import Testing from "./pages/Testing";

import { Layout } from "./components/Layout";
import { GlobalViewProvider } from "./contexts/GlobalViewContext";

function App() {
  const { hubConfig } = useHub();

  return (
    <div className="min-h-screen bg-background">
      <GlobalViewProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="companies" element={<Companies />} />
            <Route path="leads" element={<Leads />} />
            <Route path="verifications" element={<Verifications />} />
            <Route path="testing" element={<Testing />} />
            {/* <Route path="messages" element={<Messages />} /> */}
            {/* <Route path="analytics" element={<Analytics />} /> */}
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </GlobalViewProvider>
    </div>
  );
}

export default App;
