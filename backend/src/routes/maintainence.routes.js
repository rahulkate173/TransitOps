import { Router } from "express";
import {
    createMaintenance, getAllMaintenance, getMaintenanceById,
    updateMaintenance, completeMaintenance, cancelMaintenance,
} from "../controllers/maintainence.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizePermission from "../middleware/authorizePermission.js";

const maintenanceRouter = Router();

maintenanceRouter.post("/",             verifyToken, authorizePermission("Maintenance", "create"), createMaintenance);
maintenanceRouter.get("/",              verifyToken, authorizePermission("Maintenance", "view"),   getAllMaintenance);
maintenanceRouter.get("/:id",           verifyToken, authorizePermission("Maintenance", "view"),   getMaintenanceById);
maintenanceRouter.put("/:id",           verifyToken, authorizePermission("Maintenance", "update"), updateMaintenance);
maintenanceRouter.patch("/:id/complete", verifyToken, authorizePermission("Maintenance", "update"), completeMaintenance);
maintenanceRouter.patch("/:id/cancel",   verifyToken, authorizePermission("Maintenance", "delete"), cancelMaintenance);

export default maintenanceRouter;
