export * from "./database";
export * from "./hub";
export * from "./auth";
export * from "./onboarding";
export * from "./sms";
export * from "./contact";
export * from "./leads";
export * from "./account";

import type { Database } from "./database";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadActivity =
  Database["public"]["Tables"]["lead_activities"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type PaymentHistory =
  Database["public"]["Tables"]["payment_history"]["Row"];
export type AdminAuditLog =
  Database["public"]["Tables"]["admin_audit_logs"]["Row"];
