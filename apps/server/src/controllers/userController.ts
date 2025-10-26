import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import type { IUser } from "../models/User.js";
import type { UpdateUserDto } from "../dtos/user.dto.js";

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
  req: Request<Record<string, never>, IUser, UpdateUserDto>,
  res: Response<IUser | { error: string }>,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as IUser;
    const { username, bio, location, photos, tags } = req.body;

    // Build update object with only provided fields
    const updateData: Partial<IUser> = {};

    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (photos !== undefined) updateData.photos = photos as any;
    if (tags !== undefined) updateData.tags = tags as any;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}
