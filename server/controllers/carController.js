import Car from "../models/Car.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// ✅ Set Up Multer Storage for Image Uploads
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage }).single("image");

// ✅ Add a New Car (With Image Upload)
export const addCar = async (req, res) => {
  try {
    console.log("Incoming Car Data:", req.body);
    console.log("Uploaded File:", req.file);

    const {
      brand,
      model,
      year,
      pricePerDay,
      location,
      seats,
      doors,
      power,
      luggage,
      transmission,
      kwPower,
      co2Emission,
      minAge,
    } = req.body;

    if (!brand || !model || !pricePerDay || !year) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newCar = new Car({
      brand,
      model,
      year,
      seats,
      doors,
      power,
      luggage,
      transmission,
      kwPower,
      co2Emission,
      minAge,
      pricePerDay,
      location,
      image: imageUrl,
      isAvailable: true,
      protection: {
        basic: true,
        excess: "€950.00",
        collisionDamage: true,
        theftProtection: true,
        upgradeAvailable: true,
      },
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ message: "Error adding car" });
  }
};

// ✅ Update Car Details
export const updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: "Error updating car" });
  }
};

// ✅ Get All Cars
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
};

// ✅ Get Available Cars
export const getAvailableCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available cars" });
  }
};

// ✅ Delete Car
export const deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car" });
  }
};

// ✅ Get a Single Car by ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Error fetching car" });
  }
};
