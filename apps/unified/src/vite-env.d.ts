/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_STRIPE_PRICE_STARTER: string
  readonly VITE_STRIPE_PRICE_PROFESSIONAL: string
  readonly VITE_STRIPE_PRICE_ENTERPRISE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
