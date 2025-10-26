import type { Request, Response, NextFunction } from "express";
import { verifyPassword, hashPassword } from "../utils/passwords.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/tokenService.js";
import { findByEmailLower, createUser } from "../services/userService.js";
import User from "../models/User.js";
import {
  createResetToken,
  findValidToken,
  markTokenAsUsed,
} from "../services/PasswordResetTokenService.js";
import {
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
} from "../services/emailService.js";
import type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  MessageResponseDto,
} from "../dtos/index.js";
import type { IUser } from "../models/User.js";
import type { Types } from "mongoose";
import {
  getAuthCookieOptionsAuto,
  getAuthClearCookieOptionsAuto,
} from "../lib/cookies.js";

export async function loginWithEmail(
  req: Request<Record<string, never>, AuthResponseDto, LoginDto>,
  res: Response<AuthResponseDto | { error: string }>,
  next: NextFunction
): Promise<any> {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const { email, password } = req.body;
    const user = await findByEmailLower(email);
    const ok = user && (await verifyPassword(password, user.passwordHash!));
    if (!ok) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const accessToken = createAccessToken(user, "email");
    const refreshToken = createRefreshToken(user);

    // Set refresh token in HttpOnly cookie
    res.cookie("tags_refresh_token", refreshToken, getAuthCookieOptionsAuto());

    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function registerWithEmail(
  req: Request<Record<string, never>, AuthResponseDto, RegisterDto>,
  res: Response<AuthResponseDto | { error: string }>,
  next: NextFunction
): Promise<any> {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const { email, password } = req.body;
    if (await findByEmailLower(email)) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const passwordHash = await hashPassword(password);
    const newUser = await createUser({ email, passwordHash });
    const accessToken = createAccessToken(newUser, "email");
    const refreshToken = createRefreshToken(newUser);

    // Set refresh token in HttpOnly cookie
    res.cookie("tags_refresh_token", refreshToken, getAuthCookieOptionsAuto());

    console.log(
      `[${new Date().toISOString()}] User registered successfully - email: ${email}`
    );

    res.status(201).json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export function loginWithProvider(
  user: IUser,
  provider: string
): AuthResponseDto {
  const accessToken = createAccessToken(user, provider);
  return { accessToken };
}

/**
 * Handles password reset request - creates token and sends email
 */
export async function forgotPassword(
  req: Request<Record<string, never>, MessageResponseDto, ForgotPasswordDto>,
  res: Response<MessageResponseDto | { error: string }>,
  next: NextFunction
): Promise<any> {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const { email } = req.body;

    // Input validation
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    // Search for user
    const user = await findByEmailLower(email);
    if (!user) {
      // For security reasons - don't reveal that user doesn't exist
      // Return success message even if user is not found
      console.log(
        `[${new Date().toISOString()}] Password reset requested for non-existent email: ${email}`
      );
      return res.json({
        message:
          "If this email exists in our system, you will receive a password reset link",
      });
    }

    // Create password reset token
    const { token } = await createResetToken(user._id as Types.ObjectId, 1); // תוקף של שעה

    // שליחת אימייל עם הטוקן
    const emailResult = await sendPasswordResetEmail(
      user.emailLower!,
      token,
      null // User model doesn't have name field
    );

    if (!emailResult.success) {
      console.error(
        `[${new Date().toISOString()}] Failed to send reset email to ${email}:`,
        emailResult.error
      );
      return res.status(500).json({ error: "Failed to send reset email" });
    }

    console.log(
      `[${new Date().toISOString()}] Password reset email sent successfully to ${email}`
    );

    res.json({
      message:
        "If this email exists in our system, you will receive a password reset link",
      // בפיתוח - מחזירים את הטוקן לבדיקות
      ...(process.env.NODE_ENV === "development" && { token }),
    });
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error in forgotPassword:`,
      err
    );
    next(err);
  }
}

/**
 * מטפל באיפוס סיסמה עם טוכן תקף
 */
export async function resetPassword(
  req: Request<Record<string, never>, MessageResponseDto, ResetPasswordDto>,
  res: Response<MessageResponseDto | { error: string }>,
  next: NextFunction
): Promise<any> {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const { token, newPassword } = req.body;

    // Input validation
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

    // חיפוש ואימות הטוקן
    const tokenData = await findValidToken(token);
    if (!tokenData) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // סימון הטוקן כמשומש (למניעת שימוש חוזר)
    const tokenMarked = await markTokenAsUsed(token);
    if (!tokenMarked) {
      return res.status(400).json({ error: "Token has already been used" });
    }

    // המצאת המשתמש המלא
    const populatedToken = tokenData as { userId: { emailLower?: string } };
    if (!populatedToken.userId?.emailLower) {
      return res.status(400).json({ error: "Invalid token data" });
    }
    const user = await findByEmailLower(populatedToken.userId.emailLower);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // יצירת hash לסיסמה החדשה
    const newPasswordHash = await hashPassword(newPassword);

    // עדכון הסיסמה ו-passwordVersion (לביטול JWT tokens קיימים)
    await user.updateOne({
      passwordHash: newPasswordHash,
      $inc: { passwordVersion: 1 }, // מגדיל את גרסת הסיסמה לביטול tokens ישנים
    });

    // שליחת אימייל אישור
    await sendPasswordResetConfirmationEmail(
      user.emailLower!,
      null // User model doesn't have name field
    );

    console.log(
      `[${new Date().toISOString()}] Password reset successfully for user ${String(user._id)}`
    );

    res.json({
      message:
        "Password reset successfully. Please log in with your new password.",
      redirectTo: "/login", // מכוון את הצד הלקוח לדף ההתחברות
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error in resetPassword:`, err);
    next(err);
  }
}

