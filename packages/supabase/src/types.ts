// Minimal types for supabase package
export interface Database {
  public: {
    Tables: any;
    Views: any;
    Functions: any;
    Enums: any;
  }
}

export interface Company {
  id: string;
  name: string;
  hub_id: number;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface SignupData {
  email: string;
  password: string;
  hub_id: number;
}

export interface VerificationData {
  email?: string;
  mobile_phone?: string;
  verification_code: string;
}