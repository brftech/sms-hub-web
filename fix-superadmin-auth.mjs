#!/usr/bin/env node

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
  console.error('❌ Missing environment variables');
  process.exit(1);
}

async function fixSuperadminAuth() {
  console.log('🔧 Fixing superadmin authentication...\n');
  
  try {
    // Call the authenticate-user function to create/fix auth user
    const response = await fetch(
      `${supabaseUrl}/functions/v1/authenticate-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email: 'superadmin@gnymble.com',
          password: 'SuperAdmin123!'
        }),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Auth fix failed:', result.error);
      return;
    }

    console.log('✅ Superadmin authentication fixed!\n');
    
    if (result.user) {
      console.log('User details:');
      console.log('  ID:', result.user.id);
      console.log('  Email:', result.user.email);
      console.log('  Role:', result.user.role);
    }
    
    if (result.magicLink) {
      console.log('\n🔗 Magic link generated (for emergency access):');
      console.log(result.magicLink);
    }
    
    console.log('\n📧 You can now login with:');
    console.log('  Email: superadmin@gnymble.com');
    console.log('  Password: SuperAdmin123!');
    console.log('\n🔗 Login at: http://localhost:3000/login');
    console.log('  Or use dev mode: http://localhost:3001/?superadmin=dev123');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

fixSuperadminAuth();