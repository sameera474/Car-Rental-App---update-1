// server/controllers/carController.js
import Car from "../models/Car.js";
import Rental from "../models/Rental.js";

// Add Car – now handling a main image and an optional gallery
export const addCar = async (req, res) => {
  try {
    const { body, files } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    const requiredFields = ["brand", "model", "year", "pricePerDay", "mileage"];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing fields: ${missingFields.join(", ")}` });
    }
    // Check for a main image: either uploaded as "image" or provided via imageUrl in the body
    if ((!files || !files.image) && !body.imageUrl) {
      return res.status(400).json({ message: "Main image is required" });
    }

    // Process main image
    let mainImage = "";
    if (files && files.image && files.image.length > 0) {
      mainImage = `${protocol}://${host}/uploads/${files.image[0].filename}`;
    } else {
      mainImage = body.imageUrl || "";
    }

    // Process gallery images if provided
    let gallery = [];
    if (files && files.gallery) {
      gallery = files.gallery.map(
        (file) => `${protocol}://${host}/uploads/${file.filename}`
      );
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
      image: mainImage,
      gallery: gallery,
      isAvailable: body.isAvailable !== "false",
      status: "active",
      category: body.category || "Economy",
      featured: body.featured === "true",
    };

    const newCar = await Car.create(carData);
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({ message: error.message || "Error adding car" });
  }
};

// Update Car – handling new main image & gallery files
export const updateCar = async (req, res) => {
  try {
    const { body, files } = req;
    const protocol = req.protocol;
    const host = req.get("host");

    let mainImage = "";
    if (files && files.image && files.image.length > 0) {
      mainImage = `${protocol}://${host}/uploads/${files.image[0].filename}`;
    } else {
      mainImage = req.body.imageUrl || "";
    }

    let gallery = [];
    if (files && files.gallery) {
      gallery = files.gallery.map(
        (file) => `${protocol}://${host}/uploads/${file.filename}`
      );
    } else if (body.galleryUrls) {
      // In case gallery URLs are sent as a comma-separated string
      gallery = body.galleryUrls.split(",").map((url) => url.trim());
    }

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
      image: mainImage,
      gallery: gallery,
      isAvailable: true,
      status: "active",
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

// Get All Cars, Get Available Cars, Get Car by ID, Remove Car, Get Featured Cars, Get Popular Cars, and Get Car Categories remain unchanged
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
    res.status(500).json({
      message: "Error fetching available cars",
      error: error.message,
    });
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
