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
  public: {
    Tables: {
      contact_form_submissions: {
        Row: {
          assigned_to_user_id: string | null
          company_name: string | null
          created_at: string | null
          email: string
          form_data: Json | null
          form_name: string
          hub_id: number
          id: string
          ip_address: unknown | null
          message: string | null
          name: string | null
          notes: string | null
          phone: string | null
          referrer_url: string | null
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
          company_name?: string | null
          created_at?: string | null
          email: string
          form_data?: Json | null
          form_name: string
          hub_id: number
          id?: string
          ip_address?: unknown | null
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          referrer_url?: string | null
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
          company_name?: string | null
          created_at?: string | null
          email?: string
          form_data?: Json | null
          form_name?: string
          hub_id?: number
          id?: string
          ip_address?: unknown | null
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          referrer_url?: string | null
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
            foreignKeyName: "contact_form_submissions_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      conversions: {
        Row: {
          conversion_campaign: string | null
          conversion_date: string | null
          conversion_medium: string | null
          conversion_source: string | null
          conversion_type: string
          conversion_value: number | null
          created_at: string | null
          customer_id: string | null
          hub_id: number
          id: string
          lead_id: string | null
          notes: string | null
        }
        Insert: {
          conversion_campaign?: string | null
          conversion_date?: string | null
          conversion_medium?: string | null
          conversion_source?: string | null
          conversion_type: string
          conversion_value?: number | null
          created_at?: string | null
          customer_id?: string | null
          hub_id: number
          id?: string
          lead_id?: string | null
          notes?: string | null
        }
        Update: {
          conversion_campaign?: string | null
          conversion_date?: string | null
          conversion_medium?: string | null
          conversion_source?: string | null
          conversion_type?: string
          conversion_value?: number | null
          created_at?: string | null
          customer_id?: string | null
          hub_id?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversions_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "conversions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          bounce_rate: number | null
          bounced_count: number | null
          campaign_name: string
          click_rate: number | null
          clicked_count: number | null
          complaint_count: number | null
          created_at: string | null
          created_by_user_id: string | null
          delivered_count: number | null
          email_list_id: string
          html_content: string | null
          hub_id: number
          id: string
          open_rate: number | null
          opened_count: number | null
          preview_text: string | null
          scheduled_at: string | null
          send_type: string | null
          sent_at: string | null
          status: string | null
          subject_line: string
          text_content: string | null
          total_recipients: number | null
          unsubscribed_count: number | null
          updated_at: string | null
        }
        Insert: {
          bounce_rate?: number | null
          bounced_count?: number | null
          campaign_name: string
          click_rate?: number | null
          clicked_count?: number | null
          complaint_count?: number | null
          created_at?: string | null
          created_by_user_id?: string | null
          delivered_count?: number | null
          email_list_id: string
          html_content?: string | null
          hub_id: number
          id?: string
          open_rate?: number | null
          opened_count?: number | null
          preview_text?: string | null
          scheduled_at?: string | null
          send_type?: string | null
          sent_at?: string | null
          status?: string | null
          subject_line: string
          text_content?: string | null
          total_recipients?: number | null
          unsubscribed_count?: number | null
          updated_at?: string | null
        }
        Update: {
          bounce_rate?: number | null
          bounced_count?: number | null
          campaign_name?: string
          click_rate?: number | null
          clicked_count?: number | null
          complaint_count?: number | null
          created_at?: string | null
          created_by_user_id?: string | null
          delivered_count?: number | null
          email_list_id?: string
          html_content?: string | null
          hub_id?: number
          id?: string
          open_rate?: number | null
          opened_count?: number | null
          preview_text?: string | null
          scheduled_at?: string | null
          send_type?: string | null
          sent_at?: string | null
          status?: string | null
          subject_line?: string
          text_content?: string | null
          total_recipients?: number | null
          unsubscribed_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_email_list_id_fkey"
            columns: ["email_list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      email_lists: {
        Row: {
          created_at: string | null
          description: string | null
          hub_id: number
          id: string
          list_name: string
          list_type: string | null
          status: string | null
          subscriber_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hub_id: number
          id?: string
          list_name: string
          list_type?: string | null
          status?: string | null
          subscriber_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hub_id?: number
          id?: string
          list_name?: string
          list_type?: string | null
          status?: string | null
          subscriber_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_lists_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          company_name: string | null
          created_at: string | null
          custom_fields: Json | null
          email: string
          email_list_id: string
          first_name: string | null
          hub_id: number
          id: string
          job_title: string | null
          last_activity_at: string | null
          last_name: string | null
          phone: string | null
          source: string | null
          status: string | null
          subscribed_at: string | null
          tags: Json | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email: string
          email_list_id: string
          first_name?: string | null
          hub_id: number
          id?: string
          job_title?: string | null
          last_activity_at?: string | null
          last_name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          tags?: Json | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string
          email_list_id?: string
          first_name?: string | null
          hub_id?: number
          id?: string
          job_title?: string | null
          last_activity_at?: string | null
          last_name?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          tags?: Json | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_subscribers_email_list_id_fkey"
            columns: ["email_list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_subscribers_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
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
        ]
      }
      leads: {
        Row: {
          assigned_to_user_id: string | null
          budget_range: string | null
          campaign_source: string | null
          company_name: string | null
          converted_at: string | null
          converted_to_customer_id: string | null
          created_at: string | null
          custom_fields: Json | null
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
          notes: string | null
          phone: string | null
          platform_interest: string | null
          referrer_url: string | null
          source: string | null
          status: string | null
          tags: Json | null
          timeline: string | null
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
          budget_range?: string | null
          campaign_source?: string | null
          company_name?: string | null
          converted_at?: string | null
          converted_to_customer_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
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
          notes?: string | null
          phone?: string | null
          platform_interest?: string | null
          referrer_url?: string | null
          source?: string | null
          status?: string | null
          tags?: Json | null
          timeline?: string | null
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
          budget_range?: string | null
          campaign_source?: string | null
          company_name?: string | null
          converted_at?: string | null
          converted_to_customer_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
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
          notes?: string | null
          phone?: string | null
          platform_interest?: string | null
          referrer_url?: string | null
          source?: string | null
          status?: string | null
          tags?: Json | null
          timeline?: string | null
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
            foreignKeyName: "leads_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          budget: number | null
          campaign_name: string
          campaign_type: string
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          end_date: string | null
          goals: Json | null
          hub_id: number
          id: string
          metrics: Json | null
          start_date: string | null
          status: string | null
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          campaign_name: string
          campaign_type: string
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          hub_id: number
          id?: string
          metrics?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          campaign_name?: string
          campaign_type?: string
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          hub_id?: number
          id?: string
          metrics?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      sms_campaigns: {
        Row: {
          campaign_name: string
          created_at: string | null
          created_by_user_id: string | null
          delivered_count: number | null
          delivery_rate: number | null
          failed_count: number | null
          hub_id: number
          id: string
          message: string
          scheduled_at: string | null
          send_type: string | null
          sent_at: string | null
          sms_list_id: string
          status: string | null
          total_recipients: number | null
          updated_at: string | null
        }
        Insert: {
          campaign_name: string
          created_at?: string | null
          created_by_user_id?: string | null
          delivered_count?: number | null
          delivery_rate?: number | null
          failed_count?: number | null
          hub_id: number
          id?: string
          message: string
          scheduled_at?: string | null
          send_type?: string | null
          sent_at?: string | null
          sms_list_id: string
          status?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Update: {
          campaign_name?: string
          created_at?: string | null
          created_by_user_id?: string | null
          delivered_count?: number | null
          delivery_rate?: number | null
          failed_count?: number | null
          hub_id?: number
          id?: string
          message?: string
          scheduled_at?: string | null
          send_type?: string | null
          sent_at?: string | null
          sms_list_id?: string
          status?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_campaigns_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "sms_campaigns_sms_list_id_fkey"
            columns: ["sms_list_id"]
            isOneToOne: false
            referencedRelation: "sms_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_lists: {
        Row: {
          created_at: string | null
          description: string | null
          hub_id: number
          id: string
          list_name: string
          list_type: string | null
          status: string | null
          subscriber_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hub_id: number
          id?: string
          list_name: string
          list_type?: string | null
          status?: string | null
          subscriber_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hub_id?: number
          id?: string
          list_name?: string
          list_type?: string | null
          status?: string | null
          subscriber_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_lists_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      sms_subscribers: {
        Row: {
          company_name: string | null
          consent_given: boolean | null
          consent_ip_address: unknown | null
          consent_text: string | null
          consent_timestamp: string | null
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          first_name: string | null
          hub_id: number
          id: string
          last_activity_at: string | null
          last_name: string | null
          phone_number: string
          sms_list_id: string
          source: string | null
          status: string | null
          subscribed_at: string | null
          tags: Json | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          consent_given?: boolean | null
          consent_ip_address?: unknown | null
          consent_text?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_name?: string | null
          hub_id: number
          id?: string
          last_activity_at?: string | null
          last_name?: string | null
          phone_number: string
          sms_list_id: string
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          tags?: Json | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          consent_given?: boolean | null
          consent_ip_address?: unknown | null
          consent_text?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          first_name?: string | null
          hub_id?: number
          id?: string
          last_activity_at?: string | null
          last_name?: string | null
          phone_number?: string
          sms_list_id?: string
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          tags?: Json | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_subscribers_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "sms_subscribers_sms_list_id_fkey"
            columns: ["sms_list_id"]
            isOneToOne: false
            referencedRelation: "sms_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          email_confirmed: boolean | null
          first_name: string | null
          hub_id: number
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_name: string | null
          metadata: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_confirmed?: boolean | null
          first_name?: string | null
          hub_id: number
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_confirmed?: boolean | null
          first_name?: string | null
          hub_id?: number
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_name?: string | null
          metadata?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      verification_attempts: {
        Row: {
          attempted_at: string | null
          attempted_code: string
          id: string
          ip_address: unknown | null
          is_successful: boolean | null
          user_agent: string | null
          verification_id: string
        }
        Insert: {
          attempted_at?: string | null
          attempted_code: string
          id?: string
          ip_address?: unknown | null
          is_successful?: boolean | null
          user_agent?: string | null
          verification_id: string
        }
        Update: {
          attempted_at?: string | null
          attempted_code?: string
          id?: string
          ip_address?: unknown | null
          is_successful?: boolean | null
          user_agent?: string | null
          verification_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_attempts_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      verifications: {
        Row: {
          created_at: string | null
          email: string
          hub_id: number
          id: string
          metadata: Json | null
          mobile_phone: string | null
          preferred_verification_method: string | null
          step_data: Json | null
          updated_at: string | null
          verification_code: string
          verification_completed_at: string | null
          verification_sent_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          hub_id: number
          id?: string
          metadata?: Json | null
          mobile_phone?: string | null
          preferred_verification_method?: string | null
          step_data?: Json | null
          updated_at?: string | null
          verification_code: string
          verification_completed_at?: string | null
          verification_sent_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          hub_id?: number
          id?: string
          metadata?: Json | null
          mobile_phone?: string | null
          preferred_verification_method?: string | null
          step_data?: Json | null
          updated_at?: string | null
          verification_code?: string
          verification_completed_at?: string | null
          verification_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
      website_analytics: {
        Row: {
          bounce: boolean | null
          created_at: string | null
          duration_seconds: number | null
          event_data: Json | null
          event_type: string | null
          hub_id: number
          id: string
          ip_address: unknown | null
          page_title: string | null
          page_url: string
          referrer_url: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string | null
        }
        Insert: {
          bounce?: boolean | null
          created_at?: string | null
          duration_seconds?: number | null
          event_data?: Json | null
          event_type?: string | null
          hub_id: number
          id?: string
          ip_address?: unknown | null
          page_title?: string | null
          page_url: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string | null
        }
        Update: {
          bounce?: boolean | null
          created_at?: string | null
          duration_seconds?: number | null
          event_data?: Json | null
          event_type?: string | null
          hub_id?: number
          id?: string
          ip_address?: unknown | null
          page_title?: string | null
          page_url?: string
          referrer_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_analytics_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_default_email_list_id: {
        Args: { p_hub_id: number }
        Returns: string
      }
      get_default_sms_list_id: {
        Args: { p_hub_id: number }
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
  public: {
    Enums: {},
  },
} as const
