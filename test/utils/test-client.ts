import { createClient } from "@supabase/supabase-js";
import { Database } from "@sms-hub/types";

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
    getUser: jest.fn(),
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    then: jest.fn(),
  })),
  functions: {
    invoke: jest.fn(),
  },
});

// Test user factory
export const createTestUser = (overrides: Partial<any> = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  hub_id: 1,
  company_id: "test-company-id",
  role: "MEMBER",
  ...overrides,
});

// Test company factory
export const createTestCompany = (overrides: Partial<any> = {}) => ({
  id: "test-company-id",
  hub_id: 1,
  public_name: "Test Company",
  billing_email: "billing@testcompany.com",
  ...overrides,
});

// Test hub configuration factory
export const createTestHubConfig = (hubType: string = "gnymble") => ({
  id: hubType,
  hubNumber: hubType === "gnymble" ? 2 : 1,
  name: hubType,
  displayName: hubType.charAt(0).toUpperCase() + hubType.slice(1),
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  accentColor: "#cccccc",
  ...overrides,
});
