// File: server/controllers/userController.js
import User from "../models/User.js";
import { generateToken } from "../utils/authUtils.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new token with updated information
    const token = generateToken(user._id, user.role);

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("rentals", "startDate endDate totalCost");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Add financial data for boss view
    if (req.user.role === "boss" && user.role === "manager") {
      const managedRentals = await Rental.find({ managedBy: user._id });
      user.managedRevenue = managedRentals.reduce(
        (sum, r) => sum + r.totalCost,
        0
      );
      user.managedCount = managedRentals.length;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// New helper function for boss dashboard
export const getManagerStats = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" })
      .select("name email createdAt")
      .populate({
        path: "rentals",
        select: "totalCost",
        match: { status: "completed" },
      });

    const stats = managers.map((manager) => ({
      _id: manager._id,
      name: manager.name,
      email: manager.email,
      totalRevenue: manager.rentals.reduce((sum, r) => sum + r.totalCost, 0),
      rentalCount: manager.rentals.length,
      since: manager.createdAt,
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching manager stats" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email status");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "locked" : "active";
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user status" });
  }
};
export const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role: role || "user",
      status: "active",
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
