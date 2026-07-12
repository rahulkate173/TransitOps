import React, { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import "../styles/dashboard.css";

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDash = async () => {
            setLoading(true);
            try {
                const res = await dashboardService.getDashboard();
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchDash();
    }, []);

    if (loading) {
        return (
            <div className="dash-layout" style={{ justifyContent: "center", alignItems: "center" }}>
                <span className="t-spinner" style={{ borderTopColor: "#B8860B" }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="dash-layout" style={{ color: "#E74C3C" }}>
                <div>{error}</div>
            </div>
        );
    }

    const { summary = {}, recentTrips = [], vehicleStatus = {} } = data || {};

    return (
        <div className="dash-layout">
            <div className="dash-header">
                <span className="dash-title">TRANSITOPS EXECUTIVE DASHBOARD</span>
                <span style={{ fontSize: 12, color: "#888", fontFamily: "'Courier Prime',monospace" }}>
                    LIVE SYSTEM METRICS
                </span>
            </div>

            {/* KPI Cards Grid */}
            <div className="dash-grid">
                <div className="dash-card">
                    <span className="dash-card-title">TOTAL VEHICLES</span>
                    <span className="dash-card-val">{summary.totalVehicles ?? vehicleStatus.total ?? 0}</span>
                    <span className="dash-card-sub">Fleet assets registered</span>
                </div>
                <div className="dash-card">
                    <span className="dash-card-title">ACTIVE ON TRIP</span>
                    <span className="dash-card-val" style={{ color: "#2ECC71" }}>
                        {summary.activeTrips ?? vehicleStatus["On Trip"] ?? 0}
                    </span>
                    <span className="dash-card-sub">Vehicles deployed</span>
                </div>
                <div className="dash-card">
                    <span className="dash-card-title">IN MAINTENANCE</span>
                    <span className="dash-card-val" style={{ color: "#E67E22" }}>
                        {summary.inMaintenance ?? vehicleStatus["In Shop"] ?? 0}
                    </span>
                    <span className="dash-card-sub">Vehicles under repair</span>
                </div>
                <div className="dash-card">
                    <span className="dash-card-title">AVAILABLE FLEET</span>
                    <span className="dash-card-val" style={{ color: "#B8860B" }}>
                        {vehicleStatus["Available"] ?? 0}
                    </span>
                    <span className="dash-card-sub">Ready for dispatch</span>
                </div>
            </div>

            {/* Recent Trips Section */}
            <div className="dash-section">
                <span className="dash-section-title">RECENT DISPATCHED TRIPS</span>
                {recentTrips.length === 0 ? (
                    <div style={{ padding: 20, color: "#666", textAlign: "center" }}>No recent trips found.</div>
                ) : (
                    <table className="dash-table">
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Route</th>
                                <th>Vehicle</th>
                                <th>Driver</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTrips.map((trip) => (
                                <tr key={trip._id}>
                                    <td style={{ fontFamily: "'Courier Prime',monospace", fontWeight: 700 }}>
                                        {trip.tripId || trip._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td>
                                        {trip.source} → {trip.destination}
                                    </td>
                                    <td>{trip.vehicle?.registrationNumber || trip.vehicle?.vehicleName || "—"}</td>
                                    <td>{trip.driver?.name || "—"}</td>
                                    <td>
                                        <span style={{
                                            padding: "3px 8px",
                                            borderRadius: 4,
                                            fontSize: 11,
                                            background: trip.status === "Completed" ? "rgba(46,204,113,0.15)" : "rgba(184,134,11,0.15)",
                                            color: trip.status === "Completed" ? "#2ECC71" : "#B8860B"
                                        }}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12, color: "#888" }}>
                                        {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
