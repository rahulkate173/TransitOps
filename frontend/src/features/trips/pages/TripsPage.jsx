import { useState, useEffect, useCallback } from "react";
import { tripService } from "../services/tripService";
import { useSelector } from "react-redux";
import { selectUser } from "../../auth/auth.slice";
import "../styles/trips.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_TABS = ["All", "Draft", "Dispatched", "Completed", "Cancelled"];

const badgeClass = (status) => ({
    Draft:      "badge-draft",
    Dispatched: "badge-dispatched",
    Completed:  "badge-completed",
    Cancelled:  "badge-cancelled",
})[status] ?? "badge-draft";

const dotClass = (s) => ({
    All:        "tab-dot-all",
    Draft:      "tab-dot-draft",
    Dispatched: "tab-dot-dispatched",
    Completed:  "tab-dot-completed",
    Cancelled:  "tab-dot-cancelled",
})[s];

const canWrite = (role) => ["Owner", "Dispatcher"].includes(role);

// ─── Complete Modal ────────────────────────────────────────────────────────────
const CompleteModal = ({ trip, onClose, onDone }) => {
    const [form, setForm] = useState({ endOdometer: "", actualDistance: "", fuelConsumed: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const submit = async () => {
        setError("");
        if (!form.endOdometer || !form.actualDistance || !form.fuelConsumed) {
            setError("All fields are required");
            return;
        }
        setLoading(true);
        try {
            await tripService.complete(trip._id, {
                endOdometer: Number(form.endOdometer),
                actualDistance: Number(form.actualDistance),
                fuelConsumed: Number(form.fuelConsumed),
            });
            onDone();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to complete trip");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trip-modal-overlay" onClick={onClose}>
            <div className="trip-modal" onClick={(e) => e.stopPropagation()}>
                <div className="trip-modal-title">Complete Trip</div>
                <div className="trip-modal-sub">{trip.source} → {trip.destination}</div>

                {error && <div className="trip-alert trip-alert-error">{error}</div>}

                {[
                    { label: "End Odometer (km)", name: "endOdometer", placeholder: "74500" },
                    { label: "Actual Distance (km)", name: "actualDistance", placeholder: "38" },
                    { label: "Fuel Consumed (L)", name: "fuelConsumed", placeholder: "4.2" },
                ].map((f) => (
                    <div className="trip-field" key={f.name}>
                        <label className="trip-label">{f.label}</label>
                        <input
                            className="trip-input"
                            type="number"
                            name={f.name}
                            placeholder={f.placeholder}
                            value={form[f.name]}
                            onChange={handle}
                        />
                    </div>
                ))}

                <div className="trip-actions" style={{ marginTop: 4 }}>
                    <button className="btn-primary" onClick={submit} disabled={loading}>
                        {loading ? <span className="t-spinner" /> : "Mark Complete"}
                    </button>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

// ─── Trip Form (Create / Edit) ─────────────────────────────────────────────────
const TripForm = ({ trip, vehicles, drivers, onSave, onCancel }) => {
    const isEdit = !!trip?._id;

    const [form, setForm] = useState({
        source:          trip?.source          ?? "",
        destination:     trip?.destination     ?? "",
        vehicle:         trip?.vehicle?._id    ?? trip?.vehicle ?? "",
        driver:          trip?.driver?._id     ?? trip?.driver  ?? "",
        cargoWeight:     trip?.cargoWeight     ?? "",
        plannedDistance: trip?.plannedDistance ?? "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handle = (e) => {
        setError("");
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    // Capacity check
    const selectedVehicle = vehicles.find((v) => v._id === form.vehicle);
    const overCapacity =
        selectedVehicle && form.cargoWeight &&
        Number(form.cargoWeight) > selectedVehicle.maxLoadCapacity;

    const submit = async () => {
        setError("");
        if (!form.source || !form.destination || !form.vehicle || !form.driver) {
            setError("Source, destination, vehicle and driver are required");
            return;
        }
        setLoading(true);
        try {
            if (isEdit) {
                await tripService.update(trip._id, form);
            } else {
                await tripService.create(form);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save trip");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trips-panel-body">
            <div className="trips-panel-title" style={{ fontFamily: "'Courier Prime',monospace", fontSize: 10, color: "#444", letterSpacing: "2px", textTransform: "uppercase" }}>
                {isEdit ? "Edit Draft Trip" : "Create Trip"}
            </div>

            {error && <div className="trip-alert trip-alert-error">{error}</div>}

            <div className="trip-row">
                <div className="trip-field">
                    <label className="trip-label">Source</label>
                    <input className="trip-input" name="source" placeholder="Gandhinagar Depot" value={form.source} onChange={handle} />
                </div>
                <div className="trip-field">
                    <label className="trip-label">Destination</label>
                    <input className="trip-input" name="destination" placeholder="Ahmedabad Hub" value={form.destination} onChange={handle} />
                </div>
            </div>

            <div className="trip-field">
                <label className="trip-label">Vehicle (Available only)</label>
                <select className="trip-select" name="vehicle" value={form.vehicle} onChange={handle}>
                    <option value="">Select vehicle</option>
                    {vehicles.map((v) => (
                        <option key={v._id} value={v._id}>
                            {v.vehicleName} — {v.registrationNumber} ({v.maxLoadCapacity} kg)
                        </option>
                    ))}
                </select>
            </div>

            <div className="trip-field">
                <label className="trip-label">Driver (Available only)</label>
                <select className="trip-select" name="driver" value={form.driver} onChange={handle}>
                    <option value="">Select driver</option>
                    {drivers.map((d) => (
                        <option key={d._id} value={d._id}>
                            {d.name} — {d.licenseNumber}
                        </option>
                    ))}
                </select>
            </div>

            <div className="trip-row">
                <div className="trip-field">
                    <label className="trip-label">Cargo Weight (kg)</label>
                    <input className="trip-input" type="number" name="cargoWeight" placeholder="700" value={form.cargoWeight} onChange={handle} />
                </div>
                <div className="trip-field">
                    <label className="trip-label">Planned Distance (km)</label>
                    <input className="trip-input" type="number" name="plannedDistance" placeholder="38" value={form.plannedDistance} onChange={handle} />
                </div>
            </div>

            {/* Capacity check */}
            {selectedVehicle && form.cargoWeight && (
                <div className={`capacity-box ${overCapacity ? "warn" : "ok"}`}>
                    <div>Vehicle Capacity: {selectedVehicle.maxLoadCapacity} kg</div>
                    <div>Cargo Weight: {form.cargoWeight} kg</div>
                    {overCapacity
                        ? <div>✕ Capacity exceeded by {Number(form.cargoWeight) - selectedVehicle.maxLoadCapacity} kg — dispatch blocked</div>
                        : <div>✓ Capacity OK</div>
                    }
                </div>
            )}

            <div className="trip-actions">
                <button className="btn-primary" onClick={submit} disabled={loading || overCapacity}>
                    {loading ? <span className="t-spinner" /> : isEdit ? "Save Changes" : "Create Trip"}
                </button>
                <button className="btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

// ─── Trip Detail View ──────────────────────────────────────────────────────────
const TripDetail = ({ trip, role, onAction, onEdit, onClose }) => {
    const [completeModal, setCompleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    const doAction = async (action) => {
        setError("");
        setActionLoading(action);
        try {
            if (action === "dispatch") await tripService.dispatch(trip._id);
            if (action === "cancel")   await tripService.cancel(trip._id);
            onAction();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${action}`);
        } finally {
            setActionLoading(null);
        }
    };

    const field = (label, value) => (
        <div className="trip-detail-item" key={label}>
            <div className="trip-detail-label">{label}</div>
            <div className="trip-detail-value">{value || "—"}</div>
        </div>
    );

    const writer = canWrite(role);

    return (
        <>
            {completeModal && (
                <CompleteModal
                    trip={trip}
                    onClose={() => setCompleteModal(false)}
                    onDone={() => { setCompleteModal(false); onAction(); }}
                />
            )}

            <div className="trips-panel-body">
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'Courier Prime',monospace", fontSize: 11, color: "#444", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                        Trip Details
                    </div>
                    <span className={`trip-badge ${badgeClass(trip.status)}`}>{trip.status}</span>
                </div>

                {error && <div className="trip-alert trip-alert-error">{error}</div>}

                {/* Route */}
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 700, color: "#F0EDE8" }}>
                    {trip.source}
                    <span style={{ color: "#B8860B", margin: "0 10px" }}>→</span>
                    {trip.destination}
                </div>

                <div className="trip-detail-divider" />

                <div className="trip-detail-grid">
                    {field("Trip ID", trip.tripId)}
                    {field("Status", trip.status)}
                    {field("Vehicle", trip.vehicle?.vehicleName ? `${trip.vehicle.vehicleName} (${trip.vehicle.registrationNumber})` : trip.vehicle)}
                    {field("Driver", trip.driver?.name || trip.driver)}
                    {field("Cargo Weight", trip.cargoWeight ? `${trip.cargoWeight} kg` : null)}
                    {field("Planned Distance", trip.plannedDistance ? `${trip.plannedDistance} km` : null)}
                    {trip.status === "Completed" && field("Actual Distance", trip.actualDistance ? `${trip.actualDistance} km` : null)}
                    {trip.status === "Completed" && field("Fuel Consumed", trip.fuelConsumed ? `${trip.fuelConsumed} L` : null)}
                    {trip.dispatchTime  && field("Dispatched At", new Date(trip.dispatchTime).toLocaleString())}
                    {trip.completionTime && field("Completed At", new Date(trip.completionTime).toLocaleString())}
                </div>

                <div className="trip-detail-divider" />

                {/* Actions */}
                {writer && (
                    <div className="trip-actions" style={{ flexWrap: "wrap" }}>
                        {trip.status === "Draft" && (
                            <>
                                <button className="btn-primary" onClick={() => doAction("dispatch")}
                                    disabled={actionLoading === "dispatch"}>
                                    {actionLoading === "dispatch" ? <span className="t-spinner" /> : "Dispatch"}
                                </button>
                                <button className="btn-secondary" onClick={onEdit}>Edit</button>
                                <button className="btn-danger" onClick={() => doAction("cancel")}
                                    disabled={actionLoading === "cancel"}>
                                    {actionLoading === "cancel" ? <span className="t-spinner" /> : "Cancel Trip"}
                                </button>
                            </>
                        )}
                        {trip.status === "Dispatched" && (
                            <>
                                <button className="btn-primary" onClick={() => setCompleteModal(true)}>
                                    Mark Complete
                                </button>
                                <button className="btn-danger" onClick={() => doAction("cancel")}
                                    disabled={actionLoading === "cancel"}>
                                    {actionLoading === "cancel" ? <span className="t-spinner" /> : "Cancel Trip"}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

// ─── Main TripsPage ────────────────────────────────────────────────────────────
const TripsPage = () => {
    const user = useSelector(selectUser);

    const [trips, setTrips]               = useState([]);
    const [activeTab, setActiveTab]       = useState("All");
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [mode, setMode]                 = useState("form"); // "form" | "detail"
    const [editingTrip, setEditingTrip]   = useState(null);
    const [vehicles, setVehicles]         = useState([]);
    const [drivers, setDrivers]           = useState([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState("");

    // Fetch trips list
    const loadTrips = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = activeTab !== "All" ? { status: activeTab } : {};
            const res = await tripService.getAll(params);
            setTrips(res.data.trips);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load trips");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    // Fetch dropdown data (available vehicles + drivers)
    const loadFormData = useCallback(async () => {
        try {
            const [vRes, dRes] = await Promise.all([
                tripService.getAvailableVehicles(),
                tripService.getAvailableDrivers(),
            ]);
            setVehicles(vRes.data.vehicles);
            setDrivers(dRes.data.drivers);
        } catch { /* non-critical */ }
    }, []);

    useEffect(() => { loadTrips(); }, [loadTrips]);
    useEffect(() => { loadFormData(); }, [loadFormData]);

    const handleSelectTrip = (trip) => {
        setSelectedTrip(trip);
        setMode("detail");
        setEditingTrip(null);
    };

    const openCreate = () => {
        setSelectedTrip(null);
        setEditingTrip(null);
        setMode("form");
    };

    const openEdit = () => {
        setEditingTrip(selectedTrip);
        setMode("form");
    };

    const afterSave = () => {
        setMode("form");
        setSelectedTrip(null);
        setEditingTrip(null);
        loadTrips();
        loadFormData();
    };

    const afterAction = () => {
        setSelectedTrip(null);
        setMode("form");
        loadTrips();
        loadFormData();
    };

    // Left panel content (Form or Details)
    const renderLeftContent = () => {
        if (mode === "form") {
            return (
                <TripForm
                    trip={editingTrip}
                    vehicles={vehicles}
                    drivers={drivers}
                    onSave={afterSave}
                    onCancel={() => {
                        setSelectedTrip(null);
                        setEditingTrip(null);
                        setMode("form");
                    }}
                />
            );
        }

        if (selectedTrip) {
            return (
                <TripDetail
                    trip={selectedTrip}
                    role={user?.role}
                    onAction={afterAction}
                    onEdit={openEdit}
                    onClose={() => {
                        setSelectedTrip(null);
                        setMode("form");
                    }}
                />
            );
        }

        return (
            <TripForm
                trip={null}
                vehicles={vehicles}
                drivers={drivers}
                onSave={afterSave}
                onCancel={() => {}}
            />
        );
    };

    return (
        <div className="page-content trips-layout">

            {/* ── LEFT PANEL: CREATE TRIP FORM / TRIP DETAILS ──────────── */}
            <div className="trips-left">
                <div className="trips-panel-header">
                    <span className="trips-panel-title">
                        {mode === "form"
                            ? (editingTrip ? "Edit Trip" : "Create Trip")
                            : selectedTrip
                                ? `${selectedTrip.source} → ${selectedTrip.destination}`
                                : "Create Trip"
                        }
                    </span>
                    {selectedTrip && mode === "detail" && (
                        <button
                            className="trips-new-btn"
                            style={{ margin: 0, padding: "4px 10px" }}
                            onClick={openCreate}
                        >
                            + New Trip
                        </button>
                    )}
                </div>

                {renderLeftContent()}
            </div>

            {/* ── RIGHT PANEL: LIVE BOARD & TRIP LIST ───────────────────── */}
            <div className="trips-right">
                <div className="trips-panel-header">
                    <span className="trips-panel-title">LIVE BOARD</span>
                    <span style={{ fontFamily: "'Courier Prime',monospace", fontSize: 11, color: "#444" }}>
                        {trips.length} trips
                    </span>
                </div>

                {/* Status Filter Tabs */}
                <div className="trip-tabs">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`trip-tab ${activeTab === tab ? "active" : ""}`}
                            onClick={() => { setActiveTab(tab); }}
                        >
                            <span className={`tab-dot tab-dot-${tab.toLowerCase()}`} />
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Trip list */}
                {loading ? (
                    <div className="trips-empty" style={{ flex: 1 }}>
                        <span className="t-spinner" style={{ borderTopColor: "#B8860B" }} />
                    </div>
                ) : error ? (
                    <div className="trips-empty" style={{ flex: 1, color: "#E74C3C", fontSize: 12 }}>{error}</div>
                ) : trips.length === 0 ? (
                    <div className="trips-empty" style={{ flex: 1 }}>No trips found under {activeTab}</div>
                ) : (
                    <div className="trips-list" style={{ padding: 16 }}>
                        {trips.map((trip) => (
                            <div
                                key={trip._id}
                                className={`trip-item ${selectedTrip?._id === trip._id ? "selected" : ""}`}
                                onClick={() => handleSelectTrip(trip)}
                            >
                                <div className="trip-item-top">
                                    <span className="trip-item-id">{trip.tripId || trip._id.slice(-6).toUpperCase()}</span>
                                    <span className={`trip-badge ${badgeClass(trip.status)}`}>{trip.status}</span>
                                </div>
                                <div className="trip-item-route">
                                    {trip.source}
                                    <span className="trip-item-arrow">→</span>
                                    {trip.destination}
                                </div>
                                <div className="trip-item-meta">
                                    {trip.vehicle?.vehicleName && <span>🚛 {trip.vehicle.vehicleName}</span>}
                                    {trip.driver?.name && <span>👤 {trip.driver.name}</span>}
                                    {trip.cargoWeight && <span>📦 {trip.cargoWeight} kg</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default TripsPage;
