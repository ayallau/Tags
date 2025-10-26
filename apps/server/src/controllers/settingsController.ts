import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../models/User.js";
import {
  SettingsListQuerySchema,
  TargetUserIdSchema,
} from "../dtos/settings.dto.js";
import {
  listBlockedUsers,
  listHiddenUsers,
  blockUser,
  unblockUser,
  hideUser,
  unhideUser,
} from "../services/settingsService.js";
import { Types } from "mongoose";

/**
 * GET /api/settings/blocked
 * List blocked users with cursor pagination
 */
export async function getBlockedUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as IUser;
    const params = SettingsListQuerySchema.parse(req.query);

    const result = await listBlockedUsers(
      new Types.ObjectId(String(user._id)),
      params
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/settings/blocked/:targetUserId
 * Block a user
 */
export async function postBlockUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as IUser;
    const { targetUserId } = TargetUserIdSchema.parse(req.params);

    const block = await blockUser(
      new Types.ObjectId(String(user._id)),
      new Types.ObjectId(targetUserId)
    );

    res.status(201).json({
      message: "User blocked successfully",
      block: {
        _id: String(block._id),
        userId: String(block.userId),
        targetUserId: String(block.targetUserId),
        createdAt: block.createdAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/settings/blocked/:targetUserId
 * Unblock a user
 */
export async function deleteBlockUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as IUser;
    const { targetUserId } = TargetUserIdSchema.parse(req.params);

    await unblockUser(
      new Types.ObjectId(String(user._id)),
      new Types.ObjectId(targetUserId)
    );

    res.json({ message: "User unblocked successfully" });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/settings/hidden
 * List hidden users with cursor pagination
 */
export async function getHiddenUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as IUser;
    const params = SettingsListQuerySchema.parse(req.query);

    const result = await listHiddenUsers(
      new Types.ObjectId(String(user._id)),
      params
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/settings/hidden/:targetUserId
 * Hide a user
 */
export async function postHideUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as IUser;
    const { targetUserId } = TargetUserIdSchema.parse(req.params);

    const hidden = await hideUser(
      new Types.ObjectId(String(user._id)),
      new Types.ObjectId(targetUserId)
    );

    res.status(201).json({
      message: "User hidden successfully",
      hidden: {
        _id: String(hidden._id),
        userId: String(hidden.userId),
        targetUserId: String(hidden.targetUserId),
        createdAt: hidden.createdAt.toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/settings/hidden/:targetUserId
 * Unhide a user
 */
export async function deleteHideUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as IUser;
    const { targetUserId } = TargetUserIdSchema.parse(req.params);

    await unhideUser(
      new Types.ObjectId(String(user._id)),
      new Types.ObjectId(targetUserId)
    );

    res.json({ message: "User unhidden successfully" });
  } catch (err) {
    next(err);
  }
}
