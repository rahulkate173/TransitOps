import axios from "axios";

const BASE = "/api/auth";

const api = axios.create({
    baseURL: BASE,
    withCredentials: true, // send cookies (refreshToken)
});

export const authService = {
    register: (data) => api.post("/register", data),
    login: (data) => api.post("/login", data),
    verifyEmail: (data) => api.post("/verify-email", data),
    getMe: (token) =>
        api.get("/me", {
            headers: { Authorization: `Bearer ${token}` },
        }),
    refreshToken: () => api.post("/refresh-token"),
    logout: () => api.post("/logout"),
};
