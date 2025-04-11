// File: server/routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  updateUserStatus,
  createUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
// Import the new avatar upload middleware
import uploadAvatar from "../middleware/uploadAvatar.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
// Use uploadAvatar for profile update so a file field named "avatar" is processed.
router.put("/profile", protect, uploadAvatar, updateUserProfile);

router.get("/:userId", protect, getUserById);
router.get("/", protect, authorize("manager"), getAllUsers);
router.put("/:id/status", protect, authorize("manager"), updateUserStatus);
router.post("/", protect, authorize("admin"), createUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

// You may remove this extra route if not needed.
// router.put("/profile/avatar", protect, uploadAvatar, (req, res) => {
//   res.json({ message: "Avatar updated successfully" });
// });

export default router;
