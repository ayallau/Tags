import jwt from "jsonwebtoken";
import config from "../config.js";
import type { IUser } from "../models/User.js";
import type { AccessTokenPayload, RefreshTokenPayload, DecodedToken } from "../types/jwt.js";

export function createAccessToken(user: IUser, provider: string): string {
  const payload: AccessTokenPayload = {
    sub: String(user._id),
    email: user.emailLower || "",
    roles: user.roles || ["user"],
    provider,
    pv: user.passwordVersion || 0,
    tv: user.tokenVersion || 0,
  };

  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
    issuer: "your-app-name",
    audience: "your-app-users",
  });
}

export function verifyAccessToken(token: string): DecodedToken {
  return jwt.verify(token, config.JWT_ACCESS_SECRET, {
    issuer: "your-app-name",
    audience: "your-app-users",
  }) as DecodedToken;
}

export function createRefreshToken(user: IUser): string {
  const payload: RefreshTokenPayload = {
    sub: String(user._id),
    type: "refresh",
    tv: user.tokenVersion || 0,
  };

  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
    issuer: "your-app-name",
    audience: "your-app-users",
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload & { iat: number; exp: number } {
  return jwt.verify(token, config.JWT_REFRESH_SECRET, {
    issuer: "your-app-name",
    audience: "your-app-users",
  }) as RefreshTokenPayload & { iat: number; exp: number };
}