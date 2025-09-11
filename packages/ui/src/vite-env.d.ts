/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_AUTH_TOKEN?: string;
  readonly MODE: string;
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
