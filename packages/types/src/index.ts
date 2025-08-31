export * from './database'
export * from './hub'
export * from './auth'
export * from './onboarding'
export * from './sms'

import type { Database } from './database'

export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadActivity = Database['public']['Tables']['lead_activities']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type PaymentHistory = Database['public']['Tables']['payment_history']['Row']
export type AdminAuditLog = Database['public']['Tables']['admin_audit_logs']['Row']