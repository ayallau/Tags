import FriendModel, { type IFriend } from "../models/Friend.js";
import UserModel from "../models/User.js";
import type {
  UpdateFriendDto,
  FriendQueryDto,
  FriendListResponse,
  FriendResponse,
} from "../dtos/friend.dto.js";
import type { Types } from "mongoose";

/**
 * Create or get a friend (idempotent)
 * If friend exists, returns existing
 */
export async function upsertFriend(
  userId: Types.ObjectId,
  friendUserId: Types.ObjectId
): Promise<IFriend> {
  // Don't allow self-friend
  if (userId.equals(friendUserId)) {
    throw new Error("Cannot friend yourself");
  }

  // Verify target user exists
  const targetUser = await UserModel.findById(friendUserId);
  if (!targetUser) {
    throw new Error("Target user not found");
  }

  // Find or create friend
  let friend = await FriendModel.findOne({
    userId,
    friendUserId,
  });

  if (!friend) {
    // Create new friend
    friend = await FriendModel.create({
      userId,
      friendUserId,
      canNotify: false,
    });
  }

  return friend;
}

/**
 * List friends for a user with cursor-based pagination
 * Includes populated friendUser data
 */
export async function listFriends(
  userId: Types.ObjectId,
  params: FriendQueryDto
): Promise<FriendListResponse> {
  const { limit = 24, cursor } = params;

  // Build filter
  const filter: Record<string, any> = { userId };

  // Cursor-based pagination
  if (cursor) {
    filter._id = { $lt: cursor }; // for descending order (newest first)
  }

  // Fetch friends
  const friends = await FriendModel.find(filter)
    .select("_id userId friendUserId canNotify createdAt")
    .populate({
      path: "friendUserId",
      select: "_id username avatarUrl isOnline lastVisitAt tags",
      populate: {
        path: "tags",
        select: "slug label",
      },
    })
    .sort({ createdAt: -1 })
    .limit(limit + 1);

  const hasMore = friends.length > limit;
  const results = hasMore ? friends.slice(0, limit) : friends;

  // Map to response DTO
  const mapped: FriendResponse[] = results.map((fr: any) => {
    const friendUser = fr.friendUserId;

    return {
      _id: String(fr._id),
      userId: String(fr.userId),
      friendUserId: String(friendUser._id),
      friendUser: {
        _id: String(friendUser._id),
        username: friendUser.username || "Unknown",
        avatarUrl: friendUser.avatarUrl,
        isOnline: friendUser.isOnline || false,
        lastVisitAt: friendUser.lastVisitAt
          ? friendUser.lastVisitAt.toISOString()
          : undefined,
        tags:
          friendUser.tags?.map((tag: any) => ({
            _id: String(tag._id),
            slug: tag.slug,
            label: tag.label,
          })) || [],
      },
      canNotify: fr.canNotify,
      createdAt: fr.createdAt.toISOString(),
    };
  });

  return {
    friends: mapped,
    nextCursor:
      hasMore && results.length > 0
        ? String(results[results.length - 1]._id)
        : undefined,
    hasMore,
  };
}

/**
 * Update friend visibility (canNotify)
 */
export async function updateFriendVisibility(
  friendId: string,
  userId: Types.ObjectId,
  data: UpdateFriendDto
): Promise<IFriend | null> {
  const friend = await FriendModel.findOne({
    _id: friendId,
    userId, // Ensure user owns this friend record
  });

  if (!friend) {
    return null;
  }

  friend.canNotify = data.canNotify;

  await friend.save();
  return friend;
}

/**
 * Delete a friend by ID
 */
export async function deleteFriend(
  friendId: string,
  userId: Types.ObjectId
): Promise<boolean> {
  const result = await FriendModel.deleteOne({
    _id: friendId,
    userId, // Ensure user owns this friend record
  });

  return result.deletedCount > 0;
}

/**
 * Delete a friend by friendUserId
 */
export async function deleteFriendByTargetUser(
  targetUserId: string,
  userId: Types.ObjectId
): Promise<boolean> {
  const result = await FriendModel.deleteOne({
    friendUserId: targetUserId,
    userId,
  });

  return result.deletedCount > 0;
}

/**
 * Check if user has friended a target user
 */
export async function hasFriended(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId
): Promise<boolean> {
  const friend = await FriendModel.findOne({
    userId,
    friendUserId: targetUserId,
  });

  return !!friend;
}

/**
 * Get friend by ID
 */
export async function getFriendById(
  friendId: string,
  userId: Types.ObjectId
): Promise<IFriend | null> {
  const friend = await FriendModel.findOne({
    _id: friendId,
    userId,
  });

  return friend;
}

/**
 * Get friend count for a user
 */
export async function getFriendCount(userId: Types.ObjectId): Promise<number> {
  return await FriendModel.countDocuments({ userId });
}
