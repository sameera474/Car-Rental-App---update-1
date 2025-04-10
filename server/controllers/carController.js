import Car from "../models/Car.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Determine __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");

// Add Car
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
      // Add the category field (if sent; otherwise default to "Economy")
      category: body.category || "Economy",
      // If you want to mark a car as featured, pass featured: "true" in the request body.
      featured: body.featured === "true",
    };

    const newCar = await Car.create(carData);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({ message: error.message || "Error adding car" });
  }
};

// Update Car – (unchanged; see your code)
export const updateCar = async (req, res) => {
  try {
    const { body, file } = req;
    const protocol = req.protocol;
    const host = req.get("host");

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
      isAvailable: true,
      status: "active",
      // Update the category field
      category: body.category || "Economy",
      featured: body.featured === "true",
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

// Get All Cars
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

// Get Available Cars – Return only active cars that are available, sorted by creation date descending.
export const getAvailableCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true, status: "active" }).sort({
      createdAt: -1,
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching available cars",
      error: error.message,
    });
  }
};

// Get Car by ID
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

// Soft-delete (remove) a Car
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

// Get Featured Cars – Return cars where "featured" is true.
export const getFeaturedCars = async (req, res) => {
  try {
    const featuredCars = await Car.find({ featured: true });
    res.json(featuredCars);
  } catch (error) {
    console.error("Error fetching featured cars:", error);
    res.status(500).json({ message: "Error fetching featured cars" });
  }
};

// Get Popular Cars – Fallback: sort by createdAt descending and limit to 10.
export const getPopularCars = async (req, res) => {
  try {
    const popularCars = await Car.find().sort({ createdAt: -1 }).limit(10);
    res.json(popularCars);
  } catch (error) {
    console.error("Error fetching popular cars:", error);
    res.status(500).json({ message: "Error fetching popular cars" });
  }
};

// Get Car Categories – Static list if you’re not storing category on the Car.
export const getCarCategories = async (req, res) => {
  try {
    const categories = ["Economy", "SUV", "Luxury", "Convertible", "Van"];
    res.json(categories);
  } catch (error) {
    console.error("Error fetching car categories:", error);
    res.status(500).json({ message: "Error fetching car categories" });
  }
};
