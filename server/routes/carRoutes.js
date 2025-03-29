import express from "express";
import {
  getAllCars,
  getAvailableCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
  upload,
} from "../controllers/carController.js";
import {
  authenticateUser,
  authorizeRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public Routes (No Authentication Needed)
router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/:id", getCarById);

// ✅ Restricted Routes (Only Managers & Admins)
router.post(
  "/",
  authenticateUser,
  authorizeRole(["manager", "admin"]),
  upload, // ✅ Ensures Image Upload Works
  addCar
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRole(["manager", "admin"]),
  updateCar
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["manager", "admin"]),
  deleteCar
);

export default router;
