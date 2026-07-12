import { Router } from "express";
import { getPermissions, updatePermissions, resetPermissions, getMyPermissions } from "../controllers/settings.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizePermission from "../middleware/authorizePermission.js";

const settingsRouter = Router();

// GET /api/settings/my-permissions — any authenticated user, returns their own role's permissions
settingsRouter.get("/my-permissions",
    verifyToken,
    getMyPermissions
);


// All settings routes: Owner only (authorizePermission("Settings", action))
// Owner bypasses automatically; no other role has Settings access by default.

// GET  /api/settings/permissions — view all role permissions
settingsRouter.get("/permissions",
    verifyToken,
    authorizePermission("Settings", "view"),
    getPermissions
);

// PUT  /api/settings/permissions — update a single role+module permission
settingsRouter.put("/permissions",
    verifyToken,
    authorizePermission("Settings", "update"),
    updatePermissions
);

// POST /api/settings/reset — reset all permissions to defaults
settingsRouter.post("/reset",
    verifyToken,
    authorizePermission("Settings", "create"),
    resetPermissions
);

export default settingsRouter;
