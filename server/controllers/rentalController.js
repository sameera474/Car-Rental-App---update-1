import Rental from "../models/Rental.js";
import Car from "../models/Car.js";

// ✅ Function to get user rental history
export const getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.params.userId }).populate(
      "car"
    );
    res.json(rentals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching rental history", error: error.message });
  }
};

// ✅ Function to rent a car
export const rentCar = async (req, res) => {
  try {
    const { carId, startDate, endDate, totalCost } = req.body;

    // ✅ Validate rental dates
    if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Invalid rental dates" });
    }

    // ✅ Check if car exists
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // ✅ Ensure car is available
    if (!car.isAvailable) {
      return res.status(400).json({ message: "Car is not available for rent" });
    }

    // ✅ Create new rental entry
    const newRental = new Rental({
      user: req.user.userId,
      car: carId,
      startDate,
      endDate,
      totalCost,
      status: "active",
    });

    // ✅ Update car availability
    car.isAvailable = false;
    await car.save();
    await newRental.save();

    res
      .status(201)
      .json({ message: "Car rented successfully", rental: newRental });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing rental", error: error.message });
  }
};

// ✅ Function to return a car
export const returnCar = async (req, res) => {
  try {
    const rental = await Rental.findById(req.body.rentalId).populate("car");
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    // ✅ Mark rental as completed
    rental.status = "completed";
    await rental.save();

    // ✅ Mark car as available again
    const car = await Car.findById(rental.car._id);
    if (car) {
      car.isAvailable = true;
      await car.save();
    }

    res.json({ message: "Car returned successfully", rental });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing return", error: error.message });
  }
};
