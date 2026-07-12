import { Router } from "express";
import {
    addDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    suspendDriver,
    activateDriver,
    getAvailableDrivers,
    updateSafetyScore,
} from "../controllers/driver.controller.js";

const driverRouter = Router();

// GET    /api/drivers/available      
driverRouter.get("/available", getAvailableDrivers);

// POST   /api/drivers               
driverRouter.post("/", addDriver);

// GET    /api/drivers             Get all drivers (?status=&licenseCategory=)
driverRouter.get("/", getAllDrivers);

// GET    /api/drivers/:id           
driverRouter.get("/:id", getDriverById);

// PUT    /api/drivers/:id          Update driver (name, contact, licenseCategory, licenseExpiry)
driverRouter.put("/:id", updateDriver);


// PATCH  /api/drivers/:id/suspend      
driverRouter.patch("/:id/suspend", suspendDriver);

// PATCH  /api/drivers/:id/activate     
driverRouter.patch("/:id/activate", activateDriver);

// PATCH  /api/drivers/:id/safety-score 
driverRouter.patch("/:id/safety-score", updateSafetyScore);

export default driverRouter;
