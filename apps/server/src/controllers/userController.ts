import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import type { IUser } from "../models/User.js";
import type { UpdateUserDto, DiscoverUsersQuery } from "../dtos/user.dto.js";
import { UpdateProfileSchema } from "../dtos/user.dto.js";
import { discoverUsers as discoverUsersService } from "../services/userService.js";

/**
 * Get current user profile
 */
export async function getCurrentUser(
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

    // Log profile view audit
    console.log(
      `[Audit] profile_viewed by user ${user._id} at ${new Date().toISOString()}`
    );

    res.json({
      _id: user._id,
      email: user.emailLower,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      photos: user.photos,
      tags: user.tags,
      isOnline: user.isOnline,
      lastVisitAt: user.lastVisitAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update current user profile
 */
export async function updateCurrentUser(
  req: Request<Record<string, never>, unknown, UpdateUserDto>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as IUser;

    // Validate request body with Zod
    const validation = UpdateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed",
        details: validation.error.issues,
      });
      return;
    }

    const updateData = validation.data;

    // Build update object with only provided fields
    const updateFields: Partial<IUser> = {};
    if (updateData.username !== undefined)
      updateFields.username = updateData.username;
    if (updateData.bio !== undefined)
      updateFields.bio = updateData.bio === "" ? undefined : updateData.bio;
    if (updateData.location !== undefined)
      updateFields.location =
        updateData.location === "" ? undefined : updateData.location;
    if (updateData.avatarUrl !== undefined)
      updateFields.avatarUrl =
        updateData.avatarUrl === "" ? undefined : updateData.avatarUrl;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Log profile update audit
    console.log(
      `[Audit] profile_updated by user ${user._id} at ${new Date().toISOString()}`
    );
    console.log(
      `[Audit] Updated fields: ${Object.keys(updateFields).join(", ")}`
    );

    // Return lean projection for better performance
    res.json({
      _id: updatedUser._id,
      email: updatedUser.emailLower,
      username: updatedUser.username,
      avatarUrl: updatedUser.avatarUrl,
      bio: updatedUser.bio,
      location: updatedUser.location,
      photos: updatedUser.photos,
      tags: updatedUser.tags,
      isOnline: updatedUser.isOnline,
      lastVisitAt: updatedUser.lastVisitAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Discover users with filtering, sorting, and pagination
 */
export async function handleDiscoverUsers(
  req: Request<Record<string, never>, unknown, never, DiscoverUsersQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await discoverUsersService(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
