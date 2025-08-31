import { supabase } from "@sms-hub/supabase";

export interface SMSAuthRequest {
  phoneNumber: string;
  source?: string;
}

export interface OTPVerification {
  phoneNumber: string;
  otpCode: string;
}

class SMSAuthService {
  async sendVerificationCode(request: SMSAuthRequest) {
    const { phoneNumber, source = "demo-request" } = request;
    
    // Format phone number for international format
    const formattedPhone = this.formatPhoneForInternational(phoneNumber);

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        shouldCreateUser: true,
        data: {
          source: source,
          phone_number: formattedPhone,
        },
      },
    });

    if (error) {
      throw new Error(`Failed to send verification code: ${error.message}`);
    }

    return { success: true, sessionId: data.session?.access_token };
  }

  async verifyOTP(request: OTPVerification) {
    const { phoneNumber, otpCode } = request;
    const formattedPhone = this.formatPhoneForInternational(phoneNumber);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otpCode,
      type: "sms",
    });

    if (error) {
      throw new Error(`Invalid verification code: ${error.message}`);
    }

    if (!data.user || !data.session) {
      throw new Error("Verification failed");
    }

    return { 
      success: true, 
      user: {
        id: data.user.id,
        phone: data.user.phone || "",
        email: data.user.email || undefined,
        created_at: data.user.created_at,
        last_sign_in: data.user.last_sign_in_at,
      },
      session: data.session 
    };
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      phone: user.phone || "",
      email: user.email || undefined,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
    };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Failed to sign out: ${error.message}`);
    }
  }

  async isAuthenticated() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return !error && !!session;
  }

  private formatPhoneForInternational(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }

    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+${cleaned}`;
    }

    if (cleaned.length > 10) {
      return `+${cleaned}`;
    }

    return `+1${cleaned}`;
  }
}

export const smsAuthService = new SMSAuthService();
export default smsAuthService;