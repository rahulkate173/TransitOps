import { useState, useEffect } from "react";
import { useVehicle } from "../hooks/useVehicle";

const VEHICLE_TYPES = ["Van", "Truck", "Mini Truck", "Bus", "Car"];
const FUEL_TYPES = ["Diesel", "Petrol", "CNG", "Electric"];
const CAPACITY_UNITS = ["kg", "ton"];

const EMPTY_FORM = {
    registrationNumber: "",
    vehicleName: "",
    type: "",
    maxLoadCapacity: "",
    capacityUnit: "kg",
    odometer: "",
    acquisitionCost: "",
    manufactureYear: "",
    fuelType: "",
};

const AddVehicleModal = ({ onClose, editVehicle }) => {
    const { add, update, loading, error, clearError } = useVehicle();
    const [form, setForm] = useState(EMPTY_FORM);

    const isEdit = !!editVehicle;

    useEffect(() => {
        if (editVehicle) {
            setForm({
                registrationNumber: editVehicle.registrationNumber || "",
                vehicleName: editVehicle.vehicleName || "",
                type: editVehicle.type || "",
                maxLoadCapacity: editVehicle.maxLoadCapacity || "",
                capacityUnit: editVehicle.capacityUnit || "kg",
                odometer: editVehicle.odometer || "",
                acquisitionCost: editVehicle.acquisitionCost || "",
                manufactureYear: editVehicle.manufactureYear || "",
                fuelType: editVehicle.fuelType || "",
            });
        }
    }, [editVehicle]);

    const handleChange = (e) => {
        clearError();
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            maxLoadCapacity: Number(form.maxLoadCapacity),
            odometer: form.odometer !== "" ? Number(form.odometer) : undefined,
            acquisitionCost: Number(form.acquisitionCost),
            manufactureYear: form.manufactureYear !== "" ? Number(form.manufactureYear) : undefined,
        };

        const result = isEdit
            ? await update(editVehicle._id, payload)
            : await add(payload);

        if (!result.error) onClose();
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <div className="modal-title">{isEdit ? "Edit Vehicle" : "+ Add Vehicle"}</div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    {error && <div className="modal-alert-error">{error}</div>}

                    <div className="modal-row">
                        <div className="modal-field">
                            <label className="modal-label">Registration No.</label>
                            <input
                                className="modal-input"
                                name="registrationNumber"
                                placeholder="MH12AB1234"
                                value={form.registrationNumber}
                                onChange={handleChange}
                                required
                                style={{ textTransform: "uppercase" }}
                            />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Vehicle Name</label>
                            <input
                                className="modal-input"
                                name="vehicleName"
                                placeholder="VAN-05"
                                value={form.vehicleName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-row">
                        <div className="modal-field">
                            <label className="modal-label">Type</label>
                            <select className="modal-select" name="type" value={form.type} onChange={handleChange} required>
                                <option value="">Select type</option>
                                {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Fuel Type</label>
                            <select className="modal-select" name="fuelType" value={form.fuelType} onChange={handleChange}>
                                <option value="">Select fuel</option>
                                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="modal-row">
                        <div className="modal-field">
                            <label className="modal-label">Max Load Capacity</label>
                            <input
                                className="modal-input"
                                type="number"
                                name="maxLoadCapacity"
                                placeholder="500"
                                min="1"
                                value={form.maxLoadCapacity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Capacity Unit</label>
                            <select className="modal-select" name="capacityUnit" value={form.capacityUnit} onChange={handleChange}>
                                {CAPACITY_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="modal-row">
                        <div className="modal-field">
                            <label className="modal-label">Odometer (km)</label>
                            <input
                                className="modal-input"
                                type="number"
                                name="odometer"
                                placeholder="0"
                                min="0"
                                value={form.odometer}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Acquisition Cost (₹)</label>
                            <input
                                className="modal-input"
                                type="number"
                                name="acquisitionCost"
                                placeholder="620000"
                                min="0"
                                value={form.acquisitionCost}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-field">
                        <label className="modal-label">Manufacture Year</label>
                        <input
                            className="modal-input"
                            type="number"
                            name="manufactureYear"
                            placeholder="2023"
                            min="1990"
                            max={new Date().getFullYear()}
                            value={form.manufactureYear}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="modal-btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-btn-submit" disabled={loading}>
                            {loading ? <span className="spinner-sm" /> : null}
                            {isEdit ? "Save Changes" : "Add Vehicle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
