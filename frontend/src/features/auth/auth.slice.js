import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./services/authService";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await authService.register(formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Registration failed");
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await authService.login(formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const verifyEmail = createAsyncThunk(
    "auth/verifyEmail",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await authService.verifyEmail(formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Verification failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Logout failed");
        }
    }
);

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
    // stages: 'idle' | 'otp-pending' | 'verified'
    stage: "idle",
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => { state.error = null; },
        clearSuccess: (state) => { state.successMessage = null; },
        setStage: (state, action) => { state.stage = action.payload; },
    },
    extraReducers: (builder) => {
        // ── Register ──
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.stage = "otp-pending";
                state.successMessage = action.payload.message;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── Verify Email ──
        builder
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.stage = "verified";
                state.successMessage = action.payload.message;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── Login ──
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.stage = "idle";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── Logout ──
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.stage = "idle";
            });
    },
});

export const { clearError, clearSuccess, setStage } = authSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────────────────
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthStage = (state) => state.auth.stage;
export const selectAuthSuccess = (state) => state.auth.successMessage;

export default authSlice.reducer;
