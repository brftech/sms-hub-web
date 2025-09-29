// Marketing website database types for SMS Hub Web
// Synchronized with migration: 0000001_initial_schema.sql

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

      // Leads - contact form submissions and lead capture
      leads: {
        Row: {
          id: string
          hub_id: number
          email: string
          name: string | null
          phone: string | null
          lead_phone_number: string | null
          company_name: string | null
          message: string | null
          status: string | null
          source: string | null
          campaign_source: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          ip_address: unknown | null
          user_agent: string | null
          referrer_url: string | null
          landing_page_url: string | null
          lead_score: number | null
          platform_interest: string | null
          budget_range: string | null
          timeline: string | null
          interaction_count: number | null
          last_interaction_at: string | null
          converted_at: string | null
          converted_to_customer_id: string | null
          assigned_to_user_id: string | null
          notes: string | null
          tags: Json | null
          custom_fields: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          email: string
          name?: string | null
          phone?: string | null
          lead_phone_number?: string | null
          company_name?: string | null
          message?: string | null
          status?: string | null
          source?: string | null
          campaign_source?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
          referrer_url?: string | null
          landing_page_url?: string | null
          lead_score?: number | null
          platform_interest?: string | null
          budget_range?: string | null
          timeline?: string | null
          interaction_count?: number | null
          last_interaction_at?: string | null
          converted_at?: string | null
          converted_to_customer_id?: string | null
          assigned_to_user_id?: string | null
          notes?: string | null
          tags?: Json | null
          custom_fields?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          email?: string
          name?: string | null
          phone?: string | null
          lead_phone_number?: string | null
          company_name?: string | null
          message?: string | null
          status?: string | null
          source?: string | null
          campaign_source?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
          referrer_url?: string | null
          landing_page_url?: string | null
          lead_score?: number | null
          platform_interest?: string | null
          budget_range?: string | null
          timeline?: string | null
          interaction_count?: number | null
          last_interaction_at?: string | null
          converted_at?: string | null
          converted_to_customer_id?: string | null
          assigned_to_user_id?: string | null
          notes?: string | null
          tags?: Json | null
          custom_fields?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // Lead activities - tracking all lead interactions
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          hub_id: number
          activity_type: string
          activity_data: Json | null
          performed_by_user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          lead_id: string
          hub_id: number
          activity_type: string
          activity_data?: Json | null
          performed_by_user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          lead_id?: string
          hub_id?: number
          activity_type?: string
          activity_data?: Json | null
          performed_by_user_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // Email marketing lists
      email_lists: {
        Row: {
          id: string
          hub_id: number
          list_name: string
          description: string | null
          list_type: string | null
          status: string | null
          subscriber_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          list_name: string
          description?: string | null
          list_type?: string | null
          status?: string | null
          subscriber_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          list_name?: string
          description?: string | null
          list_type?: string | null
          status?: string | null
          subscriber_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_lists_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // Email subscribers
      email_subscribers: {
        Row: {
          id: string
          hub_id: number
          email_list_id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          company_name: string | null
          job_title: string | null
          status: string | null
          source: string | null
          tags: Json | null
          custom_fields: Json | null
          subscribed_at: string | null
          unsubscribed_at: string | null
          last_activity_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          email_list_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company_name?: string | null
          job_title?: string | null
          status?: string | null
          source?: string | null
          tags?: Json | null
          custom_fields?: Json | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          last_activity_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          email_list_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company_name?: string | null
          job_title?: string | null
          status?: string | null
          source?: string | null
          tags?: Json | null
          custom_fields?: Json | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          last_activity_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_subscribers_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "email_subscribers_email_list_id_fkey"
            columns: ["email_list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          }
        ]
      }

      // Email campaigns
      email_campaigns: {
        Row: {
          id: string
          hub_id: number
          email_list_id: string
          campaign_name: string
          subject_line: string
          preview_text: string | null
          html_content: string | null
          text_content: string | null
          status: string | null
          send_type: string | null
          scheduled_at: string | null
          sent_at: string | null
          total_recipients: number | null
          delivered_count: number | null
          opened_count: number | null
          clicked_count: number | null
          bounced_count: number | null
          unsubscribed_count: number | null
          complaint_count: number | null
          open_rate: number | null
          click_rate: number | null
          bounce_rate: number | null
          created_by_user_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          email_list_id: string
          campaign_name: string
          subject_line: string
          preview_text?: string | null
          html_content?: string | null
          text_content?: string | null
          status?: string | null
          send_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number | null
          delivered_count?: number | null
          opened_count?: number | null
          clicked_count?: number | null
          bounced_count?: number | null
          unsubscribed_count?: number | null
          complaint_count?: number | null
          open_rate?: number | null
          click_rate?: number | null
          bounce_rate?: number | null
          created_by_user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          email_list_id?: string
          campaign_name?: string
          subject_line?: string
          preview_text?: string | null
          html_content?: string | null
          text_content?: string | null
          status?: string | null
          send_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number | null
          delivered_count?: number | null
          opened_count?: number | null
          clicked_count?: number | null
          bounced_count?: number | null
          unsubscribed_count?: number | null
          complaint_count?: number | null
          open_rate?: number | null
          click_rate?: number | null
          bounce_rate?: number | null
          created_by_user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          },
          {
            foreignKeyName: "email_campaigns_email_list_id_fkey"
            columns: ["email_list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          }
        ]
      }

      // SMS marketing lists
      sms_lists: {
        Row: {
          id: string
          hub_id: number
          list_name: string
          description: string | null
          list_type: string | null
          status: string | null
          subscriber_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          list_name: string
          description?: string | null
          list_type?: string | null
          status?: string | null
          subscriber_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          list_name?: string
          description?: string | null
          list_type?: string | null
          status?: string | null
          subscriber_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_lists_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // SMS subscribers
      sms_subscribers: {
        Row: {
          id: string
          hub_id: number
          sms_list_id: string
          phone_number: string
          first_name: string | null
          last_name: string | null
          email: string | null
          company_name: string | null
          status: string | null
          source: string | null
          consent_given: boolean | null
          consent_timestamp: string | null
          consent_ip_address: unknown | null
          consent_text: string | null
          tags: Json | null
          custom_fields: Json | null
          subscribed_at: string | null
          unsubscribed_at: string | null
          last_activity_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          sms_list_id: string
          phone_number: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          company_name?: string | null
          status?: string | null
          source?: string | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          consent_ip_address?: unknown | null
          consent_text?: string | null
          tags?: Json | null
          custom_fields?: Json | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          last_activity_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          sms_list_id?: string
          phone_number?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          company_name?: string | null
          status?: string | null
          source?: string | null
          consent_given?: boolean | null
          consent_timestamp?: string | null
          consent_ip_address?: unknown | null
          consent_text?: string | null
          tags?: Json | null
          custom_fields?: Json | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          last_activity_at?: string | null
          created_at?: string | null
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
          }
        ]
      }

      // SMS campaigns
      sms_campaigns: {
        Row: {
          id: string
          hub_id: number
          sms_list_id: string
          campaign_name: string
          message: string
          status: string | null
          send_type: string | null
          scheduled_at: string | null
          sent_at: string | null
          total_recipients: number | null
          delivered_count: number | null
          failed_count: number | null
          delivery_rate: number | null
          created_by_user_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          sms_list_id: string
          campaign_name: string
          message: string
          status?: string | null
          send_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number | null
          delivered_count?: number | null
          failed_count?: number | null
          delivery_rate?: number | null
          created_by_user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          sms_list_id?: string
          campaign_name?: string
          message?: string
          status?: string | null
          send_type?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          total_recipients?: number | null
          delivered_count?: number | null
          failed_count?: number | null
          delivery_rate?: number | null
          created_by_user_id?: string | null
          created_at?: string | null
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
          }
        ]
      }

      // Marketing campaigns - cross-channel campaign tracking
      marketing_campaigns: {
        Row: {
          id: string
          hub_id: number
          campaign_name: string
          campaign_type: string
          description: string | null
          status: string | null
          start_date: string | null
          end_date: string | null
          budget: number | null
          target_audience: string | null
          goals: Json | null
          metrics: Json | null
          created_by_user_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          campaign_name: string
          campaign_type: string
          description?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          target_audience?: string | null
          goals?: Json | null
          metrics?: Json | null
          created_by_user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          campaign_name?: string
          campaign_type?: string
          description?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          target_audience?: string | null
          goals?: Json | null
          metrics?: Json | null
          created_by_user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // Website analytics - website traffic and engagement
      website_analytics: {
        Row: {
          id: string
          hub_id: number
          page_url: string
          page_title: string | null
          visitor_id: string | null
          session_id: string | null
          ip_address: unknown | null
          user_agent: string | null
          referrer_url: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          event_type: string | null
          event_data: Json | null
          duration_seconds: number | null
          bounce: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          page_url: string
          page_title?: string | null
          visitor_id?: string | null
          session_id?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
          referrer_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          event_type?: string | null
          event_data?: Json | null
          duration_seconds?: number | null
          bounce?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          page_url?: string
          page_title?: string | null
          visitor_id?: string | null
          session_id?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
          referrer_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          event_type?: string | null
          event_data?: Json | null
          duration_seconds?: number | null
          bounce?: boolean | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "website_analytics_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // Contact form submissions
      contact_form_submissions: {
        Row: {
          id: string
          hub_id: number
          form_name: string
          email: string
          name: string | null
          phone: string | null
          company_name: string | null
          message: string | null
          form_data: Json | null
          ip_address: unknown | null
          user_agent: string | null
          referrer_url: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          status: string | null
          assigned_to_user_id: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          form_name: string
          email: string
          name?: string | null
          phone?: string | null
          company_name?: string | null
          message?: string | null
          form_data?: Json | null
          ip_address?: unknown | null
          user_agent?: string | null
          referrer_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          status?: string | null
          assigned_to_user_id?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          form_name?: string
          email?: string
          name?: string | null
          phone?: string | null
          company_name?: string | null
          message?: string | null
          form_data?: Json | null
          ip_address?: unknown | null
          user_agent?: string | null
          referrer_url?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          status?: string | null
          assigned_to_user_id?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_form_submissions_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // User profiles - marketing team/admin users
      user_profiles: {
        Row: {
          id: string
          hub_id: number
          email: string
          first_name: string | null
          last_name: string | null
          role: string | null
          is_active: boolean | null
          email_confirmed: boolean | null
          last_login_at: string | null
          created_at: string | null
          updated_at: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          hub_id: number
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: string | null
          is_active?: boolean | null
          email_confirmed?: boolean | null
          last_login_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          hub_id?: number
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: string | null
          is_active?: boolean | null
          email_confirmed?: boolean | null
          last_login_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // Verifications - email verification
      verifications: {
        Row: {
          id: string
          email: string
          mobile_phone: string | null
          hub_id: number
          verification_code: string
          verification_sent_at: string | null
          verification_completed_at: string | null
          preferred_verification_method: string | null
          step_data: Json | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          mobile_phone?: string | null
          hub_id: number
          verification_code: string
          verification_sent_at?: string | null
          verification_completed_at?: string | null
          preferred_verification_method?: string | null
          step_data?: Json | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          mobile_phone?: string | null
          hub_id?: number
          verification_code?: string
          verification_sent_at?: string | null
          verification_completed_at?: string | null
          preferred_verification_method?: string | null
          step_data?: Json | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verifications_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["hub_number"]
          }
        ]
      }

      // Verification attempts
      verification_attempts: {
        Row: {
          id: string
          verification_id: string
          attempted_code: string
          is_successful: boolean | null
          attempted_at: string | null
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          verification_id: string
          attempted_code: string
          is_successful?: boolean | null
          attempted_at?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          verification_id?: string
          attempted_code?: string
          is_successful?: boolean | null
          attempted_at?: string | null
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_attempts_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "verifications"
            referencedColumns: ["id"]
          }
        ]
      }

      // Conversions - lead to customer conversion tracking
      conversions: {
        Row: {
          id: string
          hub_id: number
          lead_id: string | null
          conversion_type: string
          conversion_value: number | null
          customer_id: string | null
          conversion_source: string | null
          conversion_medium: string | null
          conversion_campaign: string | null
          conversion_date: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          hub_id: number
          lead_id?: string | null
          conversion_type: string
          conversion_value?: number | null
          customer_id?: string | null
          conversion_source?: string | null
          conversion_medium?: string | null
          conversion_campaign?: string | null
          conversion_date?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          hub_id?: number
          lead_id?: string | null
          conversion_type?: string
          conversion_value?: number | null
          customer_id?: string | null
          conversion_source?: string | null
          conversion_medium?: string | null
          conversion_campaign?: string | null
          conversion_date?: string | null
          notes?: string | null
          created_at?: string | null
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
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
export type Hub = Tables<'hubs'>
export type HubInsert = TablesInsert<'hubs'>
export type HubUpdate = TablesUpdate<'hubs'>

export type Lead = Tables<'leads'>
export type LeadInsert = TablesInsert<'leads'>
export type LeadUpdate = TablesUpdate<'leads'>

export type LeadActivity = Tables<'lead_activities'>
export type LeadActivityInsert = TablesInsert<'lead_activities'>
export type LeadActivityUpdate = TablesUpdate<'lead_activities'>

export type EmailList = Tables<'email_lists'>
export type EmailListInsert = TablesInsert<'email_lists'>
export type EmailListUpdate = TablesUpdate<'email_lists'>

export type EmailSubscriber = Tables<'email_subscribers'>
export type EmailSubscriberInsert = TablesInsert<'email_subscribers'>
export type EmailSubscriberUpdate = TablesUpdate<'email_subscribers'>

export type EmailCampaign = Tables<'email_campaigns'>
export type EmailCampaignInsert = TablesInsert<'email_campaigns'>
export type EmailCampaignUpdate = TablesUpdate<'email_campaigns'>

export type SmsList = Tables<'sms_lists'>
export type SmsListInsert = TablesInsert<'sms_lists'>
export type SmsListUpdate = TablesUpdate<'sms_lists'>

export type SmsSubscriber = Tables<'sms_subscribers'>
export type SmsSubscriberInsert = TablesInsert<'sms_subscribers'>
export type SmsSubscriberUpdate = TablesUpdate<'sms_subscribers'>

export type SmsCampaign = Tables<'sms_campaigns'>
export type SmsCampaignInsert = TablesInsert<'sms_campaigns'>
export type SmsCampaignUpdate = TablesUpdate<'sms_campaigns'>

export type MarketingCampaign = Tables<'marketing_campaigns'>
export type MarketingCampaignInsert = TablesInsert<'marketing_campaigns'>
export type MarketingCampaignUpdate = TablesUpdate<'marketing_campaigns'>

export type WebsiteAnalytics = Tables<'website_analytics'>
export type WebsiteAnalyticsInsert = TablesInsert<'website_analytics'>
export type WebsiteAnalyticsUpdate = TablesUpdate<'website_analytics'>

export type ContactFormSubmission = Tables<'contact_form_submissions'>
export type ContactFormSubmissionInsert = TablesInsert<'contact_form_submissions'>
export type ContactFormSubmissionUpdate = TablesUpdate<'contact_form_submissions'>

export type UserProfile = Tables<'user_profiles'>
export type UserProfileInsert = TablesInsert<'user_profiles'>
export type UserProfileUpdate = TablesUpdate<'user_profiles'>

export type Verification = Tables<'verifications'>
export type VerificationInsert = TablesInsert<'verifications'>
export type VerificationUpdate = TablesUpdate<'verifications'>

export type VerificationAttempt = Tables<'verification_attempts'>
export type VerificationAttemptInsert = TablesInsert<'verification_attempts'>
export type VerificationAttemptUpdate = TablesUpdate<'verification_attempts'>

export type Conversion = Tables<'conversions'>
export type ConversionInsert = TablesInsert<'conversions'>
export type ConversionUpdate = TablesUpdate<'conversions'>

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