import Trip from "../models/trip.model.js";
import Vehicle from "../models/vehicle.model.js";
import Driver from "../models/driver.model.js";

// 1. Create Trip
export async function createTrip(req, res) {
    try {
        const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = req.body;

        // Verify vehicle exists
        const vehicleDoc = await Vehicle.findById(vehicle);
        if (!vehicleDoc) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Verify driver exists
        const driverDoc = await Driver.findById(driver);
        if (!driverDoc) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const trip = await Trip.create({
            source,
            destination,
            vehicle,
            driver,
            cargoWeight,
            plannedDistance,
            startOdometer: vehicleDoc.odometer,
            createdBy: req.user?._id,
            status: "Draft",
        });

        return res.status(201).json({
            message: "Trip created successfully",
            trip,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 2. Get All Trips
export async function getAllTrips(req, res) {
    try {
        const { status, driver, vehicle } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (driver) filter.driver = driver;
        if (vehicle) filter.vehicle = vehicle;

        const trips = await Trip.find(filter)
            .populate("vehicle", "registrationNumber vehicleName type status")
            .populate("driver", "name licenseNumber status")
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Trips fetched successfully",
            count: trips.length,
            trips,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 3. Get Trip By ID
export async function getTripById(req, res) {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate("vehicle")
            .populate("driver")
            .populate("createdBy", "username email");

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        return res.status(200).json({
            message: "Trip fetched successfully",
            trip,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid trip ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 4. Update Draft Trip
export async function updateTrip(req, res) {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.status !== "Draft") {
            return res.status(400).json({ message: "Only Draft trips can be edited" });
        }

        const allowedFields = ["source", "destination", "vehicle", "driver", "cargoWeight", "plannedDistance"];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) trip[field] = req.body[field];
        });

        await trip.save();

        return res.status(200).json({
            message: "Trip updated successfully",
            trip,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid trip ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 5. Dispatch Trip ⭐
export async function dispatchTrip(req, res) {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.status !== "Draft") {
            return res.status(400).json({ message: "Only Draft trips can be dispatched" });
        }

        // Validation 1 — Vehicle exists
        const vehicle = await Vehicle.findById(trip.vehicle);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Validation 2 — Driver exists
        const driver = await Driver.findById(trip.driver);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // Validation 3 — Vehicle status
        if (vehicle.status !== "Available") {
            return res.status(400).json({ message: "Vehicle not available" });
        }

        // Validation 4 — Driver status
        if (driver.status !== "Available") {
            return res.status(400).json({ message: "Driver not available" });
        }

        // Validation 5 — License expiry
        if (new Date(driver.licenseExpiry) <= new Date()) {
            return res.status(400).json({ message: "Driver license has expired" });
        }

        // Validation 6 — Cargo weight
        if (trip.cargoWeight > vehicle.maxLoadCapacity) {
            return res.status(400).json({ message: "Capacity exceeded" });
        }

        // All validations passed → update everything
        trip.status = "Dispatched";
        trip.dispatchTime = new Date();
        await trip.save();

        vehicle.status = "On Trip";
        vehicle.currentDriver = driver._id;
        await vehicle.save();

        driver.status = "On Trip";
        driver.currentVehicle = vehicle._id;
        await driver.save();

        return res.status(200).json({
            message: "Trip dispatched successfully",
            trip,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid trip ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 6. Complete Trip 
export async function completeTrip(req, res) {
    try {
        const { actualDistance, fuelConsumed, endOdometer } = req.body;

        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.status !== "Dispatched") {
            return res.status(400).json({ message: "Only Dispatched trips can be completed" });
        }

        // Update Trip
        trip.status = "Completed";
        trip.actualDistance = actualDistance;
        trip.fuelConsumed = fuelConsumed;
        trip.endOdometer = endOdometer;
        trip.completionTime = new Date();
        await trip.save();

        // Update Vehicle
        const vehicle = await Vehicle.findById(trip.vehicle);
        if (vehicle) {
            vehicle.status = "Available";
            vehicle.odometer = endOdometer;
            vehicle.currentDriver = null;
            await vehicle.save();
        }

        // Update Driver
        const driver = await Driver.findById(trip.driver);
        if (driver) {
            driver.status = "Available";
            driver.currentVehicle = null;
            await driver.save();
        }

        return res.status(200).json({
            message: "Trip completed successfully",
            trip,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid trip ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 7. Cancel Trip
export async function cancelTrip(req, res) {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.status === "Completed") {
            return res.status(400).json({ message: "Completed trips cannot be cancelled" });
        }

        if (trip.status === "Cancelled") {
            return res.status(400).json({ message: "Trip is already cancelled" });
        }

        // If Dispatched → free up vehicle and driver too
        if (trip.status === "Dispatched") {
            const vehicle = await Vehicle.findById(trip.vehicle);
            if (vehicle) {
                vehicle.status = "Available";
                vehicle.currentDriver = null;
                await vehicle.save();
            }

            const driver = await Driver.findById(trip.driver);
            if (driver) {
                driver.status = "Available";
                driver.currentVehicle = null;
                await driver.save();
            }
        }

        trip.status = "Cancelled";
        await trip.save();

        return res.status(200).json({
            message: "Trip cancelled successfully",
            trip,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid trip ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 8. Live Board — Draft + Dispatched + Cancelled, newest first
export async function getLiveBoard(req, res) {
    try {
        const trips = await Trip.find({
            status: { $in: ["Draft", "Dispatched", "Cancelled"] },
        })
            .populate("vehicle", "registrationNumber vehicleName type")
            .populate("driver", "name licenseNumber")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Live board fetched successfully",
            count: trips.length,
            trips,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 9. Available Vehicles —  Retired and In Shop are not shown
export async function getAvailableVehicles(req, res) {
    try {
        const vehicles = await Vehicle.find({ status: "Available" });

        return res.status(200).json({
            message: "Available vehicles fetched successfully",
            count: vehicles.length,
            vehicles,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 10. Available Drivers
export async function getAvailableDrivers(req, res) {
    try {
        const drivers = await Driver.find({
            status: "Available",
            licenseExpiry: { $gt: new Date() },
        });

        return res.status(200).json({
            message: "Available drivers fetched successfully",
            count: drivers.length,
            drivers,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
