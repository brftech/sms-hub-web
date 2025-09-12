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

async function runNuclearReset() {
  console.log('🔥🔥🔥 NUCLEAR DATABASE RESET VIA EDGE FUNCTION 🔥🔥🔥');
  console.log('⚠️  WARNING: This will DELETE ALL DATA from your database!');
  console.log('\nPress Ctrl+C to cancel, or wait 3 seconds to continue...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Calling nuclear-reset edge function...\n');

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/nuclear-reset`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({}),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Reset failed:', result.error);
      console.error('Details:', result.details);
      return;
    }

    console.log('✅ RESET COMPLETE!\n');
    console.log('Results:', JSON.stringify(result.results, null, 2));
    console.log('\n' + '='.repeat(60));
    console.log('INSTRUCTIONS:');
    console.log('='.repeat(60));
    
    if (result.instructions.auth.includes('issues')) {
      console.log('\n⚠️  Auth API has issues. To fix authentication:');
      console.log('1. Run: node fix-superadmin-auth.mjs');
      console.log('2. This will create the superadmin in auth.users');
    }
    
    console.log('\n📧 Login credentials:');
    console.log('   Email:', result.instructions.login.email);
    console.log('   Password:', result.instructions.login.password);
    console.log('\n🔗 Access methods:');
    console.log('   Production login: http://localhost:3000/login');
    console.log('   Dev mode bypass:', result.instructions.login.devMode);
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

runNuclearReset();