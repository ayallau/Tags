import { Router, type Router as ExpressRouter } from "express";
import {
  getCurrentUser,
  updateCurrentUser,
  handleDiscoverUsers,
} from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router: ExpressRouter = Router();

// Discover users (public endpoint)
router.get("/discover", handleDiscoverUsers);

// All other routes require authentication
router.use(requireAuth);

// Get current user profile
router.get("/me", getCurrentUser);

// Update current user profile
router.patch("/me", updateCurrentUser);

export default router;
