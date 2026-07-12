import React, { useState, useEffect, useCallback } from "react";
import { expenseService } from "../services/expenseService";
import { vehicleService } from "../../vehicleRegistry/services/vehicleService";
import "../styles/expenses.css";

const ExpensesPage = () => {
    const [tab, setTab] = useState("Fuel"); // "Fuel" | "Other"
    const [fuelLogs, setFuelLogs] = useState([]);
    const [otherLogs, setOtherLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState({
        vehicle: "",
        expenseType: "Toll",
        amount: "",
        liters: "",
        pricePerLiter: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [fRes, oRes, vRes] = await Promise.all([
                expenseService.getFuelLogs(),
                expenseService.getOtherExpenses(),
                vehicleService.getAll(),
            ]);
            setFuelLogs(fRes.data?.fuelLogs || []);
            setOtherLogs(oRes.data?.expenses || []);
            setVehicles(vRes.data?.vehicles || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load expenses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.vehicle) {
            setError("Please select a vehicle");
            return;
        }
        setError("");
        setSuccessMsg("");

        try {
            if (tab === "Fuel") {
                await expenseService.logFuel({
                    vehicle: form.vehicle,
                    liters: Number(form.liters) || 0,
                    pricePerLiter: Number(form.pricePerLiter) || 0,
                    amount: Number(form.amount) || (Number(form.liters) * Number(form.pricePerLiter)) || 0,
                    date: form.date,
                });
            } else {
                await expenseService.addExpense({
                    vehicle: form.vehicle,
                    expenseType: form.expenseType,
                    amount: Number(form.amount) || 0,
                    description: form.description,
                    date: form.date,
                });
            }
            setSuccessMsg(`${tab} expense logged successfully!`);
            loadData();
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add expense");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense record?")) return;
        try {
            await expenseService.deleteExpense(id);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Error deleting expense");
        }
    };

    return (
        <div className="page-content exp-layout">
            {/* Left Panel */}
            <div className="exp-left">
                <div className="exp-panel-header">
                    <span className="exp-panel-title">
                        LOG {tab === "Fuel" ? "FUEL EXPENSE" : "OTHER EXPENSE"}
                    </span>
                </div>

                <form className="exp-form" onSubmit={handleSubmit}>
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

                    <div className="exp-field">
                        <label>Vehicle</label>
                        <select name="vehicle" className="exp-select" value={form.vehicle} onChange={handleChange} required>
                            <option value="">Select vehicle...</option>
                            {vehicles.map((v) => (
                                <option key={v._id} value={v._id}>
                                    {v.registrationNumber} {v.vehicleName ? `— ${v.vehicleName}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {tab === "Other" && (
                        <div className="exp-field">
                            <label>Expense Type</label>
                            <select name="expenseType" className="exp-select" value={form.expenseType} onChange={handleChange}>
                                <option value="Toll">Toll</option>
                                <option value="Parking">Parking</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Repair">Repair</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    )}

                    {tab === "Fuel" && (
                        <>
                            <div className="exp-field">
                                <label>Liters</label>
                                <input type="number" step="0.1" name="liters" className="exp-input" value={form.liters} onChange={handleChange} placeholder="45.5" required />
                            </div>
                            <div className="exp-field">
                                <label>Price per Liter (₹)</label>
                                <input type="number" step="0.1" name="pricePerLiter" className="exp-input" value={form.pricePerLiter} onChange={handleChange} placeholder="98.4" />
                            </div>
                        </>
                    )}

                    <div className="exp-field">
                        <label>Total Amount (₹)</label>
                        <input type="number" name="amount" className="exp-input" value={form.amount} onChange={handleChange} placeholder="4500" required />
                    </div>

                    {tab === "Other" && (
                        <div className="exp-field">
                            <label>Description</label>
                            <input type="text" name="description" className="exp-input" value={form.description} onChange={handleChange} placeholder="Highway Toll Plaza..." />
                        </div>
                    )}

                    <div className="exp-field">
                        <label>Date</label>
                        <input type="date" name="date" className="exp-input" value={form.date} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="exp-submit-btn">Save Expense</button>
                </form>
            </div>

            {/* Right Panel */}
            <div className="exp-right">
                <div className="exp-panel-header">
                    <span className="exp-panel-title">EXPENSE RECORDS</span>
                </div>

                <div className="exp-tabs">
                    <button className={`exp-tab ${tab === "Fuel" ? "active" : ""}`} onClick={() => setTab("Fuel")}>
                        Fuel Logs ({fuelLogs.length})
                    </button>
                    <button className={`exp-tab ${tab === "Other" ? "active" : ""}`} onClick={() => setTab("Other")}>
                        Other Expenses ({otherLogs.length})
                    </button>
                </div>

                <div className="exp-table-wrapper">
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                            <span className="t-spinner" style={{ borderTopColor: "#B8860B" }} />
                        </div>
                    ) : tab === "Fuel" ? (
                        fuelLogs.length === 0 ? (
                            <div style={{ textAlign: "center", padding: 60, color: "#666" }}>No fuel logs recorded.</div>
                        ) : (
                            <table className="exp-table">
                                <thead>
                                    <tr>
                                        <th>Vehicle</th>
                                        <th>Liters</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fuelLogs.map((log) => (
                                        <tr key={log._id}>
                                            <td style={{ fontWeight: 600 }}>{log.vehicle?.registrationNumber || "Unknown"}</td>
                                            <td>{log.liters || "-"} L</td>
                                            <td>₹{log.pricePerLiter || "-"}</td>
                                            <td style={{ fontFamily: "'Courier Prime',monospace", color: "#B8860B" }}>
                                                ₹{Number(log.amount || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td>{new Date(log.date).toLocaleDateString()}</td>
                                            <td>
                                                <button className="exp-del-btn" onClick={() => handleDelete(log._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    ) : (
                        otherLogs.length === 0 ? (
                            <div style={{ textAlign: "center", padding: 60, color: "#666" }}>No other expenses recorded.</div>
                        ) : (
                            <table className="exp-table">
                                <thead>
                                    <tr>
                                        <th>Vehicle</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {otherLogs.map((log) => (
                                        <tr key={log._id}>
                                            <td style={{ fontWeight: 600 }}>{log.vehicle?.registrationNumber || "Unknown"}</td>
                                            <td><span className="exp-badge">{log.expenseType}</span></td>
                                            <td>{log.description || "—"}</td>
                                            <td style={{ fontFamily: "'Courier Prime',monospace", color: "#B8860B" }}>
                                                ₹{Number(log.amount || 0).toLocaleString("en-IN")}
                                            </td>
                                            <td>{new Date(log.date).toLocaleDateString()}</td>
                                            <td>
                                                <button className="exp-del-btn" onClick={() => handleDelete(log._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpensesPage;
