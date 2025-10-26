import { Router, type Router as ExpressRouter } from "express";
import {
  getFriends,
  createFriend,
  updateFriend,
  deleteFriend,
  deleteFriendByTargetUser,
  checkFriend,
  getFriendCount,
} from "../controllers/friendController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import rateLimit from "express-rate-limit";

const router: ExpressRouter = Router();

// Rate limiter for creating friends (30 requests per minute per user)
const createFriendRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many friend requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for deleting friends (30 requests per minute per user)
const deleteFriendRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many delete requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require authentication
router.use(requireAuth);

// Get friend count
router.get("/count", getFriendCount);

// Check if friended
router.get("/check", checkFriend);

// List all friends for current user
router.get("/", getFriends);

// Create or get a friend (idempotent)
router.post("/:targetUserId", createFriendRateLimit, createFriend);

// Update friend visibility (canNotify)
router.patch("/:id", updateFriend);

// Delete a friend by target user ID
router.delete(
  "/user/:targetUserId",
  deleteFriendRateLimit,
  deleteFriendByTargetUser
);

// Delete a friend by record ID
router.delete("/:id", deleteFriendRateLimit, deleteFriend);

export default router;
