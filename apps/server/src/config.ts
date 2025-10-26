// apps/server/src/config.ts
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export interface AppConfig {
  readonly MONGO_URI: string;
  readonly PORT_HTTP: number;
  readonly PORT_HTTPS: number;
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
  readonly SSL_CERT_PATH: string;
  readonly SSL_KEY_PATH: string;
  readonly SSL_ENABLED: boolean;
  readonly PROTOCOL: "http" | "https";
}

// Single source of truth for SSL - only SSL_ENABLED determines protocol
const isHttps = process.env.SSL_ENABLED === "true";
// Support deprecated SERVER_PROTOCOL for backwards compatibility
const isHttpsLegacy = process.env.SERVER_PROTOCOL === "https";

const config: AppConfig = {
  // Secrets
  MONGO_URI: process.env.MONGO_URI ?? "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? "",
  PASSWORD_PEPPER: process.env.PASSWORD_PEPPER ?? "",
  COOKIE_KEY: process.env.COOKIE_KEY ?? "",

  // Config - ports are constants
  PORT_HTTP: 3001,
  PORT_HTTPS: 3443,
  get PORT() {
    return isHttps || isHttpsLegacy ? this.PORT_HTTPS : this.PORT_HTTP;
  },

  // Non-secret config - can be overridden via env if needed
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) || 12,

  // Dynamic client URLs based on protocol
  get CLIENT_ORIGIN() {
    return isHttps || isHttpsLegacy
      ? "https://localhost:5174"
      : "http://localhost:5173";
  },
  get CLIENT_URL() {
    return isHttps || isHttpsLegacy
      ? "https://localhost:5174"
      : "http://localhost:5173";
  },

  SSL_CERT_PATH: path.resolve("certs/server.crt"),
  SSL_KEY_PATH: path.resolve("certs/server.key"),
  SSL_ENABLED: isHttps || isHttpsLegacy,
  PROTOCOL: isHttps || isHttpsLegacy ? "https" : "http",
} as const;

export default config;
