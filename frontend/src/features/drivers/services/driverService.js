import axios from "axios";

const api = axios.create({
    baseURL: "/api/drivers",
    withCredentials: true,
});

export const driverService = {
    getAll: (params) => api.get("/", { params }),
    getById: (id) => api.get(`/${id}`),
    getAvailable: () => api.get("/available"),
    add: (data) => api.post("/", data),
    update: (id, data) => api.put(`/${id}`, data),
    suspend: (id) => api.patch(`/${id}/suspend`),
    activate: (id) => api.patch(`/${id}/activate`),
    updateSafetyScore: (id, safetyScore) => api.patch(`/${id}/safety-score`, { safetyScore }),
};
