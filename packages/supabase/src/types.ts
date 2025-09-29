// Marketing website database types for SMS Hub Web
// Re-export from the main database schema

export * from './database'

// Legacy simplified interfaces for backward compatibility
export interface Database {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  }
}

// Simplified Hub interface (legacy)
export interface Hub {
  hub_number: number;
  name: string;
  domain?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Simplified UserProfile interface (legacy) - marketing focused
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  hub_id: number;
  role?: string;
  is_active?: boolean;
  email_confirmed?: boolean;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
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
  verification_id?: string;
}