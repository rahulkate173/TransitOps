import {
    getDashboardSummary,
    getRecentTrips,
    getVehicleStatusCounts,
} from "../services/analytics.service.js";

// GET /api/dashboard
export const getDashboard = async (req, res) => {
    try {
        const [summary, recentTrips, vehicleStatus] = await Promise.all([
            getDashboardSummary(),
            getRecentTrips(5),
            getVehicleStatusCounts(),
        ]);

        return res.status(200).json({
            summary,
            recentTrips,
            vehicleStatus,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
