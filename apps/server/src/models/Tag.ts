import mongoose, { type Document, type InferSchemaType } from "mongoose";

// Tag Schema
const tagSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      index: true, // Text index
    },
  },
  { timestamps: true }
);

// Normalize slug before save
tagSchema.pre("save", function (next) {
  if (this.isModified("slug") && this.slug) {
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  next();
});

// Infer types from schema
export type TagDoc = InferSchemaType<typeof tagSchema> & Document;

// Tag Document Interface
export interface ITag extends Document {
  slug: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagModel = mongoose.model<ITag>("Tag", tagSchema);

export default TagModel;
