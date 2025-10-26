import mongoose, {
  type Document,
  type InferSchemaType,
  type Types,
} from "mongoose";

// Bookmark Schema
const bookmarkSchema = new mongoose.Schema(
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
    remark: { type: String, maxlength: 500, required: false },
  },
  { timestamps: true }
);

// Composite unique index on (userId, targetUserId)
bookmarkSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

// Index for listing bookmarks by user (sorted by createdAt desc)
bookmarkSchema.index({ userId: 1, createdAt: -1 });

// Infer types from schema
export type BookmarkDoc = InferSchemaType<typeof bookmarkSchema> & Document;

// Bookmark Document Interface
export interface IBookmark extends Document {
  userId: Types.ObjectId;
  targetUserId: Types.ObjectId;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkModel = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);

export default BookmarkModel;
