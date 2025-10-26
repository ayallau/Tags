import type { CookieOptions } from "express";
import config from "../config.js";

/**
 * Get cookie options for authentication cookies (refresh tokens)
 *
 * @param isSecure - Whether to set the secure flag (true for HTTPS/production)
 * @returns CookieOptions for setting authentication cookies
 */
export function getAuthCookieOptions(isSecure: boolean): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecure,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };
}

/**
 * Get cookie options for clearing authentication cookies
 * Must match the options used when setting the cookie
 *
 * @param isSecure - Whether to use secure flag (true for HTTPS/production)
 * @returns CookieOptions for clearing authentication cookies
 */
export function getAuthClearCookieOptions(isSecure: boolean): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecure,
    path: "/",
  };
}

/**
 * Determine if cookies should be secure based on environment
 * Cookies are secure in production or when SSL is enabled
 *
 * @returns true if cookies should be sent over HTTPS only
 */
export function shouldUseSecureCookies(): boolean {
  return process.env.NODE_ENV === "production" || config.SSL_ENABLED;
}

/**
 * Get cookie options for setting authentication cookies (auto-detects security)
 * Uses shouldUseSecureCookies() to determine if secure flag should be set
 *
 * @returns CookieOptions for setting authentication cookies
 */
export function getAuthCookieOptionsAuto(): CookieOptions {
  return getAuthCookieOptions(shouldUseSecureCookies());
}

/**
 * Get cookie options for clearing authentication cookies (auto-detects security)
 * Uses shouldUseSecureCookies() to determine if secure flag should be set
 *
 * @returns CookieOptions for clearing authentication cookies
 */
export function getAuthClearCookieOptionsAuto(): CookieOptions {
  return getAuthClearCookieOptions(shouldUseSecureCookies());
}
