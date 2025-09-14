interface ImportMetaEnv {
  readonly MODE?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}