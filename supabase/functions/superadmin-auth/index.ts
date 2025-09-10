import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { email, password } = await req.json()

    // Check if this is the superadmin email
    if (email !== 'superadmin@sms-hub.com') {
      return new Response(
        JSON.stringify({ error: 'Invalid superadmin credentials' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For superadmin, we'll use a special password check
    // In production, this should be a secure password stored in environment variables
    const superadminPassword = Deno.env.get('SUPERADMIN_PASSWORD') || 'superadmin123!'
    
    if (password !== superadminPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid superadmin credentials' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create a mock superadmin user profile
    // In production, this would come from the database
    const superadminUser = {
      id: 'superadmin-001',
      email: 'superadmin@sms-hub.com',
      phone: '+15551234567',
      first_name: 'Super',
      last_name: 'Admin',
      company_id: null,
      hub_id: 1, // PercyTech hub
      role: 'SUPERADMIN',
      signup_type: 'superadmin',
      company_admin: true,
      company_admin_since: new Date().toISOString(),
      payment_status: 'completed',
      subscription_status: 'active',
      account_onboarding_step: 'completed',
      platform_onboarding_step: 'completed',
      verification_setup_completed: true,
      verification_setup_completed_at: new Date().toISOString(),
      last_login_method: 'password',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Create a simple token for the superadmin user
    const token = createSuperadminToken(superadminUser.id)

    return new Response(
      JSON.stringify({ 
        success: true,
        user: superadminUser,
        token: token,
        message: 'Superadmin authentication successful'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Superadmin auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper function to create a superadmin token
function createSuperadminToken(userId: string) {
  // For now, we'll return a simple token
  // In production, you'd want to use Supabase's JWT creation
  const tokenData = {
    sub: userId,
    role: 'SUPERADMIN',
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000),
    iss: 'supabase'
  }
  
  // This is a simplified approach - in production you'd use proper JWT signing
  return btoa(JSON.stringify(tokenData))
}
