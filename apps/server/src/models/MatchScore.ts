import mongoose, {
  type Document,
  type InferSchemaType,
  type Types,
} from "mongoose";

// MatchScore Schema
const matchScoreSchema = new mongoose.Schema(
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
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    sharedTagsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    computedAt: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
  },
  {
    timestamps: false, // Use custom computedAt instead
  }
);

// Compound unique index: each pair can only exist once
matchScoreSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

// Compound index for sorted queries by score
matchScoreSchema.index({ userId: 1, score: -1 });

// Infer types from schema
export type MatchScoreDoc = InferSchemaType<typeof matchScoreSchema> & Document;

// MatchScore Document Interface
export interface IMatchScore extends Document {
  userId: Types.ObjectId;
  targetUserId: Types.ObjectId;
  score: number;
  sharedTagsCount: number;
  computedAt: Date;
}

const MatchScoreModel = mongoose.model<MatchScoreDoc>(
  "MatchScore",
  matchScoreSchema
);

export default MatchScoreModel;
