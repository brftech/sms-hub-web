import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadActivity, LeadFilters, LeadAnalytics } from "@/types";

class LeadsService {
  async getLeads(
    filters: LeadFilters = {},
    page = 1,
    limit = 20
  ): Promise<{ data: Lead[]; count: number }> {
    let query = supabase.from("leads").select("*", { count: "exact" });

    // Apply filters
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.source) {
      query = query.eq("source", filters.source);
    }
    if (filters.dateFrom) {
      query = query.gte("created_at", filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte("created_at", filters.dateTo);
    }
    if (filters.search) {
      query = query.or(
        `email.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`
      );
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  async getLead(id: string): Promise<Lead> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead> {
    const { data, error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from("leads")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createLead(
    leadData: Omit<Lead, "id" | "created_at" | "updated_at">
  ): Promise<Lead> {
    const { data, error } = await supabase
      .from("leads")
      .insert(leadData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) throw error;
  }

  async addLeadActivity(
    leadId: string,
    activity: Omit<LeadActivity, "id" | "created_at">
  ): Promise<LeadActivity> {
    const { data, error } = await supabase
      .from("lead_activities")
      .insert({
        lead_id: leadId,
        activity_type: activity.activity_type,
        description: activity.description,
        created_by: activity.created_by,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getLeadActivities(leadId: string): Promise<LeadActivity[]> {
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getLeadAnalytics(): Promise<LeadAnalytics> {
    // Get total count
    const { count: total } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true });

    // Get count by status
    const { data: statusData } = await supabase.from("leads").select("status");

    const byStatus = {
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    };

    statusData?.forEach((lead) => {
      byStatus[lead.status]++;
    });

    // Get count by source
    const { data: sourceData } = await supabase.from("leads").select("source");

    const bySource: Record<string, number> = {};
    sourceData?.forEach((lead) => {
      bySource[lead.source] = (bySource[lead.source] || 0) + 1;
    });

    // Calculate conversion rate
    const conversionRate = total ? (byStatus.converted / total) * 100 : 0;

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from("lead_activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      total: total || 0,
      byStatus,
      bySource,
      conversionRate,
      recentActivity: recentActivity || [],
    };
  }
}

export const leadsService = new LeadsService();
