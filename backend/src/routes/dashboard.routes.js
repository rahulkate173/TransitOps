import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizePermission from "../middleware/authorizePermission.js";

const dashboardRouter = Router();

dashboardRouter.get("/", verifyToken, authorizePermission("Dashboard", "view"), getDashboard);

export default dashboardRouter;
