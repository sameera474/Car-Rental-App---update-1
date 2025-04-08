import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../controllers/carController.js";
import {
  getAllCars,
  getAvailableCars,
  getCarById,
  addCar,
  updateCar,
  removeCar,
} from "../controllers/carController.js";

const router = express.Router();

router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/:id", getCarById);

// Protected routes
router.post("/", protect, authorize("manager", "admin"), upload, addCar);
router.put("/:id", protect, authorize("manager", "admin"), upload, updateCar);
router.put("/:id/remove", protect, authorize("manager", "admin"), removeCar);

export default router;
