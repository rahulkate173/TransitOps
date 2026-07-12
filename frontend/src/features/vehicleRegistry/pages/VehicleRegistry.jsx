import { useEffect, useState, useMemo } from "react";
import { useVehicle } from "../hooks/useVehicle";
import VehicleTable from "../components/VehicleTable";
import AddVehicleModal from "../components/AddVehicleModal";
import "../styles/vehicle.css";

const TYPES = ["All", "Van", "Truck", "Mini Truck", "Bus", "Car"];
const STATUSES = ["All", "Available", "On Trip", "In Shop", "Retired"];

const VehicleRegistry = () => {
    const { vehicles, loading, error, fetchAll, retire, clearError } = useVehicle();

    const [showModal, setShowModal] = useState(false);
    const [editVehicle, setEditVehicle] = useState(null);
    const [typeFilter, setTypeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [regSearch, setRegSearch] = useState("");

    useEffect(() => {
        fetchAll();
    }, []);

    const filtered = useMemo(() => {
        return vehicles.filter((v) => {
            const matchType = typeFilter === "All" || v.type === typeFilter;
            const matchStatus = statusFilter === "All" || v.status === statusFilter;
            const matchReg = v.registrationNumber
                .toLowerCase()
                .includes(regSearch.toLowerCase());
            return matchType && matchStatus && matchReg;
        });
    }, [vehicles, typeFilter, statusFilter, regSearch]);

    const handleEdit = (vehicle) => {
        setEditVehicle(vehicle);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditVehicle(null);
    };

    const handleRetire = (id) => {
        if (window.confirm("Retire this vehicle? This cannot be undone.")) {
            retire(id);
        }
    };

    return (
        <div className="page-content">
            {/* Toolbar */}
            <div className="vr-toolbar">
                <select
                    className="vr-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    id="filter-type"
                >
                    {TYPES.map((t) => (
                        <option key={t} value={t}>Type: {t}</option>
                    ))}
                </select>

                <select
                    className="vr-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    id="filter-status"
                >
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>Status: {s}</option>
                    ))}
                </select>

                <input
                    className="vr-search-reg"
                    type="text"
                    placeholder="Search reg. no..."
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    id="search-reg"
                />

                <button
                    id="add-vehicle-btn"
                    className="vr-add-btn"
                    onClick={() => { setEditVehicle(null); setShowModal(true); }}
                >
                    + Add Vehicle
                </button>
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
            <VehicleTable
                vehicles={filtered}
                loading={loading}
                onEdit={handleEdit}
                onRetire={handleRetire}
            />


            {/* Modal */}
            {showModal && (
                <AddVehicleModal
                    onClose={handleModalClose}
                    editVehicle={editVehicle}
                />
            )}
        </div>
    );
};

export default VehicleRegistry;
