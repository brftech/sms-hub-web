/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_SUPERADMIN?: string
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}