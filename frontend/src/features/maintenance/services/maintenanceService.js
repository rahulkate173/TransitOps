import apiClient from "../../../apiClient";

const BASE = "/api/maintenance";

export const maintenanceService = {
    getAll:   (params)       => apiClient.get(`${BASE}/`, { params }),
    getById:  (id)           => apiClient.get(`${BASE}/${id}`),
    create:   (data)         => apiClient.post(`${BASE}/`, data),
    update:   (id, data)     => apiClient.put(`${BASE}/${id}`, data),
    complete: (id, payload)  => apiClient.patch(`${BASE}/${id}/complete`, payload || {}),
    cancel:   (id)           => apiClient.patch(`${BASE}/${id}/cancel`),
};
