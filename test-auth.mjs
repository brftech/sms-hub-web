import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vgpovgpwqkjnpnrjelyg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncG92Z3B3cWtqbnBucmplbHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTM2NDUsImV4cCI6MjA3MjE4OTY0NX0.6AwyCqUEVlWXdXrrdFF9x7v9eTltLhiysPM-VhBtlhU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('Testing Supabase connection...');
  
  // Test 1: Try to sign in with superadmin credentials
  console.log('\n1. Testing superadmin login:');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'superadmin@sms-hub.com',
    password: 'SuperAdmin123!'
  });
  
  if (error) {
    console.log('❌ Login failed:', error.message);
  } else {
    console.log('✅ Login successful!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
  }
  
  // Test 2: Check if we can query user_profiles
  console.log('\n2. Checking user_profiles table:');
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, email, role')
    .eq('email', 'superadmin@sms-hub.com');
    
  if (profileError) {
    console.log('❌ Query failed:', profileError.message);
  } else {
    console.log('✅ Profile query successful:');
    console.log(profiles);
  }
  
  // Test 3: Try creating a test user to verify connection
  console.log('\n3. Testing database connection:');
  const { data: testData, error: testError } = await supabase
    .from('companies')
    .select('id')
    .limit(1);
    
  if (testError) {
    console.log('❌ Database connection failed:', testError.message);
  } else {
    console.log('✅ Database connection successful');
  }
}

testAuth().catch(console.error);