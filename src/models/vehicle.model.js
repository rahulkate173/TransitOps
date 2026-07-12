import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    vehicleName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Van", "Truck", "Mini Truck", "Bus", "Car"],
      required: true,
    },

    maxLoadCapacity: {
      type: Number,
      required: true,
    },

    capacityUnit: {
      type: String,
      enum: ["kg", "ton"],
      default: "kg",
    },

    odometer: {
      type: Number,
      required: true,
      default: 0,
    },

    acquisitionCost: {
      type: Number,
      required: true,
    },

    manufactureYear: {
      type: Number,
    },

    fuelType: {
      type: String,
      enum: ["Diesel", "Petrol", "CNG", "Electric"],
    },

    status: {
      type: String,
      enum: ["Available", "On Trip", "In Shop", "Retired"],
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

