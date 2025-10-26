import MatchScoreModel, { type IMatchScore } from "../models/MatchScore.js";
import UserModel from "../models/User.js";
import { Types } from "mongoose";

/**
 * Calculate match score between two users based on shared tags
 * Formula: min(100, sharedTagsCount * 10)
 */
export function calculateMatchScore(
  userTags: Types.ObjectId[],
  targetTags: Types.ObjectId[]
): { score: number; sharedCount: number } {
  // Convert to strings for comparison
  const userTagIds = userTags.map((id) => String(id)).sort();
  const targetTagIds = targetTags.map((id) => String(id)).sort();

  // Find intersection
  const sharedTags = userTagIds.filter((tagId) => targetTagIds.includes(tagId));
  const sharedCount = sharedTags.length;

  // Calculate score: min(100, sharedCount * 10)
  const score = Math.min(100, sharedCount * 10);

  return { score, sharedCount };
}

/**
 * Compute and save match score for a user pair
 * Upsert operation (idempotent)
 */
export async function upsertMatchScore(
  userId: Types.ObjectId,
  targetUserId: Types.ObjectId,
  userTags: Types.ObjectId[],
  targetTags: Types.ObjectId[]
): Promise<IMatchScore> {
  // Don't create self-match
  if (userId.equals(targetUserId)) {
    throw new Error("Cannot create match score for self");
  }

  const { score, sharedCount } = calculateMatchScore(userTags, targetTags);

  // Upsert match score
  const matchScore = await MatchScoreModel.findOneAndUpdate(
    { userId, targetUserId },
    {
      $set: {
        score,
        sharedTagsCount: sharedCount,
        computedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  return matchScore;
}

/**
 * Compute match scores for a user against all other users
 * Returns statistics about the operation
 */
export async function computeMatchesForUser(userId: Types.ObjectId): Promise<{
  examined: number;
  created: number;
  updated: number;
  deleted: number;
}> {
  const user = await UserModel.findById(userId).select("tags");
  if (!user || !user.tags || user.tags.length === 0) {
    return { examined: 0, created: 0, updated: 0, deleted: 0 };
  }

  const stats = { examined: 0, created: 0, updated: 0, deleted: 0 };

  // Get all other users with tags
  const allUsers = await UserModel.find({
    _id: { $ne: userId },
    tags: { $exists: true, $ne: [] },
  }).select("_id tags");

  stats.examined = allUsers.length;

  // Compute matches for each user
  for (const targetUser of allUsers) {
    try {
      const existingMatch = await MatchScoreModel.findOne({
        userId,
        targetUserId: targetUser._id,
      });

      await upsertMatchScore(
        userId,
        targetUser._id as Types.ObjectId,
        user.tags,
        targetUser.tags
      );

      if (existingMatch) {
        stats.updated++;
      } else {
        stats.created++;
      }
    } catch (err) {
      console.error(`Error computing match for ${targetUser._id}:`, err);
    }
  }

  // Clean up matches that should no longer exist (no shared tags)
  const existingMatches = await MatchScoreModel.find({ userId });
  stats.deleted = 0;

  for (const match of existingMatches) {
    const targetUser = allUsers.find(
      (u) => String(u._id) === String(match.targetUserId)
    );
    if (!targetUser) {
      await MatchScoreModel.deleteOne({ _id: match._id });
      stats.deleted++;
    }
  }

  return stats;
}

/**
 * Incrementally update match scores when a user's tags change
 * Only recalculates matches with users who share at least one tag
 */
export async function incrementalUpdateForUser(
  userId: Types.ObjectId
): Promise<{
  examined: number;
  created: number;
  updated: number;
}> {
  const user = await UserModel.findById(userId).select("tags");
  if (!user) {
    throw new Error("User not found");
  }

  const stats = { examined: 0, created: 0, updated: 0 };

  // If user has no tags, delete all their match scores
  if (!user.tags || user.tags.length === 0) {
    await MatchScoreModel.deleteMany({ userId });
    return {
      examined: 0,
      created: 0,
      updated: 0,
    };
  }

  // Find all users who have at least one shared tag
  const candidateUsers = await UserModel.find({
    _id: { $ne: userId },
    tags: { $in: user.tags }, // At least one shared tag
  }).select("_id tags");

  stats.examined = candidateUsers.length;

  // Update matches with candidates
  for (const targetUser of candidateUsers) {
    try {
      const existingMatch = await MatchScoreModel.findOne({
        userId,
        targetUserId: targetUser._id,
      });

      await upsertMatchScore(
        userId,
        targetUser._id as Types.ObjectId,
        user.tags,
        targetUser.tags
      );

      if (existingMatch) {
        stats.updated++;
      } else {
        stats.created++;
      }
    } catch (err) {
      console.error(`Error updating match for ${targetUser._id}:`, err);
    }
  }

  return stats;
}

/**
 * Rebuild all match scores (batch operation)
 * Processes in chunks to avoid overwhelming the database
 */
export async function rebuildAllMatches(params?: {
  batchSize?: number;
  onProgress?: (progress: { processed: number; total: number }) => void;
}): Promise<{
  total: number;
  processed: number;
  created: number;
  updated: number;
}> {
  const batchSize = params?.batchSize || 50;
  const onProgress = params?.onProgress;

  // Get all users with tags
  const allUsers = await UserModel.find({
    tags: { $exists: true, $ne: [] },
  }).select("_id tags");
  const total = allUsers.length;

  console.log(
    `[MatchScore] Starting rebuild for ${total} users (batch size: ${batchSize})`
  );

  let processed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;

  // Process in batches
  for (let i = 0; i < allUsers.length; i += batchSize) {
    const batch = allUsers.slice(i, i + batchSize);
    const batchEnd = Math.min(i + batchSize, allUsers.length);

    for (const user of batch) {
      const stats = await computeMatchesForUser(user._id as Types.ObjectId);
      totalCreated += stats.created;
      totalUpdated += stats.updated;
      processed++;
    }

    if (onProgress) {
      onProgress({ processed, total });
    }

    if ((i + batchSize) % 100 === 0 || batchEnd === total) {
      console.log(
        `[MatchScore] Progress: ${batchEnd}/${total} users (${((batchEnd / total) * 100).toFixed(1)}%)`
      );
    }
  }

  console.log(
    `[MatchScore] Rebuild complete: ${processed} users, ${totalCreated} created, ${totalUpdated} updated`
  );

  return {
    total,
    processed,
    created: totalCreated,
    updated: totalUpdated,
  };
}
