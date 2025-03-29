import Rental from "../models/Rental.js";
import Car from "../models/Car.js";

export const approveRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.rentalId);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    rental.status = "approved";
    await rental.save();
    res.json({ message: "Rental approved" });
  } catch (error) {
    res.status(500).json({ message: "Error approving rental" });
  }
};

export const manageCars = async (req, res) => {
  try {
    const { carId, updateData } = req.body;
    const car = await Car.findByIdAndUpdate(carId, updateData, { new: true });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error managing cars" });
  }
};

export const getReturnedCars = async (req, res) => {
  try {
    const returnedCars = await Car.find({ isAvailable: false });
    res.json(returnedCars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching returned cars" });
  }
};

export const lockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, { locked: true });
    res.json({ message: "User locked" });
  } catch (error) {
    res.status(500).json({ message: "Error locking user" });
  }
};
