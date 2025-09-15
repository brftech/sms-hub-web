
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_scope: string | null
          action_type: string
          admin_user_id: string
          created_at: string | null
          hub_id: number
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
        }
        Insert: {
          action_scope?: string | null
          action_type: string
          admin_user_id: string
          created_at?: string | null
          hub_id: number
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Update: {
          action_scope?: string | null
          action_type?: string
          admin_user_id?: string
          created_at?: string | null
          hub_id?: number
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_logs_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      bandwidth_accounts: {
        Row: {
          bandwidth_account_id: string | null
          bandwidth_credentials: Json
          company_id: string
          created_at: string | null
          hub_id: number
          id: string
          is_active: boolean | null
          phone_numbers: Json | null
          updated_at: string | null
        }
        Insert: {
          bandwidth_account_id?: string | null
          bandwidth_credentials?: Json
          company_id: string
          created_at?: string | null
          hub_id: number
          id?: string
          is_active?: boolean | null
          phone_numbers?: Json | null
          updated_at?: string | null
        }
        Update: {
          bandwidth_account_id?: string | null
          bandwidth_credentials?: Json
          company_id?: string
          created_at?: string | null
          hub_id?: number
          id?: string
          is_active?: boolean | null
          phone_numbers?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bandwidth_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bandwidth_accounts_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      brands: {
        Row: {
          alternate_business_id: string | null
          alternate_business_id_type: string | null
          brand_relationship: string | null
          company_id: string
          created_at: string | null
          dba_brand_name: string | null
          hub_id: number
          id: string
          name: string
          status: string | null
          stock_symbol: string | null
          tcr_approval_date: string | null
          tcr_brand_id: string | null
          tcr_rejection_reason: string | null
          tcr_submission_date: string | null
          updated_at: string | null
          vertical_type: string | null
        }
        Insert: {
          alternate_business_id?: string | null
          alternate_business_id_type?: string | null
          brand_relationship?: string | null
          company_id: string
          created_at?: string | null
          dba_brand_name?: string | null
          hub_id: number
          id?: string
          name: string
          status?: string | null
          stock_symbol?: string | null
          tcr_approval_date?: string | null
          tcr_brand_id?: string | null
          tcr_rejection_reason?: string | null
          tcr_submission_date?: string | null
          updated_at?: string | null
          vertical_type?: string | null
        }
        Update: {
          alternate_business_id?: string | null
          alternate_business_id_type?: string | null
          brand_relationship?: string | null
          company_id?: string
          created_at?: string | null
          dba_brand_name?: string | null
          hub_id?: number
          id?: string
          name?: string
          status?: string | null
          stock_symbol?: string | null
          tcr_approval_date?: string | null
          tcr_brand_id?: string | null
          tcr_rejection_reason?: string | null
          tcr_submission_date?: string | null
          updated_at?: string | null
          vertical_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brands_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      campaign_phone_assignments: {
        Row: {
          assigned_at: string | null
          campaign_id: string
          id: string
          phone_number_id: string
        }
        Insert: {
          assigned_at?: string | null
          campaign_id: string
          id?: string
          phone_number_id: string
        }
        Update: {
          assigned_at?: string | null
          campaign_id?: string
          id?: string
          phone_number_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_phone_assignments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_phone_assignments_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          affiliate_marketing: boolean | null
          age_gated: boolean | null
          brand_id: string
          call_to_action: string | null
          content_type: string | null
          created_at: string | null
          description: string | null
          direct_lending: boolean | null
          embedded_link: boolean | null
          embedded_phone: boolean | null
          help_message: string | null
          hub_id: number
          id: string
          message_flow: string | null
          message_samples: Json | null
          monthly_volume: number | null
          name: string
          number_pool: boolean | null
          opt_in_message: string | null
          opt_out_message: string | null
          sample_1: string | null
          sample_2: string | null
          sample_3: string | null
          sample_4: string | null
          sample_5: string | null
          status: string | null
          sub_use_cases: Json | null
          subscriber_count: number | null
          subscriber_help: string | null
          subscriber_optin: string | null
          subscriber_optout: string | null
          tcr_approval_date: string | null
          tcr_campaign_id: string | null
          tcr_rejection_reason: string | null
          tcr_submission_date: string | null
          updated_at: string | null
          use_case: string | null
        }
        Insert: {
          affiliate_marketing?: boolean | null
          age_gated?: boolean | null
          brand_id: string
          call_to_action?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          direct_lending?: boolean | null
          embedded_link?: boolean | null
          embedded_phone?: boolean | null
          help_message?: string | null
          hub_id: number
          id?: string
          message_flow?: string | null
          message_samples?: Json | null
          monthly_volume?: number | null
          name: string
          number_pool?: boolean | null
          opt_in_message?: string | null
          opt_out_message?: string | null
          sample_1?: string | null
          sample_2?: string | null
          sample_3?: string | null
          sample_4?: string | null
          sample_5?: string | null
          status?: string | null
          sub_use_cases?: Json | null
          subscriber_count?: number | null
          subscriber_help?: string | null
          subscriber_optin?: string | null
          subscriber_optout?: string | null
          tcr_approval_date?: string | null
          tcr_campaign_id?: string | null
          tcr_rejection_reason?: string | null
          tcr_submission_date?: string | null
          updated_at?: string | null
          use_case?: string | null
        }
        Update: {
          affiliate_marketing?: boolean | null
          age_gated?: boolean | null
          brand_id?: string
          call_to_action?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          direct_lending?: boolean | null
          embedded_link?: boolean | null
          embedded_phone?: boolean | null
          help_message?: string | null
          hub_id?: number
          id?: string
          message_flow?: string | null
          message_samples?: Json | null
          monthly_volume?: number | null
          name?: string
          number_pool?: boolean | null
          opt_in_message?: string | null
          opt_out_message?: string | null
          sample_1?: string | null
          sample_2?: string | null
          sample_3?: string | null
          sample_4?: string | null
          sample_5?: string | null
          status?: string | null
          sub_use_cases?: Json | null
          subscriber_count?: number | null
          subscriber_help?: string | null
          subscriber_optin?: string | null
          subscriber_optout?: string | null
          tcr_approval_date?: string | null
          tcr_campaign_id?: string | null
          tcr_rejection_reason?: string | null
          tcr_submission_date?: string | null
          updated_at?: string | null
          use_case?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          address_line_2: string | null
          annual_revenue: string | null
          brand_name: string | null
          business_registration_number: string | null
          business_registration_state: string | null
          city: string | null
          company_account_number: string | null
          company_type: string | null
          country: string | null
          created_at: string | null
          created_by_user_id: string | null
          ein: string | null
          first_admin_user_id: string | null
          hub_id: number
          id: string
          industry_vertical: string | null
          is_active: boolean | null
          legal_company_name: string | null
          legal_name: string | null
          metadata: Json | null
          number_of_employees: string | null
          phone: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          primary_contact_title: string | null
          public_name: string
          signup_type: string | null
          state: string | null
          tcr_brand_id: string | null
          tcr_brand_status: string | null
          updated_at: string | null
          website: string | null
          year_established: number | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          address_line_2?: string | null
          annual_revenue?: string | null
          brand_name?: string | null
          business_registration_number?: string | null
          business_registration_state?: string | null
          city?: string | null
          company_account_number?: string | null
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          ein?: string | null
          first_admin_user_id?: string | null
          hub_id: number
          id?: string
          industry_vertical?: string | null
          is_active?: boolean | null
          legal_company_name?: string | null
          legal_name?: string | null
          metadata?: Json | null
          number_of_employees?: string | null
          phone?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          public_name: string
          signup_type?: string | null
          state?: string | null
          tcr_brand_id?: string | null
          tcr_brand_status?: string | null
          updated_at?: string | null
          website?: string | null
          year_established?: number | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          address_line_2?: string | null
          annual_revenue?: string | null
          brand_name?: string | null
          business_registration_number?: string | null
          business_registration_state?: string | null
          city?: string | null
          company_account_number?: string | null
          company_type?: string | null
          country?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          ein?: string | null
          first_admin_user_id?: string | null
          hub_id?: number
          id?: string
          industry_vertical?: string | null
          is_active?: boolean | null
          legal_company_name?: string | null
          legal_name?: string | null
          metadata?: Json | null
          number_of_employees?: string | null
          phone?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          public_name?: string
          signup_type?: string | null
          state?: string | null
          tcr_brand_id?: string | null
          tcr_brand_status?: string | null
          updated_at?: string | null
          website?: string | null
          year_established?: number | null
          zip?: string | null
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
          },
        ]
      }
      contacts: {
        Row: {
          company_id: string
          created_at: string | null
          created_by_user_id: string | null
          custom_fields: Json | null
          email: string | null
          first_name: string | null
          hub_id: number
          id: string
          is_active: boolean | null
          last_name: string | null
          opted_in: boolean | null
          opted_in_at: string | null
          opted_out_at: string | null
          phone_number: string
          tags: Json | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by_user_id?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_name?: string | null
          hub_id: number
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          opted_in?: boolean | null
          opted_in_at?: string | null
          opted_out_at?: string | null
          phone_number: string
          tags?: Json | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by_user_id?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_name?: string | null
          hub_id?: number
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          opted_in?: boolean | null
          opted_in_at?: string | null
          opted_out_at?: string | null
          phone_number?: string
          tags?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      customers: {
        Row: {
          billing_email: string
          company_id: string | null
          created_at: string | null
          customer_type: string | null
          hub_id: number
          id: string
          is_active: boolean | null
          metadata: Json | null
          payment_status: string | null
          payment_type: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_email: string
          company_id?: string | null
          created_at?: string | null
          customer_type?: string | null
          hub_id: number
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          payment_status?: string | null
          payment_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_email?: string
          company_id?: string | null
          created_at?: string | null
          customer_type?: string | null
          hub_id?: number
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          payment_status?: string | null
          payment_type?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string | null
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
          },
        ]
      }
      hub_configs: {
        Row: {
          branding: Json | null
          config_data: Json
          created_at: string | null
          features: Json | null
          hub_id: number
          id: string
          updated_at: string | null
        }
        Insert: {
          branding?: Json | null
          config_data?: Json
          created_at?: string | null
          features?: Json | null
          hub_id: number
          id?: string
          updated_at?: string | null
        }
        Update: {
          branding?: Json | null
          config_data?: Json
          created_at?: string | null
          features?: Json | null
          hub_id?: number
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hub_configs_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: true
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      hubs: {
        Row: {
          created_at: string | null
          domain: string | null
          hub_number: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          hub_number: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          hub_number?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inboxes: {
        Row: {
          auto_reply_enabled: boolean | null
          auto_reply_message: string | null
          business_hours_enabled: boolean | null
          business_hours_end: string | null
          business_hours_start: string | null
          company_id: string
          created_at: string | null
          hub_id: number
          id: string
          inbox_name: string
          is_active: boolean | null
          notification_preferences: Json | null
          phone_number_id: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          auto_reply_enabled?: boolean | null
          auto_reply_message?: string | null
          business_hours_enabled?: boolean | null
          business_hours_end?: string | null
          business_hours_start?: string | null
          company_id: string
          created_at?: string | null
          hub_id: number
          id?: string
          inbox_name: string
          is_active?: boolean | null
          notification_preferences?: Json | null
          phone_number_id: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_reply_enabled?: boolean | null
          auto_reply_message?: string | null
          business_hours_enabled?: boolean | null
          business_hours_end?: string | null
          business_hours_start?: string | null
          company_id?: string
          created_at?: string | null
          hub_id?: number
          id?: string
          inbox_name?: string
          is_active?: boolean | null
          notification_preferences?: Json | null
          phone_number_id?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inboxes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inboxes_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "inboxes_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          hub_id: number
          id: string
          lead_id: string
          performed_by_user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          hub_id: number
          id?: string
          lead_id: string
          performed_by_user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          hub_id?: number
          id?: string
          lead_id?: string
          performed_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_performed_by_user_id_fkey"
            columns: ["performed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to_user_id: string | null
          campaign_source: string | null
          company_name: string | null
          converted_at: string | null
          converted_to_company_id: string | null
          created_at: string | null
          email: string
          hub_id: number
          id: string
          interaction_count: number | null
          ip_address: unknown | null
          landing_page_url: string | null
          last_interaction_at: string | null
          lead_phone_number: string | null
          lead_score: number | null
          message: string | null
          name: string | null
          phone: string | null
          platform_interest: string | null
          referrer_url: string | null
          source: string | null
          status: string | null
          updated_at: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          assigned_to_user_id?: string | null
          campaign_source?: string | null
          company_name?: string | null
          converted_at?: string | null
          converted_to_company_id?: string | null
          created_at?: string | null
          email: string
          hub_id: number
          id?: string
          interaction_count?: number | null
          ip_address?: unknown | null
          landing_page_url?: string | null
          last_interaction_at?: string | null
          lead_phone_number?: string | null
          lead_score?: number | null
          message?: string | null
          name?: string | null
          phone?: string | null
          platform_interest?: string | null
          referrer_url?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          assigned_to_user_id?: string | null
          campaign_source?: string | null
          company_name?: string | null
          converted_at?: string | null
          converted_to_company_id?: string | null
          created_at?: string | null
          email?: string
          hub_id?: number
          id?: string
          interaction_count?: number | null
          ip_address?: unknown | null
          landing_page_url?: string | null
          last_interaction_at?: string | null
          lead_phone_number?: string | null
          lead_score?: number | null
          message?: string | null
          name?: string | null
          phone?: string | null
          platform_interest?: string | null
          referrer_url?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
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
          },
        ]
      }
      memberships: {
        Row: {
          company_id: string
          created_at: string | null
          hub_id: number
          id: string
          is_active: boolean | null
          joined_at: string | null
          left_at: string | null
          permissions: Json | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          hub_id: number
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          hub_id?: number
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          company_id: string
          contact_id: string | null
          cost: number | null
          created_at: string | null
          created_by_user_id: string | null
          delivered_at: string | null
          direction: string
          external_id: string | null
          failed_at: string | null
          failure_reason: string | null
          from_number: string
          hub_id: number
          id: string
          inbox_id: string
          message_content: string
          phone_number_id: string
          read_at: string | null
          segments: number | null
          sent_at: string | null
          status: string | null
          to_number: string
        }
        Insert: {
          company_id: string
          contact_id?: string | null
          cost?: number | null
          created_at?: string | null
          created_by_user_id?: string | null
          delivered_at?: string | null
          direction: string
          external_id?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          from_number: string
          hub_id: number
          id?: string
          inbox_id: string
          message_content: string
          phone_number_id: string
          read_at?: string | null
          segments?: number | null
          sent_at?: string | null
          status?: string | null
          to_number: string
        }
        Update: {
          company_id?: string
          contact_id?: string | null
          cost?: number | null
          created_at?: string | null
          created_by_user_id?: string | null
          delivered_at?: string | null
          direction?: string
          external_id?: string | null
          failed_at?: string | null
          failure_reason?: string | null
          from_number?: string
          hub_id?: number
          id?: string
          inbox_id?: string
          message_content?: string
          phone_number_id?: string
          read_at?: string | null
          segments?: number | null
          sent_at?: string | null
          status?: string | null
          to_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "messages_inbox_id_fkey"
            columns: ["inbox_id"]
            isOneToOne: false
            referencedRelation: "inboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          company_id: string
          completed_at: string | null
          created_at: string | null
          hub_id: number
          id: string
          step_data: Json | null
          step_name: string
          step_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          hub_id: number
          id?: string
          step_data?: Json | null
          step_name: string
          step_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          hub_id?: number
          id?: string
          step_data?: Json | null
          step_name?: string
          step_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_steps_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "onboarding_steps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_submissions: {
        Row: {
          company_id: string
          created_at: string | null
          current_step: string | null
          hub_id: number
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by_user_id: string | null
          status: string | null
          step_data: Json | null
          stripe_status: string | null
          submission_data: Json
          submission_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          current_step?: string | null
          hub_id: number
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by_user_id?: string | null
          status?: string | null
          step_data?: Json | null
          stripe_status?: string | null
          submission_data?: Json
          submission_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          current_step?: string | null
          hub_id?: number
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by_user_id?: string | null
          status?: string | null
          step_data?: Json | null
          stripe_status?: string | null
          submission_data?: Json
          submission_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_submissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_submissions_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "onboarding_submissions_reviewed_by_user_id_fkey"
            columns: ["reviewed_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          hub_id: number
          id: string
          metadata: Json | null
          payment_method: string | null
          status: string
          stripe_payment_intent_id: string | null
          user_profile_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          hub_id: number
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status: string
          stripe_payment_intent_id?: string | null
          user_profile_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          hub_id?: number
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          user_profile_id?: string
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
          },
        ]
      }
      phone_numbers: {
        Row: {
          assigned_to_campaign: boolean | null
          campaign_id: string | null
          company_id: string | null
          created_at: string | null
          hub_id: number
          id: string
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          assigned_to_campaign?: boolean | null
          campaign_id?: string | null
          company_id?: string | null
          created_at?: string | null
          hub_id: number
          id?: string
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          assigned_to_campaign?: boolean | null
          campaign_id?: string | null
          company_id?: string | null
          created_at?: string | null
          hub_id?: number
          id?: string
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phone_numbers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      sms_verifications: {
        Row: {
          consent_given: boolean | null
          consent_ip_address: unknown | null
          consent_text: string | null
          consent_timestamp: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          phone_number: string
          user_id: string
          verification_code: string
          verified_at: string | null
        }
        Insert: {
          consent_given?: boolean | null
          consent_ip_address?: unknown | null
          consent_text?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          phone_number: string
          user_id: string
          verification_code: string
          verified_at?: string | null
        }
        Update: {
          consent_given?: boolean | null
          consent_ip_address?: unknown | null
          consent_text?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          phone_number?: string
          user_id?: string
          verification_code?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      tcr_integrations: {
        Row: {
          brand_id: string | null
          company_id: string
          created_at: string | null
          hub_id: number
          id: string
          tcr_brand_id: string | null
          tcr_brand_status: string | null
          tcr_campaign_id: string | null
          tcr_campaign_status: string | null
          tcr_credentials: Json | null
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          company_id: string
          created_at?: string | null
          hub_id: number
          id?: string
          tcr_brand_id?: string | null
          tcr_brand_status?: string | null
          tcr_campaign_id?: string | null
          tcr_campaign_status?: string | null
          tcr_credentials?: Json | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          company_id?: string
          created_at?: string | null
          hub_id?: number
          id?: string
          tcr_brand_id?: string | null
          tcr_brand_status?: string | null
          tcr_campaign_id?: string | null
          tcr_campaign_status?: string | null
          tcr_credentials?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tcr_integrations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tcr_integrations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tcr_integrations_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      user_inbox_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by_user_id: string | null
          company_id: string
          created_at: string | null
          hub_id: number
          id: string
          inbox_id: string
          is_active: boolean | null
          permissions: Json | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by_user_id?: string | null
          company_id: string
          created_at?: string | null
          hub_id: number
          id?: string
          inbox_id: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by_user_id?: string | null
          company_id?: string
          created_at?: string | null
          hub_id?: number
          id?: string
          inbox_id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_inbox_assignments_assigned_by_user_id_fkey"
            columns: ["assigned_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_inbox_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_inbox_assignments_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "user_inbox_assignments_inbox_id_fkey"
            columns: ["inbox_id"]
            isOneToOne: false
            referencedRelation: "inboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_inbox_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string | null
          created_user_id: string | null
          expires_at: string | null
          hub_id: number
          id: string
          invitation_token: string | null
          invited_by_user_id: string
          invited_email: string
          role: string | null
          sent_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string | null
          created_user_id?: string | null
          expires_at?: string | null
          hub_id: number
          id?: string
          invitation_token?: string | null
          invited_by_user_id: string
          invited_email: string
          role?: string | null
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string | null
          created_user_id?: string | null
          expires_at?: string | null
          hub_id?: number
          id?: string
          invitation_token?: string | null
          invited_by_user_id?: string
          invited_email?: string
          role?: string | null
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_created_user_id_fkey"
            columns: ["created_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "user_invitations_invited_by_user_id_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          account_number: string | null
          company_admin: boolean | null
          company_admin_since: string | null
          company_id: string | null
          created_at: string | null
          customer_id: string | null
          email: string
          first_name: string | null
          hub_id: number
          id: string
          invitation_accepted_at: string | null
          invited_by_user_id: string | null
          is_active: boolean | null
          last_login_at: string | null
          last_login_method: string | null
          last_name: string | null
          mobile_phone_number: string | null
          onboarding_completed: boolean | null
          permissions: Json | null
          role: string | null
          signup_type: string | null
          updated_at: string | null
          verification_setup_completed: boolean | null
          verification_setup_completed_at: string | null
        }
        Insert: {
          account_number?: string | null
          company_admin?: boolean | null
          company_admin_since?: string | null
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          email: string
          first_name?: string | null
          hub_id: number
          id: string
          invitation_accepted_at?: string | null
          invited_by_user_id?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          last_login_method?: string | null
          last_name?: string | null
          mobile_phone_number?: string | null
          onboarding_completed?: boolean | null
          permissions?: Json | null
          role?: string | null
          signup_type?: string | null
          updated_at?: string | null
          verification_setup_completed?: boolean | null
          verification_setup_completed_at?: string | null
        }
        Update: {
          account_number?: string | null
          company_admin?: boolean | null
          company_admin_since?: string | null
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          email?: string
          first_name?: string | null
          hub_id?: number
          id?: string
          invitation_accepted_at?: string | null
          invited_by_user_id?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          last_login_method?: string | null
          last_name?: string | null
          mobile_phone_number?: string | null
          onboarding_completed?: boolean | null
          permissions?: Json | null
          role?: string | null
          signup_type?: string | null
          updated_at?: string | null
          verification_setup_completed?: boolean | null
          verification_setup_completed_at?: string | null
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
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
