import mongoose, {
  type Document,
  type InferSchemaType,
  type Types,
} from "mongoose";

const hiddenSchema = new mongoose.Schema(
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
hiddenSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

// Infer types from schema
export type HiddenDoc = InferSchemaType<typeof hiddenSchema> & Document;

// Hidden Document Interface
export interface IHidden extends Document {
  userId: Types.ObjectId;
  targetUserId: Types.ObjectId;
  createdAt: Date;
}

const HiddenModel = mongoose.model<IHidden>("Hidden", hiddenSchema);

export default HiddenModel;
