import mongoose from "mongoose";
import UserModel from "./User.js";
import TagModel from "./Tag.js";
import PasswordResetTokenModel from "./PasswordResetToken.js";
import MatchScoreModel from "./MatchScore.js";
import BookmarkModel from "./Bookmark.js";
import FriendModel from "./Friend.js";
import BlockModel from "./Block.js";
import HiddenModel from "./Hidden.js";

// Export all models
export {
  UserModel,
  TagModel,
  PasswordResetTokenModel,
  MatchScoreModel,
  BookmarkModel,
  FriendModel,
  BlockModel,
  HiddenModel,
};

// Model names
export const MODEL_NAMES = {
  USER: "User",
  TAG: "Tag",
  PASSWORD_RESET_TOKEN: "PasswordResetToken",
  MATCH_SCORE: "MatchScore",
  BOOKMARK: "Bookmark",
  FRIEND: "Friend",
  BLOCK: "Block",
  HIDDEN: "Hidden",
} as const;

/**
 * Check that all models are registered correctly in Mongoose
 */
export function checkModelsRegistered(): void {
  const registeredModels = mongoose.modelNames();
  const expectedModels = Object.values(MODEL_NAMES);

  const missingModels = expectedModels.filter(
    (modelName) => !registeredModels.includes(modelName)
  );

  if (missingModels.length > 0) {
    throw new Error(`Missing models in mongoose: ${missingModels.join(", ")}`);
  }

  console.log("✓ All models registered successfully:", registeredModels);
}

/**
 * Validate schema indexes and constraints
 */
export async function validateSchemas(): Promise<void> {
  try {
    // Check User indexes
    const userIndexes = await UserModel.collection.indexes();
    console.log(
      "User indexes:",
      userIndexes.map((idx: any) => idx.name)
    );

    // Check Tag indexes
    const tagIndexes = await TagModel.collection.indexes();
    console.log(
      "Tag indexes:",
      tagIndexes.map((idx: any) => idx.name)
    );

    console.log("✓ Schema validation completed");
  } catch (error) {
    console.error("Error validating schemas:", error);
    throw error;
  }
}
