import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import {
  upsertBookmark as upsertBookmarkService,
  listBookmarks as listBookmarksService,
  updateBookmark as updateBookmarkService,
  deleteBookmark as deleteBookmarkService,
  hasBookmarked as hasBookmarkedService,
  getBookmarkCount as getBookmarkCountService,
} from "../services/bookmarkService.js";
import type {
  CreateBookmarkDto,
  UpdateBookmarkDto,
  BookmarkQueryDto,
} from "../dtos/bookmark.dto.js";
import {
  CreateBookmarkSchema,
  UpdateBookmarkSchema,
} from "../dtos/bookmark.dto.js";
import logger from "../lib/logger.js";

/**
 * Get all bookmarks for current user
 * GET /bookmarks?query&limit&cursor
 */
export async function getBookmarks(
  req: Request<Record<string, never>, unknown, never, BookmarkQueryDto>,
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

    const result = await listBookmarksService(userId, query);

    logger.debug(`Bookmarks retrieved for user ${userId}`, {
      count: result.bookmarks.length,
      hasMore: result.hasMore,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Create or update a bookmark (idempotent)
 * POST /bookmarks
 */
export async function createBookmark(
  req: Request<Record<string, never>, unknown, CreateBookmarkDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate request body
    const validation = CreateBookmarkSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.issues,
      });
      return;
    }

    const data = validation.data;
    const userId = (req.user as any)._id;
    const targetUserId = new Types.ObjectId(data.targetUserId);

    const bookmark = await upsertBookmarkService(
      userId,
      targetUserId,
      data.remark
    );

    logger.info(
      `Bookmark created/updated by user ${userId} for target ${targetUserId}`,
      {
        bookmarkId: bookmark._id,
      }
    );

    res.status(201).json({
      _id: String(bookmark._id),
      userId: String(bookmark.userId),
      targetUserId: String(bookmark.targetUserId),
      remark: bookmark.remark,
      createdAt: bookmark.createdAt.toISOString(),
      updatedAt: bookmark.updatedAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Cannot bookmark yourself") {
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
 * Update bookmark remark
 * PATCH /bookmarks/:id
 */
export async function updateBookmark(
  req: Request<{ id: string }, unknown, UpdateBookmarkDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate request body
    const validation = UpdateBookmarkSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.issues,
      });
      return;
    }

    const bookmarkId = req.params.id;
    const userId = (req.user as any)._id;

    const bookmark = await updateBookmarkService(
      bookmarkId,
      userId,
      validation.data
    );

    if (!bookmark) {
      res.status(404).json({ error: "Bookmark not found" });
      return;
    }

    logger.info(`Bookmark updated by user ${userId}`, {
      bookmarkId: bookmark._id,
    });

    res.json({
      _id: String(bookmark._id),
      userId: String(bookmark.userId),
      targetUserId: String(bookmark.targetUserId),
      remark: bookmark.remark,
      createdAt: bookmark.createdAt.toISOString(),
      updatedAt: bookmark.updatedAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a bookmark
 * DELETE /bookmarks/:id
 */
export async function deleteBookmark(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const bookmarkId = req.params.id;
    const userId = (req.user as any)._id;

    const success = await deleteBookmarkService(bookmarkId, userId);

    if (!success) {
      res.status(404).json({ error: "Bookmark not found" });
      return;
    }

    logger.info(`Bookmark deleted by user ${userId}`, {
      bookmarkId,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * Check if user has bookmarked a target user
 * GET /bookmarks/check?targetUserId=...
 */
export async function checkBookmark(
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
    const hasBookmarked = await hasBookmarkedService(
      userId,
      new Types.ObjectId(targetUserId)
    );

    res.json({ hasBookmarked });
  } catch (err) {
    next(err);
  }
}

/**
 * Get bookmark count for current user
 * GET /bookmarks/count
 */
export async function getBookmarkCount(
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
    const count = await getBookmarkCountService(userId);

    res.json({ count });
  } catch (err) {
    next(err);
  }
}
