import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReview,
  getCarReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// POST /api/reviews - Create review
router.post("/", protect, createReview);

// GET /api/reviews/car/:carId - Get car reviews
router.get("/car/:carId", getCarReviews);

export default router;
