// server/routes/rentalRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  rentCar,
  returnCar,
  getUserRentals,
} from "../controllers/rentalController.js";

const router = express.Router();

// POST /api/rentals - Create new rental
router.post("/", protect, rentCar);

// PUT /api/rentals/:id/return - Return a car
router.put("/:id/return", protect, returnCar);

// GET /api/rentals/user/:userId - Get user rentals
router.get("/user/:userId", protect, getUserRentals);

export default router;
