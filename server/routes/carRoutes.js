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
  upload,
} from "../controllers/carController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/featured", getFeaturedCars);
router.get("/popular", getPopularCars);
router.get("/categories", getCarCategories);
router.get("/:id", getCarById);

// Protected routes (only for managers and admins)
router.post("/", protect, authorize("manager", "admin"), upload, addCar);
router.put("/:id", protect, authorize("manager", "admin"), upload, updateCar);
router.put("/:id/remove", protect, authorize("manager", "admin"), removeCar);

export default router;
