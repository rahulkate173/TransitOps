import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },

    vehicleName: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: {
        values: ["Van", "Truck", "Mini Truck", "Bus", "Car"],
        message: "Type must be one of: Van, Truck, Mini Truck, Bus, Car",
      },
      required: [true, "Vehicle type is required"],
    },

    maxLoadCapacity: {
      type: Number,
      required: [true, "Max load capacity is required"],
      min: [1, "Max load capacity must be greater than 0"],
    },

    capacityUnit: {
      type: String,
      enum: {
        values: ["kg", "ton"],
        message: "Capacity unit must be kg or ton",
      },
      default: "kg",
    },

    odometer: {
      type: Number,
      default: 0,
      min: [0, "Odometer cannot be negative"],
    },

    acquisitionCost: {
      type: Number,
      required: [true, "Acquisition cost is required"],
      min: [0, "Acquisition cost cannot be negative"],
    },

    manufactureYear: {
      type: Number,
    },

    fuelType: {
      type: String,
      enum: {
        values: ["Diesel", "Petrol", "CNG", "Electric"],
        message: "Fuel type must be one of: Diesel, Petrol, CNG, Electric",
      },
    },

    status: {
      type: String,
      enum: {
        values: ["Available", "On Trip", "In Shop", "Retired"],
        message: "Status must be one of: Available, On Trip, In Shop, Retired",
      },
      default: "Available",
    },

    currentDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vehicle", vehicleSchema);
