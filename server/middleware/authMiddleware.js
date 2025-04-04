// File: server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(401).json({
        message:
          error.name === "TokenExpiredError"
            ? "Session expired"
            : "Invalid authentication",
      });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No authentication token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Add this check to ensure roles are properly compared
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is unauthorized to access this resource`,
      });
    }
    next();
  };
};
