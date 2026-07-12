import { Router } from "express";
import {
    addVehicle, getAllVehicles, getVehicleById,
    updateVehicle, deleteVehicle, updateVehicleStatus,
} from "../controllers/vehicle.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizePermission from "../middleware/authorizePermission.js";

const vehicleRouter = Router();

vehicleRouter.post("/",       verifyToken, authorizePermission("Fleet", "create"), addVehicle);
vehicleRouter.get("/",        verifyToken, authorizePermission("Fleet", "view"),   getAllVehicles);
vehicleRouter.get("/:id",     verifyToken, authorizePermission("Fleet", "view"),   getVehicleById);
vehicleRouter.put("/:id",     verifyToken, authorizePermission("Fleet", "update"), updateVehicle);
vehicleRouter.delete("/:id",  verifyToken, authorizePermission("Fleet", "delete"), deleteVehicle);
vehicleRouter.patch("/:id/status", verifyToken, authorizePermission("Fleet", "update"), updateVehicleStatus);

export default vehicleRouter;
