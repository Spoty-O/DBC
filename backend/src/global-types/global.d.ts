declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: string;
    FALLBACK_LANGUAGE?: string;
    DB_URL?: string;
    OWN_URL?: string;
  }
}
