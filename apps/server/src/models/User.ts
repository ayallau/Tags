import mongoose, {
  type Document,
  type InferSchemaType,
  type Types,
} from "mongoose";

// Google Provider Schema
const googleSchema = new mongoose.Schema(
  {
    id: { type: String, required: false, index: true },
    email: { type: String, required: false },
  },
  { _id: false }
);

// User Schema
const userSchema = new mongoose.Schema(
  {
    // Auth fields
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
    // Profile fields
    username: { type: String, unique: true, index: true, sparse: true },
    avatarUrl: { type: String, required: false },
    bio: { type: String, maxlength: 500, required: false },
    location: { type: String, required: false },
    photos: [{ type: String }],
    // Tags reference
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    // Status fields
    isOnline: { type: Boolean, default: false, index: true },
    lastVisitAt: { type: Date, required: false, index: true },
  },
  { timestamps: true }
);

// Infer types from schema
export type UserDoc = InferSchemaType<typeof userSchema> & Document;

// User Document Interface (for compatibility)
export interface IUser extends Document {
  // Auth fields
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
  // Profile fields
  username?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  photos: Types.Array<string>;
  tags: Types.Array<Types.ObjectId>;
  // Status fields
  isOnline: boolean;
  lastVisitAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
