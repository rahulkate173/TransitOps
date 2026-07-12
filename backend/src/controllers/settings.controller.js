import {
    getAllPermissions,
    updatePermission,
    resetToDefaults,
    getPermission,
} from "../services/permission.service.js";

const VALID_ROLES = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];
const VALID_MODULES = ["Fleet", "Drivers", "Trips", "Maintenance", "FuelExpenses", "Dashboard", "Analytics", "Settings"];
const VALID_ACTIONS = ["view", "create", "update", "delete"];

// GET /api/settings/my-permissions
// Returns all module permissions for the currently logged-in user's role.
// Accessible to ALL authenticated users (not Owner-only).
export const getMyPermissions = async (req, res) => {
    try {
        const role = req.user?.role;

        if (role === "Owner") {
            return res.status(200).json({ role: "Owner", permissions: [] });
        }

        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({ message: "Unknown role" });
        }

        const allPerms = await getAllPermissions();
        const myPerms = allPerms.filter((p) => p.role === role);

        return res.status(200).json({ role, permissions: myPerms });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};


// GET /api/settings/permissions
export const getPermissions = async (req, res) => {
    try {
        const permissions = await getAllPermissions();
        return res.status(200).json({ permissions });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// PUT /api/settings/permissions
export const updatePermissions = async (req, res) => {
    try {
        const { role, module, permissions } = req.body;

        if (!role || !VALID_ROLES.includes(role)) {
            return res.status(400).json({ message: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}` });
        }

        if (!module || !VALID_MODULES.includes(module)) {
            return res.status(400).json({ message: `Invalid module. Must be one of: ${VALID_MODULES.join(", ")}` });
        }

        if (!permissions || typeof permissions !== "object") {
            return res.status(400).json({ message: "permissions object is required" });
        }

        // Validate all provided action keys
        const unknownKeys = Object.keys(permissions).filter((k) => !VALID_ACTIONS.includes(k));
        if (unknownKeys.length) {
            return res.status(400).json({ message: `Unknown permission keys: ${unknownKeys.join(", ")}` });
        }

        const updated = await updatePermission(role, module, permissions);
        return res.status(200).json({ message: "Permission updated", permission: updated });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// POST /api/settings/reset
export const resetPermissions = async (req, res) => {
    try {
        await resetToDefaults();
        return res.status(200).json({ message: "Permissions reset to defaults" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
