import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizePermission from "../middleware/authorizePermission.js";

const analyticsRouter = Router();

analyticsRouter.get("/", verifyToken, authorizePermission("Analytics", "view"), getAnalytics);

export default analyticsRouter;
