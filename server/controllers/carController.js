import Car from "../models/Car.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export const addCar = async (req, res) => {
  try {
    const { body, file } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    const requiredFields = ["brand", "model", "year", "pricePerDay", "mileage"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing fields: ${missingFields.join(", ")}` });
    }
    if (!file && !req.body.imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    const carData = {
      brand: body.brand,
      model: body.model,
      year: Number(body.year),
      pricePerDay: Number(body.pricePerDay),
      mileage: Number(body.mileage),
      seats: Number(body.seats || 5),
      doors: Number(body.doors || 5),
      transmission: body.transmission || "Manual",
      location: body.location || "Main Branch",
      image: file
        ? `${protocol}://${host}/uploads/${file.filename}`
        : req.body.imageUrl || "",
      isAvailable: body.isAvailable !== "false",
      status: "active",
    };

    const newCar = await Car.create(carData);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({ message: error.message || "Error adding car" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { body, file } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    // Use the variable "updates" consistently
    const updates = {
      brand: body.brand,
      model: body.model,
      year: Number(body.year),
      pricePerDay: Number(body.pricePerDay),
      mileage: Number(body.mileage),
      seats: Number(body.seats || 5),
      doors: Number(body.doors || 5),
      transmission: body.transmission || "Manual",
      location: body.location || "Main Branch",
      image: file
        ? `${protocol}://${host}/uploads/${file.filename}`
        : req.body.imageUrl || "",
      // When updating a car, we set it available and active by default; adjust if needed
      isAvailable: true,
      status: "active",
    };

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error updating car" });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
};

export const getAvailableCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true, status: "active" });
    res.json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching available cars", error: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching car", error: error.message });
  }
};

export const removeCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { status: "removed", isAvailable: false },
      { new: true }
    );
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car marked as removed", car });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing car", error: error.message });
  }
};
