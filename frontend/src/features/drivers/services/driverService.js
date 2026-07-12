import apiClient from "../../../apiClient";

const BASE = "/api/drivers";

export const driverService = {
    getAll:           (params)        => apiClient.get(`${BASE}/`,                  { params }),
    getById:          (id)            => apiClient.get(`${BASE}/${id}`),
    getAvailable:     ()              => apiClient.get(`${BASE}/available`),
    add:              (data)          => apiClient.post(`${BASE}/`,                  data),
    update:           (id, data)      => apiClient.put(`${BASE}/${id}`,              data),
    suspend:          (id)            => apiClient.patch(`${BASE}/${id}/suspend`),
    activate:         (id)            => apiClient.patch(`${BASE}/${id}/activate`),
    updateSafetyScore:(id, safetyScore) => apiClient.patch(`${BASE}/${id}/safety-score`, { safetyScore }),
};
