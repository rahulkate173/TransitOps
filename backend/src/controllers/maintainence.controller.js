import { Maintenance } from "../models/maintainenece.model.js";
import Vehicle from "../models/vehicle.model.js";

// 1. Create Maintenance Log
export const createMaintenance = async (req, res) => {
    try {
        const { vehicle, maintenanceType, description, serviceCenter, cost, scheduledDate } = req.body;

        const vehicleExists = await Vehicle.findById(vehicle);
        if (!vehicleExists) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const newMaintenance = await Maintenance.create({
            vehicle,
            maintenanceType,
            description,
            serviceCenter,
            cost,
            scheduledDate,
            createdBy: req.user?._id 
        });

        // Change vehicle status to In Shop
        vehicleExists.status = "In Shop";
        await vehicleExists.save();

        return res.status(201).json({ message: "Maintenance log created successfully", maintenance: newMaintenance });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 2. Get All Maintenance Logs
export const getAllMaintenance = async (req, res) => {
    try {
        const { status, vehicle, maintenanceType } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (vehicle) filter.vehicle = vehicle;
        if (maintenanceType) filter.maintenanceType = maintenanceType;

        const logs = await Maintenance.find(filter)
            .populate("vehicle", "registrationNumber vehicleName type")
            .populate("createdBy", "username");

        return res.status(200).json({ maintenanceLogs: logs });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 3. Get Maintenance by ID
export const getMaintenanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await Maintenance.findById(id)
            .populate("vehicle", "registrationNumber vehicleName type")
            .populate("createdBy", "username");

        if (!log) {
            return res.status(404).json({ message: "Maintenance log not found" });
        }

        return res.status(200).json({ maintenance: log });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 4. Update Maintenance
export const updateMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const { maintenanceType, description, serviceCenter, cost, scheduledDate } = req.body;

        const log = await Maintenance.findById(id);
        if (!log) {
            return res.status(404).json({ message: "Maintenance log not found" });
        }

        if (log.status !== "Pending") {
            return res.status(400).json({ message: "Only pending maintenance can be updated" });
        }

        log.maintenanceType = maintenanceType || log.maintenanceType;
        if (description !== undefined) log.description = description;
        if (serviceCenter !== undefined) log.serviceCenter = serviceCenter;
        if (cost !== undefined) log.cost = cost;
        log.scheduledDate = scheduledDate || log.scheduledDate;

        await log.save();

        return res.status(200).json({ message: "Maintenance updated successfully", maintenance: log });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 5. Complete Maintenance
export const completeMaintenance = async (req, res) => {
    try {
        const { id } = req.params;
        const { completedDate, odometer } = req.body;

        const log = await Maintenance.findById(id);
        if (!log) {
            return res.status(404).json({ message: "Maintenance log not found" });
        }

        if (log.status === "Completed") {
            return res.status(400).json({ message: "Maintenance already completed" });
        }

        log.status = "Completed";
        log.completedDate = completedDate || new Date();
        await log.save();

        const vehicle = await Vehicle.findById(log.vehicle);
        if (vehicle) {
            vehicle.status = "Available";
            // Update vehicle odometer if provided and greater than current
            if (odometer !== undefined && odometer > vehicle.odometer) {
                vehicle.odometer = odometer;
            }
            await vehicle.save();
        }

        return res.status(200).json({ message: "Maintenance completed successfully", maintenance: log });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 6. Cancel Maintenance
export const cancelMaintenance = async (req, res) => {
    try {
        const { id } = req.params;

        const log = await Maintenance.findById(id);
        if (!log) {
            return res.status(404).json({ message: "Maintenance log not found" });
        }

        if (log.status !== "Pending") {
            return res.status(400).json({ message: "Only pending maintenance can be cancelled" });
        }

        log.status = "Cancelled";
        await log.save();

        const vehicle = await Vehicle.findById(log.vehicle);
       
        if (vehicle && vehicle.status === "In Shop") {
            vehicle.status = "Available";
            await vehicle.save();
        }

        return res.status(200).json({ message: "Maintenance cancelled successfully", maintenance: log });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
