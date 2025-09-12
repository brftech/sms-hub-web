import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    console.log("🔥 NUCLEAR RESET - Starting complete database cleanup");

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { 
        auth: { persistSession: false },
        db: { schema: 'public' }
      }
    );

    const results = {
      authUsers: { deleted: 0, errors: [] },
      tables: {},
      hubs: { success: false },
      superadmin: { success: false }
    };

    // Step 1: Try to clean auth users (may fail due to schema issues)
    console.log("Step 1: Attempting to clean auth.users...");
    try {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      if (authUsers?.users) {
        for (const user of authUsers.users) {
          try {
            await supabaseAdmin.auth.admin.deleteUser(user.id);
            results.authUsers.deleted++;
            console.log(`  Deleted auth user: ${user.email}`);
          } catch (err) {
            results.authUsers.errors.push(`${user.email}: ${err.message}`);
          }
        }
      }
    } catch (err) {
      console.log("  ⚠️ Auth API unavailable, skipping auth.users cleanup");
      results.authUsers.errors.push(`Auth API error: ${err.message}`);
    }

    // Step 2: Clean tables with foreign key dependencies handled
    console.log("Step 2: Cleaning database tables...");
    
    // First, clean verifications table since it references user_profiles
    const { error: verificationsError } = await supabaseAdmin
      .from('verifications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (verificationsError) {
      results.tables['verifications'] = `Error: ${verificationsError.message}`;
    } else {
      results.tables['verifications'] = 'Cleaned';
      console.log("  ✅ Cleaned verifications");
    }

    // Now clean other tables in dependency order
    const tablesToClean = [
      'messages',
      'contacts', 
      'phone_numbers',
      'campaigns',
      'brands',
      'leads',
      'user_profiles',
      'customers',
      'companies'
    ];

    for (const table of tablesToClean) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        results.tables[table] = `Error: ${error.message}`;
        console.log(`  ❌ Error cleaning ${table}: ${error.message}`);
      } else {
        results.tables[table] = 'Cleaned';
        console.log(`  ✅ Cleaned ${table}`);
      }
    }

    // Step 3: Re-initialize hubs
    console.log("Step 3: Re-initializing hubs...");
    
    // Delete and re-insert hubs
    await supabaseAdmin.from('hubs').delete().gte('hub_number', 0);
    
    const hubs = [
      { hub_number: 0, name: 'PercyTech', domain: 'percytech.com' },
      { hub_number: 1, name: 'Gnymble', domain: 'gnymble.com' },
      { hub_number: 2, name: 'PercyMD', domain: 'percymd.com' },
      { hub_number: 3, name: 'PercyText', domain: 'percytext.com' }
    ];

    const { error: hubsError } = await supabaseAdmin.from('hubs').insert(hubs);
    
    if (hubsError) {
      results.hubs = { success: false, error: hubsError.message };
      console.log(`  ❌ Error with hubs: ${hubsError.message}`);
    } else {
      results.hubs = { success: true };
      console.log("  ✅ Hubs re-initialized");
    }

    // Step 4: Create superadmin records
    console.log("Step 4: Creating superadmin records...");
    
    let authUserId = '00000000-0000-0000-0000-000000000001';
    
    // Try to create in auth.users (may fail)
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.createUser({
        email: 'superadmin@gnymble.com',
        password: 'SuperAdmin123!',
        email_confirm: true,
        user_metadata: { role: 'SUPERADMIN', hub_id: 1 },
        app_metadata: { role: 'SUPERADMIN', hub_id: 1 }
      });
      
      if (authUser?.user?.id) {
        authUserId = authUser.user.id;
        console.log(`  ✅ Created auth user with ID: ${authUserId}`);
      }
    } catch (err) {
      console.log(`  ⚠️ Could not create auth user: ${err.message}`);
      console.log("  Using fallback UUID for profile");
    }

    // Create company
    const companyId = '00000000-0000-0000-0000-000000000002';
    await supabaseAdmin.from('companies').insert({
      id: companyId,
      public_name: 'Gnymble Admin',
      legal_name: 'Gnymble Administration',
      hub_id: 1,
      company_account_number: 'GNYMBLE-SA-COMPANY',
      billing_email: 'superadmin@gnymble.com',
      signup_type: 'superadmin',
      is_active: true,
      payment_status: 'completed',
      payment_type: 'superadmin'
    });

    // Create customer
    const customerId = '00000000-0000-0000-0000-000000000003';
    await supabaseAdmin.from('customers').insert({
      id: customerId,
      company_id: companyId,
      billing_email: 'superadmin@gnymble.com',
      customer_type: 'superadmin',
      hub_id: 1,
      subscription_status: 'active',
      subscription_tier: 'superadmin',
      is_active: true
    });

    // Create user profile
    await supabaseAdmin.from('user_profiles').insert({
      id: authUserId,
      email: 'superadmin@gnymble.com',
      account_number: 'GNYMBLE-SA001',
      hub_id: 1,
      first_name: 'Super',
      last_name: 'Admin',
      mobile_phone_number: '+15551234567',
      role: 'SUPERADMIN',
      signup_type: 'superadmin',
      company_admin: true,
      verification_setup_completed: true,
      payment_status: 'completed',
      is_active: true,
      company_id: companyId,
      customer_id: customerId
    });

    results.superadmin = { success: true, authUserId };
    console.log("  ✅ Superadmin records created");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database reset complete",
        results,
        instructions: {
          auth: results.authUsers.errors.length > 0 
            ? "Auth API has issues. Use the authenticate-user function to create auth user after this."
            : "Superadmin created in auth.users",
          login: {
            email: "superadmin@gnymble.com",
            password: "SuperAdmin123!",
            devMode: "http://localhost:3001/?superadmin=dev123"
          }
        }
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

  } catch (error) {
    console.error("❌ Fatal error in nuclear-reset:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});