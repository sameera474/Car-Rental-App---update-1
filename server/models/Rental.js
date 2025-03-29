import mongoose from "mongoose";

const RentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  startDate: Date,
  endDate: Date,
  totalCost: Number,
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

export default mongoose.model("Rental", RentalSchema);
