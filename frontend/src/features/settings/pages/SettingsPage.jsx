import React, { useState, useEffect } from "react";
import { settingsService } from "../services/settingsService";
import "../styles/settings.css";

const MODULES = [
    "Fleet",
    "Drivers",
    "Trips",
    "Maintenance",
    "FuelExpenses",
    "Dashboard",
    "Analytics",
    "Settings",
];

const ACTIONS = ["view", "create", "update", "delete"];

const SettingsPage = () => {
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState("Manager");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const fetchPerms = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await settingsService.getAllPermissions();
            setPermissions(res.data?.permissions || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load permissions (Owner access required)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerms();
    }, []);

    const handleToggle = async (module, action, currentValue) => {
        setMsg("");
        try {
            await settingsService.updatePermission({
                role: selectedRole,
                module,
                action,
                allowed: !currentValue,
            });
            setPermissions((prev) =>
                prev.map((item) =>
                    item.role === selectedRole && item.module === module
                        ? {
                              ...item,
                              actions: { ...item.actions, [action]: !currentValue },
                          }
                        : item
                )
            );
            setMsg(`Updated ${selectedRole} permission for ${module} -> ${action}`);
            setTimeout(() => setMsg(""), 2500);
        } catch (err) {
            alert(err.response?.data?.message || "Error updating permission");
        }
    };

    const handleReset = async () => {
        if (!window.confirm("Reset all role permissions to factory defaults?")) return;
        try {
            await settingsService.resetPermissions();
            fetchPerms();
            setMsg("All permissions reset to default.");
        } catch (err) {
            alert(err.response?.data?.message || "Error resetting permissions");
        }
    };

    const roles = Array.from(new Set(permissions.map((p) => p.role))).filter((r) => r !== "Owner");

    const getModulePerms = (module) => {
        const found = permissions.find((p) => p.role === selectedRole && p.module === module);
        return found?.actions || { view: false, create: false, update: false, delete: false };
    };

    return (
        <div className="settings-layout">
            <div className="settings-header">
                <div>
                    <span className="settings-title">ROLE ACCESS CONTROL (RBAC MATRIX)</span>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                        Configure granular system permissions per operational role
                    </div>
                </div>
                <button className="settings-reset-btn" onClick={handleReset}>
                    RESET TO DEFAULTS
                </button>
            </div>

            {error && (
                <div style={{ padding: 14, background: "rgba(231,76,60,0.15)", color: "#E74C3C", borderRadius: 6 }}>
                    {error}
                </div>
            )}
            {msg && (
                <div style={{ padding: 12, background: "rgba(46,204,113,0.15)", color: "#2ECC71", borderRadius: 6 }}>
                    {msg}
                </div>
            )}

            {!loading && roles.length > 0 && (
                <div className="settings-role-tabs">
                    {roles.map((role) => (
                        <button
                            key={role}
                            className={`settings-role-tab ${selectedRole === role ? "active" : ""}`}
                            onClick={() => setSelectedRole(role)}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            )}

            <div className="settings-matrix-card">
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
                        <span className="t-spinner" style={{ borderTopColor: "#B8860B" }} />
                    </div>
                ) : (
                    <table className="settings-table">
                        <thead>
                            <tr>
                                <th>Module / Feature</th>
                                <th>View</th>
                                <th>Create</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MODULES.map((mod) => {
                                const actions = getModulePerms(mod);
                                return (
                                    <tr key={mod}>
                                        <td style={{ fontWeight: 700, fontFamily: "'Courier Prime',monospace" }}>
                                            {mod}
                                        </td>
                                        {ACTIONS.map((act) => (
                                            <td key={act}>
                                                <input
                                                    type="checkbox"
                                                    className="settings-checkbox"
                                                    checked={!!actions[act]}
                                                    onChange={() => handleToggle(mod, act, !!actions[act])}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
