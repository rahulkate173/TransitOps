import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { vehicleService } from "./services/vehicleService";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchVehicles = createAsyncThunk(
    "vehicles/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            const res = await vehicleService.getAll(params);
            return res.data.vehicles;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch vehicles");
        }
    }
);

export const addVehicle = createAsyncThunk(
    "vehicles/add",
    async (data, { rejectWithValue }) => {
        try {
            const res = await vehicleService.add(data);
            return res.data.vehicle;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to add vehicle");
        }
    }
);

export const updateVehicle = createAsyncThunk(
    "vehicles/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await vehicleService.update(id, data);
            return res.data.vehicle;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update vehicle");
        }
    }
);

export const updateVehicleStatus = createAsyncThunk(
    "vehicles/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await vehicleService.updateStatus(id, status);
            return res.data.vehicle;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update status");
        }
    }
);

export const retireVehicle = createAsyncThunk(
    "vehicles/retire",
    async (id, { rejectWithValue }) => {
        try {
            const res = await vehicleService.retire(id);
            return res.data.vehicle;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to retire vehicle");
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const vehicleSlice = createSlice({
    name: "vehicles",
    initialState: {
        list: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearVehicleError: (state) => { state.error = null; },
        clearVehicleSuccess: (state) => { state.successMessage = null; },
    },
    extraReducers: (builder) => {
        // Fetch
        builder
            .addCase(fetchVehicles.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchVehicles.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
            .addCase(fetchVehicles.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

        // Add
        builder
            .addCase(addVehicle.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(addVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.list.unshift(action.payload);
                state.successMessage = "Vehicle added successfully";
            })
            .addCase(addVehicle.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

        // Update
        builder
            .addCase(updateVehicle.fulfilled, (state, action) => {
                const idx = state.list.findIndex((v) => v._id === action.payload._id);
                if (idx !== -1) state.list[idx] = action.payload;
                state.successMessage = "Vehicle updated successfully";
            })
            .addCase(updateVehicle.rejected, (state, action) => { state.error = action.payload; });

        // Update Status
        builder
            .addCase(updateVehicleStatus.fulfilled, (state, action) => {
                const idx = state.list.findIndex((v) => v._id === action.payload._id);
                if (idx !== -1) state.list[idx] = action.payload;
                state.successMessage = "Status updated";
            })
            .addCase(updateVehicleStatus.rejected, (state, action) => { state.error = action.payload; });

        // Retire
        builder
            .addCase(retireVehicle.fulfilled, (state, action) => {
                const idx = state.list.findIndex((v) => v._id === action.payload._id);
                if (idx !== -1) state.list[idx] = action.payload;
                state.successMessage = "Vehicle retired";
            })
            .addCase(retireVehicle.rejected, (state, action) => { state.error = action.payload; });
    },
});

export const { clearVehicleError, clearVehicleSuccess } = vehicleSlice.actions;

export const selectVehicles = (state) => state.vehicles.list;
export const selectVehicleLoading = (state) => state.vehicles.loading;
export const selectVehicleError = (state) => state.vehicles.error;
export const selectVehicleSuccess = (state) => state.vehicles.successMessage;

export default vehicleSlice.reducer;
