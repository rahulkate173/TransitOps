import { ROLES } from "../config/roles.js";
import { getPermission } from "../services/permission.service.js";

/**
 * authorizePermission(module, action)
 *
 * Must run AFTER verifyToken (which attaches req.user).
 *
 * Owner bypasses all checks automatically.
 * For every other role, looks up the RolePermission record from
 * the DB (via cache) and checks the requested action.
 *
 * Returns:
 *   401 — if req.user is not attached (verifyToken failure)
 *   403 — if the role has no permission for the action
 *
 * @param {string} module  - e.g. "Fleet", "Trips", "Dashboard"
 * @param {string} action  - "view" | "create" | "update" | "delete"
 */
const authorizePermission = (module, action) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        // Owner always passes
        if (req.user.role === ROLES.OWNER) {
            return next();
        }

        try {
            const permissions = await getPermission(req.user.role, module);

            if (!permissions || !permissions[action]) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (err) {
            return res.status(500).json({ message: "Authorization error", error: err.message });
        }
    };
};

export default authorizePermission;
