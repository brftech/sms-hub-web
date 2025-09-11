import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read .env.local file manually
const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSuperadminAuth() {
  console.log('Testing superadmin authentication...');
  console.log('Email: superadmin@gnymble.com');
  console.log('Password: SuperAdmin123!');
  
  try {
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'superadmin@gnymble.com',
      password: 'SuperAdmin123!'
    });

    if (error) {
      console.error('Authentication failed:', error);
      
      // Try to get more info about the user
      console.log('\nChecking if user exists in user_profiles...');
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', 'superadmin@gnymble.com');
      
      if (profileError) {
        console.error('Profile lookup error:', profileError);
      } else {
        console.log('Number of profiles found:', profiles.length);
        if (profiles.length > 0) {
          console.log('Profile found:', profiles[0]);
        }
      }
      
      // Also check auth.users table using admin key if available
      const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceRoleKey) {
        console.log('\nUsing service role key to check auth.users...');
        const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
        const { data: authUser } = await adminSupabase.auth.admin.listUsers();
        const superadmin = authUser?.users?.find(u => u.email === 'superadmin@gnymble.com');
        if (superadmin) {
          console.log('Found in auth.users:', {
            id: superadmin.id,
            email: superadmin.email,
            created_at: superadmin.created_at
          });
        } else {
          console.log('NOT found in auth.users');
        }
      }
    } else {
      console.log('Authentication successful!');
      console.log('User ID:', data.user?.id);
      console.log('Email:', data.user?.email);
      console.log('Role:', data.user?.app_metadata?.role);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
  
  process.exit(0);
}

testSuperadminAuth();