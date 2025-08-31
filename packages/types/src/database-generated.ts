export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_scope: string | null;
          action_type: string;
          admin_user_id: string;
          created_at: string | null;
          hub_id: number;
          id: string;
          ip_address: unknown | null;
          new_values: Json | null;
          old_values: Json | null;
          record_id: string | null;
          table_name: string | null;
          user_agent: string | null;
        };
        Insert: {
          action_scope?: string | null;
          action_type: string;
          admin_user_id: string;
          created_at?: string | null;
          hub_id: number;
          id?: string;
          ip_address?: unknown | null;
          new_values?: Json | null;
          old_values?: Json | null;
          record_id?: string | null;
          table_name?: string | null;
          user_agent?: string | null;
        };
        Update: {
          action_scope?: string | null;
          action_type?: string;
          admin_user_id?: string;
          created_at?: string | null;
          hub_id?: number;
          id?: string;
          ip_address?: unknown | null;
          new_values?: Json | null;
          old_values?: Json | null;
          record_id?: string | null;
          table_name?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      bandwidth_accounts: {
        Row: {
          bandwidth_account_id: string | null;
          bandwidth_credentials: Json;
          company_id: string;
          created_at: string | null;
          hub_id: number;
          id: string;
          is_active: boolean | null;
          phone_numbers: Json | null;
          updated_at: string | null;
        };
        Insert: {
          bandwidth_account_id?: string | null;
          bandwidth_credentials: Json;
          company_id: string;
          created_at?: string | null;
          hub_id: number;
          id?: string;
          is_active?: boolean | null;
          phone_numbers?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          bandwidth_account_id?: string | null;
          bandwidth_credentials?: Json;
          company_id?: string;
          created_at?: string | null;
          hub_id?: number;
          id?: string;
          is_active?: boolean | null;
          phone_numbers?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bandwidth_accounts_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bandwidth_accounts_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      brands: {
        Row: {
          company_id: string;
          created_at: string | null;
          dba_brand_name: string | null;
          hub_id: number;
          id: string;
          name: string;
          status: string | null;
          tcr_brand_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          dba_brand_name?: string | null;
          hub_id: number;
          id?: string;
          name: string;
          status?: string | null;
          tcr_brand_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          dba_brand_name?: string | null;
          hub_id?: number;
          id?: string;
          name?: string;
          status?: string | null;
          tcr_brand_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "brands_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "brands_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      campaign_phone_assignments: {
        Row: {
          assigned_at: string | null;
          campaign_id: string;
          id: string;
          phone_number_id: string;
        };
        Insert: {
          assigned_at?: string | null;
          campaign_id: string;
          id?: string;
          phone_number_id: string;
        };
        Update: {
          assigned_at?: string | null;
          campaign_id?: string;
          id?: string;
          phone_number_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_phone_assignments_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaign_phone_assignments_phone_number_id_fkey";
            columns: ["phone_number_id"];
            isOneToOne: false;
            referencedRelation: "phone_numbers";
            referencedColumns: ["id"];
          },
        ];
      };
      campaigns: {
        Row: {
          brand_id: string;
          created_at: string | null;
          hub_id: number;
          id: string;
          name: string;
          status: string | null;
          tcr_campaign_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          brand_id: string;
          created_at?: string | null;
          hub_id: number;
          id?: string;
          name: string;
          status?: string | null;
          tcr_campaign_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          brand_id?: string;
          created_at?: string | null;
          hub_id?: number;
          id?: string;
          name?: string;
          status?: string | null;
          tcr_campaign_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaigns_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      companies: {
        Row: {
          address: string | null;
          address_street: string | null;
          billing_address: Json | null;
          billing_email: string;
          city: string | null;
          company_account_number: string;
          company_phone_number: string | null;
          country_of_registration: string | null;
          created_at: string | null;
          created_by_profile_id: string | null;
          ein: string | null;
          hub_id: number;
          id: string;
          industry: string | null;
          is_active: boolean | null;
          legal_form: string | null;
          legal_name: string | null;
          point_of_contact_email: string | null;
          postal_code: string | null;
          public_name: string;
          size: string | null;
          state_region: string | null;
          stripe_customer_id: string | null;
          subscription_status: string | null;
          subscription_tier: string | null;
          tax_issuing_country: string | null;
          updated_at: string | null;
          vertical_type: string | null;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          address_street?: string | null;
          billing_address?: Json | null;
          billing_email: string;
          city?: string | null;
          company_account_number: string;
          company_phone_number?: string | null;
          country_of_registration?: string | null;
          created_at?: string | null;
          created_by_profile_id?: string | null;
          ein?: string | null;
          hub_id: number;
          id?: string;
          industry?: string | null;
          is_active?: boolean | null;
          legal_form?: string | null;
          legal_name?: string | null;
          point_of_contact_email?: string | null;
          postal_code?: string | null;
          public_name: string;
          size?: string | null;
          state_region?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: string | null;
          subscription_tier?: string | null;
          tax_issuing_country?: string | null;
          updated_at?: string | null;
          vertical_type?: string | null;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          address_street?: string | null;
          billing_address?: Json | null;
          billing_email?: string;
          city?: string | null;
          company_account_number?: string;
          company_phone_number?: string | null;
          country_of_registration?: string | null;
          created_at?: string | null;
          created_by_profile_id?: string | null;
          ein?: string | null;
          hub_id?: number;
          id?: string;
          industry?: string | null;
          is_active?: boolean | null;
          legal_form?: string | null;
          legal_name?: string | null;
          point_of_contact_email?: string | null;
          postal_code?: string | null;
          public_name?: string;
          size?: string | null;
          state_region?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: string | null;
          subscription_tier?: string | null;
          tax_issuing_country?: string | null;
          updated_at?: string | null;
          vertical_type?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "companies_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      hub_configs: {
        Row: {
          accent_color: string;
          created_at: string | null;
          features: Json;
          hub_id: number;
          id: string;
          primary_color: string;
          secondary_color: string;
          settings: Json;
          updated_at: string | null;
        };
        Insert: {
          accent_color: string;
          created_at?: string | null;
          features?: Json;
          hub_id: number;
          id?: string;
          primary_color: string;
          secondary_color: string;
          settings?: Json;
          updated_at?: string | null;
        };
        Update: {
          accent_color?: string;
          created_at?: string | null;
          features?: Json;
          hub_id?: number;
          id?: string;
          primary_color?: string;
          secondary_color?: string;
          settings?: Json;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hub_configs_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: true;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      hubs: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          display_name: string;
          domain: string | null;
          hub_number: number;
          id: string;
          is_active: boolean | null;
          logo_url: string | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          display_name: string;
          domain?: string | null;
          hub_number: number;
          id?: string;
          is_active?: boolean | null;
          logo_url?: string | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          display_name?: string;
          domain?: string | null;
          hub_number?: number;
          id?: string;
          is_active?: boolean | null;
          logo_url?: string | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      lead_activities: {
        Row: {
          activity_data: Json | null;
          activity_type: string;
          created_at: string | null;
          hub_id: number;
          id: string;
          ip_address: unknown | null;
          lead_id: string;
          user_agent: string | null;
          // New field for gnymble-website compatibility
          description: string | null;
        };
        Insert: {
          activity_data?: Json | null;
          activity_type: string;
          created_at?: string | null;
          hub_id: number;
          id?: string;
          ip_address?: unknown | null;
          lead_id: string;
          user_agent?: string | null;
          // New field for gnymble-website compatibility
          description?: string | null;
        };
        Update: {
          activity_data?: Json | null;
          activity_type?: string;
          created_at?: string | null;
          hub_id?: number;
          id?: string;
          ip_address?: unknown | null;
          lead_id?: string;
          user_agent?: string | null;
          // New field for gnymble-website compatibility
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lead_activities_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
          {
            foreignKeyName: "lead_activities_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          company_name: string | null;
          created_at: string | null;
          email: string;
          hub_id: number;
          id: string;
          interaction_count: number | null;
          ip_address: unknown | null;
          last_interaction_at: string | null;
          lead_phone_number: string | null;
          message: string | null;
          name: string | null;
          platform_interest: string | null;
          source: string | null;
          // New fields for gnymble-website compatibility
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          status: string | null;
          updated_at: string | null;
          lead_score: number | null;
          priority: string | null;
          source_type: string | null;
          user_agent: string | null;
        };
        Insert: {
          company_name?: string | null;
          created_at?: string | null;
          email: string;
          hub_id: number;
          id?: string;
          interaction_count?: number | null;
          ip_address?: unknown | null;
          last_interaction_at?: string | null;
          lead_phone_number?: string | null;
          message?: string | null;
          name?: string | null;
          platform_interest?: string | null;
          source?: string | null;
          // New fields for gnymble-website compatibility
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          status?: string | null;
          updated_at?: string | null;
          lead_score?: number | null;
          priority?: string | null;
          source_type?: string | null;
          user_agent?: string | null;
        };
        Update: {
          company_name?: string | null;
          created_at?: string | null;
          email?: string;
          hub_id?: number;
          id?: string;
          interaction_count?: number | null;
          ip_address?: unknown | null;
          last_interaction_at?: string | null;
          lead_phone_number?: string | null;
          message?: string | null;
          name?: string | null;
          platform_interest?: string | null;
          source?: string | null;
          // New fields for gnymble-website compatibility
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          status?: string | null;
          updated_at?: string | null;
          lead_score?: number | null;
          priority?: string | null;
          source_type?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      memberships: {
        Row: {
          company_id: string;
          created_at: string | null;
          hub_id: number | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"] | null;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          hub_id?: number | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"] | null;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          hub_id?: number | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"] | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memberships_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
          {
            foreignKeyName: "memberships_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      onboarding_steps: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          hub_id: number;
          id: string;
          is_completed: boolean | null;
          is_required: boolean | null;
          step_data: Json | null;
          step_description: string | null;
          step_name: string;
          step_number: number;
          updated_at: string | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          hub_id: number;
          id?: string;
          is_completed?: boolean | null;
          is_required?: boolean | null;
          step_data?: Json | null;
          step_description?: string | null;
          step_name: string;
          step_number: number;
          updated_at?: string | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          hub_id?: number;
          id?: string;
          is_completed?: boolean | null;
          is_required?: boolean | null;
          step_data?: Json | null;
          step_description?: string | null;
          step_name?: string;
          step_number?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      onboarding_submissions: {
        Row: {
          assigned_phone_number: string | null;
          company_id: string;
          created_at: string | null;
          current_step: string | null;
          hub_id: number;
          id: string;
          step_data: Json | null;
          stripe_status: string | null;
          tcr_brand_id: string | null;
          tcr_campaign_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          assigned_phone_number?: string | null;
          company_id: string;
          created_at?: string | null;
          current_step?: string | null;
          hub_id: number;
          id?: string;
          step_data?: Json | null;
          stripe_status?: string | null;
          tcr_brand_id?: string | null;
          tcr_campaign_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          assigned_phone_number?: string | null;
          company_id?: string;
          created_at?: string | null;
          current_step?: string | null;
          hub_id?: number;
          id?: string;
          step_data?: Json | null;
          stripe_status?: string | null;
          tcr_brand_id?: string | null;
          tcr_campaign_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "onboarding_submissions_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "onboarding_submissions_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
          {
            foreignKeyName: "onboarding_submissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_history: {
        Row: {
          amount: number;
          created_at: string | null;
          currency: string | null;
          hub_id: number;
          id: string;
          invoice_url: string | null;
          payment_method: string | null;
          receipt_url: string | null;
          status: string;
          stripe_payment_intent_id: string | null;
          user_profile_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          currency?: string | null;
          hub_id: number;
          id?: string;
          invoice_url?: string | null;
          payment_method?: string | null;
          receipt_url?: string | null;
          status: string;
          stripe_payment_intent_id?: string | null;
          user_profile_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          currency?: string | null;
          hub_id?: number;
          id?: string;
          invoice_url?: string | null;
          payment_method?: string | null;
          receipt_url?: string | null;
          status?: string;
          stripe_payment_intent_id?: string | null;
          user_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payment_history_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
          {
            foreignKeyName: "payment_history_user_profile_id_fkey";
            columns: ["user_profile_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      phone_numbers: {
        Row: {
          assigned_to_campaign: string | null;
          bandwidth_account_id: string | null;
          created_at: string | null;
          hub_id: number;
          id: string;
          is_active: boolean | null;
          phone_number: string;
          updated_at: string | null;
        };
        Insert: {
          assigned_to_campaign?: string | null;
          bandwidth_account_id?: string | null;
          created_at?: string | null;
          hub_id: number;
          id?: string;
          is_active?: boolean | null;
          phone_number: string;
          updated_at?: string | null;
        };
        Update: {
          assigned_to_campaign?: string | null;
          bandwidth_account_id?: string | null;
          created_at?: string | null;
          hub_id?: number;
          id?: string;
          is_active?: boolean | null;
          phone_number?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "phone_numbers_assigned_to_campaign_fkey";
            columns: ["assigned_to_campaign"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "phone_numbers_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      tcr_integrations: {
        Row: {
          company_id: string;
          created_at: string | null;
          hub_id: number;
          id: string;
          is_active: boolean | null;
          tcr_brand_id: string | null;
          tcr_campaign_id: string | null;
          tcr_credentials: Json;
          updated_at: string | null;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          hub_id: number;
          id?: string;
          is_active?: boolean | null;
          tcr_brand_id?: string | null;
          tcr_campaign_id?: string | null;
          tcr_credentials: Json;
          updated_at?: string | null;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          hub_id?: number;
          id?: string;
          is_active?: boolean | null;
          tcr_brand_id?: string | null;
          tcr_campaign_id?: string | null;
          tcr_credentials?: Json;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tcr_integrations_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tcr_integrations_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      temp_signups: {
        Row: {
          auth_method: string;
          company_name: string;
          created_at: string | null;
          email: string;
          expires_at: string;
          first_name: string;
          hub_id: number;
          id: string;
          last_name: string;
          max_attempts: number | null;
          mobile_phone_number: string;
          stripe_customer_id: string | null;
          verification_attempts: number | null;
          verification_code: string | null;
        };
        Insert: {
          auth_method?: string;
          company_name: string;
          created_at?: string | null;
          email: string;
          expires_at?: string;
          first_name: string;
          hub_id: number;
          id?: string;
          last_name: string;
          max_attempts?: number | null;
          mobile_phone_number: string;
          stripe_customer_id?: string | null;
          verification_attempts?: number | null;
          verification_code?: string | null;
        };
        Update: {
          auth_method?: string;
          company_name?: string;
          created_at?: string | null;
          email?: string;
          expires_at?: string;
          first_name?: string;
          hub_id?: number;
          id?: string;
          last_name?: string;
          max_attempts?: number | null;
          mobile_phone_number?: string;
          stripe_customer_id?: string | null;
          verification_attempts?: number | null;
          verification_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "temp_signups_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
        ];
      };
      user_profiles: {
        Row: {
          account_number: string;
          company_id: string | null;
          created_at: string | null;
          email: string;
          first_name: string | null;
          hub_id: number;
          id: string;
          is_active: boolean | null;
          last_name: string | null;
          lead_id: string | null;
          mobile_phone_number: string | null;
          onboarding_data: Json | null;
          onboarding_step: string | null;
          payment_date: string | null;
          payment_status: string | null;
          role: Database["public"]["Enums"]["user_role"] | null;
          stripe_session_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          account_number: string;
          company_id?: string | null;
          created_at?: string | null;
          email: string;
          first_name?: string | null;
          hub_id: number;
          id: string;
          is_active?: boolean | null;
          last_name?: string | null;
          lead_id?: string | null;
          mobile_phone_number?: string | null;
          onboarding_data?: Json | null;
          onboarding_step?: string | null;
          payment_date?: string | null;
          payment_status?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          stripe_session_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          account_number?: string;
          company_id?: string | null;
          created_at?: string | null;
          email?: string;
          first_name?: string | null;
          hub_id?: number;
          id?: string;
          is_active?: boolean | null;
          last_name?: string | null;
          lead_id?: string | null;
          mobile_phone_number?: string | null;
          onboarding_data?: Json | null;
          onboarding_step?: string | null;
          payment_date?: string | null;
          payment_status?: string | null;
          role?: Database["public"]["Enums"]["user_role"] | null;
          stripe_session_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_profiles_hub_id_fkey";
            columns: ["hub_id"];
            isOneToOne: false;
            referencedRelation: "hubs";
            referencedColumns: ["hub_number"];
          },
          {
            foreignKeyName: "user_profiles_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      verification_attempts: {
        Row: {
          attempt_number: number;
          created_at: string | null;
          id: string;
          ip_address: unknown | null;
          is_successful: boolean | null;
          temp_signup_id: string;
          user_agent: string | null;
          verification_code: string;
        };
        Insert: {
          attempt_number: number;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown | null;
          is_successful?: boolean | null;
          temp_signup_id: string;
          user_agent?: string | null;
          verification_code: string;
        };
        Update: {
          attempt_number?: number;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown | null;
          is_successful?: boolean | null;
          temp_signup_id?: string;
          user_agent?: string | null;
          verification_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "verification_attempts_temp_signup_id_fkey";
            columns: ["temp_signup_id"];
            isOneToOne: false;
            referencedRelation: "temp_signups";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      cleanup_expired_temp_signups: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      generate_account_number: {
        Args: { hub_name: string };
        Returns: string;
      };
      generate_company_account_number: {
        Args: { hub_name: string };
        Returns: string;
      };
      is_superadmin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role:
        | "SUPERADMIN"
        | "OWNER"
        | "ADMIN"
        | "SUPPORT"
        | "VIEWER"
        | "MEMBER";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "SUPERADMIN",
        "OWNER",
        "ADMIN",
        "SUPPORT",
        "VIEWER",
        "MEMBER",
      ],
    },
  },
} as const;
