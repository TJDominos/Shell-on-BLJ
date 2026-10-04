/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAIN_SITE_URL?: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
