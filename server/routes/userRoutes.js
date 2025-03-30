// File: server/routes/userRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js"; // Fixed import names
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/:userId", protect, getUserById);

export default router;
