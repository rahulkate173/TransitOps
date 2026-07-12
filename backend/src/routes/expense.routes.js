import { Router } from "express";
import {
    logFuel,
    addExpense,
    getFuelLogs,
    getOtherExpenses,
    updateExpense,
    deleteExpense,
} from "../controllers/expense.controller.js";

const expenseRouter = Router();

// Static routes first (before /:id)

// POST  /api/expenses/fuel    → Log fuel
expenseRouter.post("/fuel", logFuel);

// GET   /api/expenses/fuel    → Get all fuel logs
expenseRouter.get("/fuel", getFuelLogs);

// GET   /api/expenses/other   → Get other expenses (Toll, Parking, Maintenance, Repair, Other)
expenseRouter.get("/other", getOtherExpenses);

// POST  /api/expenses         → Add other expense
expenseRouter.post("/", addExpense);

// PUT   /api/expenses/:id     → Update expense
expenseRouter.put("/:id", updateExpense);

// DELETE /api/expenses/:id    → Delete expense
expenseRouter.delete("/:id", deleteExpense);

export default expenseRouter;
