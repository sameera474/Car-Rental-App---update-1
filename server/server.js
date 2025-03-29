import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { PORT } from "./config/envConfig.js";
import adminRoutes from "./routes/adminRoutes.js";

// ✅ Ensure `.env` is loaded first
dotenv.config();

// ✅ Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/rentals", rentalRoutes);
// ✅ Register routes
app.use("/api/admin", adminRoutes);

// ✅ Use Global Error Handler
app.use(errorHandler);

// ✅ Connect to MongoDB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if database connection fails
  }
};

startServer();
