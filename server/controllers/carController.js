import Car from "../models/Car.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Export a named middleware for uploading both main image and gallery images:
export const uploadCarFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

export const addCar = async (req, res) => {
  try {
    const { body } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    const requiredFields = ["brand", "model", "year", "pricePerDay", "mileage"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing fields: ${missingFields.join(", ")}` });
    }
    if (!req.files.image && !body.imageUrl) {
      return res.status(400).json({ message: "Main image is required" });
    }

    // Construct car data from text fields and files
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
      image: req.files.image
        ? `${protocol}://${host}/uploads/${req.files.image[0].filename}`
        : body.imageUrl || "",
      isAvailable: body.isAvailable !== "false",
      status: "active",
      category: body.category || "Economy",
      featured: body.featured === "true", // Convert string "true" to boolean true
    };

    // Process gallery files if provided
    if (req.files.gallery) {
      const galleryUrls = req.files.gallery.map(
        (file) => `${protocol}://${host}/uploads/${file.filename}`
      );
      carData.gallery = galleryUrls;
    }

    const newCar = await Car.create(carData);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({ message: error.message || "Error adding car" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { body } = req;
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
      // Update main image if a new file is provided
      image: req.files.image
        ? `${protocol}://${host}/uploads/${req.files.image[0].filename}`
        : body.imageUrl || "",
      isAvailable: true,
      status: "active",
      category: body.category || "Economy",
      featured: body.featured === "true",
    };

    // Process gallery files update if provided, appending to existing gallery array
    if (req.files.gallery) {
      const galleryUrls = req.files.gallery.map(
        (file) => `${protocol}://${host}/uploads/${file.filename}`
      );
      // If you want to replace the gallery entirely, use:
      updates.gallery = galleryUrls;
      // Or, if appending, retrieve existing car and concatenate:
      // const existingCar = await Car.findById(req.params.id);
      // updates.gallery = (existingCar.gallery || []).concat(galleryUrls);
    }

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

// The remaining functions remain the same
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
    const cars = await Car.find({ isAvailable: true, status: "active" }).sort({
      createdAt: -1,
    });
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

export const getFeaturedCars = async (req, res) => {
  try {
    const featuredCars = await Car.find({ featured: true });
    res.json(featuredCars);
  } catch (error) {
    console.error("Error fetching featured cars:", error);
    res.status(500).json({ message: "Error fetching featured cars" });
  }
};

export const getPopularCars = async (req, res) => {
  try {
    const popularCars = await Car.find().sort({ createdAt: -1 }).limit(10);
    res.json(popularCars);
  } catch (error) {
    console.error("Error fetching popular cars:", error);
    res.status(500).json({ message: "Error fetching popular cars" });
  }
};

export const getCarCategories = async (req, res) => {
  try {
    const categories = ["Economy", "SUV", "Luxury", "Convertible", "Van"];
    res.json(categories);
  } catch (error) {
    console.error("Error fetching car categories:", error);
    res.status(500).json({ message: "Error fetching car categories" });
  }
};
