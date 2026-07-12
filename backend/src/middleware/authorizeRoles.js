import { ROLES } from "../config/roles.js";

/**
 * authorizeRoles(...allowedRoles)
 *
 * Must run AFTER verifyToken (which attaches req.user).
 *
 * Owner bypasses every role check automatically.
 * Other roles are checked against the allowedRoles list.
 *
 * Returns 403 { message: "Access denied" } if the user's role
 * is not in allowedRoles (and is not Owner).
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            // verifyToken should have caught this, but guard anyway
            return res.status(401).json({ message: "Unauthenticated" });
        }

        // Owner always passes — no further check needed
        if (req.user.role === ROLES.OWNER) {
            return next();
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
};

export default authorizeRoles;
