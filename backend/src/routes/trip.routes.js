import { Router } from "express";
import {
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip,
    getLiveBoard,
    getAvailableVehicles,
    getAvailableDrivers,
} from "../controllers/trip.controller.js";

const tripRouter = Router();

// GET /api/trips/live
tripRouter.get("/live", getLiveBoard);

// GET /api/trips/available-vehicles
tripRouter.get("/available-vehicles", getAvailableVehicles);

// GET /api/trips/available-drivers
tripRouter.get("/available-drivers", getAvailableDrivers);

// POST /api/trips
tripRouter.post("/", createTrip);

// GET /api/trips?status=&driver=&vehicle=
tripRouter.get("/", getAllTrips);

// GET /api/trips/:id
tripRouter.get("/:id", getTripById);

// PUT /api/trips/:id  (Draft only)
tripRouter.put("/:id", updateTrip);

// PATCH /api/trips/:id/dispatch
tripRouter.patch("/:id/dispatch", dispatchTrip);

// PATCH /api/trips/:id/complete
tripRouter.patch("/:id/complete", completeTrip);

// PATCH /api/trips/:id/cancel
tripRouter.patch("/:id/cancel", cancelTrip);

export default tripRouter;
