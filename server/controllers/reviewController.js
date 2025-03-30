import mongoose from "mongoose";
import Review from "../models/Review.js";
import Car from "../models/Car.js";
import Rental from "../models/Rental.js";

export const createReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate input format
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ message: "Invalid car ID format" });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (typeof comment !== "string" || comment.trim().length < 10) {
      return res
        .status(400)
        .json({ message: "Comment must be at least 10 characters" });
    }

    // Check for completed rental
    const rentalExists = await Rental.exists({
      user: userId,
      car: carId,
      status: "completed",
    });

    if (!rentalExists) {
      return res.status(403).json({
        message: "You must complete a rental before reviewing this car",
      });
    }

    // Check for existing review
    const existingReview = await Review.findOne({ user: userId, car: carId });
    if (existingReview) {
      return res.status(400).json({
        message: "You've already reviewed this car",
        existingReview,
      });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      car: carId,
      rating,
      comment: comment.trim(),
    });

    // Update car ratings
    const car = await Car.findById(carId);
    const newTotalRatings = car.ratingsAverage * car.ratingsQuantity + rating;
    car.ratingsQuantity += 1;
    car.ratingsAverage = newTotalRatings / car.ratingsQuantity;
    await car.save();

    res.status(201).json(review);
  } catch (error) {
    console.error("Review creation error:", error);
    res.status(500).json({
      message: error.message || "Error creating review",
      errorDetails: error.errors,
    });
  }
};

export const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      message: error.message || "Error fetching reviews",
    });
  }
};
