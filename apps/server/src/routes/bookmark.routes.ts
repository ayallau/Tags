import { Router, type Router as ExpressRouter } from "express";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  checkBookmark,
  getBookmarkCount,
} from "../controllers/bookmarkController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import rateLimit from "express-rate-limit";

const router: ExpressRouter = Router();

// Rate limiter for creating bookmarks (20 requests per minute per user)
const createBookmarkRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: "Too many bookmark requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for deleting bookmarks (30 requests per minute per user)
const deleteBookmarkRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many delete requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require authentication
router.use(requireAuth);

// Get bookmark count
router.get("/count", getBookmarkCount);

// Check if bookmarked
router.get("/check", checkBookmark);

// List all bookmarks for current user
router.get("/", getBookmarks);

// Create or update a bookmark (idempotent)
router.post("/", createBookmarkRateLimit, createBookmark);

// Update bookmark remark
router.patch("/:id", updateBookmark);

// Delete a bookmark
router.delete("/:id", deleteBookmarkRateLimit, deleteBookmark);

export default router;
