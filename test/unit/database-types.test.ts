/// <reference types="vitest/globals" />
import type {
  Hub,
  Lead,
  EmailSubscriber,
  ContactFormSubmission,
  Verification,
} from "@sms-hub/supabase";

// These tests are compile-time leaning: if schema changes break the exported
// types (missing/renamed fields, wrong shapes), the suite will catch it.

describe("Database Types", () => {
  it("Hub row shape should include hub_number, name, domain", () => {
    const hub: Hub = {
      hub_number: 1,
      name: "Gnymble",
      domain: "gnymble.com",
      created_at: null,
      updated_at: null,
    };
    expect(hub.hub_number).toBe(1);
    expect(typeof hub.name).toBe("string");
  });

  it("Lead row shape should include hub_id, email and allow optional fields", () => {
    const lead: Lead = {
      id: "uuid",
      hub_id: 1,
      email: "lead@example.com",
      name: null,
      phone: null,
      lead_phone_number: null,
      company_name: null,
      message: null,
      status: null,
      source: null,
      campaign_source: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      ip_address: null,
      user_agent: null,
      referrer_url: null,
      landing_page_url: null,
      lead_score: null,
      platform_interest: null,
      budget_range: null,
      timeline: null,
      interaction_count: null,
      last_interaction_at: null,
      converted_at: null,
      converted_to_customer_id: null,
      assigned_to_user_id: null,
      notes: null,
      tags: null,
      custom_fields: null,
      created_at: null,
      updated_at: null,
    };
    expect(lead.hub_id).toBeGreaterThan(0);
    expect(lead.email).toContain("@");
  });

  it("Contact form submission requires hub_id, form_name, email", () => {
    const submission: ContactFormSubmission = {
      id: "uuid",
      hub_id: 1,
      form_name: "contact",
      email: "person@example.com",
      name: null,
      phone: null,
      company_name: null,
      message: null,
      form_data: null,
      ip_address: null,
      user_agent: null,
      referrer_url: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      status: null,
      assigned_to_user_id: null,
      notes: null,
      created_at: null,
      updated_at: null,
    };
    expect(submission.form_name).toBe("contact");
  });

  it("EmailSubscriber includes email and hub_id", () => {
    const sub: EmailSubscriber = {
      id: "uuid",
      hub_id: 1,
      email_list_id: "uuid",
      email: "sub@example.com",
      first_name: null,
      last_name: null,
      phone: null,
      company_name: null,
      job_title: null,
      status: null,
      source: null,
      tags: null,
      custom_fields: null,
      subscribed_at: null,
      unsubscribed_at: null,
      last_activity_at: null,
      created_at: null,
      updated_at: null,
    };
    expect(sub.email).toContain("@");
  });

  it("Verification requires verification_code and hub_id", () => {
    const v: Verification = {
      id: "uuid",
      email: "v@example.com",
      mobile_phone: null,
      hub_id: 1,
      verification_code: "123456",
      verification_sent_at: null,
      verification_completed_at: null,
      preferred_verification_method: null,
      step_data: null,
      metadata: null,
      created_at: null,
      updated_at: null,
    };
    expect(v.verification_code.length).toBeGreaterThan(0);
    expect(v.hub_id).toBe(1);
  });
});
