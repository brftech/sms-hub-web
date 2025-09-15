import { createClient } from '@supabase/supabase-js';

// Read from .env.local
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vgpovgpwqkjnpnrjelyg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncG92Z3B3cWtqbnBucmplbHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzOTQ5NjYsImV4cCI6MjA0Mzk3MDk2Nn0.LltcLCcPRea59Z0_E2WPvvqvlqRGM0hl9Fd2uXHBPyU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSuperadmin() {
  console.log('Checking superadmin users...\n');

  // List of superadmin emails
  const superadminEmails = [
    'superadmin@gnymble.com',
    'superadmin@percytech.com'
  ];

  for (const email of superadminEmails) {
    console.log(`\nChecking ${email}:`);
    
    // Check user_profiles table
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('id, email, role, hub_id, first_name, last_name')
      .eq('email', email);

    if (error) {
      console.error('Error:', error);
      continue;
    }

    if (!profiles || profiles.length === 0) {
      console.log('  ❌ No profile found');
    } else {
      for (const profile of profiles) {
        console.log(`  ID: ${profile.id}`);
        console.log(`  Role: ${profile.role}`);
        console.log(`  Hub ID: ${profile.hub_id}`);
        console.log(`  Name: ${profile.first_name} ${profile.last_name}`);
        
        if (profile.role !== 'SUPERADMIN') {
          console.log('  ⚠️  Role is NOT SUPERADMIN!');
          console.log('  To fix, run this SQL in Supabase dashboard:');
          console.log(`  UPDATE user_profiles SET role = 'SUPERADMIN' WHERE id = '${profile.id}';`);
        } else {
          console.log('  ✅ Role is correctly set to SUPERADMIN');
        }
      }
    }
  }

  console.log('\n\nTo update roles, go to:');
  console.log('https://supabase.com/dashboard/project/vgpovgpwqkjnpnrjelyg/editor');
  console.log('And run the UPDATE statements shown above.');
}

checkSuperadmin().catch(console.error);