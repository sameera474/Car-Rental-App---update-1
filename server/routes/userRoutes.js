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
// Change the imported name to match the export from uploadMiddleware.js
import { uploadCarFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
// For updating the user profile avatar, if you need to use file upload,
// you can use the uploadCarFiles middleware. Otherwise, if you don't need to upload images, you can remove it.
router.put("/profile", protect, uploadCarFiles, updateUserProfile);

router.get("/:userId", protect, getUserById);
router.get("/", protect, authorize("manager"), getAllUsers);
router.put("/:id/status", protect, authorize("manager"), updateUserStatus);
router.post("/", protect, authorize("admin"), createUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

// Example route using the upload middleware if needed
router.put("/profile/avatar", protect, uploadCarFiles, (req, res) => {
  // Call your controller function to update the user's avatar
  // For example:
  // updateUserAvatar(req, res);
  res.json({ message: "Avatar updated successfully" });
});

export default router;
