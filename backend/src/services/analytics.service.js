import Vehicle from "../models/vehicle.model.js";
import Driver from "../models/driver.model.js";
import Trip from "../models/trip.model.js";
import Expense from "../models/expense.model.js";

const FUEL_PRICE_PER_LITER = 75; // Configurable constant

// ─────────────────────────────────────────────────────────────────────────────
// getVehicleStatusCounts
// Returns counts for each vehicle status bucket
// ─────────────────────────────────────────────────────────────────────────────
export const getVehicleStatusCounts = async () => {
    const [available, onTrip, inShop, retired] = await Promise.all([
        Vehicle.countDocuments({ status: "Available" }),
        Vehicle.countDocuments({ status: "On Trip" }),
        Vehicle.countDocuments({ status: "In Shop" }),
        Vehicle.countDocuments({ status: "Retired" }),
    ]);

    return { available, onTrip, inShop, retired };
};

// ─────────────────────────────────────────────────────────────────────────────
// getFleetUtilization
// Formula: (vehicles On Trip / active vehicles) × 100
// Active = status != "Retired"
// ─────────────────────────────────────────────────────────────────────────────
export const getFleetUtilization = async () => {
    const [activeVehicles, onTrip] = await Promise.all([
        Vehicle.countDocuments({ status: { $ne: "Retired" } }),
        Vehicle.countDocuments({ status: "On Trip" }),
    ]);

    if (activeVehicles === 0) return 0;
    return Math.round((onTrip / activeVehicles) * 100);
};

// ─────────────────────────────────────────────────────────────────────────────
// getRecentTrips
// Latest N trips with vehicle & driver populated
// ─────────────────────────────────────────────────────────────────────────────
export const getRecentTrips = async (limit = 5) => {
    const trips = await Trip.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("vehicle", "vehicleName registrationNumber")
        .populate("driver", "name");

    return trips.map((t) => ({
        tripId: t._id,
        vehicle: t.vehicle?.vehicleName || t.vehicle?.registrationNumber || "—",
        driver: t.driver?.name || "—",
        status: t.status,
        source: t.source,
        destination: t.destination,
    }));
};

// ─────────────────────────────────────────────────────────────────────────────
// getDashboardSummary
// Aggregates all summary counts for dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const getDashboardSummary = async () => {
    const [
        activeVehicles,
        availableVehicles,
        vehiclesInMaintenance,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        fleetUtilization,
    ] = await Promise.all([
        Vehicle.countDocuments({ status: { $ne: "Retired" } }),
        Vehicle.countDocuments({ status: "Available" }),
        Vehicle.countDocuments({ status: "In Shop" }),
        Trip.countDocuments({ status: "Dispatched" }),
        Trip.countDocuments({ status: "Draft" }),
        Driver.countDocuments({ status: { $in: ["Available", "On Trip"] } }),
        getFleetUtilization(),
    ]);

    return {
        activeVehicles,
        availableVehicles,
        vehiclesInMaintenance,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        fleetUtilization,
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// getFuelEfficiency
// Only completed trips with actual data
// Formula: totalActualDistance / totalFuelConsumed  (km/L)
// ─────────────────────────────────────────────────────────────────────────────
export const getFuelEfficiency = async () => {
    const result = await Trip.aggregate([
        {
            $match: {
                status: "Completed",
                actualDistance: { $gt: 0 },
                fuelConsumed: { $gt: 0 },
            },
        },
        {
            $group: {
                _id: null,
                totalDistance: { $sum: "$actualDistance" },
                totalFuel: { $sum: "$fuelConsumed" },
            },
        },
    ]);

    if (!result.length || result[0].totalFuel === 0) return 0;
    return parseFloat((result[0].totalDistance / result[0].totalFuel).toFixed(2));
};

// ─────────────────────────────────────────────────────────────────────────────
// getOperationalCost
// Fuel cost = Trip.fuelConsumed × FUEL_PRICE_PER_LITER
// Other cost = sum of all Expense.amount
// ─────────────────────────────────────────────────────────────────────────────
export const getOperationalCost = async () => {
    const [fuelResult, expenseResult] = await Promise.all([
        Trip.aggregate([
            { $match: { fuelConsumed: { $gt: 0 } } },
            { $group: { _id: null, totalFuel: { $sum: "$fuelConsumed" } } },
        ]),
        Expense.aggregate([
            { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
        ]),
    ]);

    const fuelCost = fuelResult[0]?.totalFuel
        ? Math.round(fuelResult[0].totalFuel * FUEL_PRICE_PER_LITER)
        : 0;
    const otherCost = expenseResult[0]?.totalExpenses || 0;

    return { fuelCost, otherCost, total: fuelCost + otherCost };
};

// ─────────────────────────────────────────────────────────────────────────────
// getCompletedTrips
// Count of all trips with status "Completed"
// ─────────────────────────────────────────────────────────────────────────────
export const getCompletedTrips = async () => {
    return Trip.countDocuments({ status: "Completed" });
};

// ─────────────────────────────────────────────────────────────────────────────
// getMonthlyOperationalExpenses
// Groups Expense documents by year+month, sums amounts, sorts chronologically
// ─────────────────────────────────────────────────────────────────────────────
export const getMonthlyOperationalExpenses = async () => {
    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const result = await Expense.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                },
                totalExpenses: { $sum: "$amount" },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return result.map((r) => ({
        month: MONTH_NAMES[r._id.month - 1],
        expenses: r.totalExpenses,
    }));
};

// ─────────────────────────────────────────────────────────────────────────────
// getCostBreakdown
// Expense amounts grouped by expenseType, fuel cost derived from Trip data
// ─────────────────────────────────────────────────────────────────────────────
export const getCostBreakdown = async () => {
    const [fuelFromTrips, expenseByType] = await Promise.all([
        Trip.aggregate([
            { $match: { fuelConsumed: { $gt: 0 } } },
            { $group: { _id: null, totalFuel: { $sum: "$fuelConsumed" } } },
        ]),
        Expense.aggregate([
            {
                $group: {
                    _id: "$expenseType",
                    total: { $sum: "$amount" },
                },
            },
        ]),
    ]);

    const fuelCost = Math.round((fuelFromTrips[0]?.totalFuel || 0) * FUEL_PRICE_PER_LITER);

    // Build breakdown map with defaults of 0
    const breakdown = {
        fuel: fuelCost,
        maintenance: 0,
        repair: 0,
        toll: 0,
        parking: 0,
        other: 0,
    };

    expenseByType.forEach(({ _id, total }) => {
        const key = _id?.toLowerCase();
        if (key && key in breakdown) breakdown[key] = total;
    });

    return breakdown;
};

// ─────────────────────────────────────────────────────────────────────────────
// getCostliestVehicles
// MongoDB aggregation: group expenses by vehicle, sum amount, top 5 desc
// ─────────────────────────────────────────────────────────────────────────────
export const getCostliestVehicles = async (limit = 5) => {
    const result = await Expense.aggregate([
        {
            $group: {
                _id: "$vehicle",
                totalCost: { $sum: "$amount" },
            },
        },
        { $sort: { totalCost: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: "vehicles",
                localField: "_id",
                foreignField: "_id",
                as: "vehicleData",
            },
        },
        { $unwind: { path: "$vehicleData", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 0,
                vehicle: {
                    $ifNull: ["$vehicleData.vehicleName", "Unknown"],
                },
                cost: "$totalCost",
            },
        },
    ]);

    return result;
};
