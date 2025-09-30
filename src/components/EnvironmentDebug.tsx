import React, { useState } from "react";

interface EnvironmentDebugProps {
  show?: boolean;
}

export const EnvironmentDebug: React.FC<EnvironmentDebugProps> = ({ show = true }) => {
  const [isMinimized, setIsMinimized] = useState(true);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0, 0.95)",
        color: "#00ff00",
        padding: isMinimized ? "8px 12px" : "12px 16px",
        fontSize: "10px",
        zIndex: 9998, // Lower than admin button (9999)
        maxWidth: isMinimized ? "120px" : "400px",
        wordBreak: "break-all",
        border: "1px solid #00ff00",
        borderRadius: "6px",
        fontFamily: "monospace",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 10px rgba(0, 255, 0, 0.3)",
        lineHeight: "1.4",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onClick={() => setIsMinimized(!isMinimized)}
    >
      <div
        style={{
          marginBottom: isMinimized ? "0" : "8px",
          fontWeight: "bold",
          color: "#00ff00",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>🔍 ENV DEBUG</span>
        <span style={{ fontSize: "8px", color: "#888" }}>
          {isMinimized ? "click to expand" : "click to minimize"}
        </span>
      </div>

      {!isMinimized && (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>SUPABASE:</span>{" "}
            <span style={{ color: "#00ff00" }}>
              {import.meta.env.VITE_SUPABASE_URL || "NOT SET"}
            </span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>MODE:</span>{" "}
            <span style={{ color: "#00ff00" }}>{import.meta.env.MODE || "NOT SET"}</span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>NODE_ENV:</span>{" "}
            <span style={{ color: "#00ff00" }}>{import.meta.env.NODE_ENV || "NOT SET"}</span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>DEV:</span>{" "}
            <span style={{ color: "#00ff00" }}>{import.meta.env.DEV ? "true" : "false"}</span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>PROD:</span>{" "}
            <span style={{ color: "#00ff00" }}>{import.meta.env.PROD ? "true" : "false"}</span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>DEBUG:</span>{" "}
            <span style={{ color: "#00ff00" }}>
              {import.meta.env.VITE_ENABLE_DEBUG || "NOT SET"}
            </span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>DEV_AUTH:</span>{" "}
            <span style={{ color: "#00ff00" }}>
              {import.meta.env.VITE_ENABLE_DEV_AUTH || "NOT SET"}
            </span>
          </div>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>HUB_SWITCHER:</span>{" "}
            <span style={{ color: "#00ff00" }}>
              {import.meta.env.VITE_ENABLE_HUB_SWITCHER || "NOT SET"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
