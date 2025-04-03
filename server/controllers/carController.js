import Car from "../models/Car.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");

// Create uploads directory if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");

export const addCar = async (req, res) => {
  try {
    const { body, file } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    // Validation
    const requiredFields = ["brand", "model", "year", "pricePerDay"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (!file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Construct car data
    const carData = {
      brand: body.brand,
      model: body.model,
      year: Number(body.year),
      pricePerDay: Number(body.pricePerDay),
      seats: Number(body.seats || 5),
      doors: Number(body.doors || 5),
      transmission: body.transmission || "Manual",
      location: body.location || "Main Branch",
      image: file ? `${protocol}://${host}/uploads/${file.filename}` : "",
      isAvailable: body.isAvailable !== "false",
    };

    const newCar = await Car.create(carData);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({
      message: error.message || "Error adding car",
      error: error.errors,
    });
  }
};
export const updateCar = async (req, res) => {
  try {
    const { body, file } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    const updates = {
      ...body,
      year: Number(body.year),
      pricePerDay: Number(body.pricePerDay),
      seats: Number(body.seats),
      doors: Number(body.doors),
      isAvailable: body.isAvailable !== "false",
    };

    if (file) {
      updates.image = `${protocol}://${host}/uploads/${file.filename}`;
    } else if (body.imageUrl) {
      // Add this line
      updates.image = body.imageUrl;
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
    res.status(500).json({
      message: error.message || "Error updating car",
      error: error.errors,
    });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    console.log("Fetched cars:", cars); // Add logging
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res
      .status(500)
      .json({ message: "Error fetching cars", error: error.message });
  }
};

export const getAvailableCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching available cars", error: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (car.image) {
      const filename = car.image.split("/uploads/")[1];
      const imagePath = path.join(uploadDir, filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting car", error: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching car", error: error.message });
  }
};
// File: server/controllers/carController.js
export const getCarStats = async (req, res) => {
  try {
    const stats = await Rental.aggregate([
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "car",
        },
      },
      {
        $unwind: "$car",
      },
      {
        $group: {
          _id: "$car._id",
          brand: { $first: "$car.brand" },
          model: { $first: "$car.model" },
          totalRevenue: { $sum: "$totalCost" },
          rentalCount: { $sum: 1 },
        },
      },
      {
        $sort: { rentalCount: -1 },
      },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car statistics" });
  }
};
