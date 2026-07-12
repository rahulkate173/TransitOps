import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    cargoWeight: {
      type: Number,
      required: true,
    },

    plannedDistance: {
      type: Number,
      required: true,
    },

    actualDistance: {
      type: Number,
      default: 0,
    },

    fuelConsumed: {
      type: Number,
      default: 0,
    },

    startOdometer: {
      type: Number,
      required: true,
    },

    endOdometer: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
      default: "Draft",
    },

    dispatchTime: {
      type: Date,
    },

    completionTime: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Trip", tripSchema);