/**
 * Simple logout - deletes refresh token cookie and bumps token version
 */
export async function logout(
  req: Request,
  res: Response<MessageResponseDto>,
  next: NextFunction
): Promise<void> {
  try {
    // Clear refresh token from cookies
    res.clearCookie("tags_refresh_token", getAuthClearCookieOptionsAuto());

    // If user is authenticated, invalidate their tokens
    if (req.user) {
      await (req.user as IUser).updateOne({
        $inc: { tokenVersion: 1 },
      });

      console.log(
        `[${new Date().toISOString()}] User logged out - tokenVersion incremented for user ${String(req.user._id)}`
      );
    }

    res.json({
      message: "Logged out successfully",
      action: "clearToken", // Instruct client to delete accessToken from localStorage
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error in logout:`, err);
    next(err);
  }
}

/**
 * Refresh access token using refresh token from cookie with token rotation
 */
export async function refreshToken(
  req: Request,
  res: Response<AuthResponseDto | { error: string }>,
  next: NextFunction
): Promise<any> {
  try {
    const refreshToken = req.cookies?.tags_refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Find user and verify token version
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check if token version matches (for logout invalidation)
    if ((user.tokenVersion ?? 0) !== (payload.tv ?? -1)) {
      return res.status(401).json({ error: "Token revoked due to logout" });
    }

    // Token rotation: increment tokenVersion before creating new tokens
    // This invalidates the old refresh token
    await user.updateOne({
      $inc: { tokenVersion: 1 },
    });

    // Reload user to get updated tokenVersion
    const updatedUser = await User.findById(user._id);
    if (!updatedUser) {
      return res.status(401).json({ error: "User not found" });
    }

    // Create new tokens with updated tokenVersion
    const newAccessToken = createAccessToken(updatedUser, "refresh");
    const newRefreshToken = createRefreshToken(updatedUser);

    // Update refresh token in cookie
    res.cookie(
      "tags_refresh_token",
      newRefreshToken,
      getAuthCookieOptionsAuto()
    );

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    ) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }
    next(err);
  }
}

/**
 * Global logout - invalidates all user tokens
 * TODO: In the future - add refresh token deletion from cookies and invalidate all refresh tokens in database
 */
export async function globalLogout(
  req: Request,
  res: Response<MessageResponseDto | { error: string }>,
  next: NextFunction
): Promise<any> {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    // Get user details from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No valid token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Search for user במסד הנתונים
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Increment tokenVersion to invalidate all existing tokens
    await user.updateOne({
      $inc: { tokenVersion: 1 },
    });

    // Clear refresh token from cookies
    res.clearCookie("tags_refresh_token", getAuthClearCookieOptionsAuto());

    console.log(
      `[${new Date().toISOString()}] Global logout for user ${String(user._id)} - tokenVersion incremented`
    );

    res.json({
      message: "All sessions have been logged out successfully",
      action: "clearToken",
    });
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    ) {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error(`[${new Date().toISOString()}] Error in globalLogout:`, err);
    next(err);
  }
}
