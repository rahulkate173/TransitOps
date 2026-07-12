import { Router } from "express";
import {
    createMaintenance,
    getAllMaintenance,
    getMaintenanceById,
    updateMaintenance,
    completeMaintenance,
    cancelMaintenance
} from "../controllers/maintainence.controller.js";

const maintenanceRouter = Router();


// POST /api/maintenance
maintenanceRouter.post("/", createMaintenance);


// GET /api/maintenance
maintenanceRouter.get("/", getAllMaintenance);


// GET /api/maintenance/:id
maintenanceRouter.get("/:id", getMaintenanceById);


// PUT /api/maintenance/:id
maintenanceRouter.put("/:id", updateMaintenance);


// PATCH /api/maintenance/:id/complete
maintenanceRouter.patch("/:id/complete", completeMaintenance);


// PATCH /api/maintenance/:id/cancel
maintenanceRouter.patch("/:id/cancel", cancelMaintenance);

export default maintenanceRouter;
