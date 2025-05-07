import { cleanEnv, num, str } from 'envalid';

export default function checkEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: num(),
    FALLBACK_LANGUAGE: str(),
    OWN_URL: str(),
    DB_URL: str(),
  });
}
