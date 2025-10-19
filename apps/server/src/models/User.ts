import mongoose, { type Document, type InferSchemaType } from "mongoose";

// Google Provider Schema
const googleSchema = new mongoose.Schema(
  {
    id: { type: String, required: false, index: true },
    email: { type: String, required: false },
  },
  { _id: false },
);

// User Schema
const userSchema = new mongoose.Schema(
  {
    emailLower: { type: String, unique: true, index: true, required: false },
    passwordHash: { type: String, required: false },
    passwordVersion: { type: Number, default: 0, required: true },
    tokenVersion: { type: Number, default: 0, required: true },
    roles: { type: [String], default: ["user"], required: true },
    providers: {
      type: {
        google: { type: googleSchema, required: false },
      },
      required: false,
    },
  },
  { timestamps: true },
);

// Infer types from schema
export type UserDoc = InferSchemaType<typeof userSchema> & Document;

// User Document Interface (for compatibility)
export interface IUser extends Document {
  emailLower?: string;
  passwordHash?: string;
  passwordVersion: number;
  tokenVersion: number;
  roles: string[];
  providers?: {
    google?: {
      id?: string;
      email?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
