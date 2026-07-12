import React, { useState, useEffect, useCallback } from "react";
import { maintenanceService } from "../services/maintenanceService";
import { vehicleService } from "../../vehicleRegistry/services/vehicleService";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/auth.slice";
import "../styles/maintenance.css";

const STATUS_TABS = ["All", "Pending", "Completed", "Cancelled"];

const MaintenancePage = () => {
    const user = useSelector(selectUser);

    const [logs, setLogs]             = useState([]);
    const [vehicles, setVehicles]     = useState([]);
    const [activeTab, setActiveTab]   = useState("All");
    const [loading, setLoading]       = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]           = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState({
        vehicle: "",
        maintenanceType: "Oil Change",
        cost: "",
        scheduledDate: new Date().toISOString().slice(0, 10),
        description: "",
        serviceCenter: "",
    });

    // Load logs
    const loadLogs = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = activeTab !== "All" ? { status: activeTab } : {};
            const res = await maintenanceService.getAll(params);
            setLogs(res.data?.maintenanceLogs || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load maintenance records");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    // Load vehicles
    const loadVehicles = useCallback(async () => {
        try {
            const res = await vehicleService.getAll();
            setVehicles(res.data?.vehicles || []);
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    useEffect(() => {
        loadVehicles();
    }, [loadVehicles]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.vehicle) {
            setError("Please select a vehicle");
            return;
        }
        setSubmitting(true);
        setError("");
        setSuccessMsg("");

        try {
            await maintenanceService.create({
                vehicle: form.vehicle,
                maintenanceType: form.maintenanceType,
                cost: Number(form.cost) || 0,
                scheduledDate: form.scheduledDate,
                description: form.description,
                serviceCenter: form.serviceCenter,
            });

            setSuccessMsg("Service record created successfully!");
            setForm({
                vehicle: "",
                maintenanceType: "Oil Change",
                cost: "",
                scheduledDate: new Date().toISOString().slice(0, 10),
                description: "",
                serviceCenter: "",
            });
            loadLogs();
            loadVehicles();
            setTimeout(() => setSuccessMsg(""), 3500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create service record");
        } finally {
            setSubmitting(false);
        }
    };

    const handleComplete = async (id) => {
        try {
            await maintenanceService.complete(id, { completedDate: new Date().toISOString() });
            loadLogs();
            loadVehicles();
        } catch (err) {
            alert(err.response?.data?.message || "Error completing maintenance");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this maintenance record?")) return;
        try {
            await maintenanceService.cancel(id);
            loadLogs();
            loadVehicles();
        } catch (err) {
            alert(err.response?.data?.message || "Error cancelling maintenance");
        }
    };

    const getBadgeClass = (status) => {
        if (status === "Completed") return "maint-badge-completed";
        if (status === "Cancelled") return "maint-badge-cancelled";
        return "maint-badge-pending";
    };

    return (
        <div className="page-content maint-layout">

            {/* ── LEFT PANEL: LOG SERVICE RECORD ─────────────────── */}
            <div className="maint-left">
                <div className="maint-panel-header">
                    <span className="maint-panel-title">LOG SERVICE RECORD</span>
                </div>

                <form className="maint-form" onSubmit={handleCreate}>
                    {error && (
                        <div style={{ padding: 10, background: "rgba(231,76,60,0.15)", color: "#E74C3C", borderRadius: 6, fontSize: 13 }}>
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div style={{ padding: 10, background: "rgba(46,204,113,0.15)", color: "#2ECC71", borderRadius: 6, fontSize: 13 }}>
                            {successMsg}
                        </div>
                    )}

                    <div className="maint-field">
                        <label>Vehicle</label>
                        <select
                            name="vehicle"
                            className="maint-select"
                            value={form.vehicle}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">Select a vehicle...</option>
                            {vehicles.map((v) => (
                                <option key={v._id} value={v._id}>
                                    {v.registrationNumber} {v.vehicleName ? `— ${v.vehicleName}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="maint-field">
                        <label>Service Type</label>
                        <input
                            type="text"
                            name="maintenanceType"
                            className="maint-input"
                            value={form.maintenanceType}
                            onChange={handleFormChange}
                            placeholder="e.g. Oil Change, Tyre Replace"
                            required
                        />
                    </div>

                    <div className="maint-field">
                        <label>Cost (₹)</label>
                        <input
                            type="number"
                            name="cost"
                            className="maint-input"
                            value={form.cost}
                            onChange={handleFormChange}
                            placeholder="2500"
                        />
                    </div>

                    <div className="maint-field">
                        <label>Scheduled Date</label>
                        <input
                            type="date"
                            name="scheduledDate"
                            className="maint-input"
                            value={form.scheduledDate}
                            onChange={handleFormChange}
                            required
                        />
                    </div>

                    <div className="maint-field">
                        <label>Service Center / Workshop</label>
                        <input
                            type="text"
                            name="serviceCenter"
                            className="maint-input"
                            value={form.serviceCenter}
                            onChange={handleFormChange}
                            placeholder="e.g. Authorized Tata Service Hub"
                        />
                    </div>

                    <div className="maint-field">
                        <label>Notes / Description</label>
                        <textarea
                            name="description"
                            className="maint-textarea"
                            rows={3}
                            value={form.description}
                            onChange={handleFormChange}
                            placeholder="Routine inspection..."
                        />
                    </div>

                    <button type="submit" className="maint-submit-btn" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Record"}
                    </button>
                </form>
            </div>

            {/* ── RIGHT PANEL: SERVICE LOG ───────────────────────── */}
            <div className="maint-right">
                <div className="maint-panel-header">
                    <span className="maint-panel-title">SERVICE LOG</span>
                    <span style={{ fontFamily: "'Courier Prime',monospace", fontSize: 11, color: "#888" }}>
                        {logs.length} records
                    </span>
                </div>

                <div className="maint-tabs">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`maint-tab ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="maint-table-wrapper">
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                            <span className="t-spinner" style={{ borderTopColor: "#B8860B" }} />
                        </div>
                    ) : logs.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 60, color: "#666" }}>
                            No service records found under {activeTab}.
                        </div>
                    ) : (
                        <table className="maint-table">
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Cost</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => {
                                    const vName = log.vehicle
                                        ? `${log.vehicle.registrationNumber} ${log.vehicle.vehicleName ? `(${log.vehicle.vehicleName})` : ""}`
                                        : "Unknown Vehicle";

                                    return (
                                        <tr key={log._id}>
                                            <td style={{ fontWeight: 600 }}>{vName}</td>
                                            <td>
                                                <div>{log.maintenanceType}</div>
                                                {log.serviceCenter && (
                                                    <div style={{ fontSize: 11, color: "#888" }}>{log.serviceCenter}</div>
                                                )}
                                            </td>
                                            <td>
                                                {log.scheduledDate
                                                    ? new Date(log.scheduledDate).toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td style={{ fontFamily: "'Courier Prime',monospace" }}>
                                                ₹{Number(log.cost || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td>
                                                <span className={`maint-badge ${getBadgeClass(log.status)}`}>
                                                    {log.status === "Pending" ? "In Shop" : log.status}
                                                </span>
                                            </td>
                                            <td>
                                                {log.status === "Pending" ? (
                                                    <div className="maint-actions">
                                                        <button
                                                            className="maint-action-btn btn-complete"
                                                            onClick={() => handleComplete(log._id)}
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            className="maint-action-btn btn-cancel"
                                                            onClick={() => handleCancel(log._id)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: "#666" }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

        </div>
    );
};

export default MaintenancePage;
