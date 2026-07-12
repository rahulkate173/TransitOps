import React, { useState, useEffect } from "react";
import { analyticsService } from "../services/analyticsService";
import "../styles/analytics.css";

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAna = async () => {
            setLoading(true);
            try {
                const res = await analyticsService.getAnalytics();
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAna();
    }, []);

    if (loading) {
        return (
            <div className="analytics-layout" style={{ justifyContent: "center", alignItems: "center" }}>
                <span className="t-spinner" style={{ borderTopColor: "#B8860B" }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-layout" style={{ color: "#E74C3C" }}>
                <div>{error}</div>
            </div>
        );
    }

    const {
        cards = {},
        costliestVehicles = [],
        costBreakdown = {},
    } = data || {};

    const costBreakdownList = Array.isArray(costBreakdown)
        ? costBreakdown.map((item) => ({
              category: item._id || "Other",
              amount: item.totalAmount || item.amount || 0,
          }))
        : Object.entries(costBreakdown || {}).map(([key, val]) => ({
              category: key.toUpperCase(),
              amount: val || 0,
          }));

    return (
        <div className="analytics-layout">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Courier Prime',monospace", fontSize: 20, fontWeight: 700, color: "#B8860B", letterSpacing: 2 }}>
                    FLEET PERFORMANCE ANALYTICS
                </span>
            </div>

            {/* Top Cards */}
            <div className="analytics-grid">
                <div className="analytics-card">
                    <span className="analytics-card-label">FUEL EFFICIENCY</span>
                    <span className="analytics-card-val">
                        {cards.fuelEfficiency ? `${Number(cards.fuelEfficiency).toFixed(2)} km/L` : "—"}
                    </span>
                </div>
                <div className="analytics-card">
                    <span className="analytics-card-label">FLEET UTILIZATION</span>
                    <span className="analytics-card-val">
                        {cards.fleetUtilization ? `${Number(cards.fleetUtilization).toFixed(1)}%` : "—"}
                    </span>
                </div>
                <div className="analytics-card">
                    <span className="analytics-card-label">TOTAL OPERATIONAL COST</span>
                    <span className="analytics-card-val">
                        ₹{Number(cards.operationalCost || 0).toLocaleString("en-IN")}
                    </span>
                </div>
                <div className="analytics-card">
                    <span className="analytics-card-label">COMPLETED TRIPS</span>
                    <span className="analytics-card-val">{cards.completedTrips || 0}</span>
                </div>
            </div>

            {/* Costliest Vehicles */}
            <div className="analytics-section">
                <span className="analytics-section-title">HIGHEST OPERATIONAL COST VEHICLES</span>
                {(!costliestVehicles || costliestVehicles.length === 0) ? (
                    <div style={{ padding: 20, color: "#666", textAlign: "center" }}>No expense records found.</div>
                ) : (
                    <table className="analytics-table">
                        <thead>
                            <tr>
                                <th>Vehicle</th>
                                <th>Total Cost (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {costliestVehicles.map((item, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 600 }}>
                                        {typeof item.vehicle === "object"
                                            ? `${item.vehicle?.registrationNumber || ""} ${item.vehicle?.vehicleName || ""}`
                                            : item.vehicle || "Unknown"}
                                    </td>
                                    <td style={{ fontFamily: "'Courier Prime',monospace", color: "#B8860B" }}>
                                        ₹{Number(item.cost || item.totalCost || 0).toLocaleString("en-IN")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Cost Breakdown by Type */}
            <div className="analytics-section">
                <span className="analytics-section-title">COST BREAKDOWN BY EXPENSE TYPE</span>
                {costBreakdownList.length === 0 ? (
                    <div style={{ padding: 20, color: "#666", textAlign: "center" }}>No expense categories recorded.</div>
                ) : (
                    <table className="analytics-table">
                        <thead>
                            <tr>
                                <th>Expense Category</th>
                                <th>Total Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {costBreakdownList.map((item, idx) => (
                                <tr key={idx}>
                                    <td style={{ fontWeight: 600 }}>{item.category}</td>
                                    <td style={{ fontFamily: "'Courier Prime',monospace", color: "#B8860B" }}>
                                        ₹{Number(item.amount || 0).toLocaleString("en-IN")}
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

export default AnalyticsPage;
