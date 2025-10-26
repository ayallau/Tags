import BlockModel, { type IBlock } from "../models/Block.js";
import HiddenModel, { type IHidden } from "../models/Hidden.js";
import UserModel from "../models/User.js";
import type { Types } from "mongoose";
import type {
  SettingsListQuery,
  SettingsListResponse,
  SettingsUserItem,
} from "../dtos/settings.dto.js";
import logger from "../lib/logger.js";

/**
 * Build privacy filter to exclude blocked and hidden users
 * Returns MongoDB filter object for exclusion
 */
export async function buildPrivacyFilter(
  userId: Types.ObjectId
): Promise<Record<string, any>> {
  // Get IDs of blocked and hidden users
  const blockedDocs = await BlockModel.find({ userId }, "targetUserId").lean();
  const hiddenDocs = await HiddenModel.find({ userId }, "targetUserId").lean();

  const blockedIds = blockedDocs.map((doc: any) => doc.targetUserId);
  const hiddenIds = hiddenDocs.map((doc: any) => doc.targetUserId);

  // Combine all IDs to exclude
  const excludeIds = [...blockedIds, ...hiddenIds];

  // Return filter for MongoDB query
  if (excludeIds.length > 0) {
    return { _id: { $nin: excludeIds } };
  }

  return {};
}

/**
 * Check if a user is blocked by another user
 */
export async function isBlocked(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<boolean> {
  const block = await BlockModel.findOne({ userId, targetUserId });
  return !!block;
}

/**
 * List blocked users with cursor-based pagination
 */
export async function listBlockedUsers(
  userId: Types.ObjectId,
  params: SettingsListQuery
): Promise<SettingsListResponse> {
  const { limit, cursor } = params;

  // Build query filter
  const filter: Record<string, any> = { userId };

  if (cursor) {
    filter._id = { $lt: cursor };
  }

  // Fetch blocks
  const blocks = await BlockModel.find(filter)
    .select("_id targetUserId createdAt")
    .populate({
      path: "targetUserId",
      select: "_id username avatarUrl isOnline lastVisitAt createdAt",
    })
    .sort({ createdAt: -1 })
    .limit(limit + 1);

  const hasMore = blocks.length > limit;
  const results = hasMore ? blocks.slice(0, limit) : blocks;

  // Map to response
  const users: SettingsUserItem[] = results.map((block: any) => {
    const targetUser = block.targetUserId;
    return {
      _id: String(targetUser._id),
      username: targetUser.username || "Unknown",
      avatarUrl: targetUser.avatarUrl,
      isOnline: targetUser.isOnline || false,
      lastVisitAt: targetUser.lastVisitAt?.toISOString(),
      createdAt: block.createdAt.toISOString(),
    };
  });

  const nextCursor = hasMore
    ? String(results[results.length - 1]._id)
    : undefined;

  return {
    users,
    nextCursor,
    hasMore,
  };
}

/**
 * Block a user (idempotent)
 */
export async function blockUser(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<IBlock> {
  // Don't allow self-block
  if (userId.equals(targetUserId)) {
    throw new Error("Cannot block yourself");
  }

  // Verify target user exists
  const targetUser = await UserModel.findById(targetUserId);
  if (!targetUser) {
    throw new Error("Target user not found");
  }

  // Create or get existing block
  const block = await BlockModel.findOneAndUpdate(
    { userId, targetUserId },
    { userId, targetUserId },
    { upsert: true, new: true }
  );

  logger.info(`User ${userId} blocked user ${targetUserId}`, {
    event: "block_user",
    userId: String(userId),
    targetUserId: String(targetUserId),
    timestamp: new Date().toISOString(),
  });

  return block;
}

/**
 * Unblock a user
 */
export async function unblockUser(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<void> {
  const result = await BlockModel.deleteOne({ userId, targetUserId });

  if (result.deletedCount > 0) {
    logger.info(`User ${userId} unblocked user ${targetUserId}`, {
      event: "unblock_user",
      userId: String(userId),
      targetUserId: String(targetUserId),
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * List hidden users with cursor-based pagination
 */
export async function listHiddenUsers(
  userId: Types.ObjectId,
  params: SettingsListQuery
): Promise<SettingsListResponse> {
  const { limit, cursor } = params;

  // Build query filter
  const filter: Record<string, any> = { userId };

  if (cursor) {
    filter._id = { $lt: cursor };
  }

  // Fetch hidden
  const hiddens = await HiddenModel.find(filter)
    .select("_id targetUserId createdAt")
    .populate({
      path: "targetUserId",
      select: "_id username avatarUrl isOnline lastVisitAt createdAt",
    })
    .sort({ createdAt: -1 })
    .limit(limit + 1);

  const hasMore = hiddens.length > limit;
  const results = hasMore ? hiddens.slice(0, limit) : hiddens;

  // Map to response
  const users: SettingsUserItem[] = results.map((hidden: any) => {
    const targetUser = hidden.targetUserId;
    return {
      _id: String(targetUser._id),
      username: targetUser.username || "Unknown",
      avatarUrl: targetUser.avatarUrl,
      isOnline: targetUser.isOnline || false,
      lastVisitAt: targetUser.lastVisitAt?.toISOString(),
      createdAt: hidden.createdAt.toISOString(),
    };
  });

  const nextCursor = hasMore
    ? String(results[results.length - 1]._id)
    : undefined;

  return {
    users,
    nextCursor,
    hasMore,
  };
}

/**
 * Hide a user (idempotent)
 */
export async function hideUser(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<IHidden> {
  // Don't allow self-hide
  if (userId.equals(targetUserId)) {
    throw new Error("Cannot hide yourself");
  }

  // Verify target user exists
  const targetUser = await UserModel.findById(targetUserId);
  if (!targetUser) {
    throw new Error("Target user not found");
  }

  // Create or get existing hidden
  const hidden = await HiddenModel.findOneAndUpdate(
    { userId, targetUserId },
    { userId, targetUserId },
    { upsert: true, new: true }
  );

  logger.info(`User ${userId} hid user ${targetUserId}`, {
    event: "hide_user",
    userId: String(userId),
    targetUserId: String(targetUserId),
    timestamp: new Date().toISOString(),
  });

  return hidden;
}

/**
 * Unhide a user
 */
export async function unhideUser(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<void> {
  const result = await HiddenModel.deleteOne({ userId, targetUserId });

  if (result.deletedCount > 0) {
    logger.info(`User ${userId} unhid user ${targetUserId}`, {
      event: "unhide_user",
      userId: String(userId),
      targetUserId: String(targetUserId),
      timestamp: new Date().toISOString(),
    });
  }
}
