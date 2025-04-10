// server/routes/carRoutes.js
import express from "express";
import {
  addCar,
  updateCar,
  getAllCars,
  getAvailableCars,
  getCarById,
  removeCar,
  getFeaturedCars,
  getPopularCars,
  getCarCategories,
} from "../controllers/carController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { uploadCarImages } from "../middleware/uploadMiddleware.js"; // Updated named import

const router = express.Router();

// Public routes
router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/featured", getFeaturedCars);
router.get("/popular", getPopularCars);
router.get("/categories", getCarCategories);
router.get("/:id", getCarById);

// Protected routes (only for managers and admins)
router.post(
  "/",
  protect,
  authorize("manager", "admin"),
  uploadCarImages,
  addCar
);
router.put(
  "/:id",
  protect,
  authorize("manager", "admin"),
  uploadCarImages,
  updateCar
);
router.put("/:id/remove", protect, authorize("manager", "admin"), removeCar);

export default router;
