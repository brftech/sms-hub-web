import { supabase } from './client'
import { SignupData, VerificationData, UserProfile } from '@sms-hub/types'

export const authService = {
  async createTempSignup(data: SignupData) {
    const { data: result, error } = await supabase
      .from('temp_signups')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return result
  },

  async verifyCode(verificationData: VerificationData) {
    const { data: attempt, error: attemptError } = await supabase
      .from('verification_attempts')
      .insert([{
        temp_signup_id: verificationData.temp_signup_id,
        verification_code: verificationData.verification_code,
        attempt_number: 1,
        is_successful: false
      }])
      .select()
      .single()

    if (attemptError) throw attemptError

    // Check if verification code matches
    const { data: tempSignup, error: tempError } = await supabase
      .from('temp_signups')
      .select('*')
      .eq('id', verificationData.temp_signup_id)
      .eq('verification_code', verificationData.verification_code)
      .single()

    if (tempError || !tempSignup) {
      throw new Error('Invalid verification code')
    }

    // Update attempt as successful
    await supabase
      .from('verification_attempts')
      .update({ is_successful: true })
      .eq('id', attempt.id)

    return tempSignup
  },

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) return null
    return profile as UserProfile
  },

  async createUserProfile(tempSignupId: string): Promise<UserProfile> {
    // Get temp signup data
    const { data: tempSignup, error: tempError } = await supabase
      .from('temp_signups')
      .select('*')
      .eq('id', tempSignupId)
      .single()

    if (tempError || !tempSignup) {
      throw new Error('Temp signup not found')
    }

    // Get hub name for account number generation
    const { data: hub, error: hubError } = await supabase
      .from('hubs')
      .select('name')
      .eq('hub_number', tempSignup.hub_id)
      .single()

    if (hubError || !hub) {
      throw new Error('Hub not found')
    }

    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: tempSignup.email,
      phone: tempSignup.mobile_phone_number,
      password: Math.random().toString(36) // Temporary password, user will set their own
    })

    if (authError || !authData.user) {
      throw authError || new Error('Failed to create user')
    }

    // Generate account number
    const { data: accountNumber, error: accountError } = await supabase
      .rpc('generate_account_number', { hub_name: hub.name })

    if (accountError) throw accountError

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        hub_id: tempSignup.hub_id,
        account_number: accountNumber,
        first_name: tempSignup.first_name,
        last_name: tempSignup.last_name,
        mobile_phone_number: tempSignup.mobile_phone_number,
        email: tempSignup.email,
        role: 'MEMBER',
        onboarding_step: 'payment'
      }])
      .select()
      .single()

    if (profileError) throw profileError

    // Clean up temp signup
    await supabase
      .from('temp_signups')
      .delete()
      .eq('id', tempSignupId)

    return profile as UserProfile
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }
}