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

async function syncSuperadmin() {
  console.log('🔄 Syncing superadmin user to Supabase Auth...\n');
  
  try {
    // Call the sync-auth-users function
    const response = await fetch(
      `${supabaseUrl}/functions/v1/sync-auth-users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email: 'superadmin@gnymble.com'
        }),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Sync failed:', result.error);
      return;
    }

    console.log('✅ Sync completed successfully!\n');
    console.log('Results:', JSON.stringify(result.results, null, 2));
    
    if (result.results.created.includes('superadmin@gnymble.com')) {
      console.log('\n🎉 Superadmin user created in auth.users!');
      console.log('You can now login with:');
      console.log('  Email: superadmin@gnymble.com');
      console.log('  Password: SuperAdmin123!');
    } else if (result.results.updated.includes('superadmin@gnymble.com')) {
      console.log('\n✅ Superadmin user metadata updated in auth.users');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

syncSuperadmin();