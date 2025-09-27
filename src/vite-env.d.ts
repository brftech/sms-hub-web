/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PAYMENT_LINK: string;
  readonly VITE_STRIPE_PAYMENT_LINK_STARTER?: string;
  readonly VITE_STRIPE_PAYMENT_LINK_CORE?: string;
  readonly VITE_STRIPE_PAYMENT_LINK_ELITE?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
