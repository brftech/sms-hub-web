// Import Database type first
import type { Database } from "./database-generated";

// Re-export generated types from live database
export * from "./database-generated";

// Re-export Database type for convenience
export type { Database };

// Keep existing UserRole type for backward compatibility
export type UserRole =
  | "SUPERADMIN"
  | "OWNER"
  | "ADMIN"
  | "SUPPORT"
  | "VIEWER"
  | "MEMBER";

// Additional types for gnymble-website compatibility
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];

export type LeadActivity =
  Database["public"]["Tables"]["lead_activities"]["Row"];
export type LeadActivityInsert =
  Database["public"]["Tables"]["lead_activities"]["Insert"];
export type LeadActivityUpdate =
  Database["public"]["Tables"]["lead_activities"]["Update"];

// Convenience types for contact form
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

// Lead status enum for better type safety
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";
export type LeadPriority = "low" | "medium" | "high" | "urgent";
