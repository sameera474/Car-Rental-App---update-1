// File: server/routes/carRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getAllCars,
  getAvailableCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";

const router = express.Router();

// Public routes
router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/:id", getCarById);

// Protected routes
router.post("/", protect, authorize("manager", "admin"), addCar);
router.put("/:id", protect, authorize("manager", "admin"), updateCar);
router.delete("/:id", protect, authorize("manager", "admin"), deleteCar);

export default router;
