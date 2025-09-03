import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export interface ProtectedRouteConfig {
  loginPath?: string;
  paymentRequiredPath?: string;
  checkPaymentStatus?: boolean;
  checkOnboarding?: boolean;
  onboardingPaths?: string[];
  allowedPaths?: string[];
  loadingComponent?: React.ReactNode;
  redirectAfterLogin?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: any;
  userProfile?: any;
  session?: any;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  authState: AuthState;
  config?: ProtectedRouteConfig;
  checkoutRedirectComponent?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  authState,
  config = {},
  checkoutRedirectComponent
}: ProtectedRouteProps) {
  const location = useLocation();
  const {
    loginPath = '/login',
    paymentRequiredPath = '/payment-required',
    checkPaymentStatus = false,
    checkOnboarding = false,
    onboardingPaths = ['/onboarding'],
    allowedPaths = [],
    loadingComponent,
    redirectAfterLogin = true,
  } = config;

  if (authState.isLoading) {
    return (
      loadingComponent || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!authState.isAuthenticated) {
    // Save the attempted location for redirect after login
    return (
      <Navigate 
        to={loginPath} 
        state={redirectAfterLogin ? { from: location } : undefined} 
        replace 
      />
    );
  }

  // Check if there's a pending checkout from signup
  const pendingCheckout = typeof sessionStorage !== 'undefined' 
    ? sessionStorage.getItem('pending_checkout')
    : null;
    
  if (pendingCheckout && checkoutRedirectComponent && location.pathname === '/') {
    // Only redirect to CheckoutRedirect if they're not trying to access allowed paths
    const isAllowedPath = allowedPaths.some(path => location.pathname.includes(path));
    if (!isAllowedPath) {
      return <>{checkoutRedirectComponent}</>;
    }
  }

  // Check if user needs to complete payment
  if (checkPaymentStatus && authState.userProfile && !authState.userProfile.payment_status) {
    // Allow access to onboarding and payment-related paths
    const isOnboardingPath = onboardingPaths.some(path => location.pathname.includes(path));
    const isPaymentPath = location.pathname.includes('payment') || 
                         location.pathname.includes('stripe');
    
    if (checkOnboarding && isOnboardingPath) {
      return <>{children}</>;
    }
    
    if (!isPaymentPath && !isOnboardingPath) {
      return <Navigate to={paymentRequiredPath} replace />;
    }
  }

  return <>{children}</>;
}