// File: server/routes/reviewRoutes.js
import express from "express";
import {
  createReview,
  getCarReviews,
  getUserReviews, // Import the new function
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/car/:carId", getCarReviews);
router.get("/user/:userId", protect, getUserReviews); // NEW route for user reviews

export default router;
