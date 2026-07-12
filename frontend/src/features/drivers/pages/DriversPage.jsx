import { useEffect, useState, useMemo } from "react";
import { useDriver } from "../hooks/useDriver";
import DriverTable from "../components/DriverTable";
import AddDriverModal from "../components/AddDriverModal";
import "../styles/driver.css";
import "../../vehicleRegistry/styles/vehicle.css";

const ALL_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];

const STATUS_CLASS_MAP = {
    "Available": "Available",
    "On Trip": "On-Trip",
    "Off Duty": "Off-Duty",
    "Suspended": "Suspended",
};

const DriversPage = () => {
    const { drivers, loading, error, fetchAll, suspend, activate, clearError } = useDriver();

    const [showModal, setShowModal] = useState(false);
    const [editDriver, setEditDriver] = useState(null);
    // Empty set = no filter = show all
    const [selectedStatuses, setSelectedStatuses] = useState(new Set());

    useEffect(() => {
        fetchAll();
    }, []);

    // Click = select that status only; if already sole selection → clear (show all)
    const toggleStatus = (status) => {
        setSelectedStatuses((prev) => {
            const next = new Set(prev);
            if (next.has(status)) {
                next.delete(status);
            } else {
                next.add(status);
            }
            return next;
        });
    };

    // No filter selected → show all; otherwise show matching
    const filtered = useMemo(() => {
        if (selectedStatuses.size === 0) return drivers;
        return drivers.filter((d) => selectedStatuses.has(d.status));
    }, [drivers, selectedStatuses]);

    const handleEdit = (driver) => {
        setEditDriver(driver);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditDriver(null);
    };

    const handleSuspend = (id) => {
        if (window.confirm("Suspend this driver?")) suspend(id);
    };

    return (
        <div className="page-content">
            {/* Toolbar with filter buttons inline */}
            <div className="vr-toolbar" style={{ flexWrap: "wrap", gap: "10px" }}>
                {/* Add Driver button */}
                <button
                    id="add-driver-btn"
                    className="vr-add-btn"
                    style={{ marginLeft: 0, flexShrink: 0 }}
                    onClick={() => { setEditDriver(null); setShowModal(true); }}
                >
                    + Add Driver
                </button>

                {/* Divider */}
                <div style={{ width: 1, height: 28, background: "#2A2A2A", margin: "0 4px" }} />

                {/* Toggle Status label */}
                <span className="driver-filter-label" style={{ alignSelf: "center" }}>
                    Filter:
                </span>

                {/* Toggle buttons */}
                <div className="driver-toggle-group">
                    {ALL_STATUSES.map((s) => {
                        const cls = STATUS_CLASS_MAP[s];
                        const isActive = selectedStatuses.has(s);
                        return (
                            <button
                                key={s}
                                id={`toggle-${cls.toLowerCase()}`}
                                className={`driver-toggle-btn ${cls} ${isActive ? "active" : ""}`}
                                onClick={() => toggleStatus(s)}
                                title={isActive ? `Hide ${s}` : `Show only ${s}`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>

                {/* Clear filter */}
                {selectedStatuses.size > 0 && (
                    <button
                        className="vr-icon-btn"
                        style={{ marginLeft: "auto" }}
                        onClick={() => setSelectedStatuses(new Set())}
                        title="Clear filter"
                    >
                        Clear ✕
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="modal-alert-error" style={{ marginBottom: 14 }}>
                    {error}
                    <button
                        onClick={clearError}
                        style={{ marginLeft: 12, background: "none", border: "none", color: "inherit", cursor: "pointer" }}
                    >✕</button>
                </div>
            )}

            {/* Table */}
            <DriverTable
                drivers={filtered}
                loading={loading}
                onEdit={handleEdit}
                onSuspend={handleSuspend}
                onActivate={activate}
            />

            {/* Modal */}
            {showModal && (
                <AddDriverModal
                    onClose={handleModalClose}
                    editDriver={editDriver}
                />
            )}
        </div>
    );
};

export default DriversPage;
