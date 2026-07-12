import Expense from "../models/expense.model.js";

// 1. Log Fuel 
// POST /api/expenses/fuel
export const logFuel = async (req, res) => {
    try {
        const { vehicle, trip, liters, pricePerLiter, amount, date } = req.body;

        const expense = await Expense.create({
            vehicle,
            trip: trip || null,
            expenseType: "Fuel",
            liters,
            pricePerLiter,
            amount,
            date: date || Date.now(),
            createdBy: req.user?._id,
        });

        return res.status(201).json({ message: "Fuel log created", expense });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

//  Add Other Expense 
// POST /api/expenses
export const addExpense = async (req, res) => {
    try {
        const { vehicle, trip, expenseType, amount, description, date } = req.body;

        const allowed = ["Toll", "Parking", "Maintenance", "Repair", "Other"];
        if (!allowed.includes(expenseType)) {
            return res.status(400).json({
                message: `expenseType must be one of: ${allowed.join(", ")}`,
            });
        }

        const expense = await Expense.create({
            vehicle,
            trip: trip || null,
            expenseType,
            amount,
            description,
            date: date || Date.now(),
            createdBy: req.user?._id,
        });

        return res.status(201).json({ message: "Expense added", expense });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get Fuel Logs 
// GET /api/expenses/fuel
export const getFuelLogs = async (req, res) => {
    try {
        const { vehicle, trip } = req.query;
        const filter = { expenseType: "Fuel" };

        if (vehicle) filter.vehicle = vehicle;
        if (trip) filter.trip = trip;

        const logs = await Expense.find(filter)
            .populate("vehicle", "registrationNumber vehicleName")
            .populate("trip", "source destination")
            .sort({ date: -1 });

        return res.status(200).json({ fuelLogs: logs });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get Other Expenses 
// GET /api/expenses/other
export const getOtherExpenses = async (req, res) => {
    try {
        const { vehicle, trip, expenseType } = req.query;
        const filter = {
            expenseType: { $in: ["Toll", "Parking", "Maintenance", "Repair", "Other"] },
        };

        if (vehicle) filter.vehicle = vehicle;
        if (trip) filter.trip = trip;
        if (expenseType) filter.expenseType = expenseType;

        const expenses = await Expense.find(filter)
            .populate("vehicle", "registrationNumber vehicleName")
            .populate("trip", "source destination")
            .sort({ date: -1 });

        return res.status(200).json({ expenses });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

//  Update Expense 
// PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { expenseType, amount, description, liters, pricePerLiter, date } = req.body;

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        if (expenseType !== undefined) expense.expenseType = expenseType;
        if (amount !== undefined) expense.amount = amount;
        if (description !== undefined) expense.description = description;
        if (liters !== undefined) expense.liters = liters;
        if (pricePerLiter !== undefined) expense.pricePerLiter = pricePerLiter;
        if (date !== undefined) expense.date = date;

        await expense.save();

        return res.status(200).json({ message: "Expense updated", expense });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Delete Expense 
// DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        await expense.deleteOne();

        return res.status(200).json({ message: "Expense deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
