import { Router } from "express";
import {
    logFuel, addExpense, getFuelLogs, getOtherExpenses,
    updateExpense, deleteExpense,
} from "../controllers/expense.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import authorizePermission from "../middleware/authorizePermission.js";

const expenseRouter = Router();

expenseRouter.post("/fuel",  verifyToken, authorizePermission("FuelExpenses", "create"), logFuel);
expenseRouter.get("/fuel",   verifyToken, authorizePermission("FuelExpenses", "view"),   getFuelLogs);
expenseRouter.get("/other",  verifyToken, authorizePermission("FuelExpenses", "view"),   getOtherExpenses);
expenseRouter.post("/",      verifyToken, authorizePermission("FuelExpenses", "create"), addExpense);
expenseRouter.put("/:id",    verifyToken, authorizePermission("FuelExpenses", "update"), updateExpense);
expenseRouter.delete("/:id", verifyToken, authorizePermission("FuelExpenses", "delete"), deleteExpense);

export default expenseRouter;
