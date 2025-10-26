import { Router, type Router as ExpressRouter } from "express";
import {
  getCurrentUser,
  updateCurrentUser,
  handleDiscoverUsers,
} from "../controllers/userController.js";
import { getMatches } from "../controllers/matchController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import rateLimit from "express-rate-limit";

const router: ExpressRouter = Router();

// Rate limiter for update profile endpoint (10 requests per minute per user)
const updateProfileRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: "Too many profile update requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Discover users (public endpoint)
router.get("/discover", handleDiscoverUsers);

// All other routes require authentication
router.use(requireAuth);

// Get current user profile
router.get("/me", getCurrentUser);

// Get matches for current user
router.get("/matches", getMatches);

// Update current user profile
router.patch("/me", updateProfileRateLimit, updateCurrentUser);

export default router;
