import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import { useDevAuth, clearDevAuth } from "@sms-hub/dev-auth";
// import { EnvironmentAdapter } from '../types' // Type not used

const IndicatorContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    font-size: 11px;
    padding: 6px 10px;
  }
`;

const DevIcon = styled.div`
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.2);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:active {
    transform: scale(0.9);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

interface DevAdminBannerProps {
  onboardingPath?: string;
}

export function DevAdminBanner({
  onboardingPath = "/onboarding",
}: DevAdminBannerProps) {
  // const devAuth = useDevAuth({
  //   isDevelopment: environment.isDevelopment || (() => false),
  // });
  const navigate = useNavigate();

  // if (!devAuth.isSuperadmin) {
  //   return null;
  // }

  const handleIndicatorClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the close button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    navigate(onboardingPath);
  };

  return (
    <IndicatorContainer
      onClick={handleIndicatorClick}
      title="Dev Superadmin Mode Active - Click to go to onboarding"
    >
      <DevIcon />
      <span>DEV MODE</span>
      <CloseButton
        onClick={(e) => {
          e.stopPropagation();
          // clearDevAuth();
        }}
        title="Exit Dev Mode"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </CloseButton>
    </IndicatorContainer>
  );
}
