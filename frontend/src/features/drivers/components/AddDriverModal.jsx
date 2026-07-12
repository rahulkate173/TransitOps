import { useState, useEffect } from "react";
import { useDriver } from "../hooks/useDriver";

const LICENSE_CATEGORIES = ["LMV", "HMV", "Transport"];

const EMPTY_FORM = {
    name: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiry: "",
    contactNumber: "",
    safetyScore: 100,
};

const AddDriverModal = ({ onClose, editDriver }) => {
    const { add, update, updateScore, loading, error, clearError } = useDriver();
    const [form, setForm] = useState(EMPTY_FORM);
    const isEdit = !!editDriver;

    useEffect(() => {
        if (editDriver) {
            setForm({
                name: editDriver.name || "",
                licenseNumber: editDriver.licenseNumber || "",
                licenseCategory: editDriver.licenseCategory || "",
                licenseExpiry: editDriver.licenseExpiry
                    ? new Date(editDriver.licenseExpiry).toISOString().split("T")[0]
                    : "",
                contactNumber: editDriver.contactNumber || "",
                safetyScore: editDriver.safetyScore ?? 100,
            });
        }
    }, [editDriver]);

    const handleChange = (e) => {
        clearError();
        const val = e.target.name === "safetyScore" ? Number(e.target.value) : e.target.value;
        setForm((prev) => ({ ...prev, [e.target.name]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEdit) {
            // Update driver info
            const infoResult = await update(editDriver._id, {
                name: form.name,
                contactNumber: form.contactNumber,
                licenseCategory: form.licenseCategory,
                licenseExpiry: form.licenseExpiry,
            });
            if (infoResult.error) return;

            // Update safety score separately if changed
            if (form.safetyScore !== editDriver.safetyScore) {
                const scoreResult = await updateScore(editDriver._id, form.safetyScore);
                if (scoreResult.error) return;
            }
        } else {
            // Create driver
            const result = await add({
                name: form.name,
                licenseNumber: form.licenseNumber,
                licenseCategory: form.licenseCategory,
                licenseExpiry: form.licenseExpiry,
                contactNumber: form.contactNumber,
            });
            if (result.error) return;

            // Set safety score if not default
            if (form.safetyScore !== 100 && result.payload?._id) {
                await updateScore(result.payload._id, form.safetyScore);
            }
        }

        onClose();
    };

    const scoreColor =
        form.safetyScore >= 80 ? "#2ECC71"
        : form.safetyScore >= 50 ? "#F39C12"
        : "#E74C3C";

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <div className="modal-title">{isEdit ? "Edit Driver" : "+ Add Driver"}</div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    {error && <div className="modal-alert-error">{error}</div>}

                    {/* Name */}
                    <div className="modal-field">
                        <label className="modal-label">Full Name</label>
                        <input
                            className="modal-input"
                            name="name"
                            placeholder="Alex Johnson"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="modal-row">
                        {/* License Number */}
                        <div className="modal-field">
                            <label className="modal-label">License No.</label>
                            <input
                                className="modal-input"
                                name="licenseNumber"
                                placeholder="MH14202300125"
                                value={form.licenseNumber}
                                onChange={handleChange}
                                required
                                disabled={isEdit}
                                style={{ textTransform: "uppercase", opacity: isEdit ? 0.5 : 1 }}
                            />
                        </div>

                        {/* Category */}
                        <div className="modal-field">
                            <label className="modal-label">Category</label>
                            <select
                                className="modal-select"
                                name="licenseCategory"
                                value={form.licenseCategory}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select</option>
                                {LICENSE_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-row">
                        {/* License Expiry */}
                        <div className="modal-field">
                            <label className="modal-label">License Expiry</label>
                            <input
                                className="modal-input"
                                type="date"
                                name="licenseExpiry"
                                value={form.licenseExpiry}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>

                        {/* Contact */}
                        <div className="modal-field">
                            <label className="modal-label">Contact Number</label>
                            <input
                                className="modal-input"
                                name="contactNumber"
                                placeholder="9876543210"
                                maxLength={10}
                                value={form.contactNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Safety Score */}
                    <div className="modal-field">
                        <label className="modal-label" style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Safety Score</span>
                            <span style={{ color: scoreColor, fontWeight: 700 }}>{form.safetyScore} / 100</span>
                        </label>
                        <input
                            type="range"
                            name="safetyScore"
                            min={0}
                            max={100}
                            step={1}
                            value={form.safetyScore}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                accentColor: scoreColor,
                                cursor: "pointer",
                            }}
                        />
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontFamily: "Courier Prime, monospace",
                            fontSize: 11,
                            color: "#555",
                            marginTop: 2,
                        }}>
                            <span>0 — Poor</span>
                            <span>100 — Perfect</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="modal-btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="modal-btn-submit" disabled={loading}>
                            {loading ? <span className="spinner-sm" /> : null}
                            {isEdit ? "Save Changes" : "Add Driver"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDriverModal;
