// File: server/routes/rentalRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  rentCar,
  returnCar,
  getUserRentals,
  getPendingRentals,
  approveRental,
  getRentalStats,
} from "../controllers/rentalController.js";

const router = express.Router();

// Manager routes
router.get("/pending", protect, authorize("manager"), getPendingRentals);
router.put("/:id/approve", protect, authorize("manager"), approveRental);
router.get("/stats", protect, authorize("manager"), getRentalStats);

// Existing user routes
router.post("/", protect, rentCar);
router.put("/:id/return", protect, returnCar);
router.get("/user/:userId", protect, getUserRentals);

export default router;
