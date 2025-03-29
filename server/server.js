// File: server/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
// ...other routes

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
