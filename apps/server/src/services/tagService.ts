import TagModel from "../models/Tag.js";
import type { ITag } from "../models/Tag.js";
import type {
  CreateTagDto,
  UpdateTagDto,
  TagQueryDto,
  TagSearchDto,
  TagListResponse,
  TagResponse,
} from "../dtos/tag.dto.js";
import { Types } from "mongoose";

/**
 * Normalize label to slug
 */
export function normalizeSlug(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Create a new tag
 */
export async function createTag(data: CreateTagDto): Promise<ITag> {
  const slug = normalizeSlug(data.label);

  // Check if tag with this slug already exists
  const existing = await TagModel.findOne({ slug });
  if (existing) {
    throw new Error("Tag with this label already exists");
  }

  const tag = new TagModel({ label: data.label, slug });
  await tag.save();
  return tag;
}

/**
 * List tags with cursor-based pagination
 */
export async function listTags(params: TagQueryDto): Promise<TagListResponse> {
  const { query = "", limit, cursor } = params;

  const filter: Record<string, any> = {};

  // Search by query
  if (query && query.length >= 2) {
    filter.$or = [
      { label: { $regex: query, $options: "i" } },
      { slug: { $regex: query, $options: "i" } },
    ];
  }

  // Cursor-based pagination
  if (cursor) {
    filter._id = { $gt: cursor };
  }

  const tags = await TagModel.find(filter)
    .select("_id slug label createdAt updatedAt")
    .sort({ _id: 1 })
    .limit(limit + 1);

  const hasMore = tags.length > limit;
  const results = hasMore ? tags.slice(0, limit) : tags;

  return {
    tags: results.map((tag) => ({
      _id: String(tag._id),
      slug: tag.slug,
      label: tag.label,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    })),
    nextCursor:
      hasMore && results.length > 0
        ? String(results[results.length - 1]._id)
        : undefined,
    hasMore,
  };
}

/**
 * Search tags for autocomplete (returns limited results)
 */
export async function searchTags(params: TagSearchDto): Promise<TagResponse[]> {
  const { query } = params;

  if (!query || query.length < 2) {
    return [];
  }

  const tags = await TagModel.find({
    $or: [
      { label: { $regex: query, $options: "i" } },
      { slug: { $regex: query, $options: "i" } },
    ],
  })
    .select("_id slug label createdAt updatedAt")
    .sort({ label: 1 })
    .limit(10);

  return tags.map((tag) => ({
    _id: String(tag._id),
    slug: tag.slug,
    label: tag.label,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.updatedAt.toISOString(),
  }));
}

/**
 * Get tag by ID
 */
export async function getTagById(id: string): Promise<ITag | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return await TagModel.findById(id);
}

/**
 * Update tag
 */
export async function updateTag(id: string, data: UpdateTagDto): Promise<ITag> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid tag ID");
  }

  const tag = await TagModel.findById(id);
  if (!tag) {
    throw new Error("Tag not found");
  }

  const newSlug = normalizeSlug(data.label);

  // Check if another tag with this slug exists
  const existing = await TagModel.findOne({ slug: newSlug, _id: { $ne: id } });
  if (existing) {
    throw new Error("Another tag with this label already exists");
  }

  tag.label = data.label;
  tag.slug = newSlug;
  await tag.save();

  return tag;
}

/**
 * Delete tag
 */
export async function deleteTag(id: string): Promise<void> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid tag ID");
  }

  const tag = await TagModel.findByIdAndDelete(id);
  if (!tag) {
    throw new Error("Tag not found");
  }
}
