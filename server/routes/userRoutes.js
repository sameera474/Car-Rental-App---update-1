// File: server/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getManagerStats,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/:userId", protect, getUserById);

// Boss-specific route
router.get("/managers/stats", protect, authorize("boss"), getManagerStats);

export default router;
