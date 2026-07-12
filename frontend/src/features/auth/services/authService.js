import apiClient from "../../../apiClient";

const BASE = "/api/auth";

export const authService = {
    register: (data) => apiClient.post(`${BASE}/register`, data),
    login: (data) => apiClient.post(`${BASE}/login`, data),
    verifyEmail: (data) => apiClient.post(`${BASE}/verify-email`, data),
    getMe: (token) =>
        apiClient.get(`${BASE}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
    refreshToken: () => apiClient.post(`${BASE}/refresh-token`),
    logout: () => apiClient.post(`${BASE}/logout`),
};
