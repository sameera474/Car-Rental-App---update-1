import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  seats: { type: Number, default: 5 },
  doors: { type: Number, default: 5 },
  power: { type: String, default: "92CV" },
  luggage: { type: Number, default: 1 },
  transmission: {
    type: String,
    enum: ["Manual", "Automatic"],
    default: "Manual",
  },
  kwPower: { type: String, default: "68 kW" },
  co2Emission: { type: String, default: "124g/km" },
  minAge: { type: Number, default: 19 },
  pricePerDay: { type: Number, required: true },
  protection: {
    basic: { type: Boolean, default: true },
    excess: { type: String, default: "€950.00" },
    collisionDamage: { type: Boolean, default: true },
    theftProtection: { type: Boolean, default: true },
    upgradeAvailable: { type: Boolean, default: true },
  },
  location: { type: String, default: "Default Location" },
  image: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },
});

export default mongoose.model("Car", CarSchema);
