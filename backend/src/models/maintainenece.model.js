import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },
    maintenanceType: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    serviceCenter: {
        type: String
    },
    cost: {
        type: Number,
        default: 0
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    completedDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
