// import express from "express";
// import {
//   getUserProfile,
//   updateUserProfile,
//   getUserById,
//   getAllUsers,
//   updateUserStatus,
//   createUser,
//   deleteUser,
// } from "../controllers/userController.js";
// import { protect, authorize } from "../middleware/authMiddleware.js";
// import { uploadCarImages } from "../middleware/uploadMiddleware.js";

// const router = express.Router();

// router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, upload.single("avatar"), updateUserProfile);
// router.get("/:userId", protect, getUserById);
// router.get("/", protect, authorize("manager"), getAllUsers);
// router.put("/:id/status", protect, authorize("manager"), updateUserStatus);
// router.post("/", protect, authorize("admin"), createUser);
// router.delete("/:id", protect, authorize("admin"), deleteUser);

// export default router;

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
// Use the named export here:
import { uploadCarImages } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/:userId", protect, getUserById);
router.get("/", protect, authorize("manager"), getAllUsers);
router.put("/:id/status", protect, authorize("manager"), updateUserStatus);
router.post("/", protect, authorize("admin"), createUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

// Example of using the upload middleware for a route that needs to update an avatar:
router.put("/profile/avatar", protect, uploadCarImages, (req, res) => {
  // Your controller function that updates the user's avatar goes here
});

export default router;
