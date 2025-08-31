// Updated database types to match gnymble-website schema
// This file should be used after running the migration: 20241229000004_gnymble_website_schema_sync.sql

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          hub_id: number;
          email: string;
          name: string | null;
          first_name: string | null;
          last_name: string | null;
          lead_phone_number: string | null;
          phone: string | null;
          company_name: string | null;
          platform_interest: string | null;
          source: string | null;
          message: string | null;
          status: string | null;
          ip_address: unknown | null;
          interaction_count: number | null;
          last_interaction_at: string | null;
          created_at: string | null;
          updated_at: string | null;
          lead_score: number | null;
          priority: string | null;
          source_type: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          hub_id: number;
          email: string;
          name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          lead_phone_number?: string | null;
          phone?: string | null;
          company_name?: string | null;
          platform_interest?: string | null;
          source?: string | null;
          message?: string | null;
          status?: string | null;
          ip_address?: unknown | null;
          interaction_count?: number | null;
          last_interaction_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          lead_score?: number | null;
          priority?: string | null;
          source_type?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          hub_id?: number;
          email?: string;
          name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          lead_phone_number?: string | null;
          phone?: string | null;
          company_name?: string | null;
          platform_interest?: string | null;
          source?: string | null;
          message?: string | null;
          status?: string | null;
          ip_address?: unknown | null;
          interaction_count?: number | null;
          last_interaction_at?: string | null;
          created_at?: string | null;
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
      lead_activities: {
        Row: {
          id: string;
          hub_id: number;
          lead_id: string;
          activity_type: string;
          activity_data: Json | null;
          description: string | null;
          ip_address: unknown | null;
          user_agent: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          hub_id: number;
          lead_id: string;
          activity_type: string;
          activity_data?: Json | null;
          description?: string | null;
          ip_address?: unknown | null;
          user_agent?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          hub_id?: number;
          lead_id?: string;
          activity_type?: string;
          activity_data?: Json | null;
          description?: string | null;
          ip_address?: unknown | null;
          user_agent?: string | null;
          created_at?: string | null;
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
      // Add other tables as needed...
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
