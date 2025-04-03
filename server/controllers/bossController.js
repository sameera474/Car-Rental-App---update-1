// File: server/controllers/bossController.js
export const getFinancialReport = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("car", "brand model pricePerDay")
      .populate("user", "name email");

    const totalRevenue = rentals.reduce(
      (sum, rental) => sum + rental.totalCost,
      0
    );

    const carEarnings = rentals.reduce((acc, rental) => {
      const carId = rental.car._id.toString();
      acc[carId] = (acc[carId] || 0) + rental.totalCost;
      return acc;
    }, {});

    const details = await Promise.all(
      Object.entries(carEarnings).map(async ([carId, total]) => {
        const car = await Car.findById(carId);
        return {
          car: `${car.brand} ${car.model}`,
          totalEarnings: total,
          rentalCount: rentals.filter((r) => r.car._id.toString() === carId)
            .length,
        };
      })
    );

    res.json({
      totalRevenue,
      totalRentals: rentals.length,
      details,
      activeManagers: await User.countDocuments({ role: "manager" }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating financial report" });
  }
};

export const manageManagers = async (req, res) => {
  try {
    const { email, action } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "promote") {
      user.role = "manager";
    } else if (action === "demote") {
      user.role = "user";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.json({ message: `User ${action}d successfully`, user });
  } catch (error) {
    res.status(500).json({ message: "Error managing managers" });
  }
};
