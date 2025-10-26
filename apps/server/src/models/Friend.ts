import mongoose, {
  type Document,
  type InferSchemaType,
  type Types,
} from "mongoose";

// Friend Schema
const friendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    friendUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    canNotify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Composite unique index on (userId, friendUserId)
friendSchema.index({ userId: 1, friendUserId: 1 }, { unique: true });

// Index for listing friends by user (sorted by createdAt desc)
friendSchema.index({ userId: 1, createdAt: -1 });

// Infer types from schema
export type FriendDoc = InferSchemaType<typeof friendSchema> & Document;

// Friend Document Interface
export interface IFriend extends Document {
  userId: Types.ObjectId;
  friendUserId: Types.ObjectId;
  canNotify: boolean;
  createdAt: Date;
}

const FriendModel = mongoose.model<IFriend>("Friend", friendSchema);

export default FriendModel;
