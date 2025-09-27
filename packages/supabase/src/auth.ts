import { SupabaseClient } from "@supabase/supabase-js";
import { SignupData, VerificationData, UserProfile } from "./types";

export const createAuthService = (client: SupabaseClient) => ({
  async createVerification(data: SignupData) {
    const { data: result, error } = await client.functions.invoke(
      "create-verification",
      {
        body: data,
      }
    );

    if (error) throw error;
    return result;
  },

  async verifyCode(verificationData: VerificationData) {
    const { data: attempt, error: attemptError } = await client
      .from("verification_attempts")
      .insert([
        {
          verification_id: verificationData.verification_id,
          verification_code: verificationData.verification_code,
          attempt_number: 1,
          is_successful: false,
        },
      ])
      .select()
      .single();

    if (attemptError) throw attemptError;

    // Check if verification code matches
    const { data: verification, error: verificationError } = await client
      .from("verifications")
      .select("*")
      .eq("id", verificationData.verification_id)
      .eq("verification_code", verificationData.verification_code)
      .single();

    if (verificationError || !verification) {
      throw new Error("Invalid verification code");
    }

    // Update attempt as successful
    await client
      .from("verification_attempts")
      .update({ is_successful: true })
      .eq("id", attempt.id);

    return verification;
  },

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await client
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) return null;
    return profile as UserProfile;
  },

  async createUserProfile(verificationId: string): Promise<UserProfile> {
    // Get verification data
    const { data: verification, error: verificationError } = await client
      .from("verifications")
      .select("*")
      .eq("id", verificationId)
      .single();

    if (verificationError || !verification) {
      throw new Error("Verification not found");
    }

    // Get hub name for account number generation
    const { data: hub, error: hubError } = await client
      .from("hubs")
      .select("name")
      .eq("hub_number", verification.hub_id)
      .single();

    if (hubError || !hub) {
      throw new Error("Hub not found");
    }

    // Create user in auth
    const { data: authData, error: authError } = await client.auth.signUp({
      email: verification.email,
      phone: verification.mobile_phone_number,
      password: Math.random().toString(36), // Temporary password, user will set their own
    });

    if (authError || !authData.user) {
      throw authError || new Error("Failed to create user");
    }

    // Generate account number
    const { data: accountNumber, error: accountError } = await client.rpc(
      "generate_account_number",
      { hub_name: hub.name }
    );

    if (accountError) throw accountError;

    // Create user profile
    const { data: profile, error: profileError } = await client
      .from("user_profiles")
      .insert([
        {
          id: authData.user.id,
          hub_id: verification.hub_id,
          account_number: accountNumber,
          first_name: verification.first_name,
          last_name: verification.last_name,
          mobile_phone_number: verification.mobile_phone_number,
          email: verification.email,
          role: "MEMBER",
          onboarding_step: "payment",
        },
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    // Clean up verification
    await client.from("verifications").delete().eq("id", verificationId);

    return profile as UserProfile;
  },

  async signOut() {
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  async refreshSession() {
    const { data, error } = await client.auth.refreshSession();
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },
});
