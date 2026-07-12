import axios from "axios";

const api = axios.create({
    baseURL: "/api/vehicles",
    withCredentials: true,
});

export const vehicleService = {
    getAll: (params) => api.get("/", { params }),
    getById: (id) => api.get(`/${id}`),
    add: (data) => api.post("/", data),
    update: (id, data) => api.put(`/${id}`, data),
    updateStatus: (id, status) => api.patch(`/${id}/status`, { status }),
    retire: (id) => api.delete(`/${id}`),
};
