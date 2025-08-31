import type { Database } from './database'

export type TempSignup = Database['public']['Tables']['temp_signups']['Row']
export type VerificationAttempt = Database['public']['Tables']['verification_attempts']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Membership = Database['public']['Tables']['memberships']['Row']

export interface AuthContextType {
  user: UserProfile | null
  session: any | null
  loading: boolean
  signOut: () => Promise<void>
  signInWithPhone: (phone: string, hubId: number) => Promise<void>
  verifyOTP: (token: string, tempSignupId: string) => Promise<void>
  refreshUser: () => Promise<void>
}

export interface SignupData {
  hub_id: number
  company_name: string
  first_name: string
  last_name: string
  mobile_phone_number: string
  email: string
  auth_method?: 'sms' | 'email'
}

export interface VerificationData {
  temp_signup_id: string
  verification_code: string
}