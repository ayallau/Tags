import express, { type Router } from "express";
import {
  getBlockedUsers,
  postBlockUser,
  deleteBlockUser,
  getHiddenUsers,
  postHideUser,
  deleteHideUser,
} from "../controllers/settingsController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router: Router = express.Router();

// Protected routes - all require authentication
router.use(requireAuth);

// Blocked users endpoints
router.get("/blocked", getBlockedUsers);
router.post("/blocked/:targetUserId", postBlockUser);
router.delete("/blocked/:targetUserId", deleteBlockUser);

// Hidden users endpoints
router.get("/hidden", getHiddenUsers);
router.post("/hidden/:targetUserId", postHideUser);
router.delete("/hidden/:targetUserId", deleteHideUser);

export default router;
