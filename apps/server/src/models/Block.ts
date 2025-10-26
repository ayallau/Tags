import mongoose, {
  type Document,
  type InferSchemaType,
  type Types,
} from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Unique composite index
blockSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

// Infer types from schema
export type BlockDoc = InferSchemaType<typeof blockSchema> & Document;

// Block Document Interface
export interface IBlock extends Document {
  userId: Types.ObjectId;
  targetUserId: Types.ObjectId;
  createdAt: Date;
}

const BlockModel = mongoose.model<IBlock>("Block", blockSchema);

export default BlockModel;
