// File: server/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getManagerStats,
  getAllUsers,
  updateUserStatus,
  createUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/:userId", protect, getUserById);
router.get("/", protect, authorize("manager"), getAllUsers);
router.put("/:id/status", protect, authorize("manager"), updateUserStatus);
router.post("/", protect, authorize("admin"), createUser);

router.delete(
  "/:id",
  protect,
  authorize("admin"), // Only allow admins to delete users
  deleteUser
);

// Boss-specific route
router.get("/managers/stats", protect, authorize("boss"), getManagerStats);

export default router;
