import apiClient from "../../../apiClient";

const api = apiClient;
const BASE = "/api/vehicles";

export const vehicleService = {
    getAll:       (params)       => api.get(`${BASE}/`,          { params }),
    getById:      (id)           => api.get(`${BASE}/${id}`),
    add:          (data)         => api.post(`${BASE}/`,          data),
    update:       (id, data)     => api.put(`${BASE}/${id}`,      data),
    updateStatus: (id, status)   => api.patch(`${BASE}/${id}/status`, { status }),
    retire:       (id)           => api.delete(`${BASE}/${id}`),
};
