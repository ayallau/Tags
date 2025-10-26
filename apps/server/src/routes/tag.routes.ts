import { Router } from "express";
import {
  handleCreateTag,
  handleListTags,
  handleSearchTags,
  handleGetTag,
  handleUpdateTag,
  handleDeleteTag,
  handlePopularTags,
} from "../controllers/tagController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import rateLimit from "express-rate-limit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const router: any = Router();

// Rate limiter for search endpoint (20 requests per minute per IP)
const searchRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: "Too many search requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.get("/", handleListTags);
router.get("/search", searchRateLimit, handleSearchTags);
router.get("/popular", handlePopularTags);
router.get("/:id", handleGetTag);

// Protected routes (require authentication)
router.post("/", requireAuth, handleCreateTag);
router.patch("/:id", requireAuth, handleUpdateTag);
router.delete("/:id", requireAuth, handleDeleteTag);

export default router;
