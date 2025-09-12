#!/usr/bin/env node

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
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function nukeEverything() {
  console.log('🔥🔥🔥 NUCLEAR DATABASE RESET 🔥🔥🔥');
  console.log('⚠️  WARNING: This will DELETE ALL DATA from your database!');
  console.log('⚠️  Including ALL users from auth.users!');
  console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('Starting complete database wipe...\n');

  try {
    // Step 1: Delete ALL auth users
    console.log('Step 1: Cleaning auth.users...');
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing auth users:', listError);
    } else if (authUsers?.users && authUsers.users.length > 0) {
      console.log(`Found ${authUsers.users.length} auth users to delete`);
      
      for (const user of authUsers.users) {
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        if (deleteError) {
          console.error(`❌ Error deleting auth user ${user.email}:`, deleteError);
        } else {
          console.log(`  ✅ Deleted auth user: ${user.email}`);
        }
      }
    } else {
      console.log('  ℹ️  No auth users found');
    }

    // Step 2: Delete all data from tables (in correct order due to foreign keys)
    console.log('\nStep 2: Cleaning database tables...');
    
    const tablesToClean = [
      // Clean in reverse dependency order
      'messages',
      'contacts',
      'phone_numbers',
      'campaigns',
      'brands',
      'leads',
      'user_profiles',
      'customers',
      'companies',
      // Don't delete hubs - we'll keep them
    ];

    for (const table of tablesToClean) {
      console.log(`  Cleaning ${table}...`);
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything except impossible UUID
      
      if (error) {
        console.error(`  ❌ Error cleaning ${table}:`, error.message);
      } else {
        console.log(`  ✅ Cleaned ${table}`);
      }
    }

    // Step 3: Re-initialize hubs
    console.log('\nStep 3: Re-initializing hubs...');
    
    // First delete existing hubs
    const { error: deleteHubsError } = await supabaseAdmin
      .from('hubs')
      .delete()
      .gte('hub_number', 0);
    
    if (deleteHubsError) {
      console.error('❌ Error deleting hubs:', deleteHubsError);
    }

    // Insert fresh hubs
    const hubs = [
      { hub_number: 0, name: 'PercyTech', domain: 'percytech.com' },
      { hub_number: 1, name: 'Gnymble', domain: 'gnymble.com' },
      { hub_number: 2, name: 'PercyMD', domain: 'percymd.com' },
      { hub_number: 3, name: 'PercyText', domain: 'percytext.com' }
    ];

    const { error: insertHubsError } = await supabaseAdmin
      .from('hubs')
      .insert(hubs);

    if (insertHubsError) {
      console.error('❌ Error inserting hubs:', insertHubsError);
    } else {
      console.log('✅ Hubs re-initialized');
    }

    // Step 4: Create superadmin in auth.users
    console.log('\nStep 4: Creating fresh superadmin in auth.users...');
    
    const { data: authUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'superadmin@gnymble.com',
      password: 'SuperAdmin123!',
      email_confirm: true,
      user_metadata: {
        role: 'SUPERADMIN',
        hub_id: 1,
      },
      app_metadata: {
        role: 'SUPERADMIN',
        hub_id: 1,
      }
    });

    if (createAuthError) {
      console.error('❌ Error creating superadmin in auth:', createAuthError);
      throw createAuthError;
    }

    console.log(`✅ Created superadmin in auth.users with ID: ${authUser.user?.id}`);

    // Step 5: Create superadmin company
    console.log('\nStep 5: Creating superadmin company...');
    
    const companyId = '00000000-0000-0000-0000-000000000002';
    const { error: companyError } = await supabaseAdmin
      .from('companies')
      .insert({
        id: companyId,
        public_name: 'Gnymble Admin',
        legal_name: 'Gnymble Administration',
        hub_id: 1,
        company_account_number: 'GNYMBLE-SA-COMPANY',
        billing_email: 'superadmin@gnymble.com',
        signup_type: 'superadmin',
        is_active: true,
        payment_status: 'completed',
        payment_type: 'superadmin',
        created_by_user_id: authUser.user?.id,
        first_admin_user_id: authUser.user?.id
      });

    if (companyError) {
      console.error('❌ Error creating company:', companyError);
    } else {
      console.log('✅ Created superadmin company');
    }

    // Step 6: Create superadmin customer
    console.log('\nStep 6: Creating superadmin customer...');
    
    const customerId = '00000000-0000-0000-0000-000000000003';
    const { error: customerError } = await supabaseAdmin
      .from('customers')
      .insert({
        id: customerId,
        company_id: companyId,
        user_id: authUser.user?.id,
        billing_email: 'superadmin@gnymble.com',
        customer_type: 'superadmin',
        hub_id: 1,
        subscription_status: 'active',
        subscription_tier: 'superadmin',
        is_active: true
      });

    if (customerError) {
      console.error('❌ Error creating customer:', customerError);
    } else {
      console.log('✅ Created superadmin customer');
    }

    // Step 7: Create superadmin profile
    console.log('\nStep 7: Creating superadmin profile...');
    
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authUser.user?.id,
        email: 'superadmin@gnymble.com',
        account_number: 'GNYMBLE-SA001',
        hub_id: 1,
        first_name: 'Super',
        last_name: 'Admin',
        mobile_phone_number: '+15551234567',
        role: 'SUPERADMIN',
        signup_type: 'superadmin',
        company_admin: true,
        company_admin_since: new Date().toISOString(),
        verification_setup_completed: true,
        verification_setup_completed_at: new Date().toISOString(),
        payment_status: 'completed',
        is_active: true,
        company_id: companyId,
        customer_id: customerId
      });

    if (profileError) {
      console.error('❌ Error creating profile:', profileError);
    } else {
      console.log('✅ Created superadmin profile');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 DATABASE RESET COMPLETE!');
    console.log('='.repeat(50));
    console.log('\n✅ Database has been completely wiped and re-initialized');
    console.log('✅ Superadmin user created successfully');
    console.log('\n📧 Login credentials:');
    console.log('   Email: superadmin@gnymble.com');
    console.log('   Password: SuperAdmin123!');
    console.log('\n🔗 Login at: http://localhost:3000/login');
    console.log('   Or use dev mode: http://localhost:3001/?superadmin=dev123');

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the nuclear option
nukeEverything();