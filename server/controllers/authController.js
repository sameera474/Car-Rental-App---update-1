import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    let { name, email, phone, password, role } = req.body;
    email = email.toLowerCase().trim();
    name = name.trim();
    phone = phone ? phone.trim() : "";
    if (
      !password ||
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long, include an uppercase letter and a number.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const user = new User({
      name,
      email,
      phone,
      password,
      role: role || "user",
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    email = email.toLowerCase().trim();
    password = password.trim();

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Ensure role matches the user role in DB
    if (role && role !== user.role) {
      return res
        .status(403)
        .json({ message: "Role mismatch! Unauthorized login attempt." });
    }

    // ✅ Generate JWT Token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
