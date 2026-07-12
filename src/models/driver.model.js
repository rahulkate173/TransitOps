import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    licenseCategory: {
      type: String,
      enum: ["LMV", "HMV", "Transport"],
      required: true,
    },

    licenseExpiry: {
      type: Date,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    safetyScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["Available", "On Trip", "Off Duty", "Suspended"],
      default: "Available",
    },

    currentVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Driver", driverSchema);