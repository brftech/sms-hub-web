// Global test setup - runs once before all tests
export default async function globalSetup() {
  console.log("🧪 Setting up global test environment...");

  // Set test environment variables
  process.env.NODE_ENV = "test";
  process.env.SUPABASE_URL = "https://test.supabase.co";
  process.env.SUPABASE_ANON_KEY = "test-anon-key";
  process.env.SUPABASE_PROJECT_ID = "test-project-id";

  // Mock environment variables for different apps
  process.env.VITE_SUPABASE_URL = process.env.SUPABASE_URL;
  process.env.VITE_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  console.log("✅ Global test environment setup complete");
}
