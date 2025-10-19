import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/tokenService.js";
import User from "../models/User.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "User not found" });

    // בדיקת פסילת טוקן לפי passwordVersion
    if ((user.passwordVersion ?? 0) !== (payload.pv ?? -1)) {
      return res.status(401).json({ error: "Token revoked due to password change" });
    }

    // בדיקת פסילת טוקן לפי tokenVersion (logout)
    if ((user.tokenVersion ?? 0) !== (payload.tv ?? -1)) {
      return res.status(401).json({ error: "Token revoked due to logout" });
    }

    req.user = user;
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
