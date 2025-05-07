declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    FALLBACK_LANGUAGE: string;
    OWN_URL: string;
    DB_URL: string;
  }
}
