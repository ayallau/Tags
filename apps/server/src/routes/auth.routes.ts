import { Router, type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithProvider,
  forgotPassword,
  resetPassword,
  logout,
  globalLogout,
} from "../controllers/authController.js";

const router = Router();

// Email+Password
router.post("/login", loginWithEmail);

// Register a new user with email/password
router.post("/register", registerWithEmail);

// Password Reset Routes

// Request password reset - sends email with reset token
router.post(
  "/forgot-password",
  // Basic validation middleware
  (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { email } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Basic rate limiting check (simple in-memory store for demo)
    const clientIP = req.ip || req.socket.remoteAddress;
    console.log(
      `[${new Date().toISOString()}] Password reset request from IP: ${clientIP} for email: ${email}`,
    );

    next();
  },
  forgotPassword,
);

// Reset password with token
router.post(
  "/reset-password",
  // Basic validation middleware
  (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { token, newPassword } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Reset token is required" });
    }

    if (
      !newPassword ||
      typeof newPassword !== "string" ||
      newPassword.length < 6
    ) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const clientIP = req.ip || req.socket.remoteAddress;
    console.log(
      `[${new Date().toISOString()}] Password reset attempt from IP: ${clientIP} with token: ${token.substring(0, 8)}...`,
    );

    next();
  },
  resetPassword,
);

// Google OAuth
router.get(
  "/google",
  (req: Request, _res: Response, next: NextFunction) => {
    console.log(
      `[${new Date().toISOString()}] Requesting Google OAuth - IP: ${req.ip}`,
    );
    next();
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] User Details:`, req.user);
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication failed" });
      }
      const result = loginWithProvider(req.user, "google");

      // TODO: בעתיד - הוסף שליחת refresh token בעוגייה:
      // if (result.refreshToken) {
      //   res.cookie('refreshToken', result.refreshToken, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',
      //     sameSite: 'strict',
      //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      //   });
      // }

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

// Logout Routes
// TODO: בעתיד - הוסף middleware לבדיקת refresh token בעוגיות

// Simple logout - client-side token removal + cookie clearing
// TODO: לשנות ל-middleware שמוחק גם refresh token מעוגיות
router.post("/logout", logout);

// Global logout - invalidate all user tokens + clear cookies
// TODO: לשנות ל-middleware שמטפל גם ב-refresh tokens בעוגיות
router.post("/logout/global", globalLogout);

export default router;
