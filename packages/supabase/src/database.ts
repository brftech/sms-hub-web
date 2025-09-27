// Comprehensive database types for SMS Hub Web standalone app
// Based on the complete schema from the original monorepo

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Core hub structure
      hubs: {
        Row: {
          hub_number: number
          name: string
          domain: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          hub_number: number
          name: string
          domain?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          hub_number?: number
          name?: string
          domain?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      
      // Companies table - core business entities
      companies: {
        Row: {
          id: string
          public_name: string
          legal_name: string | null
          legal_company_name: string | null
          brand_name: string | null
          hub_id: number
          company_account_number: string | null
          signup_type: string | null
          is_active: boolean | null
          created_by_user_id: string | null
          first_admin_user_id: string | null
          // Extended company fields
          address: string | null
          address_line_2: string | null
          city: string | null
          state: string | null
          zip: string | null
          country: string | null
          phone: string | null
          website: string | null
          ein: string | null
          company_type: string | null
          industry_vertical: string | null
          number_of_employees: string | null
          annual_revenue: string | null
          year_established: number | null
          business_registration_number: string | null
          business_registration_state: string | null
          primary_contact_name: string | null
          primary_contact_email: string | null
          primary_contact_phone: string | null
          primary_contact_title: string | null
          tcr_brand_id: string | null
          tcr_brand_status: string | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          public_name: string
          legal_name?: string | null
          legal_company_name?: string | null
          brand_name?: string | null
          hub_id: number
          company_account_number?: string | null
          signup_type?: string | null
          is_active?: boolean | null
          created_by_user_id?: string | null
          first_admin_user_id?: string | null
          address?: string | null
          address_line_2?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          phone?: string | null
          website?: string | null
          ein?: string | null
          company_type?: string | null
          industry_vertical?: string | null
          number_of_employees?: string | null
          annual_revenue?: string | null
          year_established?: number | null
          business_registration_number?: string | null
          business_registration_state?: string | null
          primary_contact_name?: string | null
          primary_contact_email?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          tcr_brand_id?: string | null
          tcr_brand_status?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          public_name?: string
          legal_name?: string | null
          legal_company_name?: string | null
          brand_name?: string | null
          hub_id?: number
          company_account_number?: string | null
          signup_type?: string | null
          is_active?: boolean | null
          created_by_user_id?: string | null
          first_admin_user_id?: string | null
          address?: string | null
          address_line_2?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          country?: string | null
          phone?: string | null
          website?: string | null
          ein?: string | null
          company_type?: string | null
          industry_vertical?: string | null
          number_of_employees?: string | null
          annual_revenue?: string | null
          year_established?: number | null
          business_registration_number?: string | null
          business_registration_state?: string | null
          primary_contact_name?: string | null
          primary_contact_email?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          tcr_brand_id?: string | null
          tcr_brand_status?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_first_admin_user_id_fkey"
            columns: ["first_admin_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // User profiles - core user management
      user_profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          mobile_phone_number: string | null
          hub_id: number
          company_id: string | null
          customer_id: string | null
          account_number: string | null
          role: string | null
          signup_type: string | null
          company_admin: boolean | null
          company_admin_since: string | null
          verification_setup_completed: boolean | null
          verification_setup_completed_at: string | null
          onboarding_completed: boolean | null
          is_active: boolean | null
          invited_by_user_id: string | null
          invitation_accepted_at: string | null
          permissions: Json | null
          last_login_at: string | null
          last_login_method: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          mobile_phone_number?: string | null
          hub_id: number
          company_id?: string | null
          customer_id?: string | null
          account_number?: string | null
          role?: string | null
          signup_type?: string | null
          company_admin?: boolean | null
          company_admin_since?: string | null
          verification_setup_completed?: boolean | null
          verification_setup_completed_at?: string | null
          onboarding_completed?: boolean | null
          is_active?: boolean | null
          invited_by_user_id?: string | null
          invitation_accepted_at?: string | null
          permissions?: Json | null
          last_login_at?: string | null
          last_login_method?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          mobile_phone_number?: string | null
          hub_id?: number
          company_id?: string | null
          customer_id?: string | null
          account_number?: string | null
          role?: string | null
          signup_type?: string | null
          company_admin?: boolean | null
          company_admin_since?: string | null
          verification_setup_completed?: boolean | null
          verification_setup_completed_at?: string | null
          onboarding_completed?: boolean | null
          is_active?: boolean | null
          invited_by_user_id?: string | null
          invitation_accepted_at?: string | null
          permissions?: Json | null
          last_login_at?: string | null
          last_login_method?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "user_profiles_invited_by_user_id_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // Customers - payment and billing
      customers: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          billing_email: string
          customer_type: string | null
          hub_id: number
          payment_status: string | null
          payment_type: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          subscription_ends_at: string | null
          is_active: boolean | null
          trial_ends_at: string | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          billing_email: string
          customer_type?: string | null
          hub_id: number
          payment_status?: string | null
          payment_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          subscription_ends_at?: string | null
          is_active?: boolean | null
          trial_ends_at?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          billing_email?: string
          customer_type?: string | null
          hub_id?: number
          payment_status?: string | null
          payment_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          subscription_ends_at?: string | null
          is_active?: boolean | null
          trial_ends_at?: string | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // Leads - contact form submissions
      leads: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          company_name: string | null
          message: string | null
          hub_id: number
          source: string | null
          campaign_source: string | null
          platform_interest: string | null
          status: string | null
          lead_score: number | null
          interaction_count: number | null
          last_interaction_at: string | null
          assigned_to_user_id: string | null
          converted_at: string | null
          converted_to_company_id: string | null
          // UTM tracking
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          // Technical tracking
          landing_page_url: string | null
          referrer_url: string | null
          ip_address: unknown | null
          user_agent: string | null
          lead_phone_number: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          phone?: string | null
          company_name?: string | null
          message?: string | null
          hub_id: number
          source?: string | null
          campaign_source?: string | null
          platform_interest?: string | null
          status?: string | null
          lead_score?: number | null
          interaction_count?: number | null
          last_interaction_at?: string | null
          assigned_to_user_id?: string | null
          converted_at?: string | null
          converted_to_company_id?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          landing_page_url?: string | null
          referrer_url?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
          lead_phone_number?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          company_name?: string | null
          message?: string | null
          hub_id?: number
          source?: string | null
          campaign_source?: string | null
          platform_interest?: string | null
          status?: string | null
          lead_score?: number | null
          interaction_count?: number | null
          last_interaction_at?: string | null
          assigned_to_user_id?: string | null
          converted_at?: string | null
          converted_to_company_id?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_term?: string | null
          landing_page_url?: string | null
          referrer_url?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
          lead_phone_number?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_user_id_fkey"
            columns: ["assigned_to_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_to_company_id_fkey"
            columns: ["converted_to_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // SMS verification for phone numbers
      sms_verifications: {
        Row: {
          id: string
          user_id: string
          phone_number: string
          verification_code: string
          expires_at: string | null
          verified_at: string | null
          consent_given: boolean | null
          consent_text: string | null
          consent_timestamp: string | null
          consent_ip_address: unknown | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          phone_number: string
          verification_code: string
          expires_at?: string | null
          verified_at?: string | null
          consent_given?: boolean | null
          consent_text?: string | null
          consent_timestamp?: string | null
          consent_ip_address?: unknown | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          phone_number?: string
          verification_code?: string
          expires_at?: string | null
          verified_at?: string | null
          consent_given?: boolean | null
          consent_text?: string | null
          consent_timestamp?: string | null
          consent_ip_address?: unknown | null
          created_at?: string | null
        }
        Relationships: []
      }

      // Payment history tracking
      payment_history: {
        Row: {
          id: string
          user_profile_id: string
          hub_id: number
          amount: number
          currency: string | null
          status: string
          payment_method: string | null
          description: string | null
          stripe_payment_intent_id: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_profile_id: string
          hub_id: number
          amount: number
          currency?: string | null
          status: string
          payment_method?: string | null
          description?: string | null
          stripe_payment_intent_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_profile_id?: string
          hub_id?: number
          amount?: number
          currency?: string | null
          status?: string
          payment_method?: string | null
          description?: string | null
          stripe_payment_intent_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "payment_history_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_company_account_number: {
        Args: { hub_name: string }
        Returns: string
      }
      generate_user_account_number: {
        Args: { hub_name: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// Simplified type aliases for common usage
export type Company = Tables<'companies'>
export type CompanyInsert = TablesInsert<'companies'>
export type CompanyUpdate = TablesUpdate<'companies'>

export type UserProfile = Tables<'user_profiles'>
export type UserProfileInsert = TablesInsert<'user_profiles'>
export type UserProfileUpdate = TablesUpdate<'user_profiles'>

export type Customer = Tables<'customers'>
export type CustomerInsert = TablesInsert<'customers'>
export type CustomerUpdate = TablesUpdate<'customers'>

export type Lead = Tables<'leads'>
export type LeadInsert = TablesInsert<'leads'>
export type LeadUpdate = TablesUpdate<'leads'>

export type Hub = Tables<'hubs'>
export type HubInsert = TablesInsert<'hubs'>
export type HubUpdate = TablesUpdate<'hubs'>

export type SmsVerification = Tables<'sms_verifications'>
export type SmsVerificationInsert = TablesInsert<'sms_verifications'>
export type SmsVerificationUpdate = TablesUpdate<'sms_verifications'>

export type PaymentHistory = Tables<'payment_history'>
export type PaymentHistoryInsert = TablesInsert<'payment_history'>
export type PaymentHistoryUpdate = TablesUpdate<'payment_history'>

// Legacy type aliases for backward compatibility
export interface SignupData {
  email: string
  password: string
  hub_id: number
}

export interface VerificationData {
  email?: string
  mobile_phone?: string
  verification_code: string
  verification_id?: string
}
