import mongoose, { type Document, type InferSchemaType, type Types } from "mongoose";

// PasswordResetToken Schema
const passwordResetTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    used: { type: Boolean, default: false, required: true },
    usedAt: { type: Date, required: false },
  },
  { timestamps: true },
);

// Infer types from schema
export type PasswordResetTokenDoc = InferSchemaType<typeof passwordResetTokenSchema> & Document;

// PasswordResetToken Document Interface (for compatibility)
export interface IPasswordResetToken extends Document {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  used: boolean;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetTokenModel = mongoose.model<IPasswordResetToken>("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetTokenModel;
