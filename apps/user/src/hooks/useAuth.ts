import { useState } from "react";
import { supabase } from '../config/supabase'
import { SignupData, VerificationData } from "@sms-hub/types";

export const useCreateTempSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = async (data: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the Edge Function to create temp signup
      const { data: result, error } = await supabase.functions.invoke(
        "create-temp-signup",
        {
          body: data,
        }
      );

      if (error) throw error;
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to create signup");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
    error,
  };
};

export const useVerifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = async (data: VerificationData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the Edge Function to verify code
      const { data: result, error } = await supabase.functions.invoke(
        "verify-code",
        {
          body: data,
        }
      );

      if (error) throw error;
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
    error,
  };
};
