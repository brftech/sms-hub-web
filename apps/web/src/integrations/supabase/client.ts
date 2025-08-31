// Create Supabase client with Vite environment variables
import { createSupabaseClient } from '@sms-hub/supabase';
export type { Database } from '@sms-hub/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);