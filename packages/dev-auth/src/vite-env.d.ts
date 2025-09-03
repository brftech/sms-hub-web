/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_SUPERADMIN?: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

