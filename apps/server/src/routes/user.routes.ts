import { Router } from "express";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// Get current user profile
router.get("/me", getCurrentUser);

// Update current user profile
router.patch("/me", updateCurrentUser);

export default router;
