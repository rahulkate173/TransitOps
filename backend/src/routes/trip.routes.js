import { Router } from "express";
import {
    createTrip, getAllTrips, getTripById, updateTrip,
    dispatchTrip, completeTrip, cancelTrip,
    getLiveBoard, getAvailableVehicles, getAvailableDrivers,
} from "../controllers/trip.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizePermission from "../middleware/authorizePermission.js";

const tripRouter = Router();

// Static routes first (before /:id)
tripRouter.get("/live",               verifyToken, authorizePermission("Trips", "view"),   getLiveBoard);
tripRouter.get("/available-vehicles", verifyToken, authorizePermission("Trips", "view"),   getAvailableVehicles);
tripRouter.get("/available-drivers",  verifyToken, authorizePermission("Trips", "view"),   getAvailableDrivers);

tripRouter.post("/",             verifyToken, authorizePermission("Trips", "create"), createTrip);
tripRouter.get("/",              verifyToken, authorizePermission("Trips", "view"),   getAllTrips);
tripRouter.get("/:id",           verifyToken, authorizePermission("Trips", "view"),   getTripById);
tripRouter.put("/:id",           verifyToken, authorizePermission("Trips", "update"), updateTrip);
tripRouter.patch("/:id/dispatch", verifyToken, authorizePermission("Trips", "update"), dispatchTrip);
tripRouter.patch("/:id/complete", verifyToken, authorizePermission("Trips", "update"), completeTrip);
tripRouter.patch("/:id/cancel",   verifyToken, authorizePermission("Trips", "delete"), cancelTrip);

export default tripRouter;
