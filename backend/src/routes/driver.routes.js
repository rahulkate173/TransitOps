import { Router } from "express";
import {
    addDriver, getAllDrivers, getDriverById, updateDriver,
    suspendDriver, activateDriver, getAvailableDrivers, updateSafetyScore,
} from "../controllers/driver.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizePermission from "../middleware/authorizePermission.js";

const driverRouter = Router();

driverRouter.get("/available", verifyToken, authorizePermission("Drivers", "view"),   getAvailableDrivers);
driverRouter.post("/",         verifyToken, authorizePermission("Drivers", "create"), addDriver);
driverRouter.get("/",          verifyToken, authorizePermission("Drivers", "view"),   getAllDrivers);
driverRouter.get("/:id",       verifyToken, authorizePermission("Drivers", "view"),   getDriverById);
driverRouter.put("/:id",       verifyToken, authorizePermission("Drivers", "update"), updateDriver);
driverRouter.patch("/:id/suspend",      verifyToken, authorizePermission("Drivers", "update"), suspendDriver);
driverRouter.patch("/:id/activate",     verifyToken, authorizePermission("Drivers", "update"), activateDriver);
driverRouter.patch("/:id/safety-score", verifyToken, authorizePermission("Drivers", "update"), updateSafetyScore);

export default driverRouter;
