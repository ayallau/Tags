import type { Request, Response, NextFunction } from "express";
import {
  createTag,
  listTags,
  searchTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../services/tagService.js";
import {
  CreateTagSchema,
  UpdateTagSchema,
  TagQuerySchema,
  TagSearchSchema,
} from "../dtos/tag.dto.js";
import type {
  CreateTagDto,
  UpdateTagDto,
  TagQueryDto,
  TagSearchDto,
} from "../dtos/tag.dto.js";
import logger from "../lib/logger.js";

/**
 * Create a new tag
 * POST /tags
 * Auth: Required
 */
export async function handleCreateTag(
  req: Request<
    Record<string, never>,
    { _id: string; slug: string; label: string } | { error: string },
    CreateTagDto
  >,
  res: Response<
    { _id: string; slug: string; label: string } | { error: string }
  >,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const validated = CreateTagSchema.parse(req.body);

    const tag = await createTag(validated);

    logger.info(`Tag created: ${tag.slug}`, { userId: req.user?._id });

    res.status(201).json({
      _id: String(tag._id),
      slug: tag.slug,
      label: tag.label,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("already exists")) {
      res.status(409).json({ error: err.message });
      return;
    }
    next(err);
  }
}

/**
 * List tags with pagination
 * GET /tags?query=&limit=&cursor=
 * Auth: Optional
 */
export async function handleListTags(
  req: Request<Record<string, never>, unknown, never, TagQueryDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate query params
    const validated = TagQuerySchema.parse(req.query);

    const result = await listTags(validated);

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Search tags for autocomplete
 * GET /tags/search?query=
 * Auth: Optional
 */
export async function handleSearchTags(
  req: Request<Record<string, never>, unknown, never, TagSearchDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate query params
    const validated = TagSearchSchema.parse(req.query);

    const tags = await searchTags(validated);

    res.json(tags);
  } catch (err) {
    next(err);
  }
}

/**
 * Get tag by ID
 * GET /tags/:id
 * Auth: Optional
 */
export async function handleGetTag(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const tag = await getTagById(id);

    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    res.json({
      _id: String(tag._id),
      slug: tag.slug,
      label: tag.label,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update tag
 * PATCH /tags/:id
 * Auth: Required
 */
export async function handleUpdateTag(
  req: Request<{ id: string }, unknown, UpdateTagDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Validate request body
    const validated = UpdateTagSchema.parse(req.body);

    const tag = await updateTag(id, validated);

    logger.info(`Tag updated: ${tag.slug}`, {
      userId: req.user?._id,
      tagId: id,
    });

    res.json({
      _id: String(tag._id),
      slug: tag.slug,
      label: tag.label,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("already exists")) {
        res.status(409).json({ error: err.message });
        return;
      }
      if (err.message.includes("not found")) {
        res.status(404).json({ error: err.message });
        return;
      }
    }
    next(err);
  }
}

/**
 * Delete tag
 * DELETE /tags/:id
 * Auth: Required
 */
export async function handleDeleteTag(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    await deleteTag(id);

    logger.info(`Tag deleted`, { userId: req.user?._id, tagId: id });

    res.status(204).send();
  } catch (err) {
    if (err instanceof Error && err.message.includes("not found")) {
      res.status(404).json({ error: err.message });
      return;
    }
    next(err);
  }
}
