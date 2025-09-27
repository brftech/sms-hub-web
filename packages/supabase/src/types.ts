// Comprehensive database types for SMS Hub Web standalone app
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

// Simplified Company interface (legacy)
export interface Company {
  id: string;
  name: string;
  hub_id: number;
  is_active?: boolean;
}

// Simplified UserProfile interface (legacy)
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id?: string;
  hub_id?: number;
  role?: string;
  account_number?: string;
  created_at?: string;
  is_active?: boolean;
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