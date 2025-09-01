import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@sms-hub/types";

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>("SUPABASE_URL");
    const supabaseServiceKey = this.configService.get<string>(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  get client(): SupabaseClient<Database> {
    return this.supabase;
  }

  async generateAccountNumber(hubName: string): Promise<string> {
    const { data, error } = await this.supabase.rpc("generate_account_number", {
      hub_name: hubName,
    });

    if (error) throw error;
    return data;
  }

  async generateCompanyAccountNumber(hubName: string): Promise<string> {
    const { data, error } = await this.supabase.rpc(
      "generate_company_account_number",
      { hub_name: hubName }
    );

    if (error) throw error;
    return data;
  }

  async cleanupExpiredVerifications(): Promise<number> {
    const { data, error } = await this.supabase.rpc(
      "cleanup_expired_verifications"
    );

    if (error) throw error;
    return data;
  }
}
