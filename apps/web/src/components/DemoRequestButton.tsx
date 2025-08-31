import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DemoRequestButtonProps {
  className?: string;
  children?: React.ReactNode;
  redirectTo?: string;
}

const DemoRequestButton: React.FC<DemoRequestButtonProps> = ({
  className = "",
  children = "Access Interactive Demo",
  redirectTo = "/demo",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(redirectTo);
  };

  return (
    <Button
      onClick={handleClick}
      className={`px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transition-all duration-300 hover:scale-105 ${className}`}
    >
      {children}
    </Button>
  );
};

export default DemoRequestButton;
