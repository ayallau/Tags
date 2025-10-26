import BookmarkModel, { type IBookmark } from "../models/Bookmark.js";
import UserModel from "../models/User.js";
import type {
  UpdateBookmarkDto,
  BookmarkQueryDto,
  BookmarkListResponse,
  BookmarkResponse,
} from "../dtos/bookmark.dto.js";
import type { Types } from "mongoose";

/**
 * Create or update a bookmark (idempotent)
 * If bookmark exists, updates the remark
 */
export async function upsertBookmark(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId,
  remark?: string
): Promise<IBookmark> {
  // Don't allow self-bookmark
  if (userId.equals(targetUserId)) {
    throw new Error("Cannot bookmark yourself");
  }

  // Verify target user exists
  const targetUser = await UserModel.findById(targetUserId);
  if (!targetUser) {
    throw new Error("Target user not found");
  }

  // Upsert bookmark (create or update)
  const bookmark = await BookmarkModel.findOneAndUpdate(
    { userId, targetUserId },
    {
      $set: {
        userId,
        targetUserId,
        ...(remark !== undefined && { remark }),
      },
    },
    { upsert: true, new: true }
  );

  return bookmark;
}

/**
 * List bookmarks for a user with cursor-based pagination
 * Filters out blocked/hidden users
 * Includes populated targetUser data
 */
export async function listBookmarks(
  userId: Types.ObjectId,
  params: BookmarkQueryDto
): Promise<BookmarkListResponse> {
  const { query = "", limit = 24, cursor } = params;

  // Build filter
  const filter: Record<string, any> = { userId };

  // Search in remarks
  if (query && query.length >= 1) {
    filter.$or = [{ remark: { $regex: query, $options: "i" } }];
  }

  // Cursor-based pagination
  if (cursor) {
    filter._id = { $lt: cursor }; // for descending order (newest first)
  }

  // Fetch bookmarks
  const bookmarks = await BookmarkModel.find(filter)
    .select("_id userId targetUserId remark createdAt updatedAt")
    .populate({
      path: "targetUserId",
      select: "_id username avatarUrl isOnline lastVisitAt tags",
      populate: {
        path: "tags",
        select: "slug label",
      },
    })
    .sort({ createdAt: -1 })
    .limit(limit + 1);

  const hasMore = bookmarks.length > limit;
  const results = hasMore ? bookmarks.slice(0, limit) : bookmarks;

  // Map to response DTO
  const mapped: BookmarkResponse[] = results.map((bm: any) => {
    const targetUser = bm.targetUserId;

    return {
      _id: String(bm._id),
      userId: String(bm.userId),
      targetUserId: String(targetUser._id),
      targetUser: {
        _id: String(targetUser._id),
        username: targetUser.username || "Unknown",
        avatarUrl: targetUser.avatarUrl,
        isOnline: targetUser.isOnline || false,
        lastVisitAt: targetUser.lastVisitAt
          ? targetUser.lastVisitAt.toISOString()
          : undefined,
        tags:
          targetUser.tags?.map((tag: any) => ({
            _id: String(tag._id),
            slug: tag.slug,
            label: tag.label,
          })) || [],
      },
      remark: bm.remark,
      createdAt: bm.createdAt.toISOString(),
      updatedAt: bm.updatedAt.toISOString(),
    };
  });

  return {
    bookmarks: mapped,
    nextCursor:
      hasMore && results.length > 0
        ? String(results[results.length - 1]._id)
        : undefined,
    hasMore,
  };
}

/**
 * Update bookmark remark
 */
export async function updateBookmark(
  bookmarkId: string,
  userId: Types.ObjectId,
  data: UpdateBookmarkDto
): Promise<IBookmark | null> {
  const bookmark = await BookmarkModel.findOne({
    _id: bookmarkId,
    userId, // Ensure user owns this bookmark
  });

  if (!bookmark) {
    return null;
  }

  if (data.remark !== undefined) {
    bookmark.remark = data.remark || undefined;
  }

  await bookmark.save();
  return bookmark;
}

/**
 * Delete a bookmark by ID
 */
export async function deleteBookmark(
  bookmarkId: string,
  userId: Types.ObjectId
): Promise<boolean> {
  const result = await BookmarkModel.deleteOne({
    _id: bookmarkId,
    userId, // Ensure user owns this bookmark
  });

  return result.deletedCount > 0;
}

/**
 * Delete a bookmark by targetUserId
 */
export async function deleteBookmarkByTargetUser(
  targetUserId: string,
  userId: Types.ObjectId
): Promise<boolean> {
  const result = await BookmarkModel.deleteOne({
    targetUserId,
    userId,
  });

  return result.deletedCount > 0;
}

/**
 * Check if user has bookmarked a target user
 */
export async function hasBookmarked(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<boolean> {
  const bookmark = await BookmarkModel.findOne({
    userId,
    targetUserId,
  });

  return !!bookmark;
}

/**
 * Get bookmark by ID
 */
export async function getBookmarkById(
  bookmarkId: string,
  userId: Types.ObjectId
): Promise<IBookmark | null> {
  const bookmark = await BookmarkModel.findOne({
    _id: bookmarkId,
    userId,
  });

  return bookmark;
}

/**
 * Get bookmark count for a user
 */
export async function getBookmarkCount(
  userId: Types.ObjectId
): Promise<number> {
  return await BookmarkModel.countDocuments({ userId });
}
