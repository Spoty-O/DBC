/// <reference types="vite/client" />

declare module "*.glsl" {
  const source: string;
  export default source;
}

interface ImportMetaEnv {
  readonly VITE_BE_URL?: string;
  readonly VITE_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
