import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import {
  upsertFriend as upsertFriendService,
  listFriends as listFriendsService,
  updateFriendVisibility as updateFriendVisibilityService,
  deleteFriend as deleteFriendService,
  deleteFriendByTargetUser as deleteFriendByTargetUserService,
  hasFriended as hasFriendedService,
  getFriendCount as getFriendCountService,
} from "../services/friendService.js";
import type { UpdateFriendDto, FriendQueryDto } from "../dtos/friend.dto.js";
import { UpdateFriendSchema } from "../dtos/friend.dto.js";
import logger from "../lib/logger.js";

/**
 * Get all friends for current user
 * GET /friends?limit&cursor
 */
export async function getFriends(
  req: Request<Record<string, never>, unknown, never, FriendQueryDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as any)._id;
    const query = req.query;

    const result = await listFriendsService(userId, query);

    logger.debug(`Friends retrieved for user ${userId}`, {
      count: result.friends.length,
      hasMore: result.hasMore,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Create or get a friend (idempotent)
 * POST /friends/:targetUserId
 */
export async function createFriend(
  req: Request<{ targetUserId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const targetUserId = req.params.targetUserId;

    // Validate targetUserId format
    if (!/^[0-9a-fA-F]{24}$/.test(targetUserId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const userId = (req.user as any)._id;
    const friendUserId = new Types.ObjectId(targetUserId);

    const friend = await upsertFriendService(userId, friendUserId);

    logger.info(`Friend created by user ${userId} for target ${targetUserId}`, {
      friendId: friend._id,
    });

    res.status(201).json({
      _id: String(friend._id),
      userId: String(friend.userId),
      friendUserId: String(friend.friendUserId),
      canNotify: friend.canNotify,
      createdAt: friend.createdAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Cannot friend yourself") {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof Error && err.message === "Target user not found") {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
}

/**
 * Update friend visibility (canNotify)
 * PATCH /friends/:id
 */
export async function updateFriend(
  req: Request<{ id: string }, unknown, UpdateFriendDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate request body
    const validation = UpdateFriendSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.issues,
      });
      return;
    }

    const friendId = req.params.id;
    const userId = (req.user as any)._id;

    const friend = await updateFriendVisibilityService(
      friendId,
      userId,
      validation.data
    );

    if (!friend) {
      res.status(404).json({ error: "Friend not found" });
      return;
    }

    logger.info(`Friend updated by user ${userId}`, {
      friendId: friend._id,
    });

    res.json({
      _id: String(friend._id),
      userId: String(friend.userId),
      friendUserId: String(friend.friendUserId),
      canNotify: friend.canNotify,
      createdAt: friend.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a friend by target user ID
 * DELETE /friends/user/:targetUserId
 */
export async function deleteFriendByTargetUser(
  req: Request<{ targetUserId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const targetUserId = req.params.targetUserId;
    const userId = (req.user as any)._id;

    const success = await deleteFriendByTargetUserService(targetUserId, userId);

    if (!success) {
      res.status(404).json({ error: "Friend not found" });
      return;
    }

    logger.info(`Friend deleted by user ${userId}`, {
      targetUserId,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a friend by record ID
 * DELETE /friends/:id
 */
export async function deleteFriend(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const friendId = req.params.id;
    const userId = (req.user as any)._id;

    const success = await deleteFriendService(friendId, userId);

    if (!success) {
      res.status(404).json({ error: "Friend not found" });
      return;
    }

    logger.info(`Friend deleted by user ${userId}`, {
      friendId,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * Check if user has friended a target user
 * GET /friends/check?targetUserId=...
 */
export async function checkFriend(
  req: Request<
    Record<string, never>,
    unknown,
    never,
    { targetUserId?: string }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const targetUserId = req.query.targetUserId;
    if (!targetUserId) {
      res.status(400).json({ error: "targetUserId required" });
      return;
    }

    const userId = (req.user as any)._id;
    const hasFriended = await hasFriendedService(
      userId,
      new Types.ObjectId(targetUserId)
    );

    res.json({ hasFriended });
  } catch (err) {
    next(err);
  }
}

/**
 * Get friend count for current user
 * GET /friends/count
 */
export async function getFriendCount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as any)._id;
    const count = await getFriendCountService(userId);

    res.json({ count });
  } catch (err) {
    next(err);
  }
}
