import Rental from "../models/Rental.js";
import User from "../models/User.js";

export const getFinancialReport = async (req, res) => {
  try {
    const rentals = await Rental.find();
    const totalRevenue = rentals.reduce(
      (sum, rental) => sum + rental.totalCost,
      0
    );
    res.json({ totalRevenue, totalRentals: rentals.length });
  } catch (error) {
    res.status(500).json({ message: "Error generating financial report" });
  }
};

export const manageManagers = async (req, res) => {
  try {
    const { userId, action } = req.body;
    if (action === "promote") {
      await User.findByIdAndUpdate(userId, { role: "manager" });
    } else if (action === "demote") {
      await User.findByIdAndUpdate(userId, { role: "user" });
    }
    res.json({ message: "Manager role updated" });
  } catch (error) {
    res.status(500).json({ message: "Error managing managers" });
  }
};
