import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../apiClient";

// Fetch permissions for the currently logged-in user's role
export const fetchPermissions = createAsyncThunk(
    "permissions/fetch",
    async (_, { rejectWithValue }) => {
        try {
            // apiClient interceptor auto-attaches the Bearer token
            const res = await apiClient.get("/api/settings/my-permissions");
            return res.data.permissions;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch permissions");
        }
    }
);

const permissionsSlice = createSlice({
    name: "permissions",
    initialState: {
        data: [],       // raw array from backend
        map: {},        // { "Fleet Manager:Fleet": { view, create, update, delete }, ... }
        loaded: false,
        loading: false,
        error: null,
    },
    reducers: {
        clearPermissions: (state) => {
            state.data = [];
            state.map = {};
            state.loaded = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                state.data = action.payload;
                // Build lookup map: "role:module" → permissions object
                state.map = {};
                action.payload.forEach(({ role, module, permissions }) => {
                    state.map[`${role}:${module}`] = permissions;
                });
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.loaded = false; // keep false so retry UI triggers
            });
    },
});

export const { clearPermissions } = permissionsSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectPermissionsMap = (state) => state.permissions.map;
export const selectPermissionsLoaded = (state) => state.permissions.loaded;
export const selectPermissionsLoading = (state) => state.permissions.loading;

/**
 * canAccess(role, module, action)
 * Selector factory — memoisation is fine at this scale.
 * Owner always returns true (hardcoded, same as backend).
 */
export const selectCanAccess = (role, module, action) => (state) => {
    if (role === "Owner") return true;
    const key = `${role}:${module}`;
    return state.permissions.map[key]?.[action] === true;
};

export default permissionsSlice.reducer;
