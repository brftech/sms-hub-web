import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { SmsService } from "../sms/sms.service";
import { generateVerificationCode } from "@sms-hub/utils";
import { SignupData, VerificationData } from "@sms-hub/types";

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private smsService: SmsService
  ) {}

  async createVerification(signupData: SignupData) {
    const verificationCode = generateVerificationCode();

    const { data, error } = await this.supabaseService.client
      .from("verifications")
      .insert([
        {
          ...signupData,
          verification_code: verificationCode,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(
        `Failed to create signup: ${error.message}`
      );
    }

    // Send SMS verification code
    await this.smsService.sendVerificationSMS(
      signupData.mobile_phone_number,
      verificationCode
    );

    // Return without sensitive data
    const { verification_code, ...safeData } = data;
    return safeData;
  }

  async verifyCode(verificationData: VerificationData) {
    const { verification_id, verification_code } = verificationData;

    // Get verification
    const { data: verification, error: verificationError } =
      await this.supabaseService.client
        .from("verifications")
        .select("*")
        .eq("id", verification_id)
        .single();

    if (tempError || !tempSignup) {
      throw new BadRequestException("Signup not found");
    }

    // Check if expired
    if (new Date(tempSignup.expires_at) < new Date()) {
      throw new BadRequestException("Verification code expired");
    }

    // Check if max attempts reached
    if (tempSignup.verification_attempts >= tempSignup.max_attempts) {
      throw new BadRequestException("Maximum verification attempts reached");
    }

    // Record verification attempt
    await this.supabaseService.client.from("verification_attempts").insert([
      {
        temp_signup_id,
        verification_code,
        attempt_number: tempSignup.verification_attempts + 1,
        is_successful: verification_code === tempSignup.verification_code,
      },
    ]);

    // Update attempt count
    await this.supabaseService.client
      .from("temp_signups")
      .update({
        verification_attempts: tempSignup.verification_attempts + 1,
      })
      .eq("id", temp_signup_id);

    // Check if code matches
    if (verification_code !== tempSignup.verification_code) {
      throw new UnauthorizedException("Invalid verification code");
    }

    return { success: true, temp_signup_id };
  }

  async createUserFromTempSignup(tempSignupId: string) {
    // Get temp signup data
    const { data: tempSignup, error: tempError } =
      await this.supabaseService.client
        .from("temp_signups")
        .select("*")
        .eq("id", tempSignupId)
        .single();

    if (tempError || !tempSignup) {
      throw new BadRequestException("Temp signup not found");
    }

    // Get hub name for account number generation
    const { data: hub, error: hubError } = await this.supabaseService.client
      .from("hubs")
      .select("name")
      .eq("hub_number", tempSignup.hub_id)
      .single();

    if (hubError || !hub) {
      throw new BadRequestException("Hub not found");
    }

    // Generate account number
    const accountNumber = await this.supabaseService.generateAccountNumber(
      hub.name
    );

    // Create user in Supabase Auth (admin API)
    const { data: authData, error: authError } =
      await this.supabaseService.client.auth.admin.createUser({
        email: tempSignup.email,
        phone: tempSignup.mobile_phone_number,
        email_confirm: true,
        phone_confirm: true,
      });

    if (authError || !authData.user) {
      throw new BadRequestException(
        `Failed to create user: ${authError?.message}`
      );
    }

    // Create user profile
    const { data: profile, error: profileError } =
      await this.supabaseService.client
        .from("user_profiles")
        .insert([
          {
            id: authData.user.id,
            hub_id: tempSignup.hub_id,
            account_number: accountNumber,
            first_name: tempSignup.first_name,
            last_name: tempSignup.last_name,
            mobile_phone_number: tempSignup.mobile_phone_number,
            email: tempSignup.email,
            role: "MEMBER",
            onboarding_step: "payment",
          },
        ])
        .select()
        .single();

    if (profileError) {
      // Cleanup auth user if profile creation fails
      await this.supabaseService.client.auth.admin.deleteUser(authData.user.id);
      throw new BadRequestException(
        `Failed to create profile: ${profileError.message}`
      );
    }

    // Clean up temp signup
    await this.supabaseService.client
      .from("temp_signups")
      .delete()
      .eq("id", tempSignupId);

    return profile;
  }
}
