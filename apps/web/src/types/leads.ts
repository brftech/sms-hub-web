export interface Lead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  message?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type:
    | "email_sent"
    | "phone_call"
    | "meeting_scheduled"
    | "proposal_sent"
    | "converted"
    | "note";
  description?: string;
  created_at: string;
  created_by: string;
}

export interface LeadFilters {
  status?: Lead["status"];
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface LeadAnalytics {
  total: number;
  byStatus: Record<Lead["status"], number>;
  bySource: Record<string, number>;
  conversionRate: number;
  recentActivity: LeadActivity[];
}
