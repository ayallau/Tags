import dotenv from "dotenv";
dotenv.config();

export interface AppConfig {
  readonly MONGO_URI: string;
  readonly PORT: number;
  readonly BCRYPT_ROUNDS: number;
  readonly CLIENT_ORIGIN: string;
  readonly CLIENT_URL: string;
  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly JWT_ACCESS_SECRET: string;
  readonly JWT_REFRESH_SECRET: string;
  readonly PASSWORD_PEPPER: string;
  readonly COOKIE_KEY: string;
}

const config: AppConfig = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: Number(process.env.PORT) || 5000,
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS ?? 12),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  CLIENT_URL: process.env.CLIENT_URL,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER,
  COOKIE_KEY: process.env.COOKIE_KEY,
} as const;

export default config;
