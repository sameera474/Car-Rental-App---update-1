// File: server/controllers/bossController.js
import Rental from "../models/Rental.js";
import User from "../models/User.js";

export const getFinancialReport = async (req, res) => {
  try {
    const rentals = await Rental.find().populate("car user");
    const totalRevenue = rentals.reduce(
      (sum, rental) => sum + rental.totalCost,
      0
    );

    res.json({
      totalRevenue,
      totalRentals: rentals.length,
      details: rentals.map((r) => ({
        car: r.car?.model,
        user: r.user?.email,
        duration: `${r.startDate} - ${r.endDate}`,
        cost: r.totalCost,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating financial report" });
  }
};

export const manageManagers = async (req, res) => {
  try {
    const { userId, action } = req.body;
    const validActions = ["promote", "demote"];

    if (!validActions.includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = action === "promote" ? "manager" : "user";
    await user.save();

    res.json({
      message: `User ${action}d successfully`,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error managing managers" });
  }
};
