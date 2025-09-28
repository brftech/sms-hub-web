// SMS Hub Web - Marketing Database Types
// Generated for marketing-focused database schema
// Created: 2025-01-XX

export interface Hub {
  hub_number: number;
  name: string;
  domain: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// LEAD MANAGEMENT TYPES
// =====================================================

export interface Lead {
  id: string;
  hub_id: number;
  email: string;
  name: string | null;
  phone: string | null;
  lead_phone_number: string | null;
  company_name: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: 'contact_form' | 'landing_page' | 'referral' | 'organic' | 'paid' | 'social' | 'email_campaign';
  campaign_source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  ip_address: string | null;
  user_agent: string | null;
  referrer_url: string | null;
  landing_page_url: string | null;
  lead_score: number;
  platform_interest: string | null;
  interaction_count: number;
  last_interaction_at: string | null;
  converted_at: string | null;
  converted_to_customer_id: string | null;
  assigned_to_user_id: string | null;
  notes: string | null;
  tags: string[];
  custom_fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  hub_id: number;
  activity_type: 'note' | 'email_sent' | 'email_opened' | 'email_clicked' | 'phone_call' | 'meeting' | 'demo' | 'proposal' | 'contract_sent' | 'converted' | 'lost';
  activity_data: Record<string, unknown>;
  performed_by_user_id: string | null;
  created_at: string;
}

// =====================================================
// EMAIL MARKETING TYPES
// =====================================================

export interface EmailList {
  id: string;
  hub_id: number;
  list_name: string;
  description: string | null;
  list_type: 'marketing' | 'newsletter' | 'product_updates' | 'onboarding' | 'nurture';
  status: 'active' | 'paused' | 'archived';
  subscriber_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmailSubscriber {
  id: string;
  hub_id: number;
  email_list_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company_name: string | null;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  source: 'website' | 'import' | 'api' | 'referral';
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  last_email_sent_at: string | null;
  last_email_opened_at: string | null;
  last_email_clicked_at: string | null;
  email_score: number;
  tags: string[];
  custom_fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  hub_id: number;
  campaign_name: string;
  subject_line: string;
  preview_text: string | null;
  campaign_type: 'marketing' | 'newsletter' | 'product_update' | 'onboarding' | 'nurture';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  email_list_id: string | null;
  send_date: string | null;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  bounced_count: number;
  complaint_count: number;
  campaign_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// =====================================================
// SMS MARKETING TYPES
// =====================================================

export interface SmsList {
  id: string;
  hub_id: number;
  list_name: string;
  description: string | null;
  list_type: 'marketing' | 'alerts' | 'notifications' | 'nurture';
  status: 'active' | 'paused' | 'archived';
  subscriber_count: number;
  created_at: string;
  updated_at: string;
}

export interface SmsSubscriber {
  id: string;
  hub_id: number;
  sms_list_id: string;
  phone_number: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company_name: string | null;
  status: 'subscribed' | 'unsubscribed' | 'invalid' | 'opted_out';
  source: 'website' | 'import' | 'api' | 'referral';
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  last_sms_sent_at: string | null;
  last_sms_opened_at: string | null;
  last_sms_clicked_at: string | null;
  sms_score: number;
  tags: string[];
  custom_fields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SmsCampaign {
  id: string;
  hub_id: number;
  campaign_name: string;
  message_content: string;
  campaign_type: 'marketing' | 'alert' | 'notification' | 'nurture';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  sms_list_id: string | null;
  send_date: string | null;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  failed_count: number;
  campaign_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// =====================================================
// AUTHENTICATION & USER MANAGEMENT TYPES
// =====================================================

export interface Verification {
  id: string;
  hub_id: number;
  email: string;
  mobile_phone: string | null;
  auth_method: 'email' | 'sms';
  verification_code: string;
  verification_sent_at: string | null;
  verification_completed_at: string | null;
  expires_at: string;
  existing_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  account_number: string | null;
  hub_id: number;
  first_name: string | null;
  last_name: string | null;
  mobile_phone_number: string | null;
  signup_type: 'new_company' | 'existing_company' | 'individual';
  verification_setup_completed: boolean;
  verification_setup_completed_at: string | null;
  is_active: boolean;
  invited_by_user_id: string | null;
  invitation_accepted_at: string | null;
  last_login_at: string | null;
  last_login_method: string | null;
  converted_to_customer: boolean;
  converted_to_customer_at: string | null;
  converted_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// MARKETING ANALYTICS & TRACKING TYPES
// =====================================================

export interface MarketingCampaign {
  id: string;
  hub_id: number;
  campaign_name: string;
  campaign_type: 'paid_search' | 'paid_social' | 'display' | 'email' | 'sms' | 'content' | 'referral' | 'organic';
  status: 'active' | 'paused' | 'completed' | 'archived';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  spent: number;
  target_audience: Record<string, unknown>;
  metrics: Record<string, unknown>;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactFormSubmission {
  id: string;
  hub_id: number;
  form_name: string;
  form_data: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  referrer_url: string | null;
  landing_page_url: string | null;
  utm_data: Record<string, unknown>;
  processed: boolean;
  processed_at: string | null;
  lead_id: string | null;
  created_at: string;
}

export interface WebsiteAnalytics {
  id: string;
  hub_id: number;
  page_url: string;
  page_title: string | null;
  visitor_id: string | null;
  session_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  referrer_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  event_type: 'page_view' | 'click' | 'form_submit' | 'download' | 'video_play';
  event_data: Record<string, unknown>;
  created_at: string;
}

// =====================================================
// INPUT/OUTPUT TYPES FOR FORMS AND API
// =====================================================

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  platform_interest?: string;
  hub_id?: number;
}

export interface LeadUpdateData {
  status?: Lead['status'];
  lead_score?: number;
  assigned_to_user_id?: string;
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, unknown>;
}

export interface EmailListCreateData {
  list_name: string;
  description?: string;
  list_type?: EmailList['list_type'];
}

export interface EmailSubscriberCreateData {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
  source?: EmailSubscriber['source'];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  tags?: string[];
  custom_fields?: Record<string, unknown>;
}

export interface SmsListCreateData {
  list_name: string;
  description?: string;
  list_type?: SmsList['list_type'];
}

export interface SmsSubscriberCreateData {
  phone_number: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  company_name?: string;
  source?: SmsSubscriber['source'];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  tags?: string[];
  custom_fields?: Record<string, unknown>;
}

// =====================================================
// DATABASE RESPONSE TYPES
// =====================================================

export interface DatabaseResponse<T> {
  data: T | null;
  error: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error: unknown;
}

// =====================================================
// EXPORT ALL TYPES
// =====================================================
// All types are already exported above as interfaces
