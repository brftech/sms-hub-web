import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixSuperadminRoles() {
  console.log('Checking and fixing superadmin roles...\n');

  // List of emails that should have superadmin role
  const superadminEmails = [
    'superadmin@gnymble.com',
    'superadmin@percytech.com',
    'superadmin@percymd.com',
    'superadmin@percytext.com'
  ];

  for (const email of superadminEmails) {
    console.log(`Checking ${email}...`);
    
    // First check if user exists in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error(`Error listing users:`, authError);
      continue;
    }

    const user = authUser.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`  ❌ User not found in auth.users`);
      continue;
    }

    console.log(`  ✓ Found user: ${user.id}`);

    // Check user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, role, hub_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log(`  ❌ No profile found in user_profiles`);
      
      // Create profile with SUPERADMIN role
      const hubId = email.includes('gnymble') ? 1 : 
                    email.includes('percytech') ? 0 :
                    email.includes('percymd') ? 2 : 3;
      
      const { error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: email,
          role: 'SUPERADMIN',
          hub_id: hubId,
          first_name: 'System',
          last_name: 'Administrator',
          signup_type: 'email',
          company_admin: true,
          verification_setup_completed: true,
          onboarding_completed: true
        });

      if (createError) {
        console.error(`  ❌ Error creating profile:`, createError);
      } else {
        console.log(`  ✓ Created profile with SUPERADMIN role`);
      }
    } else {
      console.log(`  ✓ Found profile: role=${profile.role}, hub_id=${profile.hub_id}`);
      
      // Update role if not SUPERADMIN
      if (profile.role !== 'SUPERADMIN') {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'SUPERADMIN' })
          .eq('id', user.id);

        if (updateError) {
          console.error(`  ❌ Error updating role:`, updateError);
        } else {
          console.log(`  ✓ Updated role to SUPERADMIN`);
        }
      } else {
        console.log(`  ✓ Role is already SUPERADMIN`);
      }
    }

    // Check memberships table
    const { data: memberships, error: membershipError } = await supabase
      .from('memberships')
      .select('id, role, hub_id')
      .eq('user_id', user.id);

    if (membershipError) {
      console.error(`  ❌ Error checking memberships:`, membershipError);
    } else if (!memberships || memberships.length === 0) {
      console.log(`  ❌ No memberships found`);
      
      // Create membership
      const hubId = email.includes('gnymble') ? 1 : 
                    email.includes('percytech') ? 0 :
                    email.includes('percymd') ? 2 : 3;
      
      const { error: createMemError } = await supabase
        .from('memberships')
        .insert({
          user_id: user.id,
          role: 'SUPERADMIN',
          hub_id: hubId
        });

      if (createMemError) {
        console.error(`  ❌ Error creating membership:`, createMemError);
      } else {
        console.log(`  ✓ Created membership with SUPERADMIN role`);
      }
    } else {
      console.log(`  ✓ Found ${memberships.length} membership(s)`);
      
      // Update all memberships to SUPERADMIN
      for (const membership of memberships) {
        if (membership.role !== 'SUPERADMIN') {
          const { error: updateMemError } = await supabase
            .from('memberships')
            .update({ role: 'SUPERADMIN' })
            .eq('id', membership.id);

          if (updateMemError) {
            console.error(`  ❌ Error updating membership ${membership.id}:`, updateMemError);
          } else {
            console.log(`  ✓ Updated membership ${membership.id} to SUPERADMIN`);
          }
        }
      }
    }

    console.log('');
  }

  console.log('Done!');
}

// Run the script
fixSuperadminRoles().catch(console.error);