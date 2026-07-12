import {
    getFuelEfficiency,
    getFleetUtilization,
    getOperationalCost,
    getCompletedTrips,
    getMonthlyOperationalExpenses,
    getCostliestVehicles,
    getCostBreakdown,
} from "../services/analytics.service.js";

// GET /api/analytics
export const getAnalytics = async (req, res) => {
    try {
        const [
            fuelEfficiency,
            fleetUtilization,
            operationalCost,
            completedTrips,
            monthlyOperationalExpenses,
            costliestVehicles,
            costBreakdown,
        ] = await Promise.all([
            getFuelEfficiency(),
            getFleetUtilization(),
            getOperationalCost(),
            getCompletedTrips(),
            getMonthlyOperationalExpenses(),
            getCostliestVehicles(5),
            getCostBreakdown(),
        ]);

        return res.status(200).json({
            cards: {
                fuelEfficiency,           // km/L
                fleetUtilization,         // %
                operationalCost: operationalCost.total,  // ₹ total
                completedTrips,           // count
            },
            monthlyOperationalExpenses,
            costliestVehicles,
            costBreakdown,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
