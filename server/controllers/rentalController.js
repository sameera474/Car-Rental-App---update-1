// server/controllers/rentalController.js
import Rental from "../models/Rental.js";
import Car from "../models/Car.js";

// server/controllers/rentalController.js
export const getUserRentals = async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const rentals = await Rental.find({ user: req.params.userId })
      .populate({
        path: "car",
        select: "brand model image pricePerDay",
      })
      .sort({ startDate: -1 });

    res.json(rentals);
  } catch (error) {
    console.error("Get rentals error:", error);
    res.status(500).json({
      message: "Error fetching rental history",
      error: error.message,
    });
  }
};

export const rentCar = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ message: "Invalid rental dates" });
    }

    // Find car with lock
    const car = await Car.findOne({ _id: carId, isAvailable: true });
    if (!car) {
      return res.status(404).json({ message: "Car not available" });
    }

    // Calculate duration
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalCost = days * car.pricePerDay;

    // Create transaction
    const session = await Rental.startSession();
    session.startTransaction();

    try {
      // Create rental
      const newRental = await Rental.create(
        [
          {
            user: userId,
            car: carId,
            startDate: start,
            endDate: end,
            totalCost,
            status: "active",
          },
        ],
        { session }
      );

      // Update car availability
      await Car.findByIdAndUpdate(carId, { isAvailable: false }, { session });

      await session.commitTransaction();
      res.status(201).json(newRental[0]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Rent car error:", error);
    res.status(500).json({
      message: error.message || "Error processing rental",
    });
  }
};

export const returnCar = async (req, res) => {
  const session = await Rental.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rental = await Rental.findOneAndUpdate(
      { _id: id, user: userId, status: "active" },
      { status: "completed" },
      { new: true, session }
    ).populate("car");

    if (!rental) {
      return res.status(404).json({ message: "Active rental not found" });
    }

    await Car.findByIdAndUpdate(
      rental.car._id,
      { isAvailable: true },
      { session }
    );

    await session.commitTransaction();
    res.json({
      message: "Car returned successfully",
      carId: rental.car._id, // Ensure correct field name
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: error.message || "Error processing return",
    });
  } finally {
    session.endSession();
  }
};
// File: server/controllers/rentalController.js
export const getPendingRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ status: "pending" })
      .populate("user", "name email")
      .populate("car", "brand model pricePerDay");
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending rentals" });
  }
};

export const approveRental = async (req, res) => {
  const session = await Rental.startSession();
  session.startTransaction();

  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true, session }
    ).populate("car");

    await Car.findByIdAndUpdate(
      rental.car._id,
      { isAvailable: false },
      { session }
    );

    await session.commitTransaction();
    res.json({ message: "Rental approved successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error approving rental" });
  } finally {
    session.endSession();
  }
};

export const getRentalStats = async (req, res) => {
  try {
    const stats = await Rental.aggregate([
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "car",
        },
      },
      {
        $group: {
          _id: "$car._id",
          totalRevenue: { $sum: "$totalCost" },
          rentalCount: { $sum: 1 },
          carDetails: { $first: "$car" },
        },
      },
      {
        $sort: { rentalCount: -1 },
      },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rental stats" });
  }
};
