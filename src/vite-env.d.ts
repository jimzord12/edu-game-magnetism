/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_STORAGE_KEY: string | undefined;
  // add other env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
