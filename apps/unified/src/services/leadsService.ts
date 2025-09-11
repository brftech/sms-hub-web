import { getSupabaseClient } from "../lib/supabaseSingleton";

export interface Lead {
  id: string;
  hub_id: number;
  company_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  status: string;
  priority: string;
  source_type?: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Joined data
  hub?: {
    hub_number: number;
    name: string;
  };
  // Computed fields for display
  full_name?: string;
  contact_info?: string;
  lead_age?: string;
  status_color?: string;
  priority_color?: string;
}

export interface LeadFilters {
  search?: string;
  hub_id?: number;
  status?: string;
  priority?: string;
  source_type?: string;
  limit?: number;
}

class LeadsService {
  private supabase = getSupabaseClient();

  async getLeads(filters: LeadFilters = {}): Promise<Lead[]> {
    try {
      let query = this.supabase.from("leads").select(`
        *,
        hub:hubs(
          hub_number,
          name
        )
      `);

      // Apply filters
      if (filters.hub_id !== undefined) {
        query = query.eq("hub_id", filters.hub_id);
      }

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.priority) {
        query = query.eq("priority", filters.priority);
      }

      if (filters.source_type) {
        query = query.eq("source_type", filters.source_type);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }

      // Process the data to add computed fields
      const leads = (data || []).map((lead) => ({
        ...lead,
        // Add computed fields for display
        full_name: this.getFullName(lead),
        contact_info: this.getContactInfo(lead),
        lead_age: this.getLeadAge(lead),
        status_color: this.getStatusColor(lead.status),
        priority_color: this.getPriorityColor(lead.priority),
      })) as unknown as Lead[];

      // Apply search filter after fetching
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return leads.filter(
          (lead) =>
            lead.email?.toLowerCase().includes(searchTerm) ||
            lead.phone?.toLowerCase().includes(searchTerm) ||
            lead.full_name?.toLowerCase().includes(searchTerm) ||
            lead.company_name?.toLowerCase().includes(searchTerm) ||
            lead.hub?.name?.toLowerCase().includes(searchTerm)
        );
      }

      return leads;
    } catch (error) {
      console.error("Error in getLeads:", error);
      throw error;
    }
  }

  async getLeadById(id: string): Promise<Lead | null> {
    try {
      const { data, error } = await this.supabase
        .from("leads")
        .select(
          `
          *,
          hub:hubs(
            hub_number,
            name
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching lead:", error);
        return null;
      }

      return {
        ...data,
        full_name: this.getFullName(data),
        contact_info: this.getContactInfo(data),
        lead_age: this.getLeadAge(data),
        status_color: this.getStatusColor(data.status),
        priority_color: this.getPriorityColor(data.priority),
      } as unknown as Lead;
    } catch (error) {
      console.error("Error in getLeadById:", error);
      return null;
    }
  }

  async createLead(leadData: any): Promise<Lead> {
    try {
      const { data, error } = await this.supabase
        .from("leads")
        .insert([leadData])
        .select(
          `
          *,
          hub:hubs(
            hub_number,
            name
          )
        `
        )
        .single();

      if (error) {
        console.error("Error creating lead:", error);
        throw error;
      }

      return {
        ...data,
        full_name: this.getFullName(data),
        contact_info: this.getContactInfo(data),
        lead_age: this.getLeadAge(data),
        status_color: this.getStatusColor(data.status),
        priority_color: this.getPriorityColor(data.priority),
      } as unknown as Lead;
    } catch (error) {
      console.error("Error in createLead:", error);
      throw error;
    }
  }

  async updateLead(id: string, updates: any): Promise<Lead> {
    try {
      const { data, error } = await this.supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          hub:hubs(
            hub_number,
            name
          )
        `
        )
        .single();

      if (error) {
        console.error("Error updating lead:", error);
        throw error;
      }

      return {
        ...data,
        full_name: this.getFullName(data),
        contact_info: this.getContactInfo(data),
        lead_age: this.getLeadAge(data),
        status_color: this.getStatusColor(data.status),
        priority_color: this.getPriorityColor(data.priority),
      } as unknown as Lead;
    } catch (error) {
      console.error("Error in updateLead:", error);
      throw error;
    }
  }

  async deleteLead(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("leads").delete().eq("id", id);

      if (error) {
        console.error("Error deleting lead:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteLead:", error);
      throw error;
    }
  }

  // Helper methods for computed fields
  private getFullName(lead: any): string {
    if (lead.first_name && lead.last_name) {
      return `${lead.first_name} ${lead.last_name}`;
    }
    if (lead.first_name) return lead.first_name;
    if (lead.last_name) return lead.last_name;
    return "Unknown Lead";
  }

  private getContactInfo(lead: any): string {
    const parts = [];
    if (lead.email) parts.push(lead.email);
    if (lead.phone) parts.push(lead.phone);
    return parts.join(" • ");
  }

  private getLeadAge(lead: any): string {
    if (!lead.created_at) return "Unknown";
    const createdAt = new Date(lead.created_at);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return createdAt.toLocaleDateString();
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "converted":
        return "bg-purple-100 text-purple-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  private getPriorityColor(priority: string): string {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}

export const leadsService = {
  instance: new LeadsService(),
};
