import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // Ensure this import exists for role checking

dotenv.config();

// ✅ Authenticate Users & Fetch User Data
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User Not Found" });
    }

    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

// ✅ Check If User is Manager or Admin
export const isManager = (req, res, next) => {
  if (!req.user || (req.user.role !== "manager" && req.user.role !== "admin")) {
    return res
      .status(403)
      .json({ message: "Access Denied - Managers/Admins Only" });
  }
  next();
};

// ✅ Flexible Role Authorization Middleware
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access Denied - Insufficient Permissions" });
    }
    next();
  };
};
