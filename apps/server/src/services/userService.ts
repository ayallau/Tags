import User, { type IUser } from "../models/User.js";
import type {
  CreateUserDto,
  GoogleUserDto,
  DiscoverUsersQuery,
  RecentUsersDto,
} from "../dtos/index.js";
import { Types } from "mongoose";
import { buildPrivacyFilter } from "./settingsService.js";

export async function findByEmailLower(email: string): Promise<IUser | null> {
  return await User.findOne({ emailLower: email.toLowerCase() });
}

export async function createUser(userData: CreateUserDto): Promise<IUser> {
  const user = new User({
    username: userData.username,
    emailLower: userData.email.toLowerCase(),
    passwordHash: userData.passwordHash,
  });
  return await user.save();
}

export async function upsertGoogleUser({
  googleId,
  email,
  displayName,
  avatarUrl,
}: GoogleUserDto): Promise<IUser> {
  // Search for existing user by Google ID
  let user = await User.findOne({ "providers.google.id": googleId });

  if (user) {
    // Update profile fields if they changed
    const updates: Record<string, any> = {};

    if (email && !user.emailLower) {
      updates.emailLower = email.toLowerCase();
    }

    if (avatarUrl && !user.avatarUrl) {
      updates.avatarUrl = avatarUrl;
    }

    if (displayName && !user.username) {
      // Generate username from displayName (remove spaces, special chars)
      const cleanName = displayName.replace(/[^a-zA-Z0-9_-]/g, "_");
      // Check if username is already taken
      const existingUser = await User.findOne({ username: cleanName });
      if (!existingUser) {
        updates.username = cleanName;
      }
    }

    if (Object.keys(updates).length > 0) {
      await user.updateOne(updates);
      await user.save();
    }

    return user;
  }

  // If not found by Google ID, search by email
  if (email) {
    user = await User.findOne({ emailLower: email.toLowerCase() });

    if (user) {
      // Update existing user with Google details
      if (!user.providers) {
        user.providers = {};
      }
      user.providers.google = { id: googleId, email };

      // Update profile fields if needed
      if (avatarUrl && !user.avatarUrl) {
        user.avatarUrl = avatarUrl;
      }

      if (displayName && !user.username) {
        const cleanName = displayName.replace(/[^a-zA-Z0-9_-]/g, "_");
        const existingUser = await User.findOne({ username: cleanName });
        if (!existingUser) {
          user.username = cleanName;
        }
      }

      await user.save();
      return user;
    }
  }

  // Create new user
  const emailLower = email?.toLowerCase() || null;

  // Generate username from displayName if available
  let username: string | undefined;
  if (displayName) {
    const cleanName = displayName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const existingUser = await User.findOne({ username: cleanName });
    if (!existingUser) {
      username = cleanName;
    }
  }

  const newUser = new User({
    emailLower,
    username,
    avatarUrl: avatarUrl || undefined,
    providers: {
      google: { id: googleId, email },
    },
  });

  return await newUser.save();
}

/**
 * Discover users based on tags, search query, and sorting options
 * Excludes blocked and hidden users
 */
export async function discoverUsers(
  params: DiscoverUsersQuery,
  currentUserId?: Types.ObjectId
) {
  const { tags, query, sort = "relevance", cursor, limit = 24 } = params;

  // Build filter query
  const filter: Record<string, any> = {};

  // Filter by tags if provided
  if (tags && tags.length > 0) {
    const tagIds = tags
      .split(",")
      .filter(Boolean)
      .map((id) => new Types.ObjectId(id));
    filter.tags = { $in: tagIds };
  }

  // Search by username if query provided
  if (query && query.length >= 1) {
    filter.username = { $regex: query, $options: "i" };
  }

  // Cursor-based pagination
  if (cursor && Types.ObjectId.isValid(cursor)) {
    filter._id = { $gt: cursor };
  }

  // Apply privacy filter (exclude blocked/hidden users)
  if (currentUserId) {
    const privacyFilter = await buildPrivacyFilter(currentUserId);
    Object.assign(filter, privacyFilter);
  }

  // Build sort options
  let sortOptions: Record<string, 1 | -1> = {};

  switch (sort) {
    case "online":
      sortOptions = { isOnline: -1, lastVisitAt: -1, _id: 1 };
      break;
    case "lastVisit":
      sortOptions = { lastVisitAt: -1, _id: 1 };
      break;
    case "name":
      sortOptions = { username: 1, _id: 1 };
      break;
    case "relevance":
    default:
      // Sort by tags match (more tags = higher relevance)
      // For now, default to _id ascending
      sortOptions = { _id: 1 };
      break;
  }

  // Fetch users with projection (only needed fields)
  const users = await User.find(filter)
    .select("_id username avatarUrl isOnline lastVisitAt createdAt tags")
    .populate("tags", "slug label")
    .sort(sortOptions)
    .limit(limit + 1); // Fetch one extra to check if more exists

  const hasMore = users.length > limit;
  const results = hasMore ? users.slice(0, limit) : users;

  return {
    users: results.map((user) => ({
      _id: String(user._id),
      username: user.username,
      avatarUrl: user.avatarUrl,
      isOnline: user.isOnline,
      lastVisitAt: user.lastVisitAt,
      createdAt: user.createdAt,
      tags: user.tags.map((tag: any) => ({
        _id: String(tag._id),
        slug: tag.slug,
        label: tag.label,
      })),
    })),
    nextCursor:
      hasMore && results.length > 0
        ? String(results[results.length - 1]._id)
        : undefined,
    hasMore,
  };
}

/**
 * Get recent users sorted by lastVisitAt then createdAt
 * Includes privacy filter and cursor-based pagination
 */
export async function getRecentUsers(
  params: RecentUsersDto,
  currentUserId?: Types.ObjectId
) {
  const { limit = 24, cursor } = params;

  // Build filter query
  const filter: Record<string, any> = {};

  // Apply privacy filter (exclude blocked/hidden users)
  if (currentUserId) {
    const privacyFilter = await buildPrivacyFilter(currentUserId);
    Object.assign(filter, privacyFilter);
  }

  // Cursor-based pagination using composite key (lastVisitAt, createdAt, _id)
  // Note: This is a simplified cursor - just using _id for now
  // A full implementation would encode/decode the composite key
  if (cursor && Types.ObjectId.isValid(cursor)) {
    // For proper cursor pagination, we'd decode the cursor
    // For now, just use _id-based cursor
    filter._id = { $gt: new Types.ObjectId(cursor) };
  }

  // Sort by lastVisitAt descending, then createdAt descending, then _id ascending
  const sortOptions: Record<string, 1 | -1> = {
    lastVisitAt: -1,
    createdAt: -1,
    _id: 1,
  };

  // Fetch users with projection (only needed fields)
  const users = await User.find(filter)
    .select("_id username avatarUrl isOnline lastVisitAt createdAt")
    .sort(sortOptions)
    .limit(limit + 1); // Fetch one extra to check if more exists

  const hasMore = users.length > limit;
  const results = hasMore ? users.slice(0, limit) : users;

  return {
    users: results.map((user) => ({
      _id: String(user._id),
      username: user.username,
      avatarUrl: user.avatarUrl,
      isOnline: user.isOnline,
      lastVisitAt: user.lastVisitAt,
      createdAt: user.createdAt,
    })),
    nextCursor:
      hasMore && results.length > 0
        ? String(results[results.length - 1]._id)
        : undefined,
    hasMore,
  };
}
