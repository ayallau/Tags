import crypto from "crypto";
import type { Types } from "mongoose";
import PasswordResetToken from "../models/PasswordResetToken.js";

export async function createResetToken(userId: Types.ObjectId, hoursValid = 1) {
  // מחיקת טוקנים ישנים של המשתמש
  await PasswordResetToken.deleteMany({ userId });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + hoursValid * 60 * 60 * 1000);

  const resetToken = new PasswordResetToken({
    userId,
    token,
    expiresAt,
  });

  await resetToken.save();
  return { token, expiresAt };
}

export async function findValidToken(token: string) {
  return await PasswordResetToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
    usedAt: null,
  }).populate("userId");
}

export async function markTokenAsUsed(token: string) {
  const result = await PasswordResetToken.findOneAndUpdate(
    { token, usedAt: null },
    { usedAt: new Date() },
    { new: true }
  );
  return !!result;
}