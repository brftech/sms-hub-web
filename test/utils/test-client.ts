import { createClient } from "@supabase/supabase-js";
import { Database } from "@sms-hub/supabase";
import { vi } from "vitest";

// Test Supabase client for integration tests
export const createTestClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || "https://test.supabase.co";
  const supabaseKey = process.env.SUPABASE_ANON_KEY || "test-anon-key";

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

// Mock Supabase client for unit tests
export const createMockSupabaseClient = () => ({
  auth: {
    getUser: vi.fn(),
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    then: vi.fn(),
  })),
  functions: {
    invoke: vi.fn(),
  },
});

// Test user factory
export const createTestUser = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  hub_id: 1,
  company_id: "test-company-id",
  role: "MEMBER",
  ...overrides,
});

// Test company factory
export const createTestCompany = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: "test-company-id",
  hub_id: 1,
  public_name: "Test Company",
  billing_email: "billing@testcompany.com",
  ...overrides,
});

// Test hub configuration factory
export const createTestHubConfig = (hubType: string = "gnymble", overrides: Partial<Record<string, unknown>> = {}) => ({
  id: hubType,
  hubNumber: hubType === "gnymble" ? 2 : 1,
  name: hubType,
  displayName: hubType.charAt(0).toUpperCase() + hubType.slice(1),
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  accentColor: "#cccccc",
  ...overrides,
});
