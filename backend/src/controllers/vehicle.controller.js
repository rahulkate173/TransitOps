import Vehicle from "../models/vehicle.model.js";

// 1 .Add Vehicle 
export async function addVehicle(req, res) {
    try {
        const {
            registrationNumber,
            vehicleName,
            type,
            maxLoadCapacity,
            capacityUnit,
            odometer,
            acquisitionCost,
            manufactureYear,
            fuelType,
        } = req.body;

        const existing = await Vehicle.findOne({
            registrationNumber: registrationNumber?.toUpperCase()
        });

        if (existing) {
            return res.status(409).json({
                message: `Registration number '${registrationNumber}' already exists`,
            });
        }

        if (!maxLoadCapacity || maxLoadCapacity <= 0) {
            return res.status(400).json({
                message: "maxLoadCapacity must be greater than 0",
            });
        }

        if (odometer !== undefined && odometer < 0) {
            return res.status(400).json({
                message: "Odometer cannot be negative",
            });
        }

        const vehicle = await Vehicle.create({
            registrationNumber,
            vehicleName,
            type,
            maxLoadCapacity,
            capacityUnit,
            odometer,
            acquisitionCost,
            manufactureYear,
            fuelType,
        });

        return res.status(201).json({
            message: "Vehicle added successfully",
            vehicle,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get All Vehicles
export async function getAllVehicles(req, res) {
    try {
        const { status, type } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const vehicles = await Vehicle.find(filter)
            .populate("currentDriver", "name phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Vehicles fetched successfully",
            count: vehicles.length,
            vehicles,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

//  Get Vehicle by ID 
export async function getVehicleById(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate(
            "currentDriver", "name phone"
        );

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        return res.status(200).json({
            message: "Vehicle fetched successfully",
            vehicle,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid vehicle ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

//  Update Vehicle 
export async function updateVehicle(req, res) {
    try {
        const { maxLoadCapacity, odometer } = req.body;

        if (maxLoadCapacity !== undefined && maxLoadCapacity <= 0) {
            return res.status(400).json({
                message: "maxLoadCapacity must be greater than 0",
            });
        }
        if (odometer !== undefined && odometer < 0) {
            return res.status(400).json({
                message: "Odometer cannot be negative",
            });
        }

        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        if (req.body.registrationNumber) {
            const regNum = req.body.registrationNumber.toUpperCase();
            const conflict = await Vehicle.findOne({
                registrationNumber: regNum,
                _id: { $ne: req.params.id },
            });

            if (conflict) {
                return res.status(409).json({
                    message: `Registration number '${regNum}' is already used by another vehicle`,
                });
            }
        }

        Object.assign(vehicle, req.body);
        await vehicle.save();

        return res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid vehicle ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

//  Delete Vehicle 
export async function deleteVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        vehicle.status = "Retired";
        await vehicle.save();

        return res.status(200).json({
            message: "Vehicle retired successfully",
            vehicle,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid vehicle ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Update Vehicle Status 
export async function updateVehicleStatus(req, res) {
    try {
        const { status } = req.body;

        const VALID_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
            });
        }

        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        vehicle.status = status;
        await vehicle.save();

        return res.status(200).json({
            message: `Vehicle status updated to '${status}'`,
            vehicle,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid vehicle ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}