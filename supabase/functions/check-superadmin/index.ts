import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if superadmin user exists
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      throw new Error(`Failed to list users: ${usersError.message}`)
    }

    const superadminUser = users.users.find(user => user.email === 'superadmin@gnymble.com')
    
    if (!superadminUser) {
      // Create superadmin user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: 'superadmin@gnymble.com',
        password: 'SuperAdmin123!',
        email_confirm: true,
        user_metadata: {
          first_name: 'Super',
          last_name: 'Admin',
          role: 'superadmin'
        }
      })

      if (createError) {
        throw new Error(`Failed to create superadmin user: ${createError.message}`)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Superadmin user created successfully',
          user: newUser.user
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      // Reset password for existing superadmin user
      const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        superadminUser.id,
        {
          password: 'SuperAdmin123!',
          email_confirm: true
        }
      )

      if (updateError) {
        throw new Error(`Failed to reset superadmin password: ${updateError.message}`)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Superadmin password reset successfully',
          user: updateData.user
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
