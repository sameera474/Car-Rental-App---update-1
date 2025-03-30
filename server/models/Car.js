// import mongoose from "mongoose";

// const CarSchema = new mongoose.Schema({
//   brand: { type: String, required: true },
//   model: { type: String, required: true },
//   year: { type: Number, required: true },
//   seats: { type: Number, default: 5 },
//   doors: { type: Number, default: 5 },
//   power: { type: String, default: "92CV" },
//   luggage: { type: Number, default: 1 },
//   transmission: {
//     type: String,
//     enum: ["Manual", "Automatic"],
//     default: "Manual",
//   },
//   kwPower: { type: String, default: "68 kW" },
//   co2Emission: { type: String, default: "124g/km" },
//   minAge: { type: Number, default: 19 },
//   pricePerDay: { type: Number, required: true },
//   protection: {
//     basic: { type: Boolean, default: true },
//     excess: { type: String, default: "€950.00" },
//     collisionDamage: { type: Boolean, default: true },
//     theftProtection: { type: Boolean, default: true },
//     upgradeAvailable: { type: Boolean, default: true },
//   },
//   location: { type: String, default: "Default Location" },
//   image: { type: String, default: "" },
//   isAvailable: { type: Boolean, default: true },
// });

// export default mongoose.model("Car", CarSchema);
import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: [50, "Brand cannot exceed 50 characters"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
      maxlength: [50, "Model cannot exceed 50 characters"],
    },
    year: {
      type: Number,
      required: [true, "Manufacturing year is required"],
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    seats: {
      type: Number,
      default: 5,
      min: [2, "Minimum 2 seats"],
      max: [8, "Maximum 8 seats"],
    },
    doors: {
      type: Number,
      default: 5,
      min: [2, "Minimum 2 doors"],
      max: [5, "Maximum 5 doors"],
    },
    power: {
      type: String,
      default: "92CV",
      validate: {
        validator: (v) => /^\d{2,3}CV$/.test(v),
        message: "Power must be in CV format (e.g., 92CV)",
      },
    },
    luggage: {
      type: Number,
      default: 1,
      min: [0, "Luggage cannot be negative"],
    },
    transmission: {
      type: String,
      enum: {
        values: ["Manual", "Automatic"],
        message: "Transmission must be Manual or Automatic",
      },
      default: "Manual",
    },
    kwPower: {
      type: String,
      default: "68 kW",
      validate: {
        validator: (v) => /^\d{2,3} kW$/.test(v),
        message: "Power must be in kW format (e.g., 68 kW)",
      },
    },
    co2Emission: {
      type: String,
      default: "124g/km",
      validate: {
        validator: (v) => /^\d+g\/km$/.test(v),
        message: "Emission must be in g/km format (e.g., 124g/km)",
      },
    },
    minAge: {
      type: Number,
      default: 19,
      min: [18, "Minimum age must be 18"],
      max: [99, "Maximum age must be 99"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Daily price is required"],
      min: [10, "Minimum daily price is $10"],
      max: [1000, "Maximum daily price is $1000"],
    },
    protection: {
      basic: { type: Boolean, default: true },
      excess: {
        type: String,
        default: "€950.00",
        validate: {
          validator: (v) => /^€\d+\.\d{2}$/.test(v),
          message: "Excess must be in € format (e.g., €950.00)",
        },
      },
      collisionDamage: { type: Boolean, default: true },
      theftProtection: { type: Boolean, default: true },
      upgradeAvailable: { type: Boolean, default: true },
    },
    location: {
      type: String,
      default: "Main Branch",
      enum: {
        values: ["Main Branch", "Downtown", "Airport", "Central Station"],
        message: "Invalid location",
      },
    },
    image: {
      type: String,
      default: "",
      validate: {
        validator: (v) => /\.(jpg|jpeg|png|webp)$/.test(v),
        message: "Image must be JPG, JPEG, PNG, or WEBP",
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must be at most 5.0"],
      set: (val) => Math.round(val * 10) / 10, // Rounds to 1 decimal
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
CarSchema.index({ pricePerDay: 1, ratingsAverage: -1 });
CarSchema.index({ brand: 1, model: 1 });

// Virtual populate reviews
CarSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "car",
  localField: "_id",
});

// Query middleware to populate reviews
CarSchema.pre(/^find/, function (next) {
  this.populate({
    path: "reviews",
    select: "-__v -createdAt",
  });
  next();
});

// Static method to calculate ratings
CarSchema.statics.calcAverageRatings = async function (carId) {
  const stats = await this.model("Review").aggregate([
    { $match: { car: carId } },
    {
      $group: {
        _id: "$car",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await this.findByIdAndUpdate(carId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await this.findByIdAndUpdate(carId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

const Car = mongoose.model("Car", CarSchema);

export default Car;
