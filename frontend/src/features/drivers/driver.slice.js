import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { driverService } from "./services/driverService";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchDrivers = createAsyncThunk(
    "drivers/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            const res = await driverService.getAll(params);
            return res.data.drivers;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch drivers");
        }
    }
);

export const addDriver = createAsyncThunk(
    "drivers/add",
    async (data, { rejectWithValue }) => {
        try {
            const res = await driverService.add(data);
            return res.data.driver;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to add driver");
        }
    }
);

export const updateDriver = createAsyncThunk(
    "drivers/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await driverService.update(id, data);
            return res.data.driver;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update driver");
        }
    }
);

export const suspendDriver = createAsyncThunk(
    "drivers/suspend",
    async (id, { rejectWithValue }) => {
        try {
            const res = await driverService.suspend(id);
            return res.data.driver || { _id: id, status: "Suspended" };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to suspend driver");
        }
    }
);

export const activateDriver = createAsyncThunk(
    "drivers/activate",
    async (id, { rejectWithValue }) => {
        try {
            const res = await driverService.activate(id);
            return res.data.driver;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to activate driver");
        }
    }
);

export const updateSafetyScore = createAsyncThunk(
    "drivers/updateSafetyScore",
    async ({ id, safetyScore }, { rejectWithValue }) => {
        try {
            const res = await driverService.updateSafetyScore(id, safetyScore);
            return res.data.driver;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update safety score");
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const driverSlice = createSlice({
    name: "drivers",
    initialState: {
        list: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearDriverError: (state) => { state.error = null; },
        clearDriverSuccess: (state) => { state.successMessage = null; },
    },
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchDrivers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDrivers.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
            .addCase(fetchDrivers.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

        // Add
        builder
            .addCase(addDriver.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(addDriver.fulfilled, (state, action) => {
                state.loading = false;
                state.list.unshift(action.payload);
                state.successMessage = "Driver added successfully";
            })
            .addCase(addDriver.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

        // Update
        builder
            .addCase(updateDriver.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateDriver.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.list.findIndex((d) => d._id === action.payload._id);
                if (idx !== -1) state.list[idx] = action.payload;
                state.successMessage = "Driver updated successfully";
            })
            .addCase(updateDriver.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

        // Suspend
        builder
            .addCase(suspendDriver.fulfilled, (state, action) => {
                const idx = state.list.findIndex((d) => d._id === action.payload._id);
                if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
                state.successMessage = "Driver suspended";
            })
            .addCase(suspendDriver.rejected, (state, action) => { state.error = action.payload; });

        // Activate
        builder
            .addCase(activateDriver.fulfilled, (state, action) => {
                const idx = state.list.findIndex((d) => d._id === action.payload._id);
                if (idx !== -1) state.list[idx] = action.payload;
                state.successMessage = "Driver activated";
            })
            .addCase(activateDriver.rejected, (state, action) => { state.error = action.payload; });

        // Safety Score
        builder
            .addCase(updateSafetyScore.fulfilled, (state, action) => {
                const idx = state.list.findIndex((d) => d._id === action.payload._id);
                if (idx !== -1) state.list[idx] = action.payload;
                state.successMessage = "Safety score updated";
            })
            .addCase(updateSafetyScore.rejected, (state, action) => { state.error = action.payload; });
    },
});

export const { clearDriverError, clearDriverSuccess } = driverSlice.actions;

export const selectDrivers = (state) => state.drivers.list;
export const selectDriverLoading = (state) => state.drivers.loading;
export const selectDriverError = (state) => state.drivers.error;
export const selectDriverSuccess = (state) => state.drivers.successMessage;

export default driverSlice.reducer;
