import Driver from "../models/driver.model.js";

// 1. Add Driver
export async function addDriver(req, res) {
    try {
        const { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber } = req.body;

        if (!/^\d{10}$/.test(contactNumber)) {
            return res.status(400).json({ message: "Contact number must be a valid 10-digit number" });
        }

        if (!licenseExpiry || new Date(licenseExpiry) <= new Date()) {
            return res.status(400).json({ message: "License expiry must be a future date" });
        }

        const existing = await Driver.findOne({ licenseNumber: licenseNumber?.toUpperCase() });
        if (existing) {
            return res.status(409).json({ message: `License number '${licenseNumber}' already exists` });
        }

        const driver = await Driver.create({
            name,
            licenseNumber,
            licenseCategory,
            licenseExpiry,
            contactNumber,
        });

        return res.status(201).json({
            message: "Driver added successfully",
            driver,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 2. Get All Drivers
export async function getAllDrivers(req, res) {
    try {
        const { status, licenseCategory } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (licenseCategory) filter.licenseCategory = licenseCategory;

        const drivers = await Driver.find(filter)
            .populate("currentVehicle", "registrationNumber vehicleName type")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Drivers fetched successfully",
            count: drivers.length,
            drivers,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 3. Get Driver by ID
export async function getDriverById(req, res) {
    try {
        const driver = await Driver.findById(req.params.id)
            .populate("currentVehicle", "registrationNumber vehicleName type");

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        return res.status(200).json({
            message: "Driver fetched successfully",
            driver,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid driver ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 4. Update Driver
export async function updateDriver(req, res) {
    try {
        const { name, contactNumber, licenseCategory, licenseExpiry } = req.body;

        if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
            return res.status(400).json({ message: "Contact number must be a valid 10-digit number" });
        }

        if (licenseExpiry && new Date(licenseExpiry) <= new Date()) {
            return res.status(400).json({ message: "License expiry must be a future date" });
        }

        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const allowedUpdates = { name, contactNumber, licenseCategory, licenseExpiry };
        Object.entries(allowedUpdates).forEach(([key, val]) => {
            if (val !== undefined) driver[key] = val;
        });

        await driver.save();

        return res.status(200).json({
            message: "Driver updated successfully",
            driver,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid driver ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}


export async function suspendDriver(req, res) {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        if (driver.status === "Suspended") {
            return res.status(400).json({ message: "Driver is already suspended" });
        }

        driver.status = "Suspended";
        await driver.save();

        return res.status(200).json({ message: "Driver suspended successfully." });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid driver ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 7. Activate Driver
export async function activateDriver(req, res) {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        if (driver.status === "Available") {
            return res.status(400).json({ message: "Driver is already active" });
        }

        if (new Date(driver.licenseExpiry) <= new Date()) {
            return res.status(400).json({ message: "Cannot activate driver with an expired license" });
        }

        driver.status = "Available";
        await driver.save();

        return res.status(200).json({
            message: "Driver activated successfully",
            driver,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid driver ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 8. Get Available Drivers
export async function getAvailableDrivers(req, res) {
    try {
        const drivers = await Driver.find({
            status: "Available",
            licenseExpiry: { $gt: new Date() },
        }).populate("currentVehicle", "registrationNumber vehicleName type");

        return res.status(200).json({
            message: "Available drivers fetched successfully",
            count: drivers.length,
            drivers,
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 9. Update Driver Safety Score
export async function updateSafetyScore(req, res) {
    try {
        const { safetyScore } = req.body;

        if (safetyScore === undefined) {
            return res.status(400).json({ message: "safetyScore is required" });
        }

        if (safetyScore < 0 || safetyScore > 100) {
            return res.status(400).json({ message: "safetyScore must be between 0 and 100" });
        }

        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        driver.safetyScore = safetyScore;
        await driver.save();

        return res.status(200).json({
            message: "Safety score updated successfully",
            driver,
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid driver ID" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}
