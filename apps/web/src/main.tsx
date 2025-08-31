import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// Import shared UI styles with hub-specific theming
import "@sms-hub/ui/styles/globals.css";
import "@sms-hub/ui/styles/gnymble.css";
import "@sms-hub/ui/styles/percytech.css";
import "@sms-hub/ui/styles/percymd.css";
import "@sms-hub/ui/styles/percytext.css";
// Import web app specific styles
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
