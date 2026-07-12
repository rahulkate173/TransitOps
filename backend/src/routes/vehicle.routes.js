import { Router } from "express";
import {
    addVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    updateVehicleStatus,
} from "../controllers/vehicle.controller.js";

const vehicleRouter = Router();

// POST   /api/vehicles       
vehicleRouter.post("/", addVehicle);

// GET    /api/vehicles        
vehicleRouter.get("/", getAllVehicles);

// GET    /api/vehicles/:id      
vehicleRouter.get("/:id", getVehicleById);

// PUT    /api/vehicles/:id      
vehicleRouter.put("/:id", updateVehicle);

// DELETE /api/vehicles/:id      
vehicleRouter.delete("/:id", deleteVehicle);

// PATCH  /api/vehicles/:id/status
vehicleRouter.patch("/:id/status", updateVehicleStatus);

export default vehicleRouter;
