import React, { useState, useEffect } from "react";
import { useHub } from "@sms-hub/ui/marketing";
import { getHubColors } from "@sms-hub/hub-logic";
import { Shield, Lock, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_PATH, HOME_PATH } from "@/utils/routes";

export const FloatingAdminButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentHub } = useHub();
  const hubColors = getHubColors(currentHub);

  const isOnAdminPage = location.pathname === ADMIN_PATH;

  useEffect(() => {
    const checkAdminAccess = () => {
      const isDev = import.meta.env.MODE === "development";
      const isLocalhost = window.location.hostname === "localhost";
      const storedAuth = localStorage.getItem("admin_auth_token");
      const authTimestamp = localStorage.getItem("admin_auth_timestamp");

      // Show in development always
      if (isDev || isLocalhost) {
        setIsVisible(true);
        setIsAuthenticated(true);
        return;
      }

      // Check if user has valid admin token (expires after 24 hours)
      if (storedAuth && authTimestamp) {
        const tokenTime = new Date(authTimestamp).getTime();
        const now = new Date().getTime();
        const hoursDiff = (now - tokenTime) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          setIsVisible(true);
          setIsAuthenticated(true);
          return;
        } else {
          // Token expired, remove it
          localStorage.removeItem("admin_auth_token");
          localStorage.removeItem("admin_auth_timestamp");
        }
      }

      // Check for admin access code in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const adminCode = urlParams.get("admin");

      if (adminCode === import.meta.env.VITE_ADMIN_ACCESS_CODE) {
        setIsVisible(true);
        setIsAuthenticated(true);
        localStorage.setItem("admin_auth_token", "authenticated");
        localStorage.setItem("admin_auth_timestamp", new Date().toISOString());
        // Remove the admin code from URL for security
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    checkAdminAccess();
  }, []);

  const handleAdminClick = () => {
    // If on admin page, go back to home
    if (isOnAdminPage) {
      navigate(HOME_PATH);
      return;
    }

    // Otherwise, navigate to admin
    if (isAuthenticated) {
      navigate(ADMIN_PATH);
    } else {
      // In production, redirect to admin with access code prompt
      const accessCode = prompt("Enter admin access code:");
      if (accessCode === import.meta.env.VITE_ADMIN_ACCESS_CODE) {
        localStorage.setItem("admin_auth_token", "authenticated");
        localStorage.setItem("admin_auth_timestamp", new Date().toISOString());
        navigate(ADMIN_PATH);
      } else {
        alert("Invalid access code");
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  // Determine icon and label based on current page
  const getIconAndLabel = () => {
    if (isOnAdminPage) {
      return {
        icon: <Home className="w-6 h-6" />,
        label: "Back to Home",
      };
    }
    return {
      icon: isAuthenticated ? <Shield className="w-6 h-6" /> : <Lock className="w-6 h-6" />,
      label: isAuthenticated ? "Admin Dashboard" : "Admin Access",
    };
  };

  const { icon, label } = getIconAndLabel();

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={handleAdminClick}
        className="w-14 h-14 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group transform hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${hubColors.primary}, ${hubColors.secondary})`,
        }}
        aria-label={label}
        title={label}
      >
        {icon}
      </button>
    </div>
  );
};

export default FloatingAdminButton;
