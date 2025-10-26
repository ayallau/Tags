import type { Request, Response, NextFunction } from "express";
import type { GetMatchesQuery, GetMatchesResponse } from "../dtos/match.dto.js";
import MatchScoreModel from "../models/MatchScore.js";
import UserModel from "../models/User.js";
import { Types } from "mongoose";
import type { IUser } from "../models/User.js";

/**
 * Get matches for the current user
 * Returns users sorted by match score with pagination
 */
export async function getMatches(
  req: Request<
    Record<string, never>,
    GetMatchesResponse,
    never,
    GetMatchesQuery
  >,
  res: Response<GetMatchesResponse>,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        matches: [],
        hasMore: false,
      });
      return;
    }

    const user = req.user as IUser;
    const { cursor, limit = 24, sort = "score" } = req.query;

    // Build query for matches
    const matchQuery: Record<string, any> = { userId: user._id };

    // Cursor-based pagination
    if (cursor) {
      // Parse cursor (format: score_userId_targetUserId)
      const parts = cursor.split("_");
      if (parts.length === 3) {
        const cursorScore = parseFloat(parts[0]);
        const cursorTargetUserId = parts[2];

        if (sort === "score") {
          matchQuery.$or = [
            { score: { $lt: cursorScore } },
            {
              score: cursorScore,
              targetUserId: { $lt: new Types.ObjectId(cursorTargetUserId) },
            },
          ];
        }
      }
    }

    // Sort options
    let sortOptions: Record<string, 1 | -1> = {};
    switch (sort) {
      case "score":
        sortOptions = { score: -1, targetUserId: 1 };
        break;
      case "sharedCount":
        sortOptions = { sharedTagsCount: -1, score: -1, targetUserId: 1 };
        break;
      case "name":
        // Will be sorted after populating user data
        sortOptions = { score: -1, targetUserId: 1 };
        break;
      default:
        sortOptions = { score: -1, targetUserId: 1 };
    }

    // Fetch matches with projection
    const matchScores = await MatchScoreModel.find(matchQuery)
      .select("targetUserId score sharedTagsCount computedAt")
      .sort(sortOptions)
      .limit(limit + 1); // Fetch one extra to check if more exists

    const hasMore = matchScores.length > limit;
    const results = hasMore ? matchScores.slice(0, limit) : matchScores;

    // Extract target user IDs
    const targetUserIds = results.map((match) => match.targetUserId);

    // Fetch users with populated tags
    const targetUsers = await UserModel.find({
      _id: { $in: targetUserIds },
    })
      .select("_id username avatarUrl isOnline lastVisitAt tags")
      .populate("tags", "slug label");

    // Create a map for quick lookup
    const userMap = new Map(targetUsers.map((u) => [String(u._id), u]));

    // Build response
    const matches = results
      .map((match) => {
        const targetUser = userMap.get(String(match.targetUserId));
        if (!targetUser) return null;

        return {
          targetUser: {
            _id: String(targetUser._id),
            username: targetUser.username,
            avatarUrl: targetUser.avatarUrl,
            isOnline: targetUser.isOnline,
            lastVisitAt: targetUser.lastVisitAt,
            tags: targetUser.tags.map((tag: any) => ({
              _id: String(tag._id),
              slug: tag.slug,
              label: tag.label,
            })),
          },
          score: match.score,
          sharedTagsCount: match.sharedTagsCount,
          computedAt: match.computedAt,
        };
      })
      .filter((match) => match !== null);

    // Sort by name if requested
    let finalMatches = matches;
    if (sort === "name") {
      finalMatches = [...matches].sort((a, b) => {
        const nameA = (a?.targetUser.username || "").toLowerCase();
        const nameB = (b?.targetUser.username || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    // Generate next cursor
    let nextCursor: string | undefined;
    if (hasMore && results.length > 0) {
      const lastMatch = results[results.length - 1];
      nextCursor = `${lastMatch.score}_${String(user._id)}_${String(lastMatch.targetUserId)}`;
    }

    // Return response
    res.json({
      matches: finalMatches as any,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    next(err);
  }
}